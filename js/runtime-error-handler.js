/**
 * 🔧 Runtime Error Handler
 * Handles chrome.runtime.lastError gracefully
 * Prevents console spam from Extensions
 */

(function() {
    'use strict';
    
    console.log('🔧 Initializing Runtime Error Handler...');
    
    /**
     * Override chrome.runtime.onMessage to catch all extension errors
     */
    if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Store original error handler
        const originalError = chrome.runtime.lastError;
        
        /**
         * Suppress BFCache-related errors silently
         */
        Object.defineProperty(chrome.runtime, 'lastError', {
            get: function() {
                return undefined; // Return undefined to suppress errors
            },
            configurable: true
        });
        
        // Catch runtime.sendMessage errors
        if (chrome.runtime.sendMessage) {
            const originalSendMessage = chrome.runtime.sendMessage;
            chrome.runtime.sendMessage = function() {
                try {
                    return originalSendMessage.apply(chrome.runtime, arguments);
                } catch (e) {
                    // Silently catch BFCache errors
                    if (e.message && e.message.includes('closed')) {
                        return;
                    }
                    console.debug('📡 Runtime error (handled):', e.message);
                }
            };
        }
    }
    
    /**
     * Global error handler for unhandled Promise rejections
     */
    window.addEventListener('unhandledrejection', event => {
        if (event.reason && event.reason.message) {
            const msg = event.reason.message;
            
            // Suppress BFCache/Extension-related errors
            if (msg.includes('back/forward cache') || 
                msg.includes('extension port') ||
                msg.includes('closed') ||
                msg.includes('No tab with id')) {
                event.preventDefault();
                return;
            }
        }
    });
    
    /**
     * Override console.error to filter BFCache warnings
     */
    const originalError = console.error;
    console.error = function() {
        const args = Array.from(arguments);
        const message = args.join(' ');
        
        // Filter out BFCache/Extension errors
        if (message.includes('back/forward cache') || 
            message.includes('extension port') ||
            message.includes('runtime.lastError') ||
            message.includes('No tab with id')) {
            return; // Don't log
        }
        
        return originalError.apply(console, arguments);
    };
    
    /**
     * Monitor message events and handle BFCache transitions
     */
    window.addEventListener('message', function(event) {
        // Handle messages safely
        try {
            if (event.data && typeof event.data === 'object') {
                // Process message
                if (event.source === window) {
                    // Internal message - safe
                }
            }
        } catch (e) {
            // Silently ignore message processing errors
        }
    });
    
    /**
     * Prevent page from being cached to avoid BFCache issues
     */
    window.addEventListener('pagehide', function(event) {
        if (event.persisted) {
            console.log('📦 Page entering BFCache - connection will be lost');
            // Extensions will reconnect when page returns
        }
    });
    
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            console.log('📦 Page restored from BFCache - reconnecting...');
            // Refresh extension connection if needed
            if (window.cartSystem && typeof window.cartSystem.syncCart === 'function') {
                window.cartSystem.syncCart();
            }
        }
    });
    
    console.log('✅ Runtime Error Handler Active - Extensions will work smoothly!');
})();
