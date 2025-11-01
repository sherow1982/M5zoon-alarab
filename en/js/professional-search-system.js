/**
 * Professional Search System for Emirates Gifts English Store
 * Advanced search with English translations and proper indexing
 * Version: v20251101-PROFESSIONAL
 */

(function(window) {
    'use strict';
    
    console.log('🔍 Professional Search System Loading...');
    
    const ProfessionalSearch = {
        searchData: [],
        searchIndex: {},
        isReady: false,
        
        /**
         * Initialize search system
         */
        async init() {
            try {
                console.log('🚀 Initializing professional search system...');
                
                // Load all product data
                await this.loadSearchData();
                
                // Build search index
                this.buildSearchIndex();
                
                // Create search UI
                this.createSearchUI();
                
                // Setup search functionality
                this.setupSearchHandlers();
                
                this.isReady = true;
                console.log('✅ Professional search system ready');
                
            } catch (error) {
                console.error('❌ Error initializing search:', error);
            }
        },
        
        /**
         * Load all product data for search
         */
        async loadSearchData() {
            try {
                const [perfumesRes, watchesRes] = await Promise.all([
                    fetch('../data/otor.json'),
                    fetch('../data/sa3at.json')
                ]);
                
                const perfumes = await perfumesRes.json();
                const watches = await watchesRes.json();
                
                // Convert to searchable format with English names
                this.searchData = [
                    ...perfumes.map(p => ({
                        id: p.id,
                        originalTitle: p.title,
                        englishTitle: this.translateToEnglish(p.title, 'perfume'),
                        price: parseFloat(p.sale_price || p.price || 0),
                        originalPrice: parseFloat(p.price || 0),
                        image: p.image_link,
                        category: 'perfume',
                        type: 'Perfume',
                        icon: '🌸',
                        url: `./product-details.html?type=perfume&id=${p.id}&source=otor`,
                        keywords: this.generateSearchKeywords(p.title, 'perfume')
                    })),
                    ...watches.map(w => ({
                        id: w.id,
                        originalTitle: w.title,
                        englishTitle: this.translateToEnglish(w.title, 'watch'),
                        price: parseFloat(w.sale_price || w.price || 0),
                        originalPrice: parseFloat(w.price || 0),
                        image: w.image_link,
                        category: 'watch',
                        type: 'Watch',
                        icon: '⏰',
                        url: `./product-details.html?type=watch&id=${w.id}&source=sa3at`,
                        keywords: this.generateSearchKeywords(w.title, 'watch')
                    }))
                ];
                
                console.log(`✅ Loaded ${this.searchData.length} products for search`);
                
            } catch (error) {
                console.error('❌ Error loading search data:', error);
                this.searchData = [];
            }
        },
        
        /**
         * Translate product name to clean English
         */
        translateToEnglish(arabicTitle, productType) {
            if (!arabicTitle) return 'Premium Product';
            
            let englishName = '';
            const title = arabicTitle.toLowerCase();
            
            if (productType === 'perfume') {
                if (title.includes('chanel') || title.includes('شانيل')) {
                    englishName = 'Chanel Premium Perfume';
                    if (title.includes('coco') || title.includes('كوكو')) englishName = 'Chanel Coco Perfume';
                } else if (title.includes('gucci') || title.includes('جوتشي')) {
                    if (title.includes('flora') || title.includes('فلورا')) englishName = 'Gucci Flora Perfume';
                    else if (title.includes('bloom') || title.includes('بلوم')) englishName = 'Gucci Bloom Perfume';
                    else englishName = 'Gucci Premium Perfume';
                } else if (title.includes('dior') || title.includes('ديور')) {
                    englishName = 'Dior Sauvage Perfume';
                } else if (title.includes('versace') || title.includes('فرزاتشي')) {
                    englishName = 'Versace Eros Perfume';
                } else if (title.includes('tom ford')) {
                    if (title.includes('vanilla')) englishName = 'Tom Ford Vanilla Perfume';
                    else if (title.includes('ombre')) englishName = 'Tom Ford Ombre Leather';
                    else englishName = 'Tom Ford Premium Perfume';
                } else if (title.includes('ysl') || title.includes('سان لوران')) {
                    if (title.includes('libre') || title.includes('ليبر')) englishName = 'YSL Libre Perfume';
                    else if (title.includes('opium') || title.includes('اوبيوم')) englishName = 'YSL Black Opium';
                    else englishName = 'YSL Premium Perfume';
                } else if (title.includes('kayali')) {
                    englishName = 'Kayali Premium Perfume';
                } else if (title.includes('فواحة')) {
                    englishName = 'Premium Car Fragrance';
                } else if (title.includes('دخون')) {
                    englishName = 'Premium Arabian Incense';
                } else {
                    englishName = 'Premium Luxury Perfume';
                }
                
                if (title.includes('100')) englishName += ' 100ml';
                else if (title.includes('50')) englishName += ' 50ml';
                
            } else {
                // Watch translations
                let brand = 'Premium';
                let model = 'Watch';
                let color = '';
                let size = '';
                let special = '';
                
                if (title.includes('rolex') || title.includes('رولكس')) {
                    brand = 'Rolex';
                    if (title.includes('yacht') || title.includes('يخت')) model = 'Yacht Master';
                    else if (title.includes('datejust') || title.includes('جاست')) model = 'Datejust';
                    else if (title.includes('daytona') || title.includes('دايتونا')) model = 'Daytona';
                    else if (title.includes('gmt')) model = 'GMT Master';
                    else if (title.includes('submariner')) model = 'Submariner';
                    else if (title.includes('oyster') || title.includes('اويستر')) model = 'Oyster';
                    else if (title.includes('r21')) model = 'Professional R21';
                    else if (title.includes('r54')) model = 'Professional R54';
                    else model = 'Classic';
                } else if (title.includes('omega') || title.includes('اوميغا')) {
                    brand = 'Omega';
                    if (title.includes('swatch') || title.includes('سواتش')) model = 'Swatch';
                    else model = 'Seamaster';
                } else if (title.includes('audemars') || title.includes('اوديمار')) {
                    brand = 'Audemars Piguet';
                    model = 'Royal Oak';
                } else if (title.includes('patek') || title.includes('باتيك')) {
                    brand = 'Patek Philippe';
                    model = 'Calatrava';
                } else if (title.includes('cartier') || title.includes('كارتييه')) {
                    brand = 'Cartier';
                    model = 'Tank';
                } else if (title.includes('bulgari') || title.includes('سربنتي')) {
                    brand = 'Bulgari';
                    model = 'Serpenti';
                } else if (title.includes('smart') || title.includes('ذكية')) {
                    brand = 'Smart';
                    model = 'Watch';
                }
                
                // Color detection
                if (title.includes('black') || title.includes('اسود') || title.includes('أسود')) color = 'Black';
                else if (title.includes('white') || title.includes('ابيض') || title.includes('أبيض')) color = 'White';
                else if (title.includes('blue') || title.includes('ازرق') || title.includes('أزرق')) color = 'Blue';
                else if (title.includes('green') || title.includes('اخضر') || title.includes('أخضر')) color = 'Green';
                else if (title.includes('gold') || title.includes('جولد') || title.includes('ذهبي')) color = 'Gold';
                else if (title.includes('silver') || title.includes('فضي') || title.includes('سيلفر')) color = 'Silver';
                
                // Size detection
                if (title.includes('41')) size = '41mm';
                else if (title.includes('40')) size = '40mm';
                else if (title.includes('36')) size = '36mm';
                
                // Special features
                if (title.includes('بوكس') && title.includes('ايربودز')) special = '& AirPods Set';
                else if (title.includes('بوكس')) special = 'with Box';
                else if (title.includes('couple') || title.includes('كوبل')) special = 'Couple Set';
                else if (title.includes('نسائي')) special = "Women's";
                else if (title.includes('رجالي')) special = "Men's";
                
                const parts = [brand, model, color, size, special].filter(p => p);
                englishName = parts.join(' ');
                
                if (!englishName) englishName = 'Premium Luxury Watch';
            }
            
            return englishName;
        },
        
        /**
         * Generate search keywords
         */
        generateSearchKeywords(title, type) {
            const keywords = [];
            const lowerTitle = title.toLowerCase();
            
            // Add English translated name
            const englishName = this.translateToEnglish(title, type);
            keywords.push(...englishName.toLowerCase().split(' '));
            
            // Add brand keywords
            const brands = ['chanel', 'gucci', 'dior', 'versace', 'tom ford', 'ysl', 'rolex', 'omega', 'cartier', 'bulgari'];
            brands.forEach(brand => {
                if (lowerTitle.includes(brand)) keywords.push(brand);
            });
            
            // Add color keywords
            const colors = ['black', 'white', 'blue', 'green', 'gold', 'silver', 'brown', 'red'];
            colors.forEach(color => {
                if (lowerTitle.includes(color)) keywords.push(color);
            });
            
            // Add category keywords
            keywords.push(type, type === 'perfume' ? 'fragrance' : 'timepiece');
            
            return [...new Set(keywords)].filter(k => k && k.length > 1);
        },
        
        /**
         * Build search index
         */
        buildSearchIndex() {
            this.searchIndex = {};
            
            this.searchData.forEach(product => {
                product.keywords.forEach(keyword => {
                    if (!this.searchIndex[keyword]) {
                        this.searchIndex[keyword] = [];
                    }
                    this.searchIndex[keyword].push(product);
                });
            });
            
            console.log(`✅ Built search index with ${Object.keys(this.searchIndex).length} keywords`);
        },
        
        /**
         * Create professional search UI
         */
        createSearchUI() {
            const searchHTML = `
                <div class="professional-search-container" id="professionalSearch">
                    <div class="search-overlay" id="searchOverlay"></div>
                    <div class="search-modal" id="searchModal">
                        <div class="search-modal-header">
                            <div class="search-input-container">
                                <i class="fas fa-search search-icon"></i>
                                <input type="text" 
                                       id="professionalSearchInput" 
                                       placeholder="Search premium products..." 
                                       autocomplete="off"
                                       aria-label="Search products">
                                <button class="search-clear" id="searchClear" aria-label="Clear search">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <button class="search-close" id="searchClose" aria-label="Close search">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div class="search-filters">
                            <button class="search-filter active" data-filter="all">
                                <i class="fas fa-th-large"></i> All
                            </button>
                            <button class="search-filter" data-filter="perfume">
                                <i class="fas fa-spray-can"></i> Perfumes
                            </button>
                            <button class="search-filter" data-filter="watch">
                                <i class="fas fa-clock"></i> Watches
                            </button>
                        </div>
                        
                        <div class="search-results" id="searchResults">
                            <div class="search-suggestions">
                                <div class="suggestions-title">Popular searches:</div>
                                <div class="suggestions-list">
                                    <span class="suggestion-item" data-search="rolex">Rolex</span>
                                    <span class="suggestion-item" data-search="chanel">Chanel</span>
                                    <span class="suggestion-item" data-search="omega">Omega</span>
                                    <span class="suggestion-item" data-search="dior">Dior</span>
                                    <span class="suggestion-item" data-search="gucci">Gucci</span>
                                    <span class="suggestion-item" data-search="tom ford">Tom Ford</span>
                                    <span class="suggestion-item" data-search="gold">Gold</span>
                                    <span class="suggestion-item" data-search="black">Black</span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="search-footer">
                            <div class="search-stats" id="searchStats"></div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add search CSS
            const searchCSS = `
                <style id="professionalSearchCSS">
                /* Professional Search Styles */
                .professional-search-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 10000;
                    display: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .professional-search-container.active {
                    display: block;
                    opacity: 1;
                }
                
                .search-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                }
                
                .search-modal {
                    position: relative;
                    max-width: 900px;
                    width: 95%;
                    max-height: 90vh;
                    margin: 5vh auto;
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
                    display: flex;
                    flex-direction: column;
                }
                
                .search-modal-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 25px 30px;
                    border-bottom: 2px solid #f1f3f4;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }
                
                .search-input-container {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: white;
                    border-radius: 15px;
                    border: 2px solid #D4AF37;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
                }
                
                .search-input-container:focus-within {
                    border-color: #B8860B;
                    box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
                }
                
                .search-icon {
                    padding: 0 15px;
                    color: #D4AF37;
                    font-size: 18px;
                }
                
                #professionalSearchInput {
                    flex: 1;
                    padding: 18px 10px;
                    border: none;
                    outline: none;
                    font-size: 16px;
                    font-family: 'Inter', sans-serif;
                    color: #2c3e50;
                    background: transparent;
                }
                
                #professionalSearchInput::placeholder {
                    color: #6c757d;
                }
                
                .search-clear {
                    padding: 15px;
                    border: none;
                    background: transparent;
                    color: #6c757d;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }
                
                .search-clear:hover {
                    color: #e74c3c;
                }
                
                .search-close {
                    padding: 15px 20px;
                    border: none;
                    background: #e74c3c;
                    color: white;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .search-close:hover {
                    background: #c0392b;
                    transform: scale(1.05);
                }
                
                .search-filters {
                    display: flex;
                    gap: 10px;
                    padding: 20px 30px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #e9ecef;
                }
                
                .search-filter {
                    padding: 12px 20px;
                    border: 2px solid #e9ecef;
                    background: white;
                    color: #6c757d;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Inter', sans-serif;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .search-filter:hover {
                    border-color: #D4AF37;
                    color: #B8860B;
                }
                
                .search-filter.active {
                    background: linear-gradient(135deg, #D4AF37, #B8860B);
                    color: white;
                    border-color: #D4AF37;
                }
                
                .search-results {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                    max-height: 60vh;
                }
                
                .search-suggestions {
                    text-align: center;
                }
                
                .suggestions-title {
                    color: #6c757d;
                    margin-bottom: 20px;
                    font-weight: 500;
                }
                
                .suggestions-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 10px;
                    justify-content: center;
                }
                
                .suggestion-item {
                    padding: 8px 16px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: #495057;
                    font-size: 14px;
                }
                
                .suggestion-item:hover {
                    background: #D4AF37;
                    color: white;
                    border-color: #D4AF37;
                }
                
                .search-results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                }
                
                .search-result-item {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    text-decoration: none;
                    color: inherit;
                }
                
                .search-result-item:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
                
                .search-result-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }
                
                .search-result-info {
                    padding: 15px;
                }
                
                .search-result-title {
                    font-weight: 600;
                    font-size: 14px;
                    color: #2c3e50;
                    margin-bottom: 8px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .search-result-price {
                    font-weight: 700;
                    color: #27ae60;
                    font-size: 16px;
                }
                
                .search-result-category {
                    font-size: 12px;
                    color: #D4AF37;
                    font-weight: 500;
                    margin-bottom: 5px;
                }
                
                .search-footer {
                    padding: 20px 30px;
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                    text-align: center;
                }
                
                .search-stats {
                    color: #6c757d;
                    font-size: 14px;
                }
                
                .no-results {
                    text-align: center;
                    padding: 60px 20px;
                    color: #6c757d;
                }
                
                .no-results i {
                    font-size: 3rem;
                    margin-bottom: 20px;
                    color: #e9ecef;
                }
                
                /* Header search button */
                .header-search-btn {
                    background: transparent;
                    border: 2px solid #D4AF37;
                    color: #D4AF37;
                    padding: 10px 15px;
                    border-radius: 25px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 14px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .header-search-btn:hover {
                    background: #D4AF37;
                    color: white;
                    transform: translateY(-2px);
                }
                
                @media (max-width: 768px) {
                    .search-modal {
                        width: 98%;
                        margin: 1vh auto;
                        max-height: 98vh;
                    }
                    
                    .search-modal-header {
                        padding: 20px;
                    }
                    
                    .search-filters {
                        padding: 15px 20px;
                        flex-wrap: wrap;
                    }
                    
                    .search-results {
                        padding: 20px;
                    }
                    
                    .search-results-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 15px;
                    }
                }
                </style>
            `;
            
            // Add CSS to head
            document.head.insertAdjacentHTML('beforeend', searchCSS);
            
            // Add search HTML to body
            document.body.insertAdjacentHTML('beforeend', searchHTML);
            
            // Add search button to header
            this.addSearchButtonToHeader();
        },
        
        /**
         * Add search button to header
         */
        addSearchButtonToHeader() {
            const headerTools = document.querySelector('.header-tools');
            if (headerTools) {
                const searchButton = document.createElement('button');
                searchButton.className = 'header-tool header-search-btn';
                searchButton.innerHTML = '<i class="fas fa-search"></i> <span>Search</span>';
                searchButton.onclick = () => this.openSearch();
                
                // Insert before first element
                headerTools.insertBefore(searchButton, headerTools.firstChild);
                
                console.log('✅ Search button added to header');
            }
            
            // Add to mobile menu
            const mobileNav = document.querySelector('.mobile-sidebar-nav');
            if (mobileNav) {
                const mobileSearchLink = document.createElement('a');
                mobileSearchLink.href = '#';
                mobileSearchLink.innerHTML = '<i class="fas fa-search"></i> Search Products';
                mobileSearchLink.onclick = (e) => {
                    e.preventDefault();
                    this.openSearch();
                    // Close mobile menu
                    document.getElementById('mobileOverlay')?.click();
                };
                
                // Insert after home link
                const homeLink = mobileNav.querySelector('a[href="./"]');
                if (homeLink && homeLink.nextSibling) {
                    mobileNav.insertBefore(mobileSearchLink, homeLink.nextSibling);
                }
            }
        },
        
        /**
         * Setup search handlers
         */
        setupSearchHandlers() {
            const searchInput = document.getElementById('professionalSearchInput');
            const searchClear = document.getElementById('searchClear');
            const searchClose = document.getElementById('searchClose');
            const searchOverlay = document.getElementById('searchOverlay');
            const searchFilters = document.querySelectorAll('.search-filter');
            const suggestionItems = document.querySelectorAll('.suggestion-item');
            
            // Search input handler
            searchInput?.addEventListener('input', (e) => {
                const query = e.target.value;
                if (query.length > 0) {
                    this.performSearch(query);
                    searchClear.style.display = 'block';
                } else {
                    this.showSuggestions();
                    searchClear.style.display = 'none';
                }
            });
            
            // Enter key search
            searchInput?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });
            
            // Clear search
            searchClear?.addEventListener('click', () => {
                searchInput.value = '';
                this.showSuggestions();
                searchClear.style.display = 'none';
                searchInput.focus();
            });
            
            // Close search
            searchClose?.addEventListener('click', () => this.closeSearch());
            searchOverlay?.addEventListener('click', () => this.closeSearch());
            
            // Filter buttons
            searchFilters.forEach(filter => {
                filter.addEventListener('click', () => {
                    searchFilters.forEach(f => f.classList.remove('active'));
                    filter.classList.add('active');
                    
                    const filterType = filter.dataset.filter;
                    if (searchInput.value) {
                        this.performSearch(searchInput.value, filterType);
                    }
                });
            });
            
            // Suggestion items
            suggestionItems.forEach(item => {
                item.addEventListener('click', () => {
                    const searchTerm = item.dataset.search;
                    searchInput.value = searchTerm;
                    this.performSearch(searchTerm);
                });
            });
            
            // Keyboard shortcuts
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.openSearch();
                } else if (e.key === 'Escape' && this.isSearchOpen()) {
                    this.closeSearch();
                }
            });
        },
        
        /**
         * Perform search
         */
        performSearch(query, filterType = 'all') {
            if (!query || query.length < 1) {
                this.showSuggestions();
                return;
            }
            
            const results = this.searchProducts(query, filterType);
            this.displayResults(results, query);
        },
        
        /**
         * Search products
         */
        searchProducts(query, filterType = 'all') {
            const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
            const results = [];
            
            this.searchData.forEach(product => {
                // Apply filter
                if (filterType !== 'all' && product.category !== filterType) {
                    return;
                }
                
                let score = 0;
                const englishTitle = product.englishTitle.toLowerCase();
                const keywords = product.keywords;
                
                // Exact title match (highest priority)
                if (englishTitle.includes(query.toLowerCase())) {
                    score += 100;
                }
                
                // Keyword matches
                searchTerms.forEach(term => {
                    if (englishTitle.includes(term)) score += 50;
                    if (keywords.includes(term)) score += 30;
                    
                    keywords.forEach(keyword => {
                        if (keyword.includes(term)) score += 20;
                    });
                });
                
                if (score > 0) {
                    results.push({ ...product, score });
                }
            });
            
            return results.sort((a, b) => b.score - a.score);
        },
        
        /**
         * Display search results
         */
        displayResults(results, query) {
            const searchResults = document.getElementById('searchResults');
            const searchStats = document.getElementById('searchStats');
            
            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>No products found</h3>
                        <p>Try searching for brands like "Rolex", "Chanel", or colors like "Gold", "Black"</p>
                    </div>
                `;
                searchStats.textContent = `No results for "${query}"`;
                return;
            }
            
            const resultsHTML = `
                <div class="search-results-grid">
                    ${results.slice(0, 12).map(product => `
                        <a href="${product.url}" class="search-result-item" target="_blank" rel="noopener">
                            <img src="${product.image}" alt="${product.englishTitle}" class="search-result-image" 
                                 onerror="this.src='https://via.placeholder.com/200x150/D4AF37/FFFFFF?text=${product.type}'">
                            <div class="search-result-info">
                                <div class="search-result-category">${product.icon} ${product.type}</div>
                                <div class="search-result-title">${product.englishTitle}</div>
                                <div class="search-result-price">${product.price.toFixed(2)} AED</div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            `;
            
            searchResults.innerHTML = resultsHTML;
            searchStats.textContent = `Found ${results.length} products for "${query}"`;
        },
        
        /**
         * Show suggestions
         */
        showSuggestions() {
            const searchResults = document.getElementById('searchResults');
            const searchStats = document.getElementById('searchStats');
            
            searchResults.innerHTML = `
                <div class="search-suggestions">
                    <div class="suggestions-title">Popular searches:</div>
                    <div class="suggestions-list">
                        <span class="suggestion-item" data-search="rolex">Rolex</span>
                        <span class="suggestion-item" data-search="chanel">Chanel</span>
                        <span class="suggestion-item" data-search="omega">Omega</span>
                        <span class="suggestion-item" data-search="dior">Dior</span>
                        <span class="suggestion-item" data-search="gucci">Gucci</span>
                        <span class="suggestion-item" data-search="tom ford">Tom Ford</span>
                        <span class="suggestion-item" data-search="gold">Gold</span>
                        <span class="suggestion-item" data-search="black">Black</span>
                    </div>
                </div>
            `;
            
            // Re-attach suggestion handlers
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const searchTerm = item.dataset.search;
                    document.getElementById('professionalSearchInput').value = searchTerm;
                    this.performSearch(searchTerm);
                });
            });
            
            searchStats.textContent = `${this.searchData.length} products available`;
        },
        
        /**
         * Open search
         */
        openSearch() {
            const searchContainer = document.getElementById('professionalSearch');
            if (searchContainer) {
                searchContainer.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                setTimeout(() => {
                    document.getElementById('professionalSearchInput')?.focus();
                }, 100);
                
                console.log('🔍 Professional search opened');
            }
        },
        
        /**
         * Close search
         */
        closeSearch() {
            const searchContainer = document.getElementById('professionalSearch');
            if (searchContainer) {
                searchContainer.classList.remove('active');
                document.body.style.overflow = '';
                
                // Clear search
                const searchInput = document.getElementById('professionalSearchInput');
                if (searchInput) {
                    searchInput.value = '';
                    this.showSuggestions();
                }
                
                console.log('❌ Professional search closed');
            }
        },
        
        /**
         * Check if search is open
         */
        isSearchOpen() {
            const searchContainer = document.getElementById('professionalSearch');
            return searchContainer && searchContainer.classList.contains('active');
        }
    };
    
    // Export globally
    window.ProfessionalSearch = ProfessionalSearch;
    
    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => ProfessionalSearch.init());
    } else {
        ProfessionalSearch.init();
    }
    
    console.log('✅ Professional Search System loaded');
    
})(window);