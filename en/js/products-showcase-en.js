// Products Showcase JavaScript for English Version

// Global Variables
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 24;
let currentView = 'grid';
let currentFilters = {
    category: 'all',
    sort: 'default',
    search: ''
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProductsShowcase();
});

function initializeProductsShowcase() {
    initializeFilters();
    loadAllProducts();
    initializeViewToggle();
    initializePagination();
    
    console.log('✅ Products Showcase initialized');
}

// Load All Products
async function loadAllProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    try {
        // Load both perfumes and watches
        const [perfumesResponse, watchesResponse] = await Promise.all([
            fetch('../data/otor.json'),
            fetch('../data/sa3at.json')
        ]);
        
        const perfumesData = await perfumesResponse.json();
        const watchesData = await watchesResponse.json();
        
        // Process and combine products
        const perfumes = perfumesData.map(product => ({
            ...product,
            category: 'perfumes',
            translatedTitle: translateProductTitle(product.title || product.name),
            price: parseFloat(product.price) || Math.floor(Math.random() * 200) + 50,
            rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
            reviews: Math.floor(Math.random() * 100) + 10,
            isNew: Math.random() > 0.8,
            isBestseller: Math.random() > 0.7
        }));
        
        const watches = watchesData.map(product => ({
            ...product,
            category: 'watches',
            translatedTitle: translateProductTitle(product.title || product.name),
            price: parseFloat(product.price) || Math.floor(Math.random() * 500) + 100,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: Math.floor(Math.random() * 100) + 10,
            isNew: Math.random() > 0.8,
            isBestseller: Math.random() > 0.7
        }));
        
        allProducts = [...perfumes, ...watches];
        filteredProducts = [...allProducts];
        
        renderProducts();
        updateResultsCount();
        
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Unable to Load Products</h3>
                <p>We're having trouble loading our products right now. Please try again later.</p>
                <a href="./" class="btn-primary">
                    <i class="fas fa-home"></i>
                    Return Home
                </a>
            </div>
        `;
    }
}

// Initialize Filters
function initializeFilters() {
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const perPageSelect = document.getElementById('perPageSelect');
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            currentFilters.search = this.value.toLowerCase();
            searchClear.style.display = this.value ? 'block' : 'none';
            applyFilters();
        }, 300));
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', function() {
            searchInput.value = '';
            currentFilters.search = '';
            this.style.display = 'none';
            applyFilters();
        });
    }
    
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentFilters.category = this.value;
            applyFilters();
        });
    }
    
    // Sort filter
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyFilters();
        });
    }
    
    // Per page selector
    if (perPageSelect) {
        perPageSelect.addEventListener('change', function() {
            productsPerPage = parseInt(this.value);
            currentPage = 1;
            renderProducts();
            updatePagination();
        });
    }
}

// Apply Filters
function applyFilters() {
    let filtered = [...allProducts];
    
    // Apply category filter
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(product => product.category === currentFilters.category);
    }
    
    // Apply search filter
    if (currentFilters.search) {
        filtered = filtered.filter(product => 
            product.translatedTitle.toLowerCase().includes(currentFilters.search) ||
            (product.title && product.title.toLowerCase().includes(currentFilters.search)) ||
            (product.name && product.name.toLowerCase().includes(currentFilters.search))
        );
    }
    
    // Apply sorting
    switch (currentFilters.sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filtered.sort((a, b) => b.isNew - a.isNew);
            break;
        default:
            // Featured/default - prioritize bestsellers and new items
            filtered.sort((a, b) => {
                if (a.isBestseller && !b.isBestseller) return -1;
                if (!a.isBestseller && b.isBestseller) return 1;
                if (a.isNew && !b.isNew) return -1;
                if (!a.isNew && b.isNew) return 1;
                return b.rating - a.rating;
            });
    }
    
    filteredProducts = filtered;
    currentPage = 1;
    renderProducts();
    updateResultsCount();
    updatePagination();
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No Products Found</h3>
                <p>We couldn't find any products matching your criteria. Try adjusting your filters or search terms.</p>
                <button class="btn-primary" onclick="clearAllFilters()">
                    <i class="fas fa-undo"></i>
                    Clear All Filters
                </button>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToShow.map((product, index) => {
        const delay = Math.min(index * 0.1, 1);
        return createEnhancedProductCard(product, delay);
    }).join('');
    
    // Initialize product interactions
    initializeProductCards(productsGrid);
    
    // Add stagger animation
    const cards = productsGrid.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('filtering-in');
    });
}

// Enhanced Product Card
function createEnhancedProductCard(product, delay = 0) {
    const image = product.image || product.img || `https://images.unsplash.com/photo-${product.category === 'perfumes' ? '1541643600914-78b084683601' : '1523275335684-37898b6baf30'}?w=400&h=400&fit=crop`;
    const hasDiscount = Math.random() > 0.7;
    const discountPrice = hasDiscount ? (product.price * 0.8).toFixed(2) : null;
    
    let badges = '';
    if (product.isNew) badges += '<div class="product-badge new-badge">New</div>';
    if (product.isBestseller) badges += '<div class="product-badge bestseller-badge">Bestseller</div>';
    if (hasDiscount) badges += '<div class="discount-badge">20% OFF</div>';
    
    return `
        <div class="product-card" data-product-id="${product.id || Date.now()}" data-category="${product.category}" style="animation-delay: ${delay}s">
            <div class="product-image-container">
                <img src="${image}" alt="${product.translatedTitle}" class="product-image" loading="lazy">
                ${badges}
                <div class="product-overlay">
                    <button class="btn-quick-view tooltip" data-tooltip="Quick View" data-product='${JSON.stringify(product)}'>
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-add-to-cart tooltip" data-tooltip="Add to Cart" data-product='${JSON.stringify(product)}'>
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="btn-wishlist tooltip" data-tooltip="Add to Wishlist" data-product-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category === 'perfumes' ? 'Perfume' : 'Watch'}</div>
                <h3 class="product-title">${highlightSearchTerm(product.translatedTitle)}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStarRating(product.rating)}
                    </div>
                    <span class="rating-text">${product.rating}</span>
                    <span class="review-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    ${hasDiscount ? `<span class="original-price">$${product.price.toFixed(2)}</span>` : ''}
                    <span class="current-price">$${hasDiscount ? discountPrice : product.price.toFixed(2)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-order-now" onclick="orderNow('${product.translatedTitle}', ${hasDiscount ? discountPrice : product.price})">
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
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Highlight Search Terms
function highlightSearchTerm(text) {
    if (!currentFilters.search || currentFilters.search.length < 2) {
        return text;
    }
    
    const regex = new RegExp(`(${currentFilters.search})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// View Toggle
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update view
            currentView = this.getAttribute('data-view');
            
            if (currentView === 'list') {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
            
            // Re-render with new view
            renderProducts();
        });
    });
}

// Pagination
function initializePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                updatePagination();
                scrollToTop();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                updatePagination();
                scrollToTop();
            }
        });
    }
}

function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagination = document.getElementById('pagination');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const paginationNumbers = document.getElementById('paginationNumbers');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    // Update prev/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    
    // Generate page numbers
    let numbersHTML = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // First page
    if (startPage > 1) {
        numbersHTML += `<button class="pagination-number" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            numbersHTML += '<span class="pagination-ellipsis">...</span>';
        }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        numbersHTML += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            numbersHTML += '<span class="pagination-ellipsis">...</span>';
        }
        numbersHTML += `<button class="pagination-number" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    paginationNumbers.innerHTML = numbersHTML;
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    updatePagination();
    scrollToTop();
}

function scrollToTop() {
    document.querySelector('.products-section').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Update Results Count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const totalProducts = filteredProducts.length;
        const startIndex = (currentPage - 1) * productsPerPage + 1;
        const endIndex = Math.min(currentPage * productsPerPage, totalProducts);
        
        if (totalProducts === 0) {
            resultsCount.textContent = 'No products found';
        } else if (totalProducts <= productsPerPage) {
            resultsCount.textContent = `Showing all ${totalProducts} products`;
        } else {
            resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${totalProducts} products`;
        }
    }
}

// Clear All Filters
function clearAllFilters() {
    // Reset all filters
    document.getElementById('searchInput').value = '';
    document.getElementById('searchClear').style.display = 'none';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('sortFilter').value = 'default';
    
    currentFilters = {
        category: 'all',
        sort: 'default',
        search: ''
    };
    
    currentPage = 1;
    applyFilters();
}

// Translation Helper (Enhanced)
function translateProductTitle(arabicTitle) {
    const translations = {
        // Perfume terms
        'عطر': 'Perfume',
        'عطور': 'Perfumes',
        'معطر': 'Perfumed',
        'عطري': 'Fragrant',
        'رائحة': 'Fragrance',
        'روائح': 'Scents',
        'عبير': 'Oud',
        'مسك': 'Musk',
        'عنبر': 'Amber',
        'ورد': 'Rose',
        'ياسمين': 'Jasmine',
        
        // Watch terms
        'ساعة': 'Watch',
        'ساعات': 'Watches',
        'منبه': 'Alarm Clock',
        'ساعة يد': 'Wristwatch',
        'ساعة جيب': 'Pocket Watch',
        'ساعة حائط': 'Wall Clock',
        'ساعة ذكية': 'Smart Watch',
        
        // Gender terms
        'رجالي': 'Men\'s',
        'رجال': 'Men',
        'نسائي': 'Women\'s',
        'نساء': 'Women',
        'أطفال': 'Children\'s',
        'طفل': 'Child',
        'شباب': 'Youth',
        'شبابي': 'Youthful',
        
        // Quality terms
        'فاخر': 'Luxury',
        'فاخرة': 'Luxurious',
        'ممتاز': 'Premium',
        'عالي الجودة': 'High Quality',
        'جودة عالية': 'Premium Quality',
        'أصلي': 'Original',
        'اصلي': 'Authentic',
        
        // Colors
        'ذهبي': 'Gold',
        'ذهب': 'Golden',
        'فضي': 'Silver',
        'فضة': 'Silver',
        'أسود': 'Black',
        'أبيض': 'White',
        'أزرق': 'Blue',
        'أحمر': 'Red',
        'أخضر': 'Green',
        'أصفر': 'Yellow',
        'بني': 'Brown',
        'بنفسجي': 'Purple',
        'وردي': 'Pink',
        'برتقالي': 'Orange',
        
        // Styles
        'شرقي': 'Oriental',
        'غربي': 'Western',
        'كلاسيكي': 'Classic',
        'عصري': 'Modern',
        'قديم': 'Vintage',
        'جديد': 'New',
        'متطور': 'Advanced',
        'بسيط': 'Simple',
        'أنيق': 'Elegant',
        'جميل': 'Beautiful',
        
        // Size terms
        'صغير': 'Small',
        'متوسط': 'Medium',
        'كبير': 'Large',
        'ضخم': 'Big',
        'رفيع': 'Thin',
        'عريض': 'Wide',
        
        // Brand-like terms
        'ملكي': 'Royal',
        'إمبراطوري': 'Imperial',
        'أمير': 'Prince',
        'ملكة': 'Queen',
        'أميرة': 'Princess',
        'سلطان': 'Sultan',
        'قيصر': 'Palace',
        'تاج': 'Crown'
    };
    
    if (!arabicTitle) return 'Premium Product';
    
    let translatedTitle = arabicTitle;
    
    // Apply translations
    Object.keys(translations).forEach(arabic => {
        const regex = new RegExp(arabic, 'g');
        translatedTitle = translatedTitle.replace(regex, translations[arabic]);
    });
    
    // If no meaningful translation, create a generic title based on category
    if (translatedTitle === arabicTitle || translatedTitle.trim() === '') {
        return 'Premium Product';
    }
    
    // Clean up the translation
    translatedTitle = translatedTitle
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    
    return translatedTitle || 'Premium Product';
}

// Wishlist Management
let wishlist = JSON.parse(localStorage.getItem('emirates-wishlist-en') || '[]');

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    const btn = document.querySelector(`[data-product-id="${productId}"]`);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        btn.classList.remove('active');
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        btn.classList.add('active');
        showNotification('Added to wishlist', 'success');
    }
    
    localStorage.setItem('emirates-wishlist-en', JSON.stringify(wishlist));
    updateWishlistButtons();
}

function updateWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.btn-wishlist');
    wishlistBtns.forEach(btn => {
        const productId = btn.getAttribute('data-product-id');
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Enhanced Product Card Interactions
function initializeProductCards(container) {
    const addToCartBtns = container.querySelectorAll('.btn-add-to-cart');
    const quickViewBtns = container.querySelectorAll('.btn-quick-view');
    const wishlistBtns = container.querySelectorAll('.btn-wishlist');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productData = JSON.parse(this.getAttribute('data-product'));
            const product = {
                id: productData.id || Date.now(),
                title: productData.translatedTitle,
                price: parseFloat(productData.price),
                image: productData.image || productData.img || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'
            };
            
            if (window.Emirates && window.Emirates.addToCart) {
                window.Emirates.addToCart(product);
            }
        });
    });
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productData = JSON.parse(this.getAttribute('data-product'));
            if (window.Emirates && window.Emirates.showQuickView) {
                showQuickView(productData);
            }
        });
    });
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-product-id');
            toggleWishlist(productId);
        });
    });
    
    // Update wishlist buttons state
    updateWishlistButtons();
}

// Quick View Modal (Enhanced)
function showQuickView(product) {
    const translatedTitle = product.translatedTitle;
    const price = parseFloat(product.price);
    const image = product.image || product.img || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop';
    const category = product.category === 'perfumes' ? 'Perfume' : 'Watch';
    
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
                    <div class="image-zoom" onclick="showImageZoom('${image}', '${translatedTitle}')">
                        <i class="fas fa-search-plus"></i>
                    </div>
                </div>
                <div class="modal-info">
                    <div class="product-category-badge">${category}</div>
                    <h2 class="modal-title">${translatedTitle}</h2>
                    <div class="modal-rating">
                        <div class="stars">${generateStarRating(product.rating || 4.5)}</div>
                        <span class="rating-text">${product.rating || '4.5'}</span>
                        <span class="review-count">(${product.reviews || '25'} reviews)</span>
                    </div>
                    <div class="modal-price">$${price.toFixed(2)}</div>
                    <div class="modal-description">
                        <p>${getProductDescription(category, translatedTitle)}</p>
                        <div class="product-features">
                            <div class="feature-tag"><i class="fas fa-certificate"></i> 100% Authentic</div>
                            <div class="feature-tag"><i class="fas fa-shipping-fast"></i> Fast Delivery</div>
                            <div class="feature-tag"><i class="fas fa-undo"></i> 14-Day Returns</div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="btn-primary" onclick="addToCartFromModal('${product.id}', '${translatedTitle}', ${price}, '${image}')">
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
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function getProductDescription(category, title) {
    const descriptions = {
        perfume: [
            `Experience the luxurious essence of ${title}, a premium fragrance crafted with the finest ingredients.`,
            `Indulge in the sophisticated blend of ${title}, featuring notes that captivate and inspire.`,
            `Discover the enchanting aroma of ${title}, a signature scent for the discerning individual.`
        ],
        watch: [
            `Elevate your style with ${title}, a precision timepiece that combines elegance with functionality.`,
            `Experience timeless sophistication with ${title}, crafted for those who appreciate fine craftsmanship.`,
            `Make a statement with ${title}, a luxury watch that reflects your impeccable taste.`
        ]
    };
    
    const categoryDescriptions = descriptions[category.toLowerCase()] || descriptions.perfume;
    return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
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
    if (window.Emirates && window.Emirates.addToCart) {
        window.Emirates.addToCart({ id, title, price, image });
    }
    closeQuickView();
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

// Order Now Function
function orderNow(productName, price) {
    const message = `Hello! I'm interested in ordering:\n\n📱 Product: ${productName}\n💰 Price: $${price.toFixed(2)}\n\nPlease provide more details about availability and delivery to UAE.`;
    const whatsappUrl = `https://wa.me/201110760081?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Export functions for global access
window.ProductsShowcase = {
    goToPage,
    clearAllFilters,
    toggleWishlist,
    closeQuickView,
    addToCartFromModal,
    orderNow
};

// Make functions globally accessible
window.goToPage = goToPage;
window.clearAllFilters = clearAllFilters;
window.closeQuickView = closeQuickView;
window.addToCartFromModal = addToCartFromModal;
window.orderNow = orderNow;