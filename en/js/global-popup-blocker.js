/**
 * Global Popup Blocker for Emirates Gifts English Store
 * Prevents ALL popup windows except WhatsApp and external links
 * Version: v20251101-NO-POPUPS
 */

(function() {
    'use strict';
    
    console.log('🚫 GLOBAL POPUP BLOCKER ACTIVE - Blocking ALL popups');
    
    const PopupBlocker = {
        blockedCount: 0,
        
        /**
         * Initialize popup blocker
         */
        init() {
            this.blockWindowPopups();
            this.blockModalPopups();
            this.blockNotificationPopups();
            this.blockOverlayPopups();
            this.preventPopupCSS();
            this.monitorForPopups();
            
            console.log('✅ All popup types blocked');
        },
        
        /**
         * Block window.open popups
         */
        blockWindowPopups() {
            const originalOpen = window.open;
            
            window.open = function(url, target, features) {
                // Allow only WhatsApp and explicit external links
                if (url && (
                    url.includes('wa.me') || 
                    url.includes('whatsapp') || 
                    url.includes('tel:') || 
                    url.includes('mailto:') ||
                    (target === '_blank' && (url.startsWith('http') || url.startsWith('./')))
                )) {
                    console.log('✅ Allowed external link:', url);
                    return originalOpen.call(window, url, target, features);
                }
                
                PopupBlocker.blockedCount++;
                console.log(`🚫 Popup blocked #${PopupBlocker.blockedCount}:`, url);
                
                // Show subtle notification instead of popup
                PopupBlocker.showBlockedNotification(url || 'Popup');
                return null;
            };
        },
        
        /**
         * Block alert/confirm/prompt popups
         */
        blockModalPopups() {
            // Block alert()
            window.alert = function(message) {
                console.log('🚫 Alert blocked:', message);
                PopupBlocker.showCleanMessage(message, 'info');
            };
            
            // Block confirm() - auto return true
            window.confirm = function(message) {
                console.log('🚫 Confirm blocked (auto-yes):', message);
                PopupBlocker.showCleanMessage('Confirmed: ' + message, 'success');
                return true;
            };
            
            // Block prompt() - return null
            window.prompt = function(message) {
                console.log('🚫 Prompt blocked:', message);
                PopupBlocker.showCleanMessage('Prompt blocked: ' + message, 'warning');
                return null;
            };
        },
        
        /**
         * Block notification popups
         */
        blockNotificationPopups() {
            // Block browser notifications
            if (window.Notification) {
                const originalNotification = window.Notification;
                window.Notification = function() {
                    console.log('🚫 Browser notification blocked');
                    return null;
                };
                window.Notification.permission = 'denied';
                window.Notification.requestPermission = () => Promise.resolve('denied');
            }
        },
        
        /**
         * Block overlay/modal popups via CSS
         */
        blockOverlayPopups() {
            const style = document.createElement('style');
            style.id = 'popupBlockerCSS';
            style.textContent = `
                /* BLOCK ALL POPUPS */
                .popup, .modal, .overlay, .notification, .alert-box, .toast,
                .dialog, .lightbox, .modal-backdrop, .modal-dialog,
                [class*="popup"], [class*="modal"], [class*="overlay"], 
                [class*="notification"], [class*="alert"], [class*="toast"],
                [class*="dialog"], [class*="lightbox"] {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                    z-index: -9999 !important;
                }
                
                /* Exception: Professional search modal */
                .professional-search-container,
                .professional-search-container .search-modal,
                .professional-search-container .search-overlay {
                    display: block !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    pointer-events: auto !important;
                }
                
                .professional-search-container:not(.active) {
                    display: none !important;
                }
                
                /* Block common popup triggers */
                body.popup-active, body.modal-open {
                    overflow: visible !important;
                }
            `;
            document.head.appendChild(style);
        },
        
        /**
         * Add CSS to prevent popups
         */
        preventPopupCSS() {
            const preventCSS = document.createElement('style');
            preventCSS.textContent = `
                /* NO POPUP ENVIRONMENT */
                * {
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    user-select: text !important;
                }
                
                /* Disable popup-triggering events */
                *[onclick*="popup"], *[onclick*="modal"], *[onclick*="alert"] {
                    pointer-events: none !important;
                }
            `;
            document.head.appendChild(preventCSS);
        },
        
        /**
         * Monitor for popup attempts
         */
        monitorForPopups() {
            // Monitor DOM for popup elements
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                const isPopup = node.className && (
                                    node.className.includes('popup') ||
                                    node.className.includes('modal') ||
                                    node.className.includes('overlay') ||
                                    node.className.includes('notification')
                                );
                                
                                // Exception for our search system
                                const isSearchSystem = node.className && 
                                    node.className.includes('professional-search');
                                
                                if (isPopup && !isSearchSystem) {
                                    console.log('🚫 Removing popup element:', node);
                                    node.remove();
                                    this.blockedCount++;
                                }
                            }
                        });
                    }
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        
        /**
         * Show clean message instead of popup
         */
        showCleanMessage(message, type = 'info') {
            const colors = {
                success: '#28a745',
                error: '#e74c3c',
                warning: '#ffc107',
                info: '#17a2b8'
            };
            
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                z-index: 9999;
                font-family: 'Inter', sans-serif;
                font-size: 14px;
                max-width: 300px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                animation: slideInRight 0.3s ease;
            `;
            
            const icons = {
                success: 'fas fa-check',
                error: 'fas fa-exclamation-triangle',
                warning: 'fas fa-exclamation-circle',
                info: 'fas fa-info-circle'
            };
            
            messageDiv.innerHTML = `<i class="${icons[type]}"></i> ${message}`;
            document.body.appendChild(messageDiv);
            
            setTimeout(() => messageDiv.remove(), 4000);
        },
        
        /**
         * Show blocked popup notification
         */
        showBlockedNotification(blockedItem) {
            if (this.blockedCount % 5 === 1) { // Show every 5th block
                this.showCleanMessage(`Popup blocked for better experience`, 'info');
            }
        }
    };
    
    // Auto-initialize
    PopupBlocker.init();
    
    // Export for debugging
    window.PopupBlocker = PopupBlocker;
    
    console.log('✅ Global Popup Blocker loaded and active');
    
    // Add animation styles
    const animationCSS = document.createElement('style');
    animationCSS.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(animationCSS);
    
})();