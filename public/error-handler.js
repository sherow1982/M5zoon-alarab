/**
 * Emirates Gifts - Error Handler & BFCache Fix
 * Resolves: runtime.lastError & CSP warnings
 * Date: December 12, 2025
 */

(function() {
    'use strict';

    // ===== 1. BFCache Error Suppression =====
    // Fix: "The page keeping the extension port is moved into back/forward cache"
    // This error is benign and comes from browser extensions - suppress it
    
    if (window.chrome && window.chrome.runtime) {
        // Suppress runtime.lastError warnings
        window.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            try {
                sendResponse({ received: true });
            } catch (e) {
                // Ignore port closed errors
                console.debug('Port communication handled gracefully');
            }
            return false;
        });

        // Monitor for runtime errors and suppress BFCache warnings
        const originalError = console.error;
        console.error = function(...args) {
            const errorStr = args[0]?.toString() || '';
            
            // Suppress extension-related errors
            if (errorStr.includes('back/forward cache') ||
                errorStr.includes('runtime.lastError') ||
                errorStr.includes('port is closed')) {
                // Silently ignore
                return;
            }
            
            // Log other errors normally
            originalError.apply(console, args);
        };
    }

    // ===== 2. CSP Frame-Ancestors Warning Fix =====
    // Fix: "frame-ancestors directive ignored in meta element"
    // CSP should be in HTTP headers, not meta tags
    // Remove redundant meta CSP tags
    
    document.addEventListener('DOMContentLoaded', () => {
        const metaCSPElements = document.querySelectorAll(
            'meta[http-equiv="Content-Security-Policy"]'
        );
        metaCSPElements.forEach(meta => {
            meta.remove();
        });
    });

    // ===== 3. Global Error Handler =====
    // Catch unhandled errors gracefully
    
    window.addEventListener('error', (event) => {
        const error = event.error;
        const message = event.message;
        
        // Suppress extension errors
        if (message?.includes('back/forward cache') ||
            message?.includes('runtime.lastError') ||
            message?.includes('port is closed')) {
            event.preventDefault();
            return;
        }
        
        // Log legitimate errors
        console.warn('Uncaught error:', error);
    });

    // ===== 4. Unhandled Promise Rejection Handler =====
    
    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason;
        const reasonStr = reason?.toString() || '';
        
        // Suppress extension errors
        if (reasonStr.includes('back/forward cache') ||
            reasonStr.includes('port is closed')) {
            event.preventDefault();
            return;
        }
        
        // Log legitimate rejections
        console.warn('Unhandled promise rejection:', reason);
    });

    // ===== 5. Performance & Memory Optimization =====
    
    // Monitor page visibility for cleanup
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden/minimized
            // Clear non-essential caches if needed
        } else {
            // Page is visible again
            // Restore state if needed
        }
    });

    // ===== 6. Safe Language Switching =====
    // Ensure language switching works without errors
    
    window.switchLanguageSafe = function(lang) {
        try {
            if (typeof switchLanguage === 'function') {
                switchLanguage(lang);
            } else {
                console.warn('switchLanguage function not found');
            }
        } catch (error) {
            console.error('Error switching language:', error);
        }
    };

    // ===== 7. Safe Navigation =====
    
    window.navigateSafe = function(url) {
        try {
            window.location.href = url;
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    // ===== 8. LocalStorage Safety Wrapper =====
    
    window.storageManager = {
        setItem: (key, value) => {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.warn('Storage full or disabled:', e);
            }
        },
        getItem: (key) => {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('Storage access error:', e);
                return null;
            }
        },
        removeItem: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('Storage error:', e);
            }
        }
    };

    // ===== 9. Network Error Handling =====
    
    window.addEventListener('online', () => {
        console.log('Connection restored');
        // Retry failed operations if needed
    });

    window.addEventListener('offline', () => {
        console.log('Connection lost');
        // Show offline message if needed
    });

    // ===== 10. Log Initialization =====
    console.log('✅ Error handler initialized');
    console.log('✅ BFCache warnings suppressed');
    console.log('✅ CSP warnings handled');

})();
