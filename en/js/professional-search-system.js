/**
 * Professional Search System for Emirates Gifts English Store
 * CSP-Safe, Popup-Free, High-Performance Search
 * Version: v20251101-FINAL-CSP-SAFE
 */

(function() {
    'use strict';
    
    console.log('🔍 Professional Search System - Final CSP-Safe Version');
    
    const ProfessionalSearch = {
        products: [],
        searchIndex: {},
        isOpen: false,
        initialized: false,
        
        // English display name mappings (specific products)
        specificNames: {
            'watch_88': 'Rolex Kaaba Design Premium Watch',
            'watch_3': 'Rolex Black Dial Professional R21',
            'watch_4': 'Rolex Oyster Professional 40mm R54',
            'watch_1': 'Rolex Yacht Master Silver',
            'watch_21': 'Rolex Yacht Master Gold',
            'watch_81': 'Rolex Yacht Master Black',
            'watch_8': 'Omega Swatch Baby Blue Edition',
            'watch_45': 'Rolex GMT Black',
            'watch_46': 'Rolex GMT Batman',
            'watch_47': 'Rolex GMT Batman II',
            'watch_48': 'Rolex GMT Pepsi',
            'watch_104': 'Patek Philippe Geneva Royal Blue & Gold',
            'watch_105': 'Audemars Piguet Blue & Silver',
            'watch_76': 'Audemars Piguet Royal Orange'
        },
        
        /**
         * Initialize search system
         */
        async init() {
            if (this.initialized) return;
            
            try {
                console.log('🚀 Starting search initialization...');
                
                await this.loadAllProducts();
                this.buildSearchIndex();
                this.createSearchUI();
                this.addSearchButtons();
                this.setupEventHandlers();
                this.setupKeyboardShortcuts();
                
                this.initialized = true;
                console.log('✅ Professional search system ready');
                
            } catch (error) {
                console.error('❌ Search initialization failed:', error);
                // Create minimal search fallback
                this.createMinimalSearch();
            }
        },
        
        /**
         * Load all products from data files
         */
        async loadAllProducts() {
            console.log('📦 Loading product data...');
            
            const loadPromises = [
                this.loadDataFile('../data/sa3at.json', 'watch'),
                this.loadDataFile('../data/otor.json', 'perfume')
            ];
            
            const results = await Promise.allSettled(loadPromises);
            
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    const type = index === 0 ? 'watch' : 'perfume';
                    console.log(`✅ Loaded ${result.value.length} ${type}s`);
                } else {
                    console.warn(`⚠️ Failed to load data file ${index}:`, result.reason);
                }
            });
            
            console.log(`🎯 Total products loaded: ${this.products.length}`);
        },
        
        /**
         * Load single data file
         */
        async loadDataFile(url, type) {
            try {
                const response = await fetch(url + '?v=' + Date.now());
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                
                const data = await response.json();
                if (!Array.isArray(data)) throw new Error('Invalid data format');
                
                // Process each product
                data.forEach(item => {
                    const product = {
                        id: item.id,
                        originalTitle: item.title,
                        displayName: this.generateDisplayName(item.title, item.id),
                        price: parseFloat(item.sale_price || item.price || 0),
                        originalPrice: parseFloat(item.price || 0),
                        image: item.image_link,
                        category: type,
                        categoryDisplay: type === 'watch' ? 'Watches' : 'Perfumes',
                        icon: type === 'watch' ? '⏰' : '🌸',
                        url: `./product-details.html?id=${item.id}&type=${type}&source=${type === 'watch' ? 'sa3at' : 'otor'}`,
                        keywords: this.generateKeywords(item.title, type)
                    };
                    
                    this.products.push(product);
                });
                
                return data;
                
            } catch (error) {
                console.error(`❌ Failed to load ${url}:`, error);
                return [];
            }
        },
        
        /**
         * Generate clean English display name
         */
        generateDisplayName(title, id) {
            // Check specific mappings first
            if (this.specificNames[id]) {
                return this.specificNames[id];
            }
            
            if (!title) return 'Premium Product';
            
            const text = title.toLowerCase();
            let brand = 'Premium';
            let model = '';
            let color = '';
            let size = '';
            let special = '';
            
            // Brand detection
            if (text.includes('rolex') || text.includes('رولكس')) {
                brand = 'Rolex';
                if (text.includes('yacht') || text.includes('يخت')) model = 'Yacht Master';
                else if (text.includes('datejust') || text.includes('جاست')) model = 'Datejust';
                else if (text.includes('daytona') || text.includes('دايتونا')) model = 'Daytona';
                else if (text.includes('gmt')) model = 'GMT Master';
                else if (text.includes('submariner')) model = 'Submariner';
                else if (text.includes('oyster') || text.includes('اويستر')) model = 'Oyster';
                else if (text.includes('كعبة') || text.includes('kaaba')) model = 'Kaaba Design';
                else if (text.includes('r21')) model = 'Professional R21';
                else if (text.includes('r54')) model = 'Professional R54';
                else model = 'Classic';
            } else if (text.includes('omega') || text.includes('اوميغا')) {
                brand = 'Omega';
                if (text.includes('swatch') || text.includes('سواتش')) model = 'Swatch';
            } else if (text.includes('chanel') || text.includes('شانيل')) {
                brand = 'Chanel';
                if (text.includes('coco') || text.includes('كوكو')) model = 'Coco';
                else model = 'Premium Perfume';
            } else if (text.includes('dior') || text.includes('ديور')) {
                brand = 'Dior';
                if (text.includes('sauvage')) model = 'Sauvage';
                else model = 'Premium Perfume';
            } else if (text.includes('gucci') || text.includes('جوتشي')) {
                brand = 'Gucci';
                if (text.includes('flora') || text.includes('فلورا')) model = 'Flora';
                else if (text.includes('bloom') || text.includes('بلوم')) model = 'Bloom';
                else model = 'Premium Perfume';
            }
            
            // Color detection
            if (text.includes('black') || text.includes('اسود') || text.includes('أسود')) color = 'Black';
            else if (text.includes('gold') || text.includes('ذهبي') || text.includes('جولد')) color = 'Gold';
            else if (text.includes('silver') || text.includes('فضي') || text.includes('سيلفر')) color = 'Silver';
            else if (text.includes('blue') || text.includes('ازرق') || text.includes('أزرق')) color = 'Blue';
            else if (text.includes('green') || text.includes('اخضر') || text.includes('أخضر')) color = 'Green';
            else if (text.includes('white') || text.includes('ابيض') || text.includes('أبيض')) color = 'White';
            
            // Size detection
            if (text.includes('41mm') || text.includes('41 ملم')) size = '41mm';
            else if (text.includes('40mm') || text.includes('40ملم') || text.includes('40 ملم')) size = '40mm';
            else if (text.includes('100ml') || text.includes('100 مل')) size = '100ml';
            else if (text.includes('50ml') || text.includes('50 مل')) size = '50ml';
            
            // Special features
            if (text.includes('بوكس') && text.includes('ايربودز')) special = '& AirPods Set';
            else if (text.includes('بوكس') || text.includes('box')) special = 'with Box';
            else if (text.includes('couple') || text.includes('كوبل')) special = 'Couple Set';
            else if (text.includes('copy 1') || text.includes('premium')) special = 'Premium Edition';
            else if (text.includes('نسائي')) special = "Women's";
            else if (text.includes('رجالي')) special = "Men's";
            
            const parts = [brand, model, color, size, special].filter(p => p && p.trim());
            return parts.join(' ') || 'Premium Product';
        },
        
        /**
         * Generate search keywords
         */
        generateKeywords(title, type) {
            const keywords = new Set();
            const lowerTitle = title.toLowerCase();
            
            // Add type keywords
            keywords.add(type);
            keywords.add(type === 'watch' ? 'timepiece' : 'fragrance');
            
            // Extract English words from title
            const englishWords = lowerTitle.match(/[a-zA-Z]+/g) || [];
            englishWords.forEach(word => {
                if (word.length > 2) keywords.add(word.toLowerCase());
            });
            
            // Common brand keywords
            const brands = ['rolex', 'omega', 'chanel', 'dior', 'gucci', 'versace', 'cartier', 'bulgari'];
            brands.forEach(brand => {
                if (lowerTitle.includes(brand)) keywords.add(brand);
            });
            
            // Color keywords
            const colors = ['black', 'white', 'blue', 'green', 'gold', 'silver', 'brown', 'red'];
            colors.forEach(color => {
                if (lowerTitle.includes(color) || lowerTitle.includes(this.getArabicColor(color))) {
                    keywords.add(color);
                }
            });
            
            return Array.from(keywords).filter(k => k && k.length > 1);
        },
        
        /**
         * Get Arabic color equivalent
         */
        getArabicColor(englishColor) {
            const colorMap = {
                'black': 'اسود',
                'white': 'ابيض',
                'blue': 'ازرق',
                'green': 'اخضر',
                'gold': 'ذهبي',
                'silver': 'فضي',
                'brown': 'بني',
                'red': 'احمر'
            };
            return colorMap[englishColor] || '';
        },
        
        /**
         * Build search index
         */
        buildSearchIndex() {
            this.searchIndex = {};
            
            this.products.forEach(product => {
                // Index by display name words
                const displayWords = product.displayName.toLowerCase().split(' ');
                displayWords.forEach(word => {
                    if (word.length > 2) {
                        if (!this.searchIndex[word]) this.searchIndex[word] = [];
                        this.searchIndex[word].push(product);
                    }
                });
                
                // Index by keywords
                product.keywords.forEach(keyword => {
                    if (!this.searchIndex[keyword]) this.searchIndex[keyword] = [];
                    this.searchIndex[keyword].push(product);
                });
            });
            
            console.log(`✅ Search index built with ${Object.keys(this.searchIndex).length} keywords`);
        },
        
        /**
         * Create search UI
         */
        createSearchUI() {
            // Create search container
            const searchContainer = document.createElement('div');
            searchContainer.className = 'professional-search-container';
            searchContainer.id = 'professionalSearch';
            
            searchContainer.innerHTML = `
                <div class="search-overlay"></div>
                <div class="search-modal">
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
                            <div class="suggestions-list" id="suggestionsList">
                                <span class="suggestion-item">Rolex</span>
                                <span class="suggestion-item">Chanel</span>
                                <span class="suggestion-item">Omega</span>
                                <span class="suggestion-item">Dior</span>
                                <span class="suggestion-item">Gold</span>
                                <span class="suggestion-item">Black</span>
                                <span class="suggestion-item">40mm</span>
                                <span class="suggestion-item">Premium</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="search-footer">
                        <div class="search-stats" id="searchStats">${this.products.length} products available</div>
                    </div>
                </div>
            `;
            
            // Add CSS styles
            this.addSearchCSS();
            
            // Add to DOM
            document.body.appendChild(searchContainer);
            
            console.log('✅ Search UI created');
        },
        
        /**
         * Add search CSS styles
         */
        addSearchCSS() {
            const css = document.createElement('style');
            css.id = 'professionalSearchStyles';
            css.textContent = `
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
                
                .search-clear {
                    padding: 15px;
                    border: none;
                    background: transparent;
                    color: #6c757d;
                    cursor: pointer;
                    transition: color 0.3s ease;
                    display: none;
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
                    text-decoration: none;
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
                        flex-wrap: wrap;
                        gap: 10px;
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
            `;
            
            document.head.appendChild(css);
        },
        
        /**
         * Add search buttons to pages
         */
        addSearchButtons() {
            // Add to header
            const headerTools = document.querySelector('.header-tools');
            if (headerTools && !document.querySelector('.header-search-btn')) {
                const searchBtn = document.createElement('button');
                searchBtn.className = 'header-tool header-search-btn';
                searchBtn.innerHTML = '<i class="fas fa-search"></i>';
                searchBtn.title = 'Search Products (Ctrl+K)';
                searchBtn.addEventListener('click', () => this.openSearch());
                
                headerTools.insertBefore(searchBtn, headerTools.firstChild);
                console.log('✅ Search button added to header');
            }
            
            // Update existing search buttons
            const existingButtons = document.querySelectorAll('[onclick*="openProfessionalSearch"], [onclick*="openSearchSafely"], [onclick*="openShowcaseSearch"]');
            existingButtons.forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    this.openSearch();
                };
            });
        },
        
        /**
         * Setup event handlers
         */
        setupEventHandlers() {
            const container = document.getElementById('professionalSearch');
            if (!container) return;
            
            const searchInput = document.getElementById('professionalSearchInput');
            const searchClear = document.getElementById('searchClear');
            const searchClose = document.getElementById('searchClose');
            const searchOverlay = container.querySelector('.search-overlay');
            const searchFilters = container.querySelectorAll('.search-filter');
            const suggestionItems = container.querySelectorAll('.suggestion-item');
            
            // Search input
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.trim();
                    if (query.length > 0) {
                        this.performSearch(query);
                        if (searchClear) searchClear.style.display = 'block';
                    } else {
                        this.showSuggestions();
                        if (searchClear) searchClear.style.display = 'none';
                    }
                });
                
                searchInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.performSearch(e.target.value.trim());
                    }
                });
            }
            
            // Clear button
            if (searchClear) {
                searchClear.addEventListener('click', () => {
                    if (searchInput) {
                        searchInput.value = '';
                        searchInput.focus();
                    }
                    this.showSuggestions();
                    searchClear.style.display = 'none';
                });
            }
            
            // Close button
            if (searchClose) {
                searchClose.addEventListener('click', () => this.closeSearch());
            }
            
            // Overlay click
            if (searchOverlay) {
                searchOverlay.addEventListener('click', () => this.closeSearch());
            }
            
            // Filter buttons
            searchFilters.forEach(filter => {
                filter.addEventListener('click', () => {
                    searchFilters.forEach(f => f.classList.remove('active'));
                    filter.classList.add('active');
                    
                    const filterType = filter.dataset.filter;
                    if (searchInput && searchInput.value.trim()) {
                        this.performSearch(searchInput.value.trim(), filterType);
                    }
                });
            });
            
            // Suggestion clicks
            suggestionItems.forEach(item => {
                item.addEventListener('click', () => {
                    const searchTerm = item.textContent.trim();
                    if (searchInput) {
                        searchInput.value = searchTerm;
                    }
                    this.performSearch(searchTerm);
                });
            });
            
            console.log('✅ Event handlers setup complete');
        },
        
        /**
         * Setup keyboard shortcuts
         */
        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    this.openSearch();
                } else if (e.key === 'Escape' && this.isOpen) {
                    this.closeSearch();
                }
            });
            
            console.log('✅ Keyboard shortcuts active (Ctrl+K, Escape)');
        },
        
        /**
         * Open search
         */
        openSearch() {
            const container = document.getElementById('professionalSearch');
            if (container) {
                container.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.isOpen = true;
                
                setTimeout(() => {
                    const input = document.getElementById('professionalSearchInput');
                    if (input) input.focus();
                }, 100);
                
                console.log('🔍 Professional search opened');
            }
        },
        
        /**
         * Close search
         */
        closeSearch() {
            const container = document.getElementById('professionalSearch');
            if (container) {
                container.classList.remove('active');
                document.body.style.overflow = '';
                this.isOpen = false;
                
                // Clear search
                const input = document.getElementById('professionalSearchInput');
                if (input) {
                    input.value = '';
                }
                this.showSuggestions();
                
                console.log('❌ Professional search closed');
            }
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
            
            this.products.forEach(product => {
                // Apply category filter
                if (filterType !== 'all' && product.category !== filterType) {
                    return;
                }
                
                let score = 0;
                const displayName = product.displayName.toLowerCase();
                
                // Exact display name match (highest priority)
                if (displayName.includes(query.toLowerCase())) {
                    score += 100;
                }
                
                // Term matches
                searchTerms.forEach(term => {
                    if (displayName.includes(term)) score += 50;
                    
                    // Keyword matches
                    product.keywords.forEach(keyword => {
                        if (keyword === term) score += 40;
                        else if (keyword.includes(term)) score += 20;
                    });
                });
                
                if (score > 0) {
                    results.push({ ...product, searchScore: score });
                }
            });
            
            return results.sort((a, b) => b.searchScore - a.searchScore);
        },
        
        /**
         * Display search results
         */
        displayResults(results, query) {
            const searchResults = document.getElementById('searchResults');
            const searchStats = document.getElementById('searchStats');
            
            if (!searchResults || !searchStats) return;
            
            if (results.length === 0) {
                searchResults.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>No products found</h3>
                        <p>Try searching for: "Rolex", "Chanel", "Gold", "Black", "40mm"</p>
                    </div>
                `;
                searchStats.textContent = `No results for "${query}"`;
                return;
            }
            
            const maxResults = 12;
            const displayResults = results.slice(0, maxResults);
            
            const resultsHTML = `
                <div class="search-results-grid">
                    ${displayResults.map(product => `
                        <a href="${product.url}" class="search-result-item" target="_blank" rel="noopener">
                            <img src="${product.image}" 
                                 alt="${product.displayName}" 
                                 class="search-result-image"
                                 loading="lazy"
                                 onerror="this.src='https://via.placeholder.com/200x150/D4AF37/FFFFFF?text=${encodeURIComponent(product.categoryDisplay)}'">
                            <div class="search-result-info">
                                <div class="search-result-category">${product.icon} ${product.categoryDisplay}</div>
                                <div class="search-result-title">${product.displayName}</div>
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
            
            if (!searchResults || !searchStats) return;
            
            searchResults.innerHTML = `
                <div class="search-suggestions">
                    <div class="suggestions-title">Popular searches:</div>
                    <div class="suggestions-list" id="suggestionsList">
                        <span class="suggestion-item">Rolex</span>
                        <span class="suggestion-item">Chanel</span>
                        <span class="suggestion-item">Omega</span>
                        <span class="suggestion-item">Dior</span>
                        <span class="suggestion-item">Gold</span>
                        <span class="suggestion-item">Black</span>
                        <span class="suggestion-item">40mm</span>
                        <span class="suggestion-item">Premium</span>
                    </div>
                </div>
            `;
            
            // Re-attach suggestion handlers
            const suggestionItems = searchResults.querySelectorAll('.suggestion-item');
            suggestionItems.forEach(item => {
                item.addEventListener('click', () => {
                    const searchTerm = item.textContent.trim();
                    const input = document.getElementById('professionalSearchInput');
                    if (input) {
                        input.value = searchTerm;
                    }
                    this.performSearch(searchTerm);
                });
            });
            
            searchStats.textContent = `${this.products.length} products available`;
        },
        
        /**
         * Create minimal search fallback
         */
        createMinimalSearch() {
            console.log('⚠️ Creating minimal search fallback');
            
            // Simple search button
            const headerTools = document.querySelector('.header-tools');
            if (headerTools && !document.querySelector('.header-search-btn')) {
                const searchBtn = document.createElement('a');
                searchBtn.className = 'header-tool';
                searchBtn.href = './products-showcase.html';
                searchBtn.target = '_blank';
                searchBtn.rel = 'noopener';
                searchBtn.innerHTML = '<i class="fas fa-search"></i>';
                searchBtn.title = 'Search Products';
                
                headerTools.insertBefore(searchBtn, headerTools.firstChild);
            }
            
            // Global functions
            window.openProfessionalSearch = () => {
                window.open('./products-showcase.html', '_blank', 'noopener,noreferrer');
            };
            
            window.openSearchSafely = window.openProfessionalSearch;
            window.openShowcaseSearch = window.openProfessionalSearch;
        }
    };
    
    // Export globally
    window.ProfessionalSearch = ProfessionalSearch;
    
    // Global search functions (safe)
    window.openProfessionalSearch = function() {
        if (ProfessionalSearch.initialized) {
            ProfessionalSearch.openSearch();
        } else {
            console.log('🔍 Search not ready, opening products page');
            window.open('./products-showcase.html', '_blank', 'noopener,noreferrer');
        }
    };
    
    window.openSearchSafely = window.openProfessionalSearch;
    window.openShowcaseSearch = window.openProfessionalSearch;
    
    // Auto-initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => ProfessionalSearch.init(), 1000);
        });
    } else {
        setTimeout(() => ProfessionalSearch.init(), 1000);
    }
    
    console.log('✅ Professional Search System loaded and ready');
    
})();