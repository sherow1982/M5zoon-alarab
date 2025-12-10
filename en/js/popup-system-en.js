// Popup System for English Version

class PopupSystem {
    constructor() {
        this.popups = new Map();
        this.settings = {
            showDelay: 10000, // 10 seconds
            reminderInterval: 20000, // 20 seconds
            maxShows: 3,
            cookieExpiry: 24 * 60 * 60 * 1000 // 24 hours
        };
    }
    
    initialize() {
        this.loadPopupSettings();
        this.initializeWelcomePopup();
        this.initializeExitIntentPopup();
        this.initializeScrollPopup();
        
        console.log('✅ Popup system initialized');
    }
    
    loadPopupSettings() {
        const settings = localStorage.getItem('emirates-popup-settings-en');
        if (settings) {
            this.settings = { ...this.settings, ...JSON.parse(settings) };
        }
    }
    
    savePopupSettings() {
        localStorage.setItem('emirates-popup-settings-en', JSON.stringify(this.settings));
    }
    
    shouldShowPopup(popupType) {
        const lastShown = localStorage.getItem(`emirates-popup-${popupType}-last-shown-en`);
        const showCount = parseInt(localStorage.getItem(`emirates-popup-${popupType}-count-en`) || '0');
        
        if (showCount >= this.settings.maxShows) return false;
        if (!lastShown) return true;
        
        const timeSinceLastShow = Date.now() - parseInt(lastShown);
        return timeSinceLastShow > this.settings.cookieExpiry;
    }
    
    markPopupShown(popupType) {
        const showCount = parseInt(localStorage.getItem(`emirates-popup-${popupType}-count-en`) || '0');
        localStorage.setItem(`emirates-popup-${popupType}-last-shown-en`, Date.now().toString());
        localStorage.setItem(`emirates-popup-${popupType}-count-en`, (showCount + 1).toString());
    }
    
    initializeWelcomePopup() {
        if (!this.shouldShowPopup('welcome')) return;
        
        setTimeout(() => {
            this.showWelcomePopup();
        }, this.settings.showDelay);
    }
    
    showWelcomePopup() {
        const popup = document.createElement('div');
        popup.className = 'welcome-popup luxury-popup';
        popup.innerHTML = `
            <div class="popup-overlay" onclick="popupSystem.closePopup('welcome')"></div>
            <div class="popup-content">
                <button class="popup-close" onclick="popupSystem.closePopup('welcome')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="popup-header">
                    <div class="popup-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <h2>Welcome to Emirates Gifts!</h2>
                    <p>Discover luxury perfumes and premium watches</p>
                </div>
                <div class="popup-body">
                    <div class="popup-offer">
                        <div class="offer-badge">Special Welcome Offer</div>
                        <h3>25% OFF</h3>
                        <p>On your first order above $100</p>
                        <div class="offer-code">
                            <span>Use code: </span>
                            <strong>WELCOME25</strong>
                        </div>
                    </div>
                    <div class="popup-features">
                        <div class="feature">
                            <i class="fas fa-shipping-fast"></i>
                            <span>Fast 1-3 Day Delivery</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-undo"></i>
                            <span>14-Day Return Guarantee</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-certificate"></i>
                            <span>100% Authentic Products</span>
                        </div>
                    </div>
                </div>
                <div class="popup-actions">
                    <button class="btn-primary" onclick="popupSystem.closePopupAndNavigate('welcome', '#perfumes-section')">
                        <i class="fas fa-shopping-bag"></i>
                        Shop Now
                    </button>
                    <button class="btn-secondary" onclick="popupSystem.closePopup('welcome')">
                        <i class="fas fa-times"></i>
                        Maybe Later
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        this.popups.set('welcome', popup);
        
        setTimeout(() => {
            popup.classList.add('active');
        }, 100);
        
        this.markPopupShown('welcome');
    }
    
    initializeExitIntentPopup() {
        if (!this.shouldShowPopup('exit-intent')) return;
        
        let isExiting = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !isExiting && !this.popups.has('exit-intent')) {
                isExiting = true;
                setTimeout(() => {
                    this.showExitIntentPopup();
                }, 500);
            }
        });
    }
    
    showExitIntentPopup() {
        const popup = document.createElement('div');
        popup.className = 'exit-intent-popup luxury-popup';
        popup.innerHTML = `
            <div class="popup-overlay" onclick="popupSystem.closePopup('exit-intent')"></div>
            <div class="popup-content">
                <button class="popup-close" onclick="popupSystem.closePopup('exit-intent')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="popup-header urgent">
                    <div class="popup-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <h2>Wait! Don't Miss Out!</h2>
                    <p>Complete your luxury collection today</p>
                </div>
                <div class="popup-body">
                    <div class="popup-offer urgent">
                        <div class="offer-badge">Limited Time</div>
                        <h3>30% OFF</h3>
                        <p>Everything in your cart + Free express shipping</p>
                        <div class="countdown" id="exitOfferCountdown">
                            <span>Offer expires in: </span>
                            <strong>05:00</strong>
                        </div>
                    </div>
                </div>
                <div class="popup-actions">
                    <button class="btn-primary" onclick="popupSystem.closePopupAndNavigate('exit-intent', './cart.html')">
                        <i class="fas fa-shopping-cart"></i>
                        Complete My Order
                    </button>
                    <button class="btn-secondary" onclick="popupSystem.closePopup('exit-intent')">
                        No Thanks
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        this.popups.set('exit-intent', popup);
        
        setTimeout(() => {
            popup.classList.add('active');
        }, 100);
        
        this.startCountdown('exitOfferCountdown', 5 * 60); // 5 minutes
        this.markPopupShown('exit-intent');
    }
    
    initializeScrollPopup() {
        if (!this.shouldShowPopup('scroll-popup')) return;
        
        let hasShown = false;
        
        window.addEventListener('scroll', () => {
            if (hasShown) return;
            
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > 50) {
                hasShown = true;
                setTimeout(() => {
                    this.showScrollPopup();
                }, 2000);
            }
        });
    }
    
    showScrollPopup() {
        const popup = document.createElement('div');
        popup.className = 'scroll-popup luxury-popup';
        popup.innerHTML = `
            <div class="popup-overlay" onclick="popupSystem.closePopup('scroll-popup')"></div>
            <div class="popup-content">
                <button class="popup-close" onclick="popupSystem.closePopup('scroll-popup')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="popup-header">
                    <div class="popup-icon">
                        <i class="fas fa-star"></i>
                    </div>
                    <h2>Loving What You See?</h2>
                    <p>Join thousands of satisfied customers</p>
                </div>
                <div class="popup-body">
                    <div class="testimonial">
                        <div class="testimonial-text">
                            "Outstanding quality and service. Emirates Gifts is my go-to for luxury perfumes!"
                        </div>
                        <div class="testimonial-author">
                            <div class="author-info">
                                <strong>Sarah M.</strong>
                                <div class="stars">★★★★★</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="popup-actions">
                    <a href="https://wa.me/201110760081" class="btn-primary" target="_blank" onclick="popupSystem.closePopup('scroll-popup')">
                        <i class="fab fa-whatsapp"></i>
                        Chat with Us
                    </a>
                    <button class="btn-secondary" onclick="popupSystem.closePopup('scroll-popup')">
                        Continue Browsing
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        this.popups.set('scroll-popup', popup);
        
        setTimeout(() => {
            popup.classList.add('active');
        }, 100);
        
        this.markPopupShown('scroll-popup');
    }
    
    startCountdown(elementId, totalSeconds) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        let remaining = totalSeconds;
        
        const countdown = setInterval(() => {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            
            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            const timeElement = element.querySelector('strong');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
            
            remaining--;
            
            if (remaining < 0) {
                clearInterval(countdown);
                this.closePopup('exit-intent');
            }
        }, 1000);
    }
    
    closePopup(popupType) {
        const popup = this.popups.get(popupType);
        if (!popup) return;
        
        popup.classList.remove('active');
        
        setTimeout(() => {
            popup.remove();
            this.popups.delete(popupType);
            
            // Restore body overflow if no popups are active
            if (this.popups.size === 0) {
                document.body.style.overflow = '';
            }
        }, 300);
    }
    
    closePopupAndNavigate(popupType, destination) {
        this.closePopup(popupType);
        
        setTimeout(() => {
            if (destination.startsWith('#')) {
                // Smooth scroll to section
                const element = document.querySelector(destination);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Navigate to page
                window.location.href = destination;
            }
        }, 300);
    }
    
    // Reminder popup every 20 seconds
    startReminderSystem() {
        setInterval(() => {
            if (this.popups.size === 0 && this.shouldShowPopup('reminder')) {
                this.showReminderPopup();
            }
        }, this.settings.reminderInterval);
    }
    
    showReminderPopup() {
        // Only show if user has items in cart but hasn't ordered
        const cartItems = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
        if (cartItems.length === 0) return;
        
        const popup = document.createElement('div');
        popup.className = 'reminder-popup luxury-popup';
        popup.innerHTML = `
            <div class="popup-overlay" onclick="popupSystem.closePopup('reminder')"></div>
            <div class="popup-content small">
                <button class="popup-close" onclick="popupSystem.closePopup('reminder')">
                    <i class="fas fa-times"></i>
                </button>
                <div class="popup-header">
                    <div class="popup-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>Complete Your Order</h3>
                    <p>You have ${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart</p>
                </div>
                <div class="popup-actions">
                    <button class="btn-primary" onclick="popupSystem.closePopupAndNavigate('reminder', './checkout.html')">
                        <i class="fas fa-credit-card"></i>
                        Checkout Now
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        this.popups.set('reminder', popup);
        
        setTimeout(() => {
            popup.classList.add('active');
        }, 100);
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            this.closePopup('reminder');
        }, 5000);
        
        this.markPopupShown('reminder');
    }
    
    // Disable popups (for users who don't want them)
    disablePopups() {
        localStorage.setItem('emirates-popups-disabled-en', 'true');
        
        // Close all active popups
        this.popups.forEach((popup, type) => {
            this.closePopup(type);
        });
    }
    
    enablePopups() {
        localStorage.removeItem('emirates-popups-disabled-en');
    }
    
    arePopupsDisabled() {
        return localStorage.getItem('emirates-popups-disabled-en') === 'true';
    }
}

// Create global popup system instance
const popupSystem = new PopupSystem();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (!popupSystem.arePopupsDisabled()) {
        popupSystem.initialize();
        
        // Start reminder system after page load
        setTimeout(() => {
            popupSystem.startReminderSystem();
        }, 30000); // Start after 30 seconds
    }
});

// Export for global access
window.popupSystem = popupSystem;
window.PopupSystem = PopupSystem;

// Global functions for popup controls
window.closeWelcomePopup = () => popupSystem.closePopup('welcome');
window.disablePopups = () => popupSystem.disablePopups();
window.enablePopups = () => popupSystem.enablePopups();