// Products Loader for English Version - Fixed Images and Currency

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
        console.log('✅ Products loader initialized with real data');
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
            
            console.log('Raw perfumes data loaded:', perfumesData.length);
            console.log('Raw watches data loaded:', watchesData.length);
            
            // Process perfumes with actual images
            this.loadedProducts.perfumes = perfumesData.map((product, index) => {
                return {
                    id: product.id || `perfume-${index}`,
                    originalTitle: product.title || product.name,
                    translatedTitle: this.translateProductTitle(product.title || product.name),
                    price: parseFloat(product.sale_price || product.price) || 150,
                    originalPrice: product.price && product.sale_price && parseFloat(product.price) > parseFloat(product.sale_price) ? parseFloat(product.price) : null,
                    // Use actual image from data
                    image: product.image_link || product.image || this.getFallbackPerfumeImage(),
                    category: 'perfumes',
                    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                    reviews: Math.floor(Math.random() * 100) + 25,
                    hasDiscount: product.price && product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price),
                    isNew: Math.random() > 0.85,
                    isBestseller: Math.random() > 0.8,
                    inStock: true
                };
            });
            
            // Process watches with actual images
            this.loadedProducts.watches = watchesData.map((product, index) => {
                return {
                    id: product.id || `watch-${index}`,
                    originalTitle: product.title || product.name,
                    translatedTitle: this.translateProductTitle(product.title || product.name),
                    price: parseFloat(product.sale_price || product.price) || 250,
                    originalPrice: product.price && product.sale_price && parseFloat(product.price) > parseFloat(product.sale_price) ? parseFloat(product.price) : null,
                    // Use actual image from data
                    image: product.image_link || product.image || this.getFallbackWatchImage(),
                    category: 'watches',
                    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                    reviews: Math.floor(Math.random() * 100) + 25,
                    hasDiscount: product.price && product.sale_price && parseFloat(product.sale_price) < parseFloat(product.price),
                    isNew: Math.random() > 0.85,
                    isBestseller: Math.random() > 0.8,
                    inStock: true
                };
            });
            
            console.log('Processed perfumes:', this.loadedProducts.perfumes.length);
            console.log('Processed watches:', this.loadedProducts.watches.length);
            
        } catch (error) {
            console.error('Error loading product data:', error);
            this.generateSampleData();
        }
    }
    
    getFallbackPerfumeImage() {
        const perfumeImages = [
            'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop'
        ];
        return perfumeImages[Math.floor(Math.random() * perfumeImages.length)];
    }
    
    getFallbackWatchImage() {
        const watchImages = [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=400&h=400&fit=crop'
        ];
        return watchImages[Math.floor(Math.random() * watchImages.length)];
    }
    
    translateProductTitle(arabicTitle) {
        const translations = {
            // Perfume terms
            'عطر': 'Perfume',
            'عطور': 'Perfumes',
            'رائحة': 'Fragrance', 
            'دخون': 'Incense',
            'عبير': 'Oud',
            'مسك': 'Musk',
            'عنبر': 'Amber',
            'ورد': 'Rose',
            'ياسمين': 'Jasmine',
            
            // Watch terms
            'ساعة': 'Watch',
            'ساعات': 'Watches',
            
            // Brands
            'شانيل': 'Chanel',
            'ديور': 'Dior', 
            'جوتشي': 'Gucci',
            'رولكس': 'Rolex',
            'اوميغا': 'Omega',
            'فرزاتشي': 'Versace',
            'بربيري': 'Burberry',
            'كارتييه': 'Cartier',
            
            // Quality terms
            'فاخر': 'Luxury',
            'ممتاز': 'Premium',
            'أصلي': 'Original',
            'راقيه': 'Elite',
            'راقية': 'Elite',
            
            // Gender
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
            'بيج': 'Beige',
            'زرقاء': 'Blue',
            'زهري': 'Pink',
            'بنفسجي': 'Purple',
            'بيبي بلو': 'Baby Blue',
            'نبيتي': 'Wine',
            'هافان': 'Havana',
            'صفراء': 'Yellow',
            'سبرايت': 'Sprite',
            'تشوكلاته': 'Chocolate',
            'منت': 'Mint',
            'اليف بلو': 'Olive',
            'ايس بلو': 'Ice Blue',
            
            // Styles
            'كلاسيكي': 'Classic',
            'عصري': 'Modern',
            'شرقي': 'Oriental',
            'غربي': 'Western'
        };
        
        if (!arabicTitle) {
            return 'Premium Product';
        }
        
        let translated = arabicTitle;
        
        // Apply all translations
        Object.keys(translations).forEach(arabic => {
            const regex = new RegExp(arabic, 'gi');
            translated = translated.replace(regex, translations[arabic]);
        });
        
        // Clean up the translation
        translated = translated
            .replace(/\s+/g, ' ')  // Remove extra spaces
            .replace(/[\u0660-\u0669]/g, (match) => {
                // Convert Arabic numerals to English
                const arabicNumerals = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';
                return arabicNumerals.indexOf(match).toString();
            })
            .replace(/\s*\+\s*/g, ' + ')  // Clean up plus signs
            .replace(/\s*\&\s*/g, ' & ')  // Clean up ampersands
            .trim();
        
        // If translation didn't work or still has Arabic
        if (!translated || translated === arabicTitle || /[\u0600-\u06FF]/.test(translated)) {
            // Generate based on category indicators
            if (arabicTitle.includes('عطر') || arabicTitle.includes('رائحة')) {
                return this.generatePerfumeName();
            } else if (arabicTitle.includes('ساعة')) {
                return this.generateWatchName();
            } else {
                return 'Premium Product';
            }
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
    
    generatePerfumeName() {
        const perfumeNames = [
            'Luxury Oriental Perfume', 'Premium Rose Fragrance', 'Royal Oud Scent',
            'Golden Amber Perfume', 'Elite Eastern Fragrance', 'Designer Perfume',
            'Classic Arabian Scent', 'Premium Floral Perfume', 'Luxury Musk Fragrance'
        ];
        return perfumeNames[Math.floor(Math.random() * perfumeNames.length)];
    }
    
    generateWatchName() {
        const watchNames = [
            'Luxury Gold Watch', 'Premium Silver Timepiece', 'Elite Sports Watch',
            'Classic Dress Watch', 'Designer Watch', 'Modern Chronograph',
            'Executive Timepiece', 'Elegant Watch', 'Professional Watch'
        ];
        return watchNames[Math.floor(Math.random() * watchNames.length)];
    }
    
    generateSampleData() {
        console.log('Generating sample data as fallback...');
        
        // Generate sample perfumes
        this.loadedProducts.perfumes = Array.from({length: 20}, (_, index) => ({
            id: `perfume-sample-${index + 1}`,
            originalTitle: 'Sample Perfume',
            translatedTitle: this.generatePerfumeName(),
            price: Math.floor(Math.random() * 200) + 50,
            image: this.getFallbackPerfumeImage(),
            category: 'perfumes',
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 25,
            inStock: true
        }));
        
        // Generate sample watches
        this.loadedProducts.watches = Array.from({length: 15}, (_, index) => ({
            id: `watch-sample-${index + 1}`,
            originalTitle: 'Sample Watch',
            translatedTitle: this.generateWatchName(),
            price: Math.floor(Math.random() * 400) + 100,
            image: this.getFallbackWatchImage(),
            category: 'watches',
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 25,
            inStock: true
        }));
    }
    
    initializeProductLoading() {
        console.log('Loading products for homepage sections...');
        
        // Load each section with proper delays
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
            
            // Initialize interactions
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
            // Get best products from both categories
            const bestPerfumes = this.loadedProducts.perfumes.slice(0, 3);
            const bestWatches = this.loadedProducts.watches.slice(0, 3);
            const featured = [...bestPerfumes, ...bestWatches];
            
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
            // Get products with discounts or create discounts
            const perfumesWithDeals = this.loadedProducts.perfumes.slice(3, 6).map(product => ({
                ...product,
                originalPrice: product.originalPrice || (product.price * 1.25),
                hasDiscount: true,
                discountPercent: '20%'
            }));
            
            const watchesWithDeals = this.loadedProducts.watches.slice(3, 6).map(product => ({
                ...product,
                originalPrice: product.originalPrice || (product.price * 1.3),
                hasDiscount: true,
                discountPercent: '25%'
            }));
            
            const deals = [...perfumesWithDeals, ...watchesWithDeals];
            
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
        // Create badges
        let badges = '';
        if (product.isNew) badges += '<div class="product-badge new-badge">New</div>';
        if (product.isBestseller) badges += '<div class="product-badge bestseller-badge">Bestseller</div>';
        if (product.hasDiscount && product.originalPrice) {
            const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
            badges += `<div class="discount-badge">${discountPercent}% OFF</div>`;
        }
        
        return `
            <div class="product-card" data-product-id="${product.id}" style="animation-delay: ${delay}s">
                <div class="product-image-container">
                    <img src="${product.image}" 
                         alt="${product.translatedTitle}" 
                         class="product-image" 
                         loading="lazy" 
                         onerror="this.src='${product.category === 'perfumes' ? this.getFallbackPerfumeImage() : this.getFallbackWatchImage()}'">
                    ${badges}
                    <div class="product-overlay">
                        <button class="btn-add-to-cart" 
                                onclick="addToCartSimple('${product.id}', '${product.translatedTitle.replace(/'/g, "\\'")}'', ${product.price}, '${product.image}')" 
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
                            ${this.generateStarRating(product.rating)}
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
                        <button class="btn-order-now" onclick="orderNowSimple('${product.translatedTitle.replace(/'/g, "\\'")}'', ${product.price})">
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
        console.log(`Initializing product cards in ${container.id}`);
        
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
            card.title = 'Click to view details (opens in new tab)';
        });
    }
}

// Global Cart and Order Functions
function addToCartSimple(id, title, price, image) {
    console.log('Adding to cart:', { id, title, price });
    
    let cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
    
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
    
    localStorage.setItem('emirates-cart-en', JSON.stringify(cart));
    updateCartCounter();
    showNotificationFixed(`${title} added to cart!`, 'success');
}

function orderNowSimple(productName, price) {
    const message = `Hello! I would like to order:\n\n🛍️ Product: ${productName}\n💰 Price: ${price.toFixed(2)} AED\n\nPlease confirm availability and delivery details to UAE.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('emirates-cart-en') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const counters = document.querySelectorAll('.cart-counter');
    counters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

function showNotificationFixed(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const bgColor = type === 'success' ? '#d4edda' : '#d1ecf1';
    const textColor = type === 'success' ? '#155724' : '#0c5460';
    const icon = type === 'success' ? 'check-circle' : 'info-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: ${textColor};
        padding: 15px 20px;
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

// Create global instance
const productsLoader = new ProductsLoader();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    productsLoader.initialize();
    
    // Update cart counter on page load
    setTimeout(() => {
        updateCartCounter();
    }, 1000);
});

// Export for global access
window.productsLoader = productsLoader;
window.addToCartSimple = addToCartSimple;
window.orderNowSimple = orderNowSimple;
window.updateCartCounter = updateCartCounter;
window.showNotificationFixed = showNotificationFixed;