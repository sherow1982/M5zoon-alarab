/**
 * Emirates Gifts Store - English Version Enhancements
 * Optimized for English-speaking customers
 * Currency: AED, Direction: LTR, Language: English
 */

// English Version Configuration
const ENGLISH_CONFIG = {
    language: 'en',
    currency: 'AED',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    phoneFormat: '+971 XX XXX XXXX',
    whatsappNumber: '+201110760081'
};

// English Text Labels
const ENGLISH_LABELS = {
    // Navigation
    home: 'Home',
    products: 'All Products',
    perfumes: 'Perfumes',
    watches: 'Watches',
    blog: 'Blog',
    about: 'About Us',
    contact: 'Contact',
    cart: 'Cart',
    checkout: 'Checkout',
    orderNow: 'Order Now',
    
    // Product Actions
    addToCart: 'Add to Cart',
    orderNow: 'Order Now',
    viewDetails: 'View Details',
    quickView: 'Quick View',
    
    // Cart
    cartEmpty: 'Your luxury collection awaits',
    cartEmptyDesc: 'Your shopping cart is currently empty. Discover our premium perfumes and luxury watches collection.',
    startShopping: 'Start Shopping',
    continueShopping: 'Continue Shopping',
    proceedToCheckout: 'Proceed to Checkout',
    
    // Checkout
    orderSummary: 'Order Summary',
    subtotal: 'Subtotal',
    vat: 'UAE VAT (5%)',
    shipping: 'Shipping',
    total: 'Total',
    freeShipping: 'Free',
    
    // Customer Information
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    emailAddress: 'Email Address',
    emirate: 'Emirate',
    deliveryAddress: 'Delivery Address',
    specialInstructions: 'Special Instructions',
    
    // Delivery Options
    standardDelivery: 'Standard Delivery (FREE)',
    expressDelivery: 'Express Delivery',
    deliveryTime: '1-3 business days delivery to all UAE emirates',
    
    // Payment Methods
    whatsappPayment: 'WhatsApp Order',
    cashOnDelivery: 'Cash on Delivery',
    
    // Messages
    loading: 'Loading...',
    addedToCart: 'Added to cart successfully!',
    orderPlaced: 'Order placed successfully!',
    errorOccurred: 'An error occurred. Please try again.',
    
    // Reviews
    customerReviews: 'Customer Reviews',
    verifiedPurchase: 'Verified Purchase',
    helpful: 'Helpful',
    showMore: 'Show More Reviews',
    showLess: 'Show Less',
    
    // Filters
    allCategories: 'All Categories',
    allPrices: 'All Prices',
    sortBy: 'Sort By',
    featured: 'Featured',
    nameAZ: 'Name (A-Z)',
    nameZA: 'Name (Z-A)',
    priceLowHigh: 'Price (Low to High)',
    priceHighLow: 'Price (High to Low)',
    customerRating: 'Customer Rating',
    
    // Shipping Policy
    shippingPolicy: 'Shipping Policy (1-3 business days)',
    returnPolicy: 'Return Policy (14 days + shipping fees)',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    
    // Footer
    quickLinks: 'Quick Links',
    customerService: 'Customer Service',
    policiesTerms: 'Policies & Terms',
    contactUs: 'Contact Us',
    followUs: 'Follow Us',
    
    // Misc
    readMore: 'Read More',
    readLess: 'Read Less',
    viewAll: 'View All',
    backToTop: 'Back to Top',
    closeMenu: 'Close Menu',
    openMenu: 'Open Menu'
};

// Currency Formatting for English Version
function formatCurrencyEN(amount) {
    if (typeof amount === 'string') {
        amount = parseFloat(amount.replace(/[^\d.-]/g, ''));
    }
    
    if (isNaN(amount)) {
        return '0 AED';
    }
    
    return amount.toLocaleString('en-AE', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }) + ' AED';
}

// WhatsApp Message Template for English
function createWhatsAppMessageEN(orderData) {
    const message = `
🛍️ *New Order from Emirates Gifts Store*

📋 *Customer Information:*
Name: ${orderData.name || 'Not provided'}
Phone: ${orderData.phone || 'Not provided'}
Email: ${orderData.email || 'Not provided'}
Emirate: ${orderData.emirate || 'Not provided'}
Address: ${orderData.address || 'Not provided'}

📦 *Order Details:*
${orderData.itemsList || 'Items from cart'}

💰 *Order Total: ${orderData.total || '0 AED'}*

🚚 *Delivery: Express delivery within 1-3 business days*

📝 *Special Instructions:*
${orderData.notes || 'None'}

✨ Thank you for choosing Emirates Gifts!
`;
    return encodeURIComponent(message.trim());
}

// Update Currency Display Throughout Page
function updateCurrencyDisplayEN() {
    const priceSelectors = [
        '.price',
        '.original-price', 
        '.total-price',
        '.cart-total',
        '.cart-subtotal',
        '.cart-vat',
        '.subtotal-amount',
        '.vat-amount',
        '.final-amount',
        '.delivery-amount'
    ];
    
    priceSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && element.textContent) {
                const text = element.textContent.trim();
                if (text && text !== 'Free' && text !== 'فري' && !text.includes('AED') && text.match(/\d/)) {
                    const numericValue = parseFloat(text.replace(/[^\d.-]/g, ''));
                    if (!isNaN(numericValue)) {
                        element.textContent = formatCurrencyEN(numericValue);
                    }
                }
            }
        });
    });
}

// Initialize English Version Features
function initializeEnglishVersion() {
    // Set document language and direction
    document.documentElement.lang = 'en-US';
    document.documentElement.dir = 'ltr';
    document.body.dir = 'ltr';
    
    // Update currency display
    updateCurrencyDisplayEN();
    
    // Update loading messages
    const loadingMessages = document.querySelectorAll('.loading-message');
    loadingMessages.forEach(msg => {
        if (msg.textContent.includes('⏳')) {
            const isProducts = msg.textContent.includes('منتج') || msg.textContent.includes('products');
            const isReviews = msg.textContent.includes('تقييم') || msg.textContent.includes('reviews');
            
            if (isProducts && isReviews) {
                msg.innerHTML = '⏳ Loading premium products with customer reviews...';
            } else if (isProducts) {
                msg.innerHTML = '⏳ Loading premium products...';
            } else {
                msg.innerHTML = '⏳ Loading...';
            }
        }
    });
    
    // Update search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = 'Search premium perfumes, watches, gifts...';
        searchInput.setAttribute('aria-label', 'Search products');
    }
    
    // Update filter labels
    updateFilterLabelsEN();
    
    // Update empty cart message
    updateEmptyCartMessageEN();
    
    // Set up periodic currency updates
    setInterval(updateCurrencyDisplayEN, 3000);
}

// Update Filter Labels for English
function updateFilterLabelsEN() {
    const filterMappings = {
        'categoryFilter': {
            'all': 'All Categories',
            'perfumes': 'Perfumes',
            'watches': 'Watches',
            'gifts': 'Gifts'
        },
        'priceFilter': {
            'all': 'All Prices',
            '0-200': '0 - 200 AED',
            '200-500': '200 - 500 AED', 
            '500-1000': '500 - 1000 AED',
            '1000+': '1000+ AED'
        },
        'sortFilter': {
            'featured': 'Featured',
            'name-asc': 'Name (A-Z)',
            'name-desc': 'Name (Z-A)',
            'price-asc': 'Price (Low to High)',
            'price-desc': 'Price (High to Low)',
            'rating': 'Customer Rating'
        }
    };
    
    Object.keys(filterMappings).forEach(filterId => {
        const select = document.getElementById(filterId);
        if (select) {
            Array.from(select.options).forEach(option => {
                const mapping = filterMappings[filterId][option.value];
                if (mapping) {
                    option.textContent = mapping;
                }
            });
        }
    });
}

// Update Empty Cart Message for English
function updateEmptyCartMessageEN() {
    setTimeout(() => {
        const emptyCartTitle = document.querySelector('.empty-cart h2');
        if (emptyCartTitle && emptyCartTitle.textContent.includes('سلة')) {
            emptyCartTitle.textContent = 'Your luxury collection awaits';
        }
        
        const emptyCartDesc = document.querySelector('.empty-cart p');
        if (emptyCartDesc && emptyCartDesc.textContent.includes('فارغة')) {
            emptyCartDesc.textContent = 'Your shopping cart is currently empty. Discover our premium perfumes and luxury watches collection.';
        }
    }, 1000);
}

// Enhanced Product Card Click Handler for English
function setupProductCardClicksEN() {
    document.addEventListener('click', function(e) {
        const productCard = e.target.closest('.product-card');
        if (productCard && !e.target.closest('button, .btn-primary, .btn-secondary, .order-now-btn')) {
            e.preventDefault();
            
            // Open product details in new tab
            const productId = productCard.getAttribute('data-product-id');
            if (productId) {
                const detailsUrl = `./product-details.html?id=${productId}&lang=en`;
                window.open(detailsUrl, '_blank', 'noopener,noreferrer');
            }
        }
    });
}

// Update Reviews for English Version
function updateReviewsForEN() {
    const reviewElements = document.querySelectorAll('.review-item, .review-text, .review-author');
    reviewElements.forEach(element => {
        // This would be where we'd translate review content
        // For now, we'll keep the same reviews but format them for English readability
        if (element.classList.contains('review-text')) {
            element.style.textAlign = 'left';
            element.style.direction = 'ltr';
        }
    });
}

// WhatsApp Integration for English
function sendWhatsAppOrderEN(orderDetails) {
    const message = createWhatsAppMessageEN(orderDetails);
    const whatsappUrl = `https://wa.me/${ENGLISH_CONFIG.whatsappNumber.replace(/\D/g, '')}?text=${message}`;
    
    // Track order attempt
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            'currency': 'AED',
            'value': orderDetails.total || 0,
            'items': orderDetails.items || []
        });
    }
    
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

// Form Validation Messages in English
const VALIDATION_MESSAGES_EN = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid UAE phone number',
    minLength: 'This field is too short',
    maxLength: 'This field is too long'
};

// Update Form Validation for English
function setupFormValidationEN() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                const errorElement = input.parentNode.querySelector('.error-message');
                if (errorElement) {
                    errorElement.remove();
                }
                
                if (!input.value.trim()) {
                    showFieldErrorEN(input, VALIDATION_MESSAGES_EN.required);
                    isValid = false;
                } else if (input.type === 'email' && !isValidEmail(input.value)) {
                    showFieldErrorEN(input, VALIDATION_MESSAGES_EN.email);
                    isValid = false;
                } else if (input.type === 'tel' && !isValidUAEPhone(input.value)) {
                    showFieldErrorEN(input, VALIDATION_MESSAGES_EN.phone);
                    isValid = false;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
}

// Show Field Error in English
function showFieldErrorEN(field, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '14px';
    errorElement.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#dc3545';
    
    // Remove error on input
    field.addEventListener('input', function() {
        errorElement.remove();
        field.style.borderColor = '';
    }, { once: true });
}

// Validation Helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidUAEPhone(phone) {
    // UAE phone number validation
    const cleaned = phone.replace(/\D/g, '');
    return /^(971|0)?[0-9]{9}$/.test(cleaned);
}

// Update Page Title and Meta for SEO
function updateSEOForEN() {
    // Update meta description if needed
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.content.includes('هدايا')) {
        metaDesc.content = metaDesc.content.replace(/هدايا الإمارات/g, 'Emirates Gifts');
    }
    
    // Update page titles for better SEO
    if (document.title.includes('هدايا')) {
        document.title = document.title.replace(/هدايا الإمارات/g, 'Emirates Gifts');
    }
}

// Performance Optimizations
function optimizeForPerformanceEN() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0 && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazyload');
                    img.classList.add('lazyloaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Preload critical resources
    const preloadLinks = [
        '../css/dkhoon-inspired-style.css',
        '../js/cart-system.js',
        '../js/products-loader.js'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = href.endsWith('.css') ? 'style' : 'script';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Analytics Tracking for English Version
function trackPageViewEN() {
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href,
            language: 'en',
            currency: 'AED'
        });
    }
}

// Initialize English Version on DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Emirates Gifts English Version Loaded');
    
    // Initialize all English features
    initializeEnglishVersion();
    setupProductCardClicksEN();
    setupFormValidationEN();
    updateSEOForEN();
    optimizeForPerformanceEN();
    trackPageViewEN();
    
    // Update reviews display
    setTimeout(updateReviewsForEN, 2000);
    
    // Periodic updates
    setInterval(() => {
        updateCurrencyDisplayEN();
        updateEmptyCartMessageEN();
    }, 5000);
    
    // Add English-specific event listeners
    document.addEventListener('cartUpdated', updateCurrencyDisplayEN);
    document.addEventListener('productsLoaded', updateCurrencyDisplayEN);
    
    console.log('English Version: All systems initialized ✅');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ENGLISH_CONFIG,
        ENGLISH_LABELS,
        formatCurrencyEN,
        createWhatsAppMessageEN,
        updateCurrencyDisplayEN
    };
}

// Global English utilities
window.EmiratesGiftsEN = {
    config: ENGLISH_CONFIG,
    labels: ENGLISH_LABELS,
    formatCurrency: formatCurrencyEN,
    createWhatsAppMessage: createWhatsAppMessageEN,
    updateCurrency: updateCurrencyDisplayEN
};