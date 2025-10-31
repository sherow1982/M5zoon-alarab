// Dismissible Popup System for English Version - Appears every 20 seconds on all devices
// Can be dismissed by user and respects user preference

class DismissiblePopupSystemEN {
    constructor() {
        this.popupInterval = null;
        this.isPopupVisible = false;
        this.dismissedUntil = null;
        this.popupShownCount = 0;
        this.maxShowsPerSession = 10; // Limit to avoid annoying users
        this.storageKey = 'emirates-popup-dismissed-en';
        this.countKey = 'emirates-popup-count-en';
        
        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }
    
    initialize() {
        console.log('Initializing English dismissible popup system...');
        
        // Create popup HTML
        this.createPopupHTML();
        
        // Load user preferences
        this.loadUserPreferences();
        
        // Start showing popup every 20 seconds
        this.startPopupTimer();
        
        console.log('✅ English dismissible popup system initialized');
    }
    
    loadUserPreferences() {
        // Check if user has dismissed the popup recently
        const dismissedData = localStorage.getItem(this.storageKey);
        if (dismissedData) {
            const parsedData = JSON.parse(dismissedData);
            this.dismissedUntil = parsedData.until;
            
            // If dismissed time has passed, reset
            if (this.dismissedUntil && Date.now() > this.dismissedUntil) {
                this.dismissedUntil = null;
                localStorage.removeItem(this.storageKey);
            }
        }
        
        // Load show count for current session
        const countData = sessionStorage.getItem(this.countKey);
        if (countData) {
            this.popupShownCount = parseInt(countData, 10) || 0;
        }
    }
    
    createPopupHTML() {
        // Remove existing popup if any
        const existingPopup = document.getElementById('dismissiblePopupEN');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const popupHTML = `
            <div id="dismissiblePopupEN" class="dismissible-popup-en" style="display: none;">
                <div class="popup-overlay"></div>
                <div class="popup-container">
                    <div class="popup-header">
                        <div class="popup-logo">
                            <i class="fas fa-gift"></i>
                            <span>Emirates Gifts</span>
                        </div>
                        <button class="popup-close" onclick="dismissiblePopupEN.dismissPopup('close')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="popup-content">
                        <h3>🎁 Exclusive Offers on Premium Collections!</h3>
                        <p>Get special discounts on luxury perfumes and elegant watches</p>
                        <div class="popup-features">
                            <div class="popup-feature">
                                <i class="fas fa-shipping-fast"></i>
                                <span>Delivery within 1-3 business days</span>
                            </div>
                            <div class="popup-feature">
                                <i class="fas fa-undo"></i>
                                <span>14-day return guarantee + shipping fees</span>
                            </div>
                            <div class="popup-feature">
                                <i class="fas fa-star"></i>
                                <span>100% quality guaranteed</span>
                            </div>
                        </div>
                        
                        <div class="popup-actions">
                            <a href="./products-showcase.html" 
                               class="popup-btn popup-btn-primary" 
                               onclick="dismissiblePopupEN.dismissPopup('shop')" 
                               target="_blank" 
                               rel="noopener">
                                <i class="fas fa-shopping-bag"></i>
                                Shop Now
                            </a>
                            <a href="./checkout.html" 
                               class="popup-btn popup-btn-secondary" 
                               onclick="dismissiblePopupEN.dismissPopup('order')">
                                <i class="fas fa-credit-card"></i>
                                Complete Order
                            </a>
                            <a href="https://wa.me/201110760081?text=Hello! I would like to inquire about your special offers" 
                               class="popup-btn popup-btn-whatsapp" 
                               onclick="dismissiblePopupEN.dismissPopup('whatsapp')" 
                               target="_blank" 
                               rel="noopener">
                                <i class="fab fa-whatsapp"></i>
                                WhatsApp
                            </a>
                        </div>
                    </div>
                    
                    <div class="popup-footer">
                        <label class="popup-checkbox">
                            <input type="checkbox" id="dontShowAgainEN">
                            <span>Don't show again today</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        
        // Add CSS styles
        this.addPopupStyles();
    }
    
    addPopupStyles() {
        const styleId = 'dismissiblePopupStylesEN';
        if (document.getElementById(styleId)) return;
        
        const styles = `
            <style id="${styleId}">
            .dismissible-popup-en {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                direction: ltr;
            }
            
            .dismissible-popup-en.show {
                opacity: 1;
                visibility: visible;
            }
            
            .dismissible-popup-en .popup-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }
            
            .dismissible-popup-en .popup-container {
                position: relative;
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.8);
                transition: transform 0.3s ease;
                direction: ltr;
                text-align: left;
            }
            
            .dismissible-popup-en.show .popup-container {
                transform: scale(1);
            }
            
            .dismissible-popup-en .popup-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 25px 15px;
                border-bottom: 2px solid #f0f0f0;
                background: linear-gradient(135deg, #D4AF37, #B8941F);
                color: white;
                border-radius: 20px 20px 0 0;
            }
            
            .dismissible-popup-en .popup-logo {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 20px;
                font-weight: 700;
            }
            
            .dismissible-popup-en .popup-logo i {
                font-size: 24px;
                color: white;
            }
            
            .dismissible-popup-en .popup-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .dismissible-popup-en .popup-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: rotate(90deg);
            }
            
            .dismissible-popup-en .popup-content {
                padding: 30px 25px;
                text-align: center;
            }
            
            .dismissible-popup-en .popup-content h3 {
                font-size: 24px;
                font-weight: 800;
                color: #333;
                margin-bottom: 15px;
                line-height: 1.4;
            }
            
            .dismissible-popup-en .popup-content p {
                font-size: 16px;
                color: #666;
                margin-bottom: 25px;
                line-height: 1.6;
            }
            
            .dismissible-popup-en .popup-features {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 25px;
            }
            
            .dismissible-popup-en .popup-feature {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                padding: 8px 15px;
                background: #f8f9fa;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                text-align: left;
            }
            
            .dismissible-popup-en .popup-feature i {
                color: #D4AF37;
                font-size: 16px;
                flex-shrink: 0;
            }
            
            .dismissible-popup-en .popup-actions {
                display: flex;
                flex-direction: column;
                gap: 12px;
                margin-bottom: 20px;
            }
            
            .dismissible-popup-en .popup-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                padding: 12px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 16px;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .dismissible-popup-en .popup-btn-primary {
                background: linear-gradient(135deg, #D4AF37, #B8941F);
                color: white;
                border: none;
            }
            
            .dismissible-popup-en .popup-btn-primary:hover {
                background: linear-gradient(135deg, #B8941F, #D4AF37);
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
                color: white;
            }
            
            .dismissible-popup-en .popup-btn-secondary {
                background: transparent;
                color: #D4AF37;
                border: 2px solid #D4AF37;
            }
            
            .dismissible-popup-en .popup-btn-secondary:hover {
                background: #D4AF37;
                color: white;
                transform: translateY(-2px);
            }
            
            .dismissible-popup-en .popup-btn-whatsapp {
                background: #25D366;
                color: white;
                border: none;
            }
            
            .dismissible-popup-en .popup-btn-whatsapp:hover {
                background: #20BA5A;
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
                color: white;
            }
            
            .dismissible-popup-en .popup-footer {
                padding: 15px 25px 20px;
                border-top: 1px solid #f0f0f0;
                background: #f8f9fa;
                border-radius: 0 0 20px 20px;
            }
            
            .dismissible-popup-en .popup-checkbox {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
                font-size: 14px;
                color: #666;
                user-select: none;
            }
            
            .dismissible-popup-en .popup-checkbox input {
                width: 18px;
                height: 18px;
                cursor: pointer;
            }
            
            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .dismissible-popup-en .popup-container {
                    width: 95%;
                    margin: 10px;
                    border-radius: 15px;
                }
                
                .dismissible-popup-en .popup-header {
                    padding: 15px 20px 12px;
                    border-radius: 15px 15px 0 0;
                }
                
                .dismissible-popup-en .popup-logo {
                    font-size: 18px;
                }
                
                .dismissible-popup-en .popup-content {
                    padding: 25px 20px;
                }
                
                .dismissible-popup-en .popup-content h3 {
                    font-size: 20px;
                    margin-bottom: 12px;
                }
                
                .dismissible-popup-en .popup-content p {
                    font-size: 15px;
                    margin-bottom: 20px;
                }
                
                .dismissible-popup-en .popup-features {
                    gap: 10px;
                    margin-bottom: 20px;
                }
                
                .dismissible-popup-en .popup-feature {
                    padding: 6px 12px;
                    font-size: 13px;
                }
                
                .dismissible-popup-en .popup-actions {
                    gap: 10px;
                }
                
                .dismissible-popup-en .popup-btn {
                    padding: 10px 16px;
                    font-size: 15px;
                }
                
                .dismissible-popup-en .popup-footer {
                    padding: 12px 20px 15px;
                    border-radius: 0 0 15px 15px;
                }
                
                .dismissible-popup-en .popup-checkbox {
                    font-size: 13px;
                }
            }
            
            @media (max-width: 480px) {
                .dismissible-popup-en .popup-container {
                    width: 98%;
                    margin: 5px;
                }
                
                .dismissible-popup-en .popup-content h3 {
                    font-size: 18px;
                }
                
                .dismissible-popup-en .popup-actions {
                    gap: 8px;
                }
                
                .dismissible-popup-en .popup-btn {
                    padding: 8px 14px;
                    font-size: 14px;
                }
            }
            
            /* Animation Effects */
            @keyframes popupSlideInEN {
                from {
                    transform: scale(0.7) translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes popupSlideOutEN {
                from {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }
                to {
                    transform: scale(0.7) translateY(-50px);
                    opacity: 0;
                }
            }
            
            .dismissible-popup-en.slide-in .popup-container {
                animation: popupSlideInEN 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            }
            
            .dismissible-popup-en.slide-out .popup-container {
                animation: popupSlideOutEN 0.3s ease-in forwards;
            }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    startPopupTimer() {
        // Clear any existing timer
        if (this.popupInterval) {
            clearInterval(this.popupInterval);
        }
        
        // Start new timer - show popup every 20 seconds
        this.popupInterval = setInterval(() => {
            this.attemptShowPopup();
        }, 20000); // 20 seconds
        
        // Also show popup after 15 seconds initially (first time)
        setTimeout(() => {
            this.attemptShowPopup();
        }, 15000);
        
        console.log('English popup timer started - will show every 20 seconds');
    }
    
    attemptShowPopup() {
        // Check if we should show the popup
        if (this.shouldShowPopup()) {
            this.showPopup();
        } else {
            console.log('English popup skipped based on user preferences or limits');
        }
    }
    
    shouldShowPopup() {
        // Don't show if user dismissed it for today
        if (this.dismissedUntil && Date.now() < this.dismissedUntil) {
            return false;
        }
        
        // Don't show if popup is already visible
        if (this.isPopupVisible) {
            return false;
        }
        
        // Don't show if we've shown it too many times this session
        if (this.popupShownCount >= this.maxShowsPerSession) {
            return false;
        }
        
        // Don't show on certain pages (checkout, cart)
        const currentPath = window.location.pathname.toLowerCase();
        if (currentPath.includes('checkout') || currentPath.includes('cart')) {
            return false;
        }
        
        return true;
    }
    
    showPopup() {
        const popup = document.getElementById('dismissiblePopupEN');
        if (!popup) {
            console.error('English popup element not found');
            return;
        }
        
        console.log('Showing English dismissible popup...');
        
        // Mark as visible
        this.isPopupVisible = true;
        
        // Increment show count
        this.popupShownCount++;
        sessionStorage.setItem(this.countKey, this.popupShownCount.toString());
        
        // Show popup with animation
        popup.style.display = 'flex';
        setTimeout(() => {
            popup.classList.add('show', 'slide-in');
        }, 50);
        
        // Auto-hide after 8 seconds if user doesn't interact
        setTimeout(() => {
            if (this.isPopupVisible) {
                this.dismissPopup('auto');
            }
        }, 8000);
        
        // Track popup display
        this.trackPopupEvent('shown');
    }
    
    dismissPopup(reason = 'close') {
        const popup = document.getElementById('dismissiblePopupEN');
        if (!popup || !this.isPopupVisible) return;
        
        console.log('Dismissing English popup. Reason:', reason);
        
        // Check if user selected "don't show again today"
        const dontShowCheckbox = document.getElementById('dontShowAgainEN');
        if (dontShowCheckbox && dontShowCheckbox.checked) {
            // Don't show for 24 hours
            const until = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
            this.dismissedUntil = until;
            localStorage.setItem(this.storageKey, JSON.stringify({
                until: until,
                reason: reason
            }));
            console.log('English popup dismissed for 24 hours');
        } else if (reason === 'close') {
            // Don't show for 1 hour if manually closed
            const until = Date.now() + (60 * 60 * 1000); // 1 hour
            this.dismissedUntil = until;
            localStorage.setItem(this.storageKey, JSON.stringify({
                until: until,
                reason: reason
            }));
            console.log('English popup dismissed for 1 hour');
        }
        
        // Hide popup with animation
        popup.classList.add('slide-out');
        popup.classList.remove('slide-in');
        
        setTimeout(() => {
            popup.classList.remove('show', 'slide-out');
            popup.style.display = 'none';
            this.isPopupVisible = false;
        }, 300);
        
        // Track dismissal
        this.trackPopupEvent('dismissed', reason);
    }
    
    trackPopupEvent(action, reason = null) {
        // Simple event tracking
        console.log(`English popup ${action}${reason ? ' (' + reason + ')' : ''} - Count: ${this.popupShownCount}`);
        
        // Google Analytics tracking if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'popup_interaction_en', {
                'event_category': 'popup_english',
                'event_label': action,
                'value': reason || 'none'
            });
        }
    }
    
    // Method to manually show popup (for testing)
    forceShowPopup() {
        this.dismissedUntil = null;
        this.popupShownCount = 0;
        localStorage.removeItem(this.storageKey);
        sessionStorage.removeItem(this.countKey);
        this.attemptShowPopup();
    }
    
    // Method to permanently disable popup
    disablePopup() {
        if (this.popupInterval) {
            clearInterval(this.popupInterval);
            this.popupInterval = null;
        }
        
        const until = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year
        this.dismissedUntil = until;
        localStorage.setItem(this.storageKey, JSON.stringify({
            until: until,
            reason: 'disabled'
        }));
        
        console.log('English popup system disabled for 1 year');
    }
    
    // Cleanup method
    destroy() {
        if (this.popupInterval) {
            clearInterval(this.popupInterval);
        }
        
        const popup = document.getElementById('dismissiblePopupEN');
        if (popup) {
            popup.remove();
        }
        
        const styles = document.getElementById('dismissiblePopupStylesEN');
        if (styles) {
            styles.remove();
        }
        
        console.log('English popup system destroyed');
    }
}

// Create global instance
const dismissiblePopupEN = new DismissiblePopupSystemEN();

// Export for external access
window.dismissiblePopupEN = dismissiblePopupEN;

// Handle page visibility change (pause when page is hidden)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause popup when page is not visible
        if (dismissiblePopupEN.popupInterval) {
            clearInterval(dismissiblePopupEN.popupInterval);
        }
    } else {
        // Resume popup when page becomes visible again
        dismissiblePopupEN.startPopupTimer();
    }
});

// Handle popup overlay click to close
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('popup-overlay') && e.target.closest('.dismissible-popup-en')) {
        dismissiblePopupEN.dismissPopup('overlay');
    }
});

// Handle ESC key to close popup
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && dismissiblePopupEN.isPopupVisible) {
        dismissiblePopupEN.dismissPopup('escape');
    }
});

console.log('🎯 English Dismissible Popup System Loaded - Shows every 20 seconds');
console.log('🔧 Features: User dismissal, mobile-friendly, accessibility support');
console.log('⚙️ Controls: Click overlay or press ESC to close, checkbox to disable for 24h');