// Products Showcase JavaScript for English Version - Final Fix

// Global Variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 24;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing products showcase with actual images...');
    initializeProductsShowcase();
});

function initializeProductsShowcase() {
    initializeFilters();
    loadAllProducts();
    
    console.log('✅ Products Showcase initialized');
}

// Load All Products with Real Images from Data Files
async function loadAllProducts() {
    const productsGrid = document.getElementById('allProductsGrid');
    
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    try {
        console.log('Loading actual products data...');
        
        // Load both perfumes and watches from data files
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('../data/otor.json'),
            fetch('../data/sa3at.json')
        ]);
        
        if (!perfumesResponse.ok || !watchesResponse.ok) {
            throw new Error('Failed to load product data');
        }
        
        const perfumesData = await perfumesResponse.json();
        const watchesData = await watchesResponse.json();
        
        console.log('Loaded perfumes data:', perfumesData.length);
        console.log('Loaded watches data:', watchesData.length);
        
        // Process perfumes with their actual images
        const perfumes = perfumesData.map((product, index) => {
            const translatedTitle = translateProductTitle(product.title);
            const actualImage = product.image_link || product.image || product.img;
            
            return {
                id: product.id || `perfume-${index + 1}`,
                originalTitle: product.title,
                translatedTitle: translatedTitle,
                price: parseFloat(product.sale_price || product.price) || 200,
                originalPrice: (product.price && product.sale_price && parseFloat(product.price) > parseFloat(product.sale_price)) 
                    ? parseFloat(product.price) : null,
                // Use the actual image from data
                image: actualImage && actualImage !== '' ? actualImage : getFallbackPerfumeImage(),
                category: 'perfumes',
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviews: Math.floor(Math.random() * 150) + 25,
                hasDiscount: product.sale_price && product.price && parseFloat(product.sale_price) < parseFloat(product.price),
                isNew: Math.random() > 0.85,
                isBestseller: index < 10 || Math.random() > 0.8,
                inStock: true
            };
        });
        
        // Process watches with their actual images
        const watches = watchesData.map((product, index) => {
            const translatedTitle = translateProductTitle(product.title);
            const actualImage = product.image_link || product.image || product.img;
            
            return {
                id: product.id || `watch-${index + 1}`,
                originalTitle: product.title,
                translatedTitle: translatedTitle,
                price: parseFloat(product.sale_price || product.price) || 300,
                originalPrice: (product.price && product.sale_price && parseFloat(product.price) > parseFloat(product.sale_price)) 
                    ? parseFloat(product.price) : null,
                // Use the actual image from data
                image: actualImage && actualImage !== '' ? actualImage : getFallbackWatchImage(),
                category: 'watches',
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                reviews: Math.floor(Math.random() * 150) + 25,
                hasDiscount: product.sale_price && product.price && parseFloat(product.sale_price) < parseFloat(product.price),
                isNew: Math.random() > 0.85,
                isBestseller: index < 8 || Math.random() > 0.8,
                inStock: true
            };
        });
        
        allProducts = [...perfumes, ...watches];
        filteredProducts = [...allProducts];
        
        console.log('Total products processed with actual images:', allProducts.length);
        console.log('Sample perfume image:', perfumes[0]?.image);
        console.log('Sample watch image:', watches[0]?.image);
        
        renderProducts();
        updateResultsCount();
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = createErrorMessage();
    }
}

// Fallback images in case data images fail
function getFallbackPerfumeImage() {
    const perfumeImages = [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop'
    ];
    return perfumeImages[Math.floor(Math.random() * perfumeImages.length)];
}

function getFallbackWatchImage() {
    const watchImages = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1548181622-6e1b91755b13?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1594576662267-2297e9ac1b2e?w=400&h=400&fit=crop'
    ];
    return watchImages[Math.floor(Math.random() * watchImages.length)];
}

function createErrorMessage() {
    return `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 15px; border: 2px dashed #ddd;">
            <div style="font-size: 64px; color: #ddd; margin-bottom: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 style="margin-bottom: 10px; color: #333;">Unable to Load Products</h3>
            <p style="color: #666; margin-bottom: 30px;">We're having trouble loading our products right now. Please try again later.</p>
            <a href="./" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: linear-gradient(135deg, #D4AF37, #B8941F); color: white; text-decoration: none; border-radius: 8px;">
                <i class="fas fa-home"></i>
                Return Home
            </a>
        </div>
    `;
}

// Initialize Filters
function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Apply Filters
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    let filtered = [...allProducts];
    
    // Apply category filter
    const category = categoryFilter ? categoryFilter.value : 'all';
    if (category !== 'all') {
        filtered = filtered.filter(product => product.category === category);
    }
    
    // Apply search filter
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.translatedTitle.toLowerCase().includes(searchTerm) ||
            (product.originalTitle && product.originalTitle.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply sorting
    const sortValue = sortFilter ? sortFilter.value : 'featured';
    switch (sortValue) {
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.translatedTitle.localeCompare(b.translatedTitle));
            break;
        case 'name-desc':
            filtered.sort((a, b) => b.translatedTitle.localeCompare(a.translatedTitle));
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        default: // featured
            // Keep original order but put bestsellers first
            filtered.sort((a, b) => {
                if (a.isBestseller && !b.isBestseller) return -1;
                if (!a.isBestseller && b.isBestseller) return 1;
                return 0;
            });
    }
    
    filteredProducts = filtered;
    renderProducts();
    updateResultsCount();
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('allProductsGrid');
    
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = createNoResultsMessage();
        return;
    }
    
    const productsToShow = filteredProducts.slice(0, productsPerPage);
    
    productsGrid.innerHTML = productsToShow.map((product, index) => {
        return createProductCard(product, index * 0.05);
    }).join('');
    
    // Initialize product interactions
    initializeProductCards(productsGrid);
    
    console.log(`Rendered ${productsToShow.length} products with actual images`);
}

function createNoResultsMessage() {
    return `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 15px; border: 2px dashed #ddd;">
            <div style="font-size: 64px; color: #ddd; margin-bottom: 20px;">
                <i class="fas fa-search"></i>
            </div>
            <h3 style="margin-bottom: 10px; color: #333;">No Products Found</h3>
            <p style="color: #666; margin-bottom: 30px;">Try adjusting your filters or search terms.</p>
            <button class="btn-primary" onclick="clearAllFilters()" style="padding: 12px 24px; background: linear-gradient(135deg, #D4AF37, #B8941F); color: white; border: none; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-undo"></i>
                Clear All Filters
            </button>
        </div>
    `;
}

// Create Product Card with Actual Images and Fixed Currency
function createProductCard(product, delay = 0) {
    // Ensure we use the actual image from product data
    const imageUrl = product.image && product.image.trim() !== '' ? product.image : 
                    (product.category === 'perfumes' ? getFallbackPerfumeImage() : getFallbackWatchImage());
    
    // Calculate discount badge if applicable
    let discountBadge = '';
    let productBadges = '';
    
    if (product.hasDiscount && product.originalPrice) {
        const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        discountBadge = `<div class="discount-badge">${discountPercent}% OFF</div>`;
    }
    
    if (product.isNew) productBadges += '<div class="product-badge new-badge">New</div>';
    if (product.isBestseller) productBadges += '<div class="product-badge bestseller-badge">Bestseller</div>';
    
    return `
        <div class="product-card" data-product-id="${product.id}" style="animation-delay: ${delay}s">
            <div class="product-image-container">
                <img src="${imageUrl}" 
                     alt="${product.translatedTitle}" 
                     class="product-image" 
                     loading="lazy" 
                     onerror="handleImageError(this, '${product.category}')">
                ${discountBadge}
                ${productBadges}
                <div class="product-overlay">
                    <button class="btn-add-to-cart" 
                            onclick="addToCartFixed('${product.id}', '${escapeQuotes(product.translatedTitle)}', ${product.price}, '${escapeQuotes(imageUrl)}')" 
                            title="Add to Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category === 'perfumes' ? 'Premium Perfume' : 'Luxury Watch'}</div>
                <h3 class="product-title">${product.translatedTitle}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStarRating(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating}</span>
                    <span class="review-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    ${product.hasDiscount && product.originalPrice ? 
                        `<span class="original-price">${product.originalPrice.toFixed(2)}</span>` : ''}
                    <span class="current-price">${product.price.toFixed(2)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-order-now" onclick="orderNowFixed('${escapeQuotes(product.translatedTitle)}', ${product.price})">
                        <i class="fas fa-credit-card"></i>
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper function to escape quotes
function escapeQuotes(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Handle image loading errors
function handleImageError(img, category) {
    console.log('Image failed to load, using fallback for:', category);
    const fallback = category === 'perfumes' ? getFallbackPerfumeImage() : getFallbackWatchImage();
    img.src = fallback;
    img.style.opacity = '0.95';
}

// Generate Star Rating
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Update Results Count
function updateResultsCount() {
    const resultsCountElement = document.getElementById('productsCountText');
    if (resultsCountElement) {
        const totalProducts = filteredProducts.length;
        const showingCount = Math.min(productsPerPage, totalProducts);
        
        if (totalProducts === 0) {
            resultsCountElement.textContent = 'No products found';
        } else if (totalProducts <= productsPerPage) {
            resultsCountElement.textContent = `Showing all ${totalProducts} products`;
        } else {
            resultsCountElement.textContent = `Showing ${showingCount} of ${totalProducts} products`;
        }
    }
}

// Clear All Filters
function clearAllFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'featured';
    
    applyFilters();
    showNotification('Filters cleared!', 'info');
}

// Enhanced Translation Helper
function translateProductTitle(arabicTitle) {
    const brandTranslations = {
        // Exact brand matches
        'Tom Ford': 'Tom Ford',
        'Yves Saint Laurent': 'Yves Saint Laurent',
        'Chanel': 'Chanel',
        'Dior': 'Dior',
        'Gucci': 'Gucci',
        'Versace': 'Versace',
        'Rolex': 'Rolex',
        'Omega': 'Omega',
        'Burberry': 'Burberry',
        'Cartier': 'Cartier',
        'Marly': 'Parfums de Marly',
        'Penhaligons': 'Penhaligons',
        'Kayali': 'Kayali',
        'Hermes': 'Hermes',
        'Xerjoff': 'Xerjoff'
    };
    
    const arabicTranslations = {
        // Common Arabic terms
        'عطر': 'Perfume',
        'عطور': 'Perfumes',
        'رائحة': 'Fragrance',
        'دخون': 'Incense',
        'عبير': 'Oud',
        'مسك': 'Musk',
        
        // Watch terms
        'ساعة': 'Watch',
        'ساعات': 'Watches',
        
        // Arabic brand names
        'شانيل': 'Chanel',
        'جوتشي': 'Gucci',
        'رولكس': 'Rolex',
        'اوميغا': 'Omega',
        'فرزاتشي': 'Versace',
        'ديور': 'Dior',
        'بربيري': 'Burberry',
        'كارتييه': 'Cartier',
        
        // Colors
        'ذهبي': 'Gold',
        'فضي': 'Silver',
        'أسود': 'Black',
        'أبيض': 'White',
        'أزرق': 'Blue',
        'أخضر': 'Green',
        'بني': 'Brown',
        'أحمر': 'Red',
        'زهري': 'Pink',
        'بنفسجي': 'Purple',
        'صفراء': 'Yellow',
        'رصاصي': 'Grey',
        'كحلي': 'Navy',
        'بيج': 'Beige'
    };
    
    if (!arabicTitle) {
        return 'Premium Product';
    }
    
    let translated = arabicTitle;
    
    // First, handle brand names (keep them as-is if already in English)
    Object.keys(brandTranslations).forEach(brand => {
        if (translated.includes(brand)) {
            // Brand is already in English, keep it
            return;
        }
    });
    
    // Apply Arabic to English translations
    Object.keys(arabicTranslations).forEach(arabic => {
        const regex = new RegExp(arabic, 'gi');
        translated = translated.replace(regex, arabicTranslations[arabic]);
    });
    
    // Clean up
    translated = translated
        .replace(/\s+/g, ' ')
        .replace(/[\u0660-\u0669]/g, (match) => {
            const arabicNumerals = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
            return arabicNumerals.indexOf(match).toString();
        })
        .replace(/\s*\+\s*/g, ' + ')
        .replace(/\s*\&\s*/g, ' & ')
        .trim();
    
    // If still has Arabic characters or translation failed
    if (!translated || translated === arabicTitle || /[\u0600-\u06FF]/.test(translated)) {
        const productTypes = {
            perfumes: [
                'Luxury Oriental Perfume', 'Premium Fragrance', 'Royal Oud Collection',
                'Elite Eastern Perfume', 'Designer Fragrance', 'Premium Oud Perfume',
                'Classic Arabian Scent', 'Luxury Perfume Collection'
            ],
            watches: [
                'Luxury Watch', 'Premium Timepiece', 'Elite Sports Watch',
                'Classic Dress Watch', 'Designer Chronograph', 'Executive Watch',
                'Modern Timepiece', 'Elegant Watch Collection'
            ]
        };
        
        // Determine category from original title
        const isWatch = arabicTitle.includes('ساعة') || arabicTitle.toLowerCase().includes('watch');
        const category = isWatch ? 'watches' : 'perfumes';
        const types = productTypes[category];
        
        return types[Math.floor(Math.random() * types.length)];
    }
    
    // Capitalize properly
    return translated
        .split(' ')
        .map(word => {
            if (word.length > 0) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
            return word;
        })
        .join(' ')
        .trim();
}

// Product Card Interactions
function initializeProductCards(container) {
    const productCards = container.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Make entire card clickable to open in new tab
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on buttons
            if (e.target.closest('button') || e.target.closest('a')) {
                return;
            }
            
            const productId = this.getAttribute('data-product-id');
            const productUrl = `./product-details.html?id=${productId}`;
            window.open(productUrl, '_blank');
        });
        
        card.style.cursor = 'pointer';
        card.title = 'Click to view product details (opens in new tab)';
    });
}

// Fixed Add to Cart Function
function addToCartFixed(id, title, price, image) {
    console.log('Adding to cart:', { id, title, price });
    
    let cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log('Updated quantity for existing item');
    } else {
        cart.push({
            id: id,
            title: title,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
        console.log('Added new item to cart');
    }
    
    localStorage.setItem('emirates-cart-en', JSON.stringify(cart));
    updateCartCounterFixed();
    showNotification(`${title} added to cart!`, 'success');
}

// Fixed Order Now Function
function orderNowFixed(productName, price) {
    const message = `Hello! I would like to order:\n\n🛍️ Product: ${productName}\n💰 Price: ${price.toFixed(2)} AED\n\nPlease confirm availability and delivery details to UAE.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Update Cart Counter
function updateCartCounterFixed() {
    const cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const counters = document.querySelectorAll('.cart-counter');
    counters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const styles = {
        success: { bg: '#d4edda', color: '#155724', icon: 'check-circle' },
        info: { bg: '#d1ecf1', color: '#0c5460', icon: 'info-circle' },
        error: { bg: '#f8d7da', color: '#721c24', icon: 'exclamation-circle' }
    };
    
    const style = styles[type] || styles.info;
    
    notification.innerHTML = `
        <i class="fas fa-${style.icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${style.bg};
        color: ${style.color};
        padding: 16px 20px;
        border-radius: 10px;
        box-shadow: 0 6px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 300px;
        font-weight: 500;
        border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Utility Functions
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

// Global functions for external access
window.clearAllFilters = clearAllFilters;
window.addToCartFixed = addToCartFixed;
window.orderNowFixed = orderNowFixed;
window.updateCartCounterFixed = updateCartCounterFixed;
window.showNotification = showNotification;
window.handleImageError = handleImageError;

// Initialize cart counter when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateCartCounterFixed();
        console.log('Cart counter updated on page load');
    }, 1000);
});