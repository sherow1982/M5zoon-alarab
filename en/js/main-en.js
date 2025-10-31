// Emirates Gifts - English Version Main JavaScript - Simplified

// Global Variables
let cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Emirates Gifts English version...');
    initializeApp();
});

function initializeApp() {
    initializeNavigation();
    initializeMobileMenu();
    initializeBackToTop();
    initializeCart();
    
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

// Cart Management
function initializeCart() {
    updateCartCounter();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', function() {
        updateCartCounter();
        saveCart();
    });
}

function updateCartCounter() {
    const cartCounters = document.querySelectorAll('.cart-counter');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Dispatch cart updated event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Show success notification
    showNotification('Product added to cart!', 'success');
}

function saveCart() {
    localStorage.setItem('emirates-cart-en', JSON.stringify(cart));
}

// Order Now Function
function orderNow(productName, price) {
    const message = `Hello! I'm interested in ordering:\n\n📱 Product: ${productName}\n💰 Price: $${price.toFixed(2)} AED\n\nPlease provide more details about availability and delivery to UAE.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : '#0c5460'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: 10px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Export functions for global access
window.Emirates = {
    addToCart,
    orderNow,
    showNotification,
    closeMobileMenu
};

// Global functions
window.orderNow = orderNow;
window.addToCartSimple = addToCartSimple;
window.orderNowSimple = orderNowSimple;
window.showNotification = showNotification;