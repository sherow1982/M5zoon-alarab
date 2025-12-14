/**
 * 🔒 Global BFCache Prevention Script
 * Prevents the page from being cached by browser's Back-Forward Cache
 * This prevents extension port closure errors
 * 
 * Must be loaded as early as possible (in <head>)
 */

(function() {
    'use strict';
    
    console.log('🔒 Initializing BFCache prevention...');
    
    /**
     * Method 1: Prevent BFCache using unload handler
     * Most reliable method across all browsers
     */
    window.addEventListener('unload', function() {
        // This prevents BFCache from storing the page
    }, false);
    
    /**
     * Method 2: Prevent BFCache using beforeunload
     */
    window.addEventListener('beforeunload', function() {
        // Some browsers also use beforeunload
    }, false);
    
    /**
     * Method 3: Handle page restoration from BFCache
     * When user clicks back/forward
     */
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            console.log('🔁 Page restored from BFCache - reloading...');
            // Force full page reload if restored from cache
            window.location.reload();
        }
    }, false);
    
    /**
     * Method 4: Warn when entering BFCache
     */
    window.addEventListener('pagehide', function(event) {
        if (event.persisted) {
            console.log('⚠️ Page being stored in BFCache');
        }
    }, false);
    
    /**
     * Method 5: Prevent BFCache using no-cache meta tag
     * Add dynamically for browsers that support it
     */
    try {
        const noCacheMeta = document.createElement('meta');
        noCacheMeta.httpEquiv = 'Cache-Control';
        noCacheMeta.content = 'no-cache, no-store, must-revalidate';
        if (document.head) {
            document.head.appendChild(noCacheMeta);
        }
    } catch (e) {
        console.log('Could not add no-cache meta tag');
    }
    
    console.log('✅ BFCache prevention active on all pages');
})();
