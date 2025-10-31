// Products Loader for English Version

class ProductsLoader {
    constructor() {
        this.cache = new Map();
        this.loadedProducts = {
            perfumes: [],
            watches: []
        };
    }
    
    async initialize() {
        await this.preloadProductData();
        this.initializeProductLoading();
        console.log('✅ Products loader initialized');
    }
    
    async preloadProductData() {
        try {
            // Load and cache product data
            const [perfumesResponse, watchesResponse] = await Promise.all([
                fetch('../data/otor.json'),
                fetch('../data/sa3at.json')
            ]);
            
            const perfumesData = await perfumesResponse.json();
            const watchesData = await watchesResponse.json();
            
            // Process and translate products
            this.loadedProducts.perfumes = perfumesData.map(this.processProduct.bind(this));
            this.loadedProducts.watches = watchesData.map(this.processProduct.bind(this));
            
            // Cache the processed data
            this.cache.set('perfumes', this.loadedProducts.perfumes);
            this.cache.set('watches', this.loadedProducts.watches);
            
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
            category: product.category || (product.title?.includes('عطر') ? 'perfumes' : 'watches'),
            rating: product.rating || (Math.random() * 2 + 3).toFixed(1),
            reviews: product.reviews || Math.floor(Math.random() * 100) + 10,
            description: product.description || this.generateDescription(product),
            inStock: product.inStock !== false,
            isNew: product.isNew || Math.random() > 0.8,
            isBestseller: product.isBestseller || Math.random() > 0.7,
            tags: product.tags || this.generateTags(product)
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
            'ساعة يد': 'Wristwatch',
            'ساعة ذكية': 'Smart Watch',
            'ميقاتي': 'Mechanical',
            'رقمي': 'Digital',
            
            // Quality terms
            'فاخر': 'Luxury',
            'ممتاز': 'Premium',
            'أصلي': 'Original',
            'جودة عالية': 'High Quality',
            
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
            
            // Styles
            'شرقي': 'Oriental',
            'غربي': 'Western',
            'كلاسيكي': 'Classic',
            'عصري': 'Modern',
            'قديم': 'Vintage',
            'جديد': 'New'
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
        // Generate realistic prices
        const priceRanges = {
            perfumes: { min: 45, max: 250 },
            watches: { min: 85, max: 500 }
        };
        
        const range = priceRanges.perfumes; // Default to perfume range
        return Math.floor(Math.random() * (range.max - range.min) + range.min);
    }
    
    getDefaultImage(product) {
        const category = product.category || (product.title?.includes('عطر') ? 'perfumes' : 'watches');
        
        const defaultImages = {
            perfumes: [
                'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400&h=400&fit=crop'
            ],
            watches: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop',
                'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&h=400&fit=crop'
            ]
        };
        
        const images = defaultImages[category] || defaultImages.perfumes;
        return images[Math.floor(Math.random() * images.length)];
    }
    
    generateDescription(product) {
        const category = product.category || (product.title?.includes('عطر') ? 'perfumes' : 'watches');
        const title = this.translateProductTitle(product.title || product.name);
        
        const descriptions = {
            perfumes: [
                `Experience the captivating essence of ${title}, a premium fragrance that embodies sophistication and luxury.`,
                `Discover the alluring scent of ${title}, crafted with the finest ingredients for lasting impression.`,
                `Indulge in the exquisite fragrance of ${title}, a perfect blend of elegance and mystery.`
            ],
            watches: [
                `Elevate your style with ${title}, a precision timepiece that combines luxury with functionality.`,
                `Experience timeless elegance with ${title}, crafted for discerning individuals who appreciate quality.`,
                `Make a statement with ${title}, a sophisticated watch that reflects your impeccable taste.`
            ]
        };
        
        const categoryDescriptions = descriptions[category] || descriptions.perfumes;
        return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
    }
    
    generateTags(product) {
        const category = product.category || (product.title?.includes('عطر') ? 'perfumes' : 'watches');
        
        const tagSets = {
            perfumes: ['Oriental', 'Western', 'Unisex', 'Long-lasting', 'Premium', 'Luxury'],
            watches: ['Luxury', 'Sports', 'Dress', 'Casual', 'Water-resistant', 'Premium']
        };
        
        const availableTags = tagSets[category] || tagSets.perfumes;
        const numTags = Math.floor(Math.random() * 3) + 2;
        
        return availableTags
            .sort(() => 0.5 - Math.random())
            .slice(0, numTags);
    }
    
    generateSampleData() {
        // Generate sample perfumes
        const perfumeNames = [
            'Royal Oud', 'Golden Rose', 'Mystic Amber', 'Oriental Nights',
            'Desert Rose', 'Palace Musk', 'Diamond Jasmine', 'Luxury Blend',
            'Premium Saffron', 'Imperial Scent'
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
            inStock: true,
            isNew: Math.random() > 0.7,
            isBestseller: Math.random() > 0.8
        }));
        
        // Generate sample watches
        const watchNames = [
            'Elite Timepiece', 'Luxury Gold Watch', 'Sports Watch Pro',
            'Classic Elegance', 'Modern Style', 'Premium Silver',
            'Executive Watch', 'Designer Time', 'Elegant Classic',
            'Sophisticated Style'
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
            inStock: true,
            isNew: Math.random() > 0.7,
            isBestseller: Math.random() > 0.8
        }));
    }
    
    initializeProductLoading() {
        // Load products for homepage
        this.loadHomePageProducts();
    }
    
    async loadHomePageProducts() {
        // Load perfumes section
        await this.loadSectionProducts('perfumes', 'perfumes-grid', 6);
        
        // Load watches section
        await this.loadSectionProducts('watches', 'watches-grid', 6);
        
        // Load featured products (mix)
        await this.loadFeaturedProducts();
        
        // Load best deals
        await this.loadBestDeals();
    }
    
    async loadSectionProducts(category, gridId, limit = 6) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        try {
            const products = this.loadedProducts[category].slice(0, limit);
            
            if (products.length === 0) {
                grid.innerHTML = '<p class="error-message">No products available</p>';
                return;
            }
            
            // Create product cards with staggered animation
            grid.innerHTML = products.map((product, index) => {
                const delay = index * 0.1;
                return this.createProductCard(product, delay);
            }).join('');
            
            // Initialize product interactions
            this.initializeProductCards(grid);
            
        } catch (error) {
            console.error(`Error loading ${category}:`, error);
            grid.innerHTML = '<p class="error-message">Unable to load products</p>';
        }
    }
    
    async loadFeaturedProducts() {
        const grid = document.getElementById('featuredProducts');
        if (!grid) return;
        
        try {
            // Mix featured products from both categories
            const allProducts = [
                ...this.loadedProducts.perfumes,
                ...this.loadedProducts.watches
            ];
            
            // Sort by bestseller and new status, then take first 6
            const featured = allProducts
                .sort((a, b) => {
                    if (a.isBestseller && !b.isBestseller) return -1;
                    if (!a.isBestseller && b.isBestseller) return 1;
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return parseFloat(b.rating) - parseFloat(a.rating);
                })
                .slice(0, 6);
            
            grid.innerHTML = featured.map((product, index) => {
                const delay = index * 0.1;
                return this.createProductCard(product, delay);
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
            const allProducts = [
                ...this.loadedProducts.perfumes,
                ...this.loadedProducts.watches
            ];
            
            // Create deals with discounts
            const deals = allProducts
                .slice(10, 16) // Get different products for deals
                .map(product => ({
                    ...product,
                    originalPrice: product.price * 1.4, // Show original higher price
                    discount: '30%',
                    isOnSale: true
                }));
            
            grid.innerHTML = deals.map((product, index) => {
                const delay = index * 0.1;
                return this.createProductCard(product, delay, true);
            }).join('');
            
            this.initializeProductCards(grid);
            
        } catch (error) {
            console.error('Error loading deals:', error);
            grid.innerHTML = '<p class="error-message">Unable to load deals</p>';
        }
    }
    
    createProductCard(product, delay = 0, showDiscount = false) {
        const hasDiscount = showDiscount && product.originalPrice;
        let badges = '';
        
        if (product.isNew) badges += '<div class="product-badge new-badge">New</div>';
        if (product.isBestseller) badges += '<div class="product-badge bestseller-badge">Bestseller</div>';
        if (hasDiscount) badges += '<div class="discount-badge">30% OFF</div>';
        
        return `
            <div class="product-card" data-product-id="${product.id}" style="animation-delay: ${delay}s">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.translatedTitle}" class="product-image" loading="lazy">
                    ${badges}
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
                        <button class="btn-order-now" onclick="orderNow('${product.translatedTitle}', ${product.price})">
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
        const addToCartBtns = container.querySelectorAll('.btn-add-to-cart');
        const quickViewBtns = container.querySelectorAll('.btn-quick-view');
        
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productData = JSON.parse(this.getAttribute('data-product'));
                
                if (window.Emirates && window.Emirates.addToCart) {
                    window.Emirates.addToCart({
                        id: productData.id,
                        title: productData.translatedTitle,
                        price: parseFloat(productData.price),
                        image: productData.image
                    });
                }
            });
        });
        
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const productData = JSON.parse(this.getAttribute('data-product'));
                
                if (window.showQuickView) {
                    window.showQuickView(productData);
                }
            });
        });
    }
    
    // Get all products for showcase page
    getAllProducts() {
        return [
            ...this.loadedProducts.perfumes,
            ...this.loadedProducts.watches
        ];
    }
    
    // Get products by category
    getProductsByCategory(category) {
        return this.loadedProducts[category] || [];
    }
    
    // Search products
    searchProducts(query, category = 'all') {
        const searchTerm = query.toLowerCase();
        let products = [];
        
        if (category === 'all') {
            products = this.getAllProducts();
        } else {
            products = this.getProductsByCategory(category);
        }
        
        return products.filter(product => 
            product.translatedTitle.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
}

// Create global instance
const productsLoader = new ProductsLoader();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    productsLoader.initialize();
});

// Export for global access
window.productsLoader = productsLoader;
window.ProductsLoader = ProductsLoader;