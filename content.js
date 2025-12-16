/**
 * AI RTL Fixer
 * Author: Mehrab Mahmoudifar (@astheysaymehrab)
 * Description: Content script to detect Persian text and apply RTL styles.
 */

(function() {
    'use strict';

    // Regex to detect Persian/Arabic characters
    const PERSIAN_REGEX = /[\u0600-\u06FF]/;
    
    // CSS Selectors for potential text containers in various AI interfaces
    const TARGET_SELECTORS = 'p, div.markdown > *, .prose > *, li, td, h1, h2, h3, span, textarea, div[contenteditable="true"]';

    /**
     * Updates CSS variables on the root element for dynamic sizing.
     * @param {string} fontSize - The font size in pixels.
     * @param {string} lineHeight - The line height value.
     */
    function updateGlobalStyles(fontSize, lineHeight) {
        const root = document.documentElement;
        if (fontSize) {
            root.style.setProperty('--ai-rtl-font-size', fontSize + 'px', 'important');
        }
        if (lineHeight) {
            root.style.setProperty('--ai-rtl-line-height', lineHeight, 'important');
        }
    }

    /**
     * Analyzes a DOM node and applies RTL class if Persian content is detected.
     * @param {HTMLElement} node - The element to check.
     */
    function processNode(node) {
        // Validation: Must be an element, not script/style/code
        if (node.nodeType !== 1) return;
        const tagName = node.tagName;
        if (tagName === 'SCRIPT' || tagName === 'STYLE' || tagName === 'CODE' || tagName === 'PRE') return;
        
        // Prevent re-checking already processed nodes
        if (node.classList.contains('ai-rtl-active') || node.getAttribute('data-rtl-checked')) return;

        // Find targets within the node or check the node itself
        const elementsToCheck = node.matches && node.matches(TARGET_SELECTORS) 
            ? [node] 
            : (node.querySelectorAll ? node.querySelectorAll(TARGET_SELECTORS) : []);

        elementsToCheck.forEach(el => {
            if (el.classList.contains('ai-rtl-active')) return;

            // Get text content excluding child elements to avoid false positives from code blocks
            const textContent = el.innerText || el.textContent;
            
            // Check if text exists and contains Persian characters
            if (textContent && textContent.trim().length > 1 && PERSIAN_REGEX.test(textContent)) {
                el.classList.add('ai-rtl-active');
                el.setAttribute('dir', 'rtl');
            }
            
            // Mark as checked to optimize performance
            el.setAttribute('data-rtl-checked', 'true');
        });
    }

    /**
     * Scans the entire document for existing content.
     */
    function scanDocument() {
        const elements = document.querySelectorAll(TARGET_SELECTORS);
        elements.forEach(el => processNode(el));
    }

    // --- Initialization ---

    // 1. Load saved settings
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['prefFontSize', 'prefLineHeight'], (result) => {
            const size = result.prefFontSize || 16;
            const height = result.prefLineHeight || 1.8;
            updateGlobalStyles(size, height);
        });
    }

    // 2. Listen for setting changes from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "UPDATE_SETTINGS") {
            updateGlobalStyles(request.fontSize, request.lineHeight);
        }
    });

    // 3. Observe DOM changes (for streaming responses)
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(processNode);
            } else if (mutation.type === 'characterData') {
                // Handle text updates in existing nodes
                if (mutation.target.parentElement) {
                    processNode(mutation.target.parentElement);
                }
            }
        }
    });

    observer.observe(document.body, { 
        childList: true, 
        subtree: true, 
        characterData: true 
    });

    // 4. Initial scan
    scanDocument();

    // 5. Input listener for dynamic typing
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target.tagName === 'TEXTAREA' || target.getAttribute('contenteditable') === 'true') {
            target.classList.remove('ai-rtl-active'); 
            processNode(target);
        }
    });
})();