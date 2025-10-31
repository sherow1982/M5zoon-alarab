// Products Loader for English Version - Simplified and Fixed

class ProductsLoader {
    constructor() {
        this.loadedProducts = {
            perfumes: [],
            watches: []
        };
    }
    
    async initialize() {
        console.log('Initializing Products Loader...');
        await this.preloadProductData();
        this.initializeProductLoading();
        console.log('✅ Products loader initialized');
    }
    
    async preloadProductData() {
        try {
            console.log('Loading product data...');
            
            // Load and cache product data
            const [perfumesResponse, watchesResponse] = await Promise.all([
                fetch('../data/otor.json'),
                fetch('../data/sa3at.json')
            ]);
            
            const perfumesData = await perfumesResponse.json();
            const watchesData = await watchesResponse.json();
            
            console.log('Perfumes data loaded:', perfumesData.length);
            console.log('Watches data loaded:', watchesData.length);
            
            // Process and translate products
            this.loadedProducts.perfumes = perfumesData.map(this.processProduct.bind(this));
            this.loadedProducts.watches = watchesData.map(this.processProduct.bind(this));
            
        } catch (error) {
            console.error('Error preloading product data:', error);
            // Generate sample data as fallback
            this.generateSampleData();
        }
    }
    
    processProduct(product, index) {
        return {
            id: product.id || `product-${Date.now()}-${index}`,
            title: product.title || product.name || 'Premium Product',
            translatedTitle: this.translateProductTitle(product.title || product.name),
            price: parseFloat(product.price) || this.generatePrice(),
            originalPrice: product.originalPrice || null,
            image: product.image || product.img || this.getDefaultImage(product),
            category: product.category || (product.title && product.title.includes('عطر') ? 'perfumes' : 'watches'),
            rating: product.rating || (Math.random() * 2 + 3).toFixed(1),
            reviews: product.reviews || Math.floor(Math.random() * 100) + 10,
            description: product.description || this.generateDescription(product),
            inStock: product.inStock !== false
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
            'رجال': 'Men',
            'نساء': 'Women',
            
            // Colors
            'ذهبي': 'Gold',
            'فضي': 'Silver',
            'أسود': 'Black',
            'أبيض': 'White',
            'أزرق': 'Blue',
            'أحمر': 'Red',
            
            // Styles
            'شرقي': 'Oriental',
            'غربي': 'Western',
            'كلاسيكي': 'Classic',
            'عصري': 'Modern'
        };
        
        if (!arabicTitle) return 'Premium Product';
        
        let translated = arabicTitle;
        Object.keys(translations).forEach(arabic => {
            const regex = new RegExp(arabic, 'g');
            translated = translated.replace(regex, translations[arabic]);
        });
        
        // If no translation happened, generate based on category
        if (translated === arabicTitle) {
            const productTypes = [
                'Luxury Perfume', 'Premium Watch', 'Designer Fragrance',
                'Elegant Timepiece', 'Oriental Scent', 'Classic Watch',
                'Modern Perfume', 'Vintage Watch', 'Exclusive Fragrance',
                'Sophisticated Timepiece'
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
    
    generatePrice() {
        return Math.floor(Math.random() * 300) + 50;
    }
    
    getDefaultImage(product) {
        const category = product.category || (product.title && product.title.includes('عطر') ? 'perfumes' : 'watches');
        
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
    
    generateDescription(product) {
        const title = this.translateProductTitle(product.title || product.name);
        return `Experience the luxury of ${title}, a premium product crafted with attention to detail.`;
    }
    
    generateSampleData() {
        console.log('Generating sample data as fallback...');
        
        // Generate sample perfumes
        const perfumeNames = [
            'Royal Oud Perfume', 'Golden Rose Fragrance', 'Mystic Amber Scent', 'Oriental Nights Perfume',
            'Desert Rose Fragrance', 'Palace Musk Perfume', 'Diamond Jasmine Scent', 'Luxury Blend Perfume'
        ];
        
        this.loadedProducts.perfumes = perfumeNames.map((name, index) => ({
            id: `perfume-${index + 1}`,
            title: name,
            translatedTitle: name,
            price: Math.floor(Math.random() * 200) + 50,
            image: this.getDefaultImage({ category: 'perfumes' }),
            category: 'perfumes',
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 10,
            description: `Experience the luxury of ${name}, a premium fragrance.`,
            inStock: true
        }));
        
        // Generate sample watches
        const watchNames = [
            'Elite Timepiece Watch', 'Luxury Gold Watch', 'Sports Watch Pro',
            'Classic Elegance Watch', 'Modern Style Timepiece', 'Premium Silver Watch'
        ];
        
        this.loadedProducts.watches = watchNames.map((name, index) => ({
            id: `watch-${index + 1}`,
            title: name,
            translatedTitle: name,
            price: Math.floor(Math.random() * 400) + 100,
            image: this.getDefaultImage({ category: 'watches' }),
            category: 'watches',
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 10,
            description: `Discover the precision of ${name}, a luxury timepiece.`,
            inStock: true
        }));
    }
    
    initializeProductLoading() {
        // Load products for homepage
        this.loadHomePageProducts();
    }
    
    async loadHomePageProducts() {
        console.log('Loading homepage products...');
        
        // Load perfumes section
        await this.loadSectionProducts('perfumes', 'perfumes-grid', 6);
        
        // Load watches section
        await this.loadSectionProducts('watches', 'watches-grid', 6);
        
        // Load featured products
        await this.loadFeaturedProducts();
        
        // Load best deals
        await this.loadBestDeals();
    }
    
    async loadSectionProducts(category, gridId, limit = 6) {
        const grid = document.getElementById(gridId);
        if (!grid) {
            console.log(`Grid element ${gridId} not found`);
            return;
        }
        
        try {
            const products = this.loadedProducts[category].slice(0, limit);
            
            if (products.length === 0) {
                grid.innerHTML = '<p class="loading-message">No products available</p>';
                return;
            }
            
            grid.innerHTML = products.map((product, index) => {
                return this.createProductCard(product, index * 0.1);
            }).join('');
            
            // Initialize interactions
            this.initializeProductCards(grid);
            
            console.log(`Loaded ${products.length} ${category}`);
            
        } catch (error) {
            console.error(`Error loading ${category}:`, error);
            grid.innerHTML = '<p class="error-message">Unable to load products</p>';
        }
    }
    
    async loadFeaturedProducts() {
        const grid = document.getElementById('featuredProducts');
        if (!grid) return;
        
        try {
            const allProducts = [...this.loadedProducts.perfumes, ...this.loadedProducts.watches];
            const featured = allProducts.slice(0, 6);
            
            grid.innerHTML = featured.map((product, index) => {
                return this.createProductCard(product, index * 0.1);
            }).join('');
            
            this.initializeProductCards(grid);
            
        } catch (error) {
            console.error('Error loading featured products:', error);
            grid.innerHTML = '<p class="error-message">Unable to load featured products</p>';
        }
    }
    
    async loadBestDeals() {
        const grid = document.getElementById('bestDeals');
        if (!grid) return;
        
        try {
            const allProducts = [...this.loadedProducts.perfumes, ...this.loadedProducts.watches];
            const deals = allProducts.slice(6, 12).map(product => ({
                ...product,
                originalPrice: product.price * 1.3,
                discount: '25%'
            }));
            
            grid.innerHTML = deals.map((product, index) => {
                return this.createProductCard(product, index * 0.1, true);
            }).join('');
            
            this.initializeProductCards(grid);
            
        } catch (error) {
            console.error('Error loading deals:', error);
            grid.innerHTML = '<p class="error-message">Unable to load deals</p>';
        }
    }
    
    createProductCard(product, delay = 0, showDiscount = false) {
        const hasDiscount = showDiscount && product.originalPrice;
        
        return `
            <div class="product-card" data-product-id="${product.id}" style="animation-delay: ${delay}s">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.translatedTitle}" class="product-image" loading="lazy">
                    ${hasDiscount ? '<div class="discount-badge">25% OFF</div>' : ''}
                    <div class="product-overlay">
                        <button class="btn-add-to-cart" onclick="addToCartSimple('${product.id}', '${product.translatedTitle}', ${product.price})" title="Add to Cart">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.translatedTitle}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStarRating(product.rating)}
                        </div>
                        <span class="review-count">(${product.reviews} reviews)</span>
                    </div>
                    <div class="product-price">
                        ${hasDiscount ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
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
        // Basic initialization without complex event handlers
        console.log('Initializing product cards in', container.id || 'container');
    }
}

// Simple cart functions
function addToCartSimple(id, title, price) {
    console.log('Adding to cart:', { id, title, price });
    
    // Show notification
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
        ${title} added to cart!
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

function orderNowSimple(productName, price) {
    const message = `Hello! I would like to order:\n\n🛍️ Product: ${productName}\n💰 Price: $${price.toFixed(2)} AED\n\nPlease confirm availability and delivery details to UAE.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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