// Products Showcase JavaScript for English Version - Fixed Images and Currency

// Global Variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 24;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing products showcase...');
    initializeProductsShowcase();
});

function initializeProductsShowcase() {
    initializeFilters();
    loadAllProducts();
    
    console.log('✅ Products Showcase initialized');
}

// Load All Products with Real Images
async function loadAllProducts() {
    const productsGrid = document.getElementById('allProductsGrid');
    
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    try {
        console.log('Loading products data...');
        
        // Load both perfumes and watches
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('../data/otor.json'),
            fetch('../data/sa3at.json')
        ]);
        
        const perfumesData = await perfumesResponse.json();
        const watchesData = await watchesResponse.json();
        
        console.log('Loaded perfumes:', perfumesData.length);
        console.log('Loaded watches:', watchesData.length);
        
        // Process perfumes with actual images
        const perfumes = perfumesData.map((product, index) => ({
            ...product,
            id: product.id || `perfume-${index}`,
            category: 'perfumes',
            translatedTitle: translateProductTitle(product.title || product.name),
            price: parseFloat(product.sale_price || product.price) || Math.floor(Math.random() * 200) + 50,
            originalPrice: product.price ? parseFloat(product.price) : null,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 15,
            // Use actual image from data or fallback
            image: product.image_link || product.image || product.img || getRandomPerfumeImage(),
            hasDiscount: product.sale_price && product.price && parseFloat(product.sale_price) < parseFloat(product.price)
        }));
        
        // Process watches with actual images
        const watches = watchesData.map((product, index) => ({
            ...product,
            id: product.id || `watch-${index}`,
            category: 'watches',
            translatedTitle: translateProductTitle(product.title || product.name),
            price: parseFloat(product.sale_price || product.price) || Math.floor(Math.random() * 500) + 100,
            originalPrice: product.price ? parseFloat(product.price) : null,
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 15,
            // Use actual image from data or fallback
            image: product.image_link || product.image || product.img || getRandomWatchImage(),
            hasDiscount: product.sale_price && product.price && parseFloat(product.sale_price) < parseFloat(product.price)
        }));
        
        allProducts = [...perfumes, ...watches];
        filteredProducts = [...allProducts];
        
        console.log('Total products processed:', allProducts.length);
        
        renderProducts();
        updateResultsCount();
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = createErrorMessage();
    }
}

// Get random perfume image as fallback
function getRandomPerfumeImage() {
    const perfumeImages = [
        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop'
    ];
    return perfumeImages[Math.floor(Math.random() * perfumeImages.length)];
}

// Get random watch image as fallback
function getRandomWatchImage() {
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
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <div class="empty-state-icon" style="font-size: 64px; color: #ddd; margin-bottom: 20px;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 style="margin-bottom: 10px; color: #333;">Unable to Load Products</h3>
            <p style="color: #666; margin-bottom: 30px;">We're having trouble loading our products right now. Please try again later.</p>
            <a href="./" class="btn-primary" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #D4AF37; color: white; text-decoration: none; border-radius: 8px;">
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
        searchInput.addEventListener('input', debounce(function() {
            applyFilters();
        }, 300));
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            applyFilters();
        });
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
            (product.title && product.title.toLowerCase().includes(searchTerm))
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
    
    console.log(`Rendered ${productsToShow.length} products`);
}

function createNoResultsMessage() {
    return `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
            <div class="empty-state-icon" style="font-size: 64px; color: #ddd; margin-bottom: 20px;">
                <i class="fas fa-search"></i>
            </div>
            <h3 style="margin-bottom: 10px; color: #333;">No Products Found</h3>
            <p style="color: #666; margin-bottom: 30px;">Try adjusting your filters or search terms.</p>
            <button class="btn-primary" onclick="clearAllFilters()" style="padding: 12px 24px; background: #D4AF37; color: white; border: none; border-radius: 8px; cursor: pointer;">
                <i class="fas fa-undo"></i>
                Clear All Filters
            </button>
        </div>
    `;
}

// Create Product Card with Real Images and Fixed Currency
function createProductCard(product, delay = 0) {
    // Fix the image URL if needed
    let imageUrl = product.image;
    if (imageUrl && imageUrl.includes('m5zoon.com')) {
        // Use the actual image from the data
        imageUrl = product.image;
    } else {
        // Use category-appropriate fallback
        imageUrl = product.category === 'perfumes' ? getRandomPerfumeImage() : getRandomWatchImage();
    }
    
    // Calculate discount percentage if applicable
    let discountBadge = '';
    if (product.hasDiscount && product.originalPrice) {
        const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        discountBadge = `<div class="discount-badge">${discountPercent}% OFF</div>`;
    }
    
    return `
        <div class="product-card" data-product-id="${product.id}" style="animation-delay: ${delay}s">
            <div class="product-image-container">
                <img src="${imageUrl}" 
                     alt="${product.translatedTitle}" 
                     class="product-image" 
                     loading="lazy" 
                     onerror="this.src='${product.category === 'perfumes' ? getRandomPerfumeImage() : getRandomWatchImage()}'">
                ${discountBadge}
                <div class="product-overlay">
                    <button class="btn-add-to-cart" onclick="addToCartFixed('${product.id}', '${product.translatedTitle.replace(/'/g, "\\'")}'', ${product.price}, '${imageUrl}')">
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
                    <button class="btn-order-now" onclick="orderNowFixed('${product.translatedTitle.replace(/'/g, "\\'")}'', ${product.price})">
                        <i class="fas fa-credit-card"></i>
                        Order Now
                    </button>
                </div>
            </div>
        </div>
    `;
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
}

// Enhanced Translation Helper
function translateProductTitle(arabicTitle) {
    const translations = {
        // Perfume terms
        'عطر': 'Perfume',
        'عطور': 'Perfumes',
        'رائحة': 'Fragrance',
        'عبير': 'Oud',
        'مسك': 'Musk',
        'عنبر': 'Amber',
        'ورد': 'Rose',
        'ياسمين': 'Jasmine',
        'زعفران': 'Saffron',
        'دخون': 'Incense',
        
        // Watch terms
        'ساعة': 'Watch',
        'ساعات': 'Watches',
        
        // Brand names (keep as is but clean up)
        'شانيل': 'Chanel',
        'ديور': 'Dior',
        'جوتشي': 'Gucci',
        'فرزاتشي': 'Versace',
        'رولكس': 'Rolex',
        'اوميغا': 'Omega',
        
        // Quality terms
        'فاخر': 'Luxury',
        'ممتاز': 'Premium',
        'أصلي': 'Original',
        'راقية': 'Elite',
        'راقيه': 'Elite',
        
        // Gender terms
        'رجالي': "Men's",
        'نسائي': "Women's",
        'رجال': 'Men',
        'نساء': 'Women',
        
        // Colors
        'ذهبي': 'Gold',
        'فضي': 'Silver',
        'أسود': 'Black',
        'أبيض': 'White',
        'أزرق': 'Blue',
        'أحمر': 'Red',
        'أخضر': 'Green',
        'بني': 'Brown',
        'كحلي': 'Navy',
        'رصاصي': 'Grey',
        
        // Styles
        'شرقي': 'Oriental',
        'غربي': 'Western',
        'كلاسيكي': 'Classic',
        'عصري': 'Modern',
        'كلاسيكية': 'Classic'
    };
    
    if (!arabicTitle) {
        return 'Premium Product';
    }
    
    let translatedTitle = arabicTitle;
    
    // Apply translations
    Object.keys(translations).forEach(arabic => {
        const regex = new RegExp(arabic, 'gi');
        translatedTitle = translatedTitle.replace(regex, translations[arabic]);
    });
    
    // Clean up and format
    translatedTitle = translatedTitle
        .replace(/\s+/g, ' ')  // Remove extra spaces
        .replace(/[٠-٩]/g, (match) => {
            // Convert Arabic numerals to English
            const arabicNumerals = '٠١٢٣٤٥٦٧٨٩';
            return arabicNumerals.indexOf(match).toString();
        })
        .trim();
    
    // If still mostly Arabic or empty, generate a descriptive name
    if (!translatedTitle || translatedTitle === arabicTitle || /[\u0600-\u06FF]/.test(translatedTitle)) {
        const productTypes = {
            perfumes: [
                'Luxury Oriental Perfume', 'Premium Fragrance', 'Royal Oud Scent',
                'Golden Rose Perfume', 'Mystic Amber Fragrance', 'Elite Eastern Perfume',
                'Designer Perfume', 'Classic Fragrance', 'Premium Oud Perfume'
            ],
            watches: [
                'Luxury Watch', 'Premium Timepiece', 'Elite Watch',
                'Classic Watch', 'Designer Watch', 'Sports Watch',
                'Elegant Timepiece', 'Modern Watch', 'Executive Watch'
            ]
        };
        
        const category = arabicTitle && arabicTitle.includes('عطر') ? 'perfumes' : 'watches';
        const types = productTypes[category] || productTypes.perfumes;
        return types[Math.floor(Math.random() * types.length)];
    }
    
    // Capitalize first letter of each word
    return translatedTitle
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
    // Make product cards clickable to open in new tab
    const productCards = container.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
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
        card.title = 'Click to view product details';
    });
}

// Fixed Add to Cart Function
function addToCartFixed(id, title, price, image) {
    console.log('Adding to cart:', { id, title, price });
    
    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
    
    // Check if item exists
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            title: title,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }
    
    // Save cart
    localStorage.setItem('emirates-cart-en', JSON.stringify(cart));
    
    // Update counter
    updateCartCounterFixed();
    
    // Show notification
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

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
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

// Global functions
window.clearAllFilters = clearAllFilters;
window.addToCartFixed = addToCartFixed;
window.orderNowFixed = orderNowFixed;
window.updateCartCounterFixed = updateCartCounterFixed;
window.showNotification = showNotification;

// Initialize cart counter on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateCartCounterFixed, 1000);
});