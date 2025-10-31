// Products Loader for English Version - Fixed for Homepage IDs

class ProductsLoader {
    constructor() {
        this.loadedProducts = {
            perfumes: [],
            watches: []
        };
        this.isInitialized = false;
    }
    
    async initialize() {
        if (this.isInitialized) return;
        
        console.log('Initializing Products Loader...');
        await this.preloadProductData();
        this.initializeProductLoading();
        this.isInitialized = true;
        console.log('✅ Products loader initialized');
    }
    
    async preloadProductData() {
        try {
            console.log('Loading product data...');
            
            const [perfumesResponse, watchesResponse] = await Promise.all([
                fetch('../data/otor.json'),
                fetch('../data/sa3at.json')
            ]);
            
            if (!perfumesResponse.ok || !watchesResponse.ok) {
                throw new Error('Failed to fetch product data');
            }
            
            const perfumesData = await perfumesResponse.json();
            const watchesData = await watchesResponse.json();
            
            console.log('Perfumes data loaded:', perfumesData.length);
            console.log('Watches data loaded:', watchesData.length);
            
            // Process and translate products
            this.loadedProducts.perfumes = perfumesData.map((product, index) => this.processProduct(product, index, 'perfumes'));
            this.loadedProducts.watches = watchesData.map((product, index) => this.processProduct(product, index, 'watches'));
            
        } catch (error) {
            console.error('Error preloading product data:', error);
            this.generateSampleData();
        }
    }
    
    processProduct(product, index, category) {
        return {
            id: product.id || `${category}-${index}`,
            title: product.title || product.name || 'Premium Product',
            translatedTitle: this.translateProductTitle(product.title || product.name),
            price: parseFloat(product.price) || this.generatePrice(category),
            originalPrice: product.originalPrice || null,
            image: product.image || product.img || this.getDefaultImage(category),
            category: category,
            rating: product.rating || (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: product.reviews || Math.floor(Math.random() * 80) + 20,
            description: product.description || this.generateDescription(product.title || product.name),
            inStock: product.inStock !== false,
            isNew: Math.random() > 0.8,
            isBestseller: Math.random() > 0.7
        };
    }
    
    translateProductTitle(arabicTitle) {
        const translations = {
            // Perfume translations
            'عطر': 'Perfume',
            'عطور': 'Perfumes', 
            'رائحة': 'Fragrance',
            'عبير': 'Oud',
            'مسك': 'Musk',
            'عنبر': 'Amber',
            'ورد': 'Rose',
            'ياسمين': 'Jasmine',
            'زعفران': 'Saffron',
            
            // Watch translations
            'ساعة': 'Watch',
            'ساعات': 'Watches',
            
            // Quality terms
            'فاخر': 'Luxury',
            'ممتاز': 'Premium',
            'أصلي': 'Original',
            
            // Gender terms
            'رجالي': "Men's",
            'نسائي': "Women's",
            
            // Colors
            'ذهبي': 'Gold',
            'فضي': 'Silver',
            'أسود': 'Black',
            'أبيض': 'White',
            'أزرق': 'Blue',
            'أحمر': 'Red',
            'أخضر': 'Green',
            
            // Styles
            'شرقي': 'Oriental',
            'غربي': 'Western',
            'كلاسيكي': 'Classic',
            'عصري': 'Modern'
        };
        
        if (!arabicTitle) {
            const productTypes = [
                'Luxury Perfume', 'Premium Watch', 'Designer Fragrance',
                'Elegant Timepiece', 'Oriental Scent', 'Classic Watch',
                'Modern Perfume', 'Vintage Watch', 'Exclusive Fragrance'
            ];
            return productTypes[Math.floor(Math.random() * productTypes.length)];
        }
        
        let translated = arabicTitle;
        Object.keys(translations).forEach(arabic => {
            const regex = new RegExp(arabic, 'g');
            translated = translated.replace(regex, translations[arabic]);
        });
        
        // If no translation happened, generate based on type
        if (translated === arabicTitle) {
            const productTypes = [
                'Premium Perfume', 'Luxury Watch', 'Designer Fragrance',
                'Elegant Timepiece', 'Oriental Scent', 'Classic Watch'
            ];
            return productTypes[Math.floor(Math.random() * productTypes.length)];
        }
        
        // Capitalize and clean up
        return translated
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .trim();
    }
    
    generatePrice(category) {
        return category === 'perfumes' 
            ? Math.floor(Math.random() * 200) + 50
            : Math.floor(Math.random() * 400) + 100;
    }
    
    getDefaultImage(category) {
        const defaultImages = {
            perfumes: [
                'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop'
            ],
            watches: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop'
            ]
        };
        
        const images = defaultImages[category] || defaultImages.perfumes;
        return images[Math.floor(Math.random() * images.length)];
    }
    
    generateDescription(title) {
        return `Experience the luxury of ${this.translateProductTitle(title)}, a premium product with excellent quality.`;
    }
    
    generateSampleData() {
        console.log('Generating sample data as fallback...');
        
        const perfumeNames = [
            'Royal Oud Perfume', 'Golden Rose Fragrance', 'Mystic Amber Scent', 'Oriental Nights',
            'Desert Rose Fragrance', 'Palace Musk', 'Diamond Jasmine', 'Luxury Eastern Blend'
        ];
        
        this.loadedProducts.perfumes = perfumeNames.map((name, index) => ({
            id: `perfume-${index + 1}`,
            title: name,
            translatedTitle: name,
            price: Math.floor(Math.random() * 200) + 50,
            image: this.getDefaultImage('perfumes'),
            category: 'perfumes',
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: Math.floor(Math.random() * 80) + 20,
            inStock: true
        }));
        
        const watchNames = [
            'Elite Timepiece', 'Luxury Gold Watch', 'Sports Watch Pro',
            'Classic Elegance', 'Modern Timepiece', 'Premium Silver Watch'
        ];
        
        this.loadedProducts.watches = watchNames.map((name, index) => ({
            id: `watch-${index + 1}`,
            title: name,
            translatedTitle: name,
            price: Math.floor(Math.random() * 400) + 100,
            image: this.getDefaultImage('watches'),
            category: 'watches',
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: Math.floor(Math.random() * 80) + 20,
            inStock: true
        }));
    }
    
    initializeProductLoading() {
        console.log('Starting product loading for homepage...');
        
        // Load each section with delay for smooth loading
        setTimeout(() => this.loadSectionProducts('perfumes', 'perfumes-grid', 6), 500);
        setTimeout(() => this.loadSectionProducts('watches', 'watches-grid', 6), 1000);
        setTimeout(() => this.loadFeaturedProducts(), 1500);
        setTimeout(() => this.loadBestDeals(), 2000);
    }
    
    async loadSectionProducts(category, gridId, limit = 6) {
        const grid = document.getElementById(gridId);
        if (!grid) {
            console.warn(`Grid element '${gridId}' not found`);
            return;
        }
        
        console.log(`Loading ${category} for ${gridId}...`);
        
        try {
            const products = this.loadedProducts[category].slice(0, limit);
            
            if (products.length === 0) {
                grid.innerHTML = '<p class="loading-message">No products available</p>';
                return;
            }
            
            const productsHTML = products.map((product, index) => {
                return this.createProductCard(product, index * 0.1);
            }).join('');
            
            grid.innerHTML = productsHTML;
            
            // Initialize product interactions
            this.initializeProductCards(grid);
            
            console.log(`✅ Loaded ${products.length} ${category} to ${gridId}`);
            
        } catch (error) {
            console.error(`Error loading ${category}:`, error);
            grid.innerHTML = '<p class="error-message">Unable to load products</p>';
        }
    }
    
    async loadFeaturedProducts() {
        const grid = document.getElementById('featuredProducts');
        if (!grid) {
            console.warn('Featured products grid not found');
            return;
        }
        
        try {
            // Mix of perfumes and watches for featured
            const allProducts = [...this.loadedProducts.perfumes, ...this.loadedProducts.watches];
            const featured = allProducts
                .filter(product => product.isBestseller || product.isNew)
                .slice(0, 6);
            
            if (featured.length === 0) {
                // Fallback to first 6 products
                featured.push(...allProducts.slice(0, 6));
            }
            
            const productsHTML = featured.map((product, index) => {
                return this.createProductCard(product, index * 0.1);
            }).join('');
            
            grid.innerHTML = productsHTML;
            this.initializeProductCards(grid);
            
            console.log('✅ Loaded featured products');
            
        } catch (error) {
            console.error('Error loading featured products:', error);
            grid.innerHTML = '<p class="error-message">Unable to load featured products</p>';
        }
    }
    
    async loadBestDeals() {
        const grid = document.getElementById('bestDeals');
        if (!grid) {
            console.warn('Best deals grid not found');
            return;
        }
        
        try {
            const allProducts = [...this.loadedProducts.perfumes, ...this.loadedProducts.watches];
            const deals = allProducts.slice(6, 12).map(product => ({
                ...product,
                originalPrice: (product.price * 1.3).toFixed(2),
                discount: '25%',
                hasDiscount: true
            }));
            
            const productsHTML = deals.map((product, index) => {
                return this.createProductCard(product, index * 0.1);
            }).join('');
            
            grid.innerHTML = productsHTML;
            this.initializeProductCards(grid);
            
            console.log('✅ Loaded best deals');
            
        } catch (error) {
            console.error('Error loading deals:', error);
            grid.innerHTML = '<p class="error-message">Unable to load deals</p>';
        }
    }
    
    createProductCard(product, delay = 0) {
        let badges = '';
        if (product.isNew) badges += '<div class="product-badge new-badge">New</div>';
        if (product.isBestseller) badges += '<div class="product-badge bestseller-badge">Bestseller</div>';
        if (product.hasDiscount) badges += '<div class="discount-badge">25% OFF</div>';
        
        return `
            <div class="product-card" data-product-id="${product.id}" style="animation-delay: ${delay}s">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.translatedTitle}" class="product-image" loading="lazy" onerror="handleImageError(this)">
                    ${badges}
                    <div class="product-overlay">
                        <button class="btn-add-to-cart" onclick="addToCartSimple('${product.id}', '${product.translatedTitle}', ${product.price}, '${product.image}')" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category === 'perfumes' ? 'Perfume' : 'Watch'}</div>
                    <h3 class="product-title">${product.translatedTitle}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStarRating(product.rating)}
                        </div>
                        <span class="rating-text">${product.rating}</span>
                        <span class="review-count">(${product.reviews} reviews)</span>
                    </div>
                    <div class="product-price">
                        ${product.hasDiscount ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn-order-now" onclick="orderNowSimple('${product.translatedTitle}', ${product.price})">
                            <i class="fas fa-credit-card"></i>
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        stars += '<i class="fas fa-star"></i>'.repeat(fullStars);
        if (hasHalfStar) stars += '<i class="fas fa-star-half-alt"></i>';
        stars += '<i class="far fa-star"></i>'.repeat(emptyStars);
        
        return stars;
    }
    
    initializeProductCards(container) {
        console.log(`Initialized product cards in ${container.id || 'container'}`);
        
        // Add click handlers for product cards to open in new tab
        const productCards = container.querySelectorAll('.product-card');
        productCards.forEach(card => {
            // Make entire card clickable (excluding buttons)
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on a button
                if (e.target.closest('button') || e.target.closest('a')) {
                    return;
                }
                
                const productId = this.getAttribute('data-product-id');
                const productUrl = `./product-details.html?id=${productId}`;
                window.open(productUrl, '_blank');
            });
            
            card.style.cursor = 'pointer';
        });
    }
}

// Simple global functions
function addToCartSimple(id, title, price, image) {
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
    updateCartCounter();
    
    // Show notification
    showSimpleNotification(`${title} added to cart!`);
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const counters = document.querySelectorAll('.cart-counter');
    counters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function orderNowSimple(productName, price) {
    const message = `Hello! I would like to order:\n\n🛍️ Product: ${productName}\n💰 Price: $${price.toFixed(2)} AED\n\nPlease confirm availability and delivery details.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function showSimpleNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Handle image errors
function handleImageError(img) {
    console.log('Image error, using fallback');
    img.src = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop';
    img.style.opacity = '0.8';
}

// Create global instance
const productsLoader = new ProductsLoader();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    productsLoader.initialize();
});

// Export for global access
window.productsLoader = productsLoader;
window.addToCartSimple = addToCartSimple;
window.orderNowSimple = orderNowSimple;
window.updateCartCounter = updateCartCounter;
window.handleImageError = handleImageError;