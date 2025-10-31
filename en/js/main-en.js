// Emirates Gifts - English Version Main JavaScript - Fixed
// Removed cart variable conflict

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Emirates Gifts English version...');
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeMobileMenu();
    initializeBackToTop();
    initializeCartSystem();
    
    console.log('✅ Emirates Gifts English version initialized');
}

// Navigation Management
function initializeNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    // Smooth scrolling for anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

// Mobile Menu Management
function initializeMobileMenu() {
    const openSidebar = document.getElementById('openSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (openSidebar) {
        openSidebar.addEventListener('click', function() {
            if (mobileSidebar) mobileSidebar.classList.add('active');
            if (mobileOverlay) mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (mobileSidebar) mobileSidebar.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Back to Top Button
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Cart Management - Fixed
function initializeCartSystem() {
    updateCartCounterMain();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', function() {
        updateCartCounterMain();
    });
}

function updateCartCounterMain() {
    try {
        const cartData = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
        const cartCounters = document.querySelectorAll('.cart-counter, .mobile-cart-counter');
        const totalItems = cartData.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        cartCounters.forEach(counter => {
            if (counter) {
                counter.textContent = totalItems;
                counter.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });
    } catch (error) {
        console.error('Error updating cart counter:', error);
    }
}

// Simple Add to Cart Function
function addToCartSimple(productId, productName, price, image) {
    try {
        const cartData = JSON.parse(localStorage.getItem('emirates_shopping_cart') || '[]');
        const existingItem = cartData.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cartData.push({
                id: productId,
                name: productName,
                price: parseFloat(price),
                image: image || '',
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('emirates_shopping_cart', JSON.stringify(cartData));
        updateCartCounterMain();
        showNotificationMain('Product added to cart!', 'success');
        
    } catch (error) {
        console.error('Error adding to cart:', error);
        showNotificationMain('Error adding product to cart', 'error');
    }
}

// Order Now Function
function orderNowSimple(productName, price) {
    const message = `Hello! I'm interested in ordering:\n\n📱 Product: ${productName}\n💰 Price: ${price.toFixed(2)} AED\n\nPlease provide more details about availability and delivery to UAE.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Notification System - Fixed
function showNotificationMain(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.main-notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = 'main-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10001;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
        font-family: 'Inter', sans-serif;
        max-width: 300px;
        font-size: 14px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}-circle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: 10px; font-size: 16px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Export functions for global access
window.Emirates = {
    addToCartSimple,
    orderNowSimple,
    showNotificationMain,
    closeMobileMenu,
    updateCartCounterMain
};

// Global functions for backward compatibility
window.orderNowSimple = orderNowSimple;
window.addToCartSimple = addToCartSimple;
window.showNotificationMain = showNotificationMain;
window.updateCartCounterMain = updateCartCounterMain;

console.log('✅ Emirates Gifts English main system loaded successfully');
console.log('🛍️ Cart system integrated with localStorage');
console.log('💬 WhatsApp integration ready');