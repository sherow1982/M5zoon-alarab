// Emirates Gifts - English Version Main JavaScript

// Global Variables
let cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
let currentLanguage = 'en';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeNavigation();
    initializeProgressBar();
    initializeMobileMenu();
    initializeBackToTop();
    initializeCart();
    loadProducts();
    initializeAnimations();
    initializePopupSystem();
    
    console.log('✅ Emirates Gifts English version initialized successfully');
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
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Auto-update active navigation based on scroll position
        updateActiveNavOnScroll();
        
        lastScrollTop = scrollTop;
    });
}

function updateActiveNavLink(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeId) {
            link.classList.add('active');
        }
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const header = document.getElementById('header');
    const headerHeight = header.offsetHeight;
    const scrollPos = window.scrollY + headerHeight + 50;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
}

// Progress Bar
function initializeProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// Mobile Menu Management
function initializeMobileMenu() {
    const openSidebar = document.getElementById('openSidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (openSidebar) {
        openSidebar.addEventListener('click', function() {
            mobileSidebar.classList.add('active');
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu when clicking mobile nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-sidebar-nav a[href^="#"]');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(closeMobileMenu, 300);
        });
    });
}

function closeMobileMenu() {
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    mobileSidebar.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Back to Top Button
function initializeBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    if (backToTop) {
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
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
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
    
    // Animate cart icon
    animateCartIcon();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    showNotification('Product removed from cart', 'info');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    }
}

function saveCart() {
    localStorage.setItem('emirates-cart-en', JSON.stringify(cart));
}

function animateCartIcon() {
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            icon.style.transform = 'scale(1)';
        }, 200);
    });
}

// Product Loading
function loadProducts() {
    loadPerfumes();
    loadWatches();
    loadFeaturedProducts();
    loadBestDeals();
}

async function loadPerfumes() {
    const perfumesGrid = document.getElementById('perfumes-grid');
    if (!perfumesGrid) return;
    
    try {
        // Load Arabic perfumes data but translate
        const response = await fetch('../data/otor.json');
        const data = await response.json();
        
        // Get first 6 products
        const products = data.slice(0, 6);
        
        perfumesGrid.innerHTML = products.map(product => createProductCard(product)).join('');
        
        // Initialize product interactions
        initializeProductCards(perfumesGrid);
        
    } catch (error) {
        console.error('Error loading perfumes:', error);
        perfumesGrid.innerHTML = '<p class="error-message">Unable to load perfumes. Please try again later.</p>';
    }
}

async function loadWatches() {
    const watchesGrid = document.getElementById('watches-grid');
    if (!watchesGrid) return;
    
    try {
        // Load Arabic watches data but translate
        const response = await fetch('../data/sa3at.json');
        const data = await response.json();
        
        // Get first 6 products
        const products = data.slice(0, 6);
        
        watchesGrid.innerHTML = products.map(product => createProductCard(product)).join('');
        
        // Initialize product interactions
        initializeProductCards(watchesGrid);
        
    } catch (error) {
        console.error('Error loading watches:', error);
        watchesGrid.innerHTML = '<p class="error-message">Unable to load watches. Please try again later.</p>';
    }
}

async function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProducts');
    if (!featuredGrid) return;
    
    try {
        // Mix of perfumes and watches
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('../data/otor.json'),
            fetch('../data/sa3at.json')
        ]);
        
        const perfumes = await perfumesResponse.json();
        const watches = await watchesResponse.json();
        
        // Get 3 from each category
        const featured = [
            ...perfumes.slice(0, 3),
            ...watches.slice(0, 3)
        ];
        
        // Shuffle the array
        const shuffled = featured.sort(() => 0.5 - Math.random());
        
        featuredGrid.innerHTML = shuffled.map(product => createProductCard(product)).join('');
        
        // Initialize product interactions
        initializeProductCards(featuredGrid);
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        featuredGrid.innerHTML = '<p class="error-message">Unable to load featured products. Please try again later.</p>';
    }
}

async function loadBestDeals() {
    const dealsGrid = document.getElementById('bestDeals');
    if (!dealsGrid) return;
    
    try {
        // Load and show discounted products
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('../data/otor.json'),
            fetch('../data/sa3at.json')
        ]);
        
        const perfumes = await perfumesResponse.json();
        const watches = await watchesResponse.json();
        
        // Get products with discounts
        const deals = [
            ...perfumes.slice(6, 9),
            ...watches.slice(6, 9)
        ].map(product => ({
            ...product,
            originalPrice: product.price * 1.3, // Add original price for discount display
            discount: '25%'
        }));
        
        dealsGrid.innerHTML = deals.map(product => createProductCard(product, true)).join('');
        
        // Initialize product interactions
        initializeProductCards(dealsGrid);
        
    } catch (error) {
        console.error('Error loading deals:', error);
        dealsGrid.innerHTML = '<p class="error-message">Unable to load deals. Please try again later.</p>';
    }
}

// Create Product Card
function createProductCard(product, showDiscount = false) {
    const translatedTitle = translateProductTitle(product.title || product.name);
    const price = parseFloat(product.price) || 99;
    const originalPrice = showDiscount ? (price * 1.3) : null;
    const image = product.image || product.img || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop';
    
    return `
        <div class="product-card" data-product-id="${product.id || Date.now()}">
            <div class="product-image-container">
                <img src="${image}" alt="${translatedTitle}" class="product-image" loading="lazy">
                ${showDiscount ? `<div class="discount-badge">${product.discount || '25%'} OFF</div>` : ''}
                <div class="product-overlay">
                    <button class="btn-quick-view" data-product='${JSON.stringify(product)}' title="Quick View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-add-to-cart" data-product='${JSON.stringify(product)}' title="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${translatedTitle}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${'★'.repeat(5)}
                    </div>
                    <span class="review-count">(${Math.floor(Math.random() * 50) + 10} reviews)</span>
                </div>
                <div class="product-price">
                    ${originalPrice ? `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : ''}
                    <span class="current-price">$${price.toFixed(2)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-order-now" onclick="orderNow('${translatedTitle}', ${price})">
                        <i class="fas fa-credit-card"></i>
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Product Card Interactions
function initializeProductCards(container) {
    const addToCartBtns = container.querySelectorAll('.btn-add-to-cart');
    const quickViewBtns = container.querySelectorAll('.btn-quick-view');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productData = JSON.parse(this.getAttribute('data-product'));
            addToCart({
                id: productData.id || Date.now(),
                title: translateProductTitle(productData.title || productData.name),
                price: parseFloat(productData.price) || 99,
                image: productData.image || productData.img || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'
            });
        });
    });
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productData = JSON.parse(this.getAttribute('data-product'));
            showQuickView(productData);
        });
    });
}

// Translation Helper
function translateProductTitle(arabicTitle) {
    // Simple translation mapping - in a real app, you'd use a proper translation service
    const translations = {
        'عطر': 'Perfume',
        'ساعة': 'Watch',
        'رجالي': 'Men\'s',
        'نسائي': 'Women\'s',
        'فاخر': 'Luxury',
        'ذهبي': 'Gold',
        'فضي': 'Silver',
        'أسود': 'Black',
        'أبيض': 'White',
        'أزرق': 'Blue',
        'أحمر': 'Red',
        'شرقي': 'Oriental',
        'غربي': 'Western',
        'كلاسيكي': 'Classic',
        'عصري': 'Modern'
    };
    
    if (!arabicTitle) return 'Premium Product';
    
    let translatedTitle = arabicTitle;
    Object.keys(translations).forEach(arabic => {
        translatedTitle = translatedTitle.replace(new RegExp(arabic, 'g'), translations[arabic]);
    });
    
    // If no translation found, return a generic English title
    if (translatedTitle === arabicTitle) {
        return 'Premium Product';
    }
    
    return translatedTitle;
}

// Quick View Modal
function showQuickView(product) {
    const translatedTitle = translateProductTitle(product.title || product.name);
    const price = parseFloat(product.price) || 99;
    const image = product.image || product.img || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop';
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeQuickView()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeQuickView()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${image}" alt="${translatedTitle}">
                </div>
                <div class="modal-info">
                    <h2 class="modal-title">${translatedTitle}</h2>
                    <div class="modal-rating">
                        <div class="stars">${'★'.repeat(5)}</div>
                        <span>(${Math.floor(Math.random() * 50) + 10} reviews)</span>
                    </div>
                    <div class="modal-price">$${price.toFixed(2)}</div>
                    <div class="modal-description">
                        <p>Premium quality product with authentic materials and superior craftsmanship. Perfect for those who appreciate luxury and style.</p>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="addToCartFromModal('${product.id || Date.now()}', '${translatedTitle}', ${price}, '${image}')">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn-secondary" onclick="orderNow('${translatedTitle}', ${price})">
                            <i class="fas fa-credit-card"></i>
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeQuickView() {
    const modal = document.querySelector('.quick-view-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

function addToCartFromModal(id, title, price, image) {
    addToCart({ id, title, price, image });
    closeQuickView();
}

// Order Now Function
function orderNow(productName, price) {
    const message = `Hello! I'm interested in ordering:\n\n📱 Product: ${productName}\n💰 Price: $${price.toFixed(2)}\n\nPlease provide more details about availability and delivery.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Popup System
function initializePopupSystem() {
    // Check if popup was shown recently
    const lastPopupTime = localStorage.getItem('emirates-popup-last-shown-en');
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    if (!lastPopupTime || (now - parseInt(lastPopupTime)) > dayInMs) {
        setTimeout(showWelcomePopup, 10000); // Show after 10 seconds
    }
}

function showWelcomePopup() {
    const popup = document.createElement('div');
    popup.className = 'welcome-popup';
    popup.innerHTML = `
        <div class="popup-overlay" onclick="closeWelcomePopup()"></div>
        <div class="popup-content">
            <button class="popup-close" onclick="closeWelcomePopup()">
                <i class="fas fa-times"></i>
            </button>
            <div class="popup-header">
                <h2>🎉 Welcome to Emirates Gifts!</h2>
                <p>Discover premium perfumes and luxury watches</p>
            </div>
            <div class="popup-body">
                <div class="popup-offer">
                    <div class="offer-badge">Special Offer</div>
                    <h3>Get 25% OFF</h3>
                    <p>On your first order above $100</p>
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
                </div>
            </div>
            <div class="popup-actions">
                <button class="btn-primary" onclick="closeWelcomePopup(); document.querySelector('#perfumes-section').scrollIntoView({behavior: 'smooth'});">
                    <i class="fas fa-shopping-bag"></i>
                    Shop Now
                </button>
                <a href="https://wa.me/201110760081" class="btn-secondary" target="_blank" onclick="closeWelcomePopup()">
                    <i class="fab fa-whatsapp"></i>
                    Contact Us
                </a>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
    
    // Mark popup as shown
    localStorage.setItem('emirates-popup-last-shown-en', Date.now().toString());
}

function closeWelcomePopup() {
    const popup = document.querySelector('.welcome-popup');
    if (popup) {
        popup.classList.remove('active');
        setTimeout(() => {
            popup.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.section-header, .product-card, .service-card, .showcase-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Utility Functions
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You could send this to an error tracking service
});

// Export functions for global access
window.Emirates = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    orderNow,
    showNotification,
    closeQuickView,
    closeWelcomePopup
};