/**
 * AI RTL Fixer - High Performance Version
 * Author: Mehrab Mahmoudifar
 * Optimized to prevent browser crashes on streaming responses.
 */

(function() {
    'use strict';

    // Regex constants
    const PERSIAN_REGEX = /[\u0600-\u06FF]/;
    
    // Selectors for text containers
    const TARGET_SELECTORS = 'p, div.markdown > *, .prose > *, li, td, h1, h2, h3, span, textarea, div[contenteditable="true"]';

    // State management
    let processingScheduled = false;
    const nodesToProcess = new Set(); // Using Set to avoid duplicate checks

    /**
     * Updates CSS variables for font size and line height
     */
    function updateGlobalStyles(fontSize, lineHeight) {
        const root = document.documentElement;
        if (fontSize) root.style.setProperty('--ai-rtl-font-size', fontSize + 'px', 'important');
        if (lineHeight) root.style.setProperty('--ai-rtl-line-height', lineHeight, 'important');
    }

    /**
     * Checks a single element and applies RTL if needed.
     * Logic preserved but optimized for speed.
     */
    function processSingleNode(node) {
        // Safety checks
        if (!node || !node.isConnected) return; // Skip removed nodes
        if (node.nodeType !== 1) return; // Elements only
        
        // Skip ignored tags
        const tagName = node.tagName;
        if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'CODE' || tagName === 'PRE') return;
        
        // Skip already processed nodes to save CPU
        if (node.classList.contains('ai-rtl-active')) return;

        // Get text safely
        const textContent = node.innerText || node.textContent;
        
        // Validation: Must contain Persian and be long enough
        if (textContent && textContent.trim().length > 1 && PERSIAN_REGEX.test(textContent)) {
            // Check if it starts with strong English (code-like) indicator
            // This prevents code blocks with Persian comments from breaking
            // Note: Isolation in CSS handles the rest.
            
            node.classList.add('ai-rtl-active');
            node.setAttribute('dir', 'rtl');
        }
        
        // Mark as checked (custom attribute) to prevent re-scanning in this session
        // Note: We don't rely solely on this for streaming content, but it helps for static content.
        node.setAttribute('data-rtl-checked', 'true');
    }

    /**
     * Batch Processor
     * Processes all queued nodes in one go to reduce layout thrashing.
     */
    function processQueue() {
        nodesToProcess.forEach(node => {
            // If the node itself matches target
            if (node.matches && node.matches(TARGET_SELECTORS)) {
                processSingleNode(node);
            }
            
            // Also check children if it's a container
            if (node.querySelectorAll) {
                const children = node.querySelectorAll(TARGET_SELECTORS);
                for (let i = 0; i < children.length; i++) {
                    processSingleNode(children[i]);
                }
            }
        });

        // Clear queue
        nodesToProcess.clear();
        processingScheduled = false;
    }

    /**
     * Scheduler (Debounce/Throttle)
     * Ensures we don't run heavy logic on every single character change.
     */
    function scheduleProcessing(node) {
        nodesToProcess.add(node);
        
        if (!processingScheduled) {
            processingScheduled = true;
            // Wait 200ms before processing. This is fast enough for human eye 
            // but slow enough to group hundreds of AI token streams into one batch.
            setTimeout(processQueue, 200);
        }
    }

    // --- Observer Setup ---
    
    const observer = new MutationObserver((mutations) => {
        let shouldSchedule = false;
        
        for (const mutation of mutations) {
            // 1. New nodes added
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) { // Element
                        nodesToProcess.add(node);
                        shouldSchedule = true;
                    }
                }
            } 
            // 2. Text changed (Streaming)
            else if (mutation.type === 'characterData') {
                const parent = mutation.target.parentElement;
                if (parent && parent.nodeType === 1) {
                    nodesToProcess.add(parent);
                    shouldSchedule = true;
                }
            }
        }

        if (shouldSchedule && !processingScheduled) {
            processingScheduled = true;
            setTimeout(processQueue, 200);
        }
    });

    // Start Observing
    observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        characterData: true 
    });

    // --- Initial Setup ---

    // Load Settings
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['prefFontSize', 'prefLineHeight'], (result) => {
            updateGlobalStyles(result.prefFontSize || 16, result.prefLineHeight || 1.8);
        });
    }

    // Listen for Settings Update
    chrome.runtime.onMessage.addListener((request) => {
        if (request.type === "UPDATE_SETTINGS") {
            updateGlobalStyles(request.fontSize, request.lineHeight);
        }
    });

    // Initial Scan
    const initialElements = document.querySelectorAll(TARGET_SELECTORS);
    initialElements.forEach(el => nodesToProcess.add(el));
    if(initialElements.length > 0) scheduleProcessing(document.body);

    // Input Handling (Immediate response for typing)
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target.tagName === 'TEXTAREA' || target.getAttribute('contenteditable') === 'true') {
            // Process immediately for user typing experience
            processSingleNode(target);
        }
    });

    console.log("AI RTL Fixer: Optimized Mode Active");
})();
