# AI RTL Fixer

A browser extension designed to correct Right-to-Left (RTL) direction, font rendering, and text alignment for Persian and Arabic languages on major AI platforms.

This extension ensures a seamless reading experience on ChatGPT, Claude, Gemini, DeepSeek, and other LLM interfaces by applying the "Vazirmatn" font and utilizing intelligent content isolation to handle mixed English/Persian text correctly.

**Author:** Mehrab Mahmoudifar  
**GitHub:** [@astheysaymehrab](https://github.com/astheysaymehrab)

---

## Features

*   **Smart Direction Detection:** Automatically detects Persian/Arabic context and applies RTL styling solely to relevant paragraphs.
*   **Vazirmatn Font Integration:** Replaces system fonts with "Vazirmatn" for improved readability.
*   **Content Isolation:** Protects code blocks, mathematical formulas (LaTeX/MathJax), and English technical terms from incorrect rendering within RTL paragraphs.
*   **Customization:** Allows users to adjust font size and line height via the extension popup.
*   **Performance Optimization:** Utilizes MutationObserver to handle streaming responses efficiently without impacting browser performance.

## Supported Platforms

*   ChatGPT (OpenAI)
*   Claude (Anthropic)
*   Google Gemini / AI Studio
*   Microsoft Copilot / Bing
*   DeepSeek
*   Perplexity AI
*   Poe.com

---

## Installation Guide (English)

Since this extension is not currently available on the Chrome Web Store, manual installation is required via Developer Mode.

### Chrome, Edge, Brave, Opera

1.  **Download:** Click the green **Code** button above and select **Download ZIP**. Extract the ZIP file to a folder on your computer.
2.  **Open Extensions Page:**
    *   **Chrome:** Type `chrome://extensions` in the address bar.
    *   **Edge:** Type `edge://extensions` in the address bar.
    *   **Brave:** Type `brave://extensions` in the address bar.
    *   **Opera:** Type `opera://extensions` in the address bar.
3.  **Enable Developer Mode:** Toggle the switch labeled **Developer mode** (usually in the top-right corner).
4.  **Load Extension:** Click the **Load unpacked** button.
5.  **Select Folder:** Browse and select the folder where you extracted the files (ensure the folder contains `manifest.json`).

### Firefox

1.  Type `about:debugging` in the address bar.
2.  Click on **This Firefox** in the left sidebar.
3.  Click on **Load Temporary Add-on...**
4.  Navigate to the project folder and select the `manifest.json` file.
    *   *Note: In Firefox, temporary add-ons are removed when the browser is fully closed.*

---

## راهنمای کامل نصب و راه‌اندازی (Persian)

از آنجا که این افزونه متن‌باز است و بر روی فروشگاه‌های رسمی منتشر نشده، نصب آن باید به صورت دستی انجام شود. لطفاً طبق دستورالعمل زیر برای مرورگر خود اقدام کنید.

### پیش‌نیاز
۱. در همین صفحه گیت‌هاب، روی دکمه سبز رنگ **Code** کلیک کرده و گزینه **Download ZIP** را انتخاب کنید.
۲. فایل دانلود شده را باز کرده و محتویات آن را در یک پوشه مشخص در کامپیوتر خود **Extract** (استخراج) کنید.

### ۱. نصب در گوگل کروم (Google Chrome) و بریو (Brave)
1.  مرورگر را باز کنید و در نوار آدرس عبارت `chrome://extensions` را تایپ کرده و اینتر بزنید.
2.  در گوشه بالا سمت راست صفحه، گزینه‌ای به نام **Developer mode** وجود دارد. آن را روشن (فعال) کنید.
3.  پس از فعال‌سازی، دکمه‌هایی در بالا ظاهر می‌شوند. روی دکمه **Load unpacked** کلیک کنید.
4.  پنجره‌ای باز می‌شود. به مسیری بروید که فایل‌ها را در آنجا استخراج کردید و پوشه اصلی پروژه را انتخاب کنید.
5.  افزونه نصب شده و آیکون آن در نوار ابزار ظاهر می‌شود.

### ۲. نصب در مایکروسافت اج (Microsoft Edge)
1.  در نوار آدرس عبارت `edge://extensions` را تایپ کنید.
2.  از منوی سمت چپ (یا دکمه‌های بالا)، گزینه **Developer mode** را فعال کنید.
3.  روی دکمه **Load unpacked** کلیک کنید.
4.  پوشه پروژه را انتخاب کنید تا افزونه فعال شود.

### ۳. نصب در موزیلا فایرفاکس (Firefox)
1.  در نوار آدرس عبارت `about:debugging` را تایپ کنید.
2.  از منوی سمت چپ، روی گزینه **This Firefox** کلیک کنید.
3.  روی دکمه **Load Temporary Add-on** کلیک کنید.
4.  بر خلاف کروم، در اینجا باید وارد پوشه شوید و فایل `manifest.json` را انتخاب و Open کنید.
    *   *نکته: در فایرفاکس استاندارد، افزونه‌های موقت پس از بستن کامل مرورگر حذف می‌شوند و هربار باید لود شوند. برای نصب دائم نیاز به نسخه Developer Edition فایرفاکس دارید.*

### ۴. نصب در اپرا (Opera)
1.  به آدرس `opera://extensions` بروید.
2.  گزینه **Developer mode** را در بالا فعال کنید.
3.  روی **Load unpacked** کلیک کرده و پوشه را انتخاب کنید.

### عیب‌یابی و نکات مهم
*   **خطای فایل Manifest:** اگر هنگام نصب با خطای "Missing manifest file" مواجه شدید، مطمئن شوید که پوشه درستی را انتخاب کرده‌اید (پوشه‌ای که فایل `manifest.json` مستقیماً داخل آن است، نه پوشه والد آن).
*   **تغییر تنظیمات:** برای تغییر اندازه فونت یا فاصله خطوط، روی آیکون افزونه در نوار ابزار کلیک کنید تا پنل تنظیمات باز شود.
*   **آپدیت افزونه:** اگر نسخه جدیدی از این کد منتشر شد، فایل‌های جدید را جایگزین فایل‌های قبلی کنید، سپس در صفحه Extensions مرورگر، روی آیکون **Reload** (فلش چرخشی) در کادر مربوط به این افزونه کلیک کنید.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.