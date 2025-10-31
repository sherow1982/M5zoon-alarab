// Products Showcase JavaScript for English Version - Simplified

// Global Variables
let allProducts = [];
let filteredProducts = [];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing products showcase...');
    loadAllProducts();
    initializeFilters();
});

// Load All Products
async function loadAllProducts() {
    const productsGrid = document.getElementById('allProductsGrid');
    
    if (!productsGrid) {
        console.error('Products grid element not found - ID: allProductsGrid');
        return;
    }
    
    console.log('Loading products...');
    
    try {
        // Load perfumes and watches data
        const perfumesResponse = await fetch('../data/otor.json');
        const watchesResponse = await fetch('../data/sa3at.json');
        
        const perfumesData = await perfumesResponse.json();
        const watchesData = await watchesResponse.json();
        
        console.log('Perfumes loaded:', perfumesData.length);
        console.log('Watches loaded:', watchesData.length);
        
        // Process perfumes
        const perfumes = perfumesData.map((product, index) => ({
            id: `perfume-${index}`,
            title: translateTitle(product.title || product.name || 'Premium Perfume'),
            price: parseFloat(product.price) || (Math.floor(Math.random() * 150) + 50),
            image: product.image || product.img || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
            category: 'perfumes',
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: Math.floor(Math.random() * 80) + 20
        }));
        
        // Process watches
        const watches = watchesData.map((product, index) => ({
            id: `watch-${index}`,
            title: translateTitle(product.title || product.name || 'Premium Watch'),
            price: parseFloat(product.price) || (Math.floor(Math.random() * 300) + 100),
            image: product.image || product.img || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            category: 'watches',
            rating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviews: Math.floor(Math.random() * 80) + 20
        }));
        
        allProducts = [...perfumes, ...watches];
        filteredProducts = [...allProducts];
        
        console.log('Total products processed:', allProducts.length);
        
        renderProducts();
        updateResultsCount();
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 15px;">
                <div style="font-size: 48px; color: #dc3545; margin-bottom: 20px;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 style="color: #333; margin-bottom: 15px;">Unable to Load Products</h3>
                <p style="color: #666; margin-bottom: 30px;">Please check your connection and try again.</p>
                <a href="./" style="display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: #D4AF37; color: white; text-decoration: none; border-radius: 8px;">
                    <i class="fas fa-home"></i>
                    Return Home
                </a>
            </div>
        `;
    }
}

// Simple Translation Function
function translateTitle(arabicTitle) {
    if (!arabicTitle) return 'Premium Product';
    
    const translations = {
        'عطر': 'Perfume',
        'عطور': 'Perfumes',
        'ساعة': 'Watch',
        'ساعات': 'Watches',
        'رجالي': 'Mens',
        'نسائي': 'Womens',
        'فاخر': 'Luxury',
        'ذهبي': 'Gold',
        'فضي': 'Silver',
        'شرقي': 'Oriental',
        'غربي': 'Western'
    };
    
    let result = arabicTitle;
    Object.keys(translations).forEach(arabic => {
        result = result.replace(new RegExp(arabic, 'g'), translations[arabic]);
    });
    
    return result === arabicTitle ? 'Premium Product' : result;
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('allProductsGrid');
    
    if (!productsGrid) {
        console.error('Cannot render - products grid not found');
        return;
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <h3>No Products Found</h3>
                <p>Try adjusting your search or filters.</p>
                <button onclick="clearAllFilters()" style="padding: 10px 20px; background: #D4AF37; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Clear Filters
                </button>
            </div>
        `;
        return;
    }
    
    const productsHTML = filteredProducts.map(product => createProductCard(product)).join('');
    productsGrid.innerHTML = productsHTML;
    
    console.log('Rendered', filteredProducts.length, 'products');
}

// Create Product Card
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'">
                <div class="product-overlay">
                    <button class="btn-add-to-cart" onclick="addToCart('${product.id}', '${product.title}', ${product.price})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span>(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                </div>
                <button class="btn-order-now" onclick="orderNow('${product.title}', ${product.price})">
                    <i class="fas fa-credit-card"></i>
                    Order Now
                </button>
            </div>
        </div>
    `;
}

// Generate Stars
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    for (let i = fullStars; i < 5; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Initialize Filters
function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
}

// Apply Filters
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    let filtered = [...allProducts];
    
    // Category filter
    if (categoryFilter && categoryFilter.value !== 'all') {
        filtered = filtered.filter(product => product.category === categoryFilter.value);
    }
    
    // Search filter
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.toLowerCase();
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort
    if (sortFilter) {
        switch (sortFilter.value) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
    }
    
    filteredProducts = filtered;
    renderProducts();
    updateResultsCount();
}

// Update Results Count
function updateResultsCount() {
    const countElement = document.getElementById('productsCountText');
    if (countElement) {
        countElement.textContent = `Showing ${filteredProducts.length} products`;
    }
}

// Clear Filters
function clearAllFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = 'all';
    if (sortFilter) sortFilter.value = 'featured';
    
    filteredProducts = [...allProducts];
    renderProducts();
    updateResultsCount();
}

// Add to Cart Function
function addToCart(id, title, price) {
    console.log('Adding to cart:', { id, title, price });
    
    // Create notification
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
        Product added to cart!
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

// Order Now Function
function orderNow(productName, price) {
    const message = `Hello! I would like to order:\n\n🛍️ Product: ${productName}\n💰 Price: $${price.toFixed(2)} AED\n\nPlease confirm availability and delivery details.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Make functions global
window.clearAllFilters = clearAllFilters;
window.orderNow = orderNow;
window.addToCart = addToCart;