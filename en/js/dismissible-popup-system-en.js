// Dismissible Popup System for English Version
// Single popup that appears every 20 seconds on all devices
// Identical functionality to Arabic version but in English

class DismissiblePopupSystemEN {
    constructor() {
        this.popupInterval = null;
        this.popupTimeout = null;
        this.isDismissed = false;
        this.showInterval = 20000; // 20 seconds
        this.storageKey = 'emirates-popup-dismissed-en';
        this.currentPopupIndex = 0;
        
        this.popupMessages = [
            {
                title: '🎆 Special Offers on Premium Products!',
                message: 'Discover exclusive deals on luxury perfumes and watches. Fast UAE delivery within 1-3 business days!',
                cta: 'Shop Now',
                link: './products-showcase.html',
                icon: 'fas fa-fire'
            },
            {
                title: '⭐ Premium Quality Guaranteed',
                message: 'All our products are 100% authentic with 14-day return policy + shipping fees covered. Customer satisfaction guaranteed!',
                cta: 'Learn More',
                link: './about.html',
                icon: 'fas fa-shield-alt'
            },
            {
                title: '🚚 Free Express Shipping',
                message: 'Enjoy fast delivery within 1-3 business days to all UAE emirates. Order now and receive your premium products quickly!',
                cta: 'View Products',
                link: './products-showcase.html',
                icon: 'fas fa-shipping-fast'
            },
            {
                title: '📱 Order via WhatsApp',
                message: 'Get instant support and quick ordering through WhatsApp. Our customer service team is available 24/7!',
                cta: 'Chat Now',
                link: 'https://wa.me/201110760081',
                icon: 'fab fa-whatsapp'
            },
            {
                title: '🎁 Premium Gift Collections',
                message: 'Perfect gifts for all occasions! Luxury perfumes, elegant watches, and exclusive items with beautiful packaging.',
                cta: 'Explore Gifts',
                link: './products-showcase.html',
                icon: 'fas fa-gift'
            }
        ];
        
        this.initialize();
    }
    
    initialize() {
        console.log('Initializing English dismissible popup system...');
        
        // Check if popup was recently dismissed
        const dismissedTime = localStorage.getItem(this.storageKey);
        const currentTime = Date.now();
        
        // Reset dismissal after 1 hour
        if (dismissedTime && (currentTime - parseInt(dismissedTime)) > 3600000) {
            localStorage.removeItem(this.storageKey);
            this.isDismissed = false;
        } else if (dismissedTime) {
            this.isDismissed = true;
        }
        
        if (!this.isDismissed) {
            this.startPopupCycle();
        }
        
        this.addPopupStyles();
        
        console.log('🔔 English popup system initialized - Shows every 20 seconds');
    }
    
    startPopupCycle() {
        // First popup after page load
        this.popupTimeout = setTimeout(() => {
            if (!this.isDismissed) {
                this.showPopup();
            }
        }, 3000); // First popup after 3 seconds
        
        // Recurring popup every 20 seconds
        this.popupInterval = setInterval(() => {
            if (!this.isDismissed && !document.hidden) {
                this.showPopup();
            }
        }, this.showInterval);
    }
    
    showPopup() {
        // Don't show if already dismissed or if another popup is visible
        if (this.isDismissed || document.querySelector('.emirates-popup-en')) {
            return;
        }
        
        const popup = this.popupMessages[this.currentPopupIndex];
        this.currentPopupIndex = (this.currentPopupIndex + 1) % this.popupMessages.length;
        
        const popupHTML = `
            <div class="emirates-popup-en" id="emiratesPopupEN">
                <div class="popup-overlay-en" onclick="dismissiblePopupEN.hidePopup()"></div>
                <div class="popup-content-en">
                    <div class="popup-header-en">
                        <div class="popup-icon-en">
                            <i class="${popup.icon}"></i>
                        </div>
                        <button class="popup-close-en" onclick="dismissiblePopupEN.dismissPopup()" aria-label="Close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="popup-body-en">
                        <h3 class="popup-title-en">${popup.title}</h3>
                        <p class="popup-message-en">${popup.message}</p>
                        
                        <div class="popup-actions-en">
                            <a href="${popup.link}" class="popup-cta-en" ${popup.link.startsWith('http') ? 'target="_blank" rel="noopener"' : 'target="_blank" rel="noopener"'}>
                                <i class="${popup.icon}"></i>
                                ${popup.cta}
                            </a>
                            <button class="popup-dismiss-en" onclick="dismissiblePopupEN.hidePopup()">
                                <i class="fas fa-eye-slash"></i>
                                Not Now
                            </button>
                        </div>
                        
                        <div class="popup-footer-en">
                            <label class="popup-checkbox-en">
                                <input type="checkbox" id="dontShowAgainEN" onchange="dismissiblePopupEN.toggleDontShow(this.checked)">
                                <span>Don't show again today</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        // Animate in
        setTimeout(() => {
            const popupElement = document.getElementById('emiratesPopupEN');
            if (popupElement) {
                popupElement.classList.add('popup-visible-en');
            }
        }, 100);
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            this.hidePopup();
        }, 10000);
        
        console.log(`💬 English popup shown: ${popup.title}`);
    }
    
    hidePopup() {
        const popup = document.getElementById('emiratesPopupEN');
        if (popup) {
            popup.classList.remove('popup-visible-en');
            popup.classList.add('popup-hiding-en');
            
            setTimeout(() => {
                popup.remove();
            }, 300);
        }
    }
    
    dismissPopup() {
        this.isDismissed = true;
        localStorage.setItem(this.storageKey, Date.now().toString());
        
        this.hidePopup();
        
        // Stop the intervals
        if (this.popupInterval) {
            clearInterval(this.popupInterval);
            this.popupInterval = null;
        }
        
        if (this.popupTimeout) {
            clearTimeout(this.popupTimeout);
            this.popupTimeout = null;
        }
        
        console.log('🚫 English popup dismissed by user');
    }
    
    toggleDontShow(checked) {
        if (checked) {
            this.dismissPopup();
        }
    }
    
    addPopupStyles() {
        const styleId = 'dismissiblePopupStylesEN';
        if (document.getElementById(styleId)) return;
        
        const styles = `
            <style id="${styleId}">
            .emirates-popup-en {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                direction: ltr;
                text-align: left;
            }
            
            .emirates-popup-en.popup-visible-en {
                opacity: 1;
                visibility: visible;
            }
            
            .emirates-popup-en.popup-hiding-en {
                opacity: 0;
                visibility: hidden;
            }
            
            .popup-overlay-en {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(5px);
            }
            
            .popup-content-en {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                max-width: 480px;
                width: 90%;
                max-height: 80vh;
                overflow: hidden;
                animation: popupSlideInEN 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            
            @keyframes popupSlideInEN {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.7) rotate(5deg);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                }
            }
            
            .popup-header-en {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 25px 0;
            }
            
            .popup-icon-en {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #D4AF37, #B8941F);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 22px;
                animation: pulseEN 2s infinite;
            }
            
            @keyframes pulseEN {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .popup-close-en {
                background: transparent;
                border: none;
                font-size: 20px;
                color: #999;
                cursor: pointer;
                padding: 8px;
                transition: all 0.3s ease;
                border-radius: 50%;
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .popup-close-en:hover {
                color: #D4AF37;
                background: rgba(212, 175, 55, 0.1);
                transform: rotate(90deg);
            }
            
            .popup-body-en {
                padding: 25px;
                text-align: center;
            }
            
            .popup-title-en {
                font-size: 24px;
                font-weight: 700;
                color: #333;
                margin: 0 0 15px 0;
                line-height: 1.3;
            }
            
            .popup-message-en {
                color: #666;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 25px 0;
            }
            
            .popup-actions-en {
                display: flex;
                gap: 12px;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 20px;
            }
            
            .popup-cta-en {
                background: linear-gradient(135deg, #D4AF37, #B8941F);
                color: white;
                padding: 12px 20px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                flex: 1;
                justify-content: center;
                min-width: 120px;
            }
            
            .popup-cta-en:hover {
                background: linear-gradient(135deg, #B8941F, #D4AF37);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                color: white;
            }
            
            .popup-dismiss-en {
                background: transparent;
                color: #666;
                border: 2px solid #e9ecef;
                padding: 12px 18px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                flex: 1;
                justify-content: center;
                min-width: 100px;
            }
            
            .popup-dismiss-en:hover {
                border-color: #D4AF37;
                color: #D4AF37;
                background: rgba(212, 175, 55, 0.05);
            }
            
            .popup-footer-en {
                border-top: 1px solid #f0f0f0;
                padding: 15px 25px 20px;
                background: #f8f9fa;
                border-radius: 0 0 20px 20px;
            }
            
            .popup-checkbox-en {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
                font-size: 14px;
                color: #666;
                user-select: none;
            }
            
            .popup-checkbox-en input[type="checkbox"] {
                width: 18px;
                height: 18px;
                margin: 0;
                cursor: pointer;
                accent-color: #D4AF37;
            }
            
            /* Mobile Optimization */
            @media (max-width: 768px) {
                .popup-content-en {
                    max-width: 95%;
                    margin: 0 auto;
                    border-radius: 15px;
                }
                
                .popup-header-en {
                    padding: 15px 20px 0;
                }
                
                .popup-body-en {
                    padding: 20px;
                }
                
                .popup-title-en {
                    font-size: 20px;
                    margin-bottom: 12px;
                }
                
                .popup-message-en {
                    font-size: 15px;
                    margin-bottom: 20px;
                }
                
                .popup-actions-en {
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 15px;
                }
                
                .popup-cta-en,
                .popup-dismiss-en {
                    width: 100%;
                    flex: none;
                    min-width: auto;
                    justify-content: center;
                }
                
                .popup-icon-en {
                    width: 45px;
                    height: 45px;
                    font-size: 20px;
                }
                
                .popup-footer-en {
                    padding: 12px 20px 15px;
                }
                
                .popup-checkbox-en {
                    font-size: 13px;
                }
            }
            
            /* Tablet Adjustments */
            @media (max-width: 1024px) and (min-width: 769px) {
                .popup-content-en {
                    max-width: 70%;
                }
            }
            
            /* Enhanced Animations */
            .popup-content-en {
                animation-duration: 0.5s;
                animation-fill-mode: forwards;
            }
            
            .popup-hiding-en .popup-content-en {
                animation: popupSlideOutEN 0.3s ease-out;
            }
            
            @keyframes popupSlideOutEN {
                0% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1) rotate(0deg);
                }
                100% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8) rotate(-3deg);
                }
            }
            
            /* Accessibility Improvements */
            .popup-content-en:focus-within {
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(212, 175, 55, 0.5);
            }
            
            .popup-cta-en:focus,
            .popup-dismiss-en:focus,
            .popup-close-en:focus {
                outline: 2px solid #D4AF37;
                outline-offset: 2px;
            }
            
            /* High Contrast Mode Support */
            @media (prefers-contrast: high) {
                .popup-content-en {
                    border: 2px solid #000;
                }
                
                .popup-title-en {
                    color: #000;
                }
                
                .popup-message-en {
                    color: #333;
                }
            }
            
            /* Reduced Motion Support */
            @media (prefers-reduced-motion: reduce) {
                .popup-content-en {
                    animation: none;
                }
                
                .popup-icon-en {
                    animation: none;
                }
                
                .popup-cta-en:hover,
                .popup-dismiss-en:hover,
                .popup-close-en:hover {
                    transform: none;
                }
            }
            
            /* Dark Mode Support */
            @media (prefers-color-scheme: dark) {
                .popup-content-en {
                    background: #2d2d2d;
                    border: 1px solid #444;
                }
                
                .popup-title-en {
                    color: #fff;
                }
                
                .popup-message-en {
                    color: #ccc;
                }
                
                .popup-footer-en {
                    background: #1a1a1a;
                    border-top-color: #444;
                }
                
                .popup-checkbox-en {
                    color: #ccc;
                }
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    // Force show popup (for testing)
    forceShowPopup() {
        this.isDismissed = false;
        localStorage.removeItem(this.storageKey);
        this.showPopup();
    }
    
    // Reset popup system
    resetPopupSystem() {
        this.isDismissed = false;
        localStorage.removeItem(this.storageKey);
        
        if (this.popupInterval) {
            clearInterval(this.popupInterval);
        }
        if (this.popupTimeout) {
            clearTimeout(this.popupTimeout);
        }
        
        this.hidePopup();
        this.startPopupCycle();
        
        console.log('🔄 English popup system reset');
    }
    
    // Get popup statistics
    getPopupStats() {
        const dismissedTime = localStorage.getItem(this.storageKey);
        return {
            isDismissed: this.isDismissed,
            dismissedTime: dismissedTime ? new Date(parseInt(dismissedTime)) : null,
            currentPopupIndex: this.currentPopupIndex,
            totalPopups: this.popupMessages.length,
            showInterval: this.showInterval
        };
    }
    
    // Update popup messages
    updatePopupMessages(newMessages) {
        if (Array.isArray(newMessages) && newMessages.length > 0) {
            this.popupMessages = newMessages;
            this.currentPopupIndex = 0;
            console.log('📝 English popup messages updated');
        }
    }
}

// Create global instance
const dismissiblePopupEN = new DismissiblePopupSystemEN();

// Export for external access
window.dismissiblePopupEN = dismissiblePopupEN;
window.dismissiblePopup = dismissiblePopupEN; // Compatibility

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause popup when page is not visible
        if (dismissiblePopupEN.popupInterval) {
            clearInterval(dismissiblePopupEN.popupInterval);
        }
    } else {
        // Resume popup when page becomes visible
        if (!dismissiblePopupEN.isDismissed && !dismissiblePopupEN.popupInterval) {
            dismissiblePopupEN.startPopupCycle();
        }
    }
});

// Handle before page unload
window.addEventListener('beforeunload', function() {
    if (dismissiblePopupEN.popupInterval) {
        clearInterval(dismissiblePopupEN.popupInterval);
    }
    if (dismissiblePopupEN.popupTimeout) {
        clearTimeout(dismissiblePopupEN.popupTimeout);
    }
});

// Handle ESC key to close popup
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const popup = document.getElementById('emiratesPopupEN');
        if (popup && popup.classList.contains('popup-visible-en')) {
            dismissiblePopupEN.hidePopup();
        }
    }
});

// Developer tools for testing
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.testEnglishPopup = () => dismissiblePopupEN.forceShowPopup();
    window.resetEnglishPopup = () => dismissiblePopupEN.resetPopupSystem();
    window.englishPopupStats = () => console.table(dismissiblePopupEN.getPopupStats());
    
    console.log('🔧 English popup testing tools available:');
    console.log('- testEnglishPopup() - Force show popup');
    console.log('- resetEnglishPopup() - Reset popup system');
    console.log('- englishPopupStats() - Show popup statistics');
}

console.log('📱 English Dismissible Popup System Loaded');
console.log('⏰ Shows every 20 seconds on all devices');
console.log('❌ Single dismissal stops all future popups for 1 hour');
console.log('🎯 Identical functionality to Arabic version but in English');