// DOM Optimization System for Faster Page Speed
// Reduces DOM complexity and improves loading performance

class DOMOptimizer {
    constructor() {
        this.observerConfig = {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        };
        
        this.lazyLoadConfig = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        
        this.isOptimized = false;
        this.initialize();
    }
    
    initialize() {
        console.log('Initializing DOM optimization system...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startOptimization());
        } else {
            this.startOptimization();
        }
    }
    
    startOptimization() {
        // Optimize existing DOM
        this.optimizeExistingDOM();
        
        // Setup lazy loading
        this.setupLazyLoading();
        
        // Setup virtual scrolling for long lists
        this.setupVirtualScrolling();
        
        // Optimize images
        this.optimizeImages();
        
        // Reduce reflows and repaints
        this.optimizeStyleCalculations();
        
        // Monitor performance
        this.setupPerformanceMonitoring();
        
        this.isOptimized = true;
        console.log('✅ DOM optimization completed');
    }
    
    optimizeExistingDOM() {
        console.log('Optimizing existing DOM elements...');
        
        // Remove unused elements
        this.removeUnusedElements();
        
        // Optimize CSS classes
        this.optimizeCSSClasses();
        
        // Combine similar elements
        this.combineSimilarElements();
        
        // Remove empty elements
        this.removeEmptyElements();
        
        console.log('📦 DOM structure optimized');
    }
    
    removeUnusedElements() {
        // Remove hidden elements that are not needed
        const hiddenElements = document.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"]');
        let removedCount = 0;
        
        hiddenElements.forEach(element => {
            // Keep essential elements like popups, modals
            if (!element.id || 
                (!element.id.includes('popup') && 
                 !element.id.includes('modal') && 
                 !element.id.includes('sidebar'))) {
                // Check if element has any important data
                if (!element.dataset.important && 
                    !element.classList.contains('important') &&
                    element.children.length === 0) {
                    element.remove();
                    removedCount++;
                }
            }
        });
        
        if (removedCount > 0) {
            console.log(`🧹 Removed ${removedCount} unused hidden elements`);
        }
    }
    
    optimizeCSSClasses() {
        // Optimize repetitive CSS classes
        const elements = document.querySelectorAll('*[class]');
        let optimizedCount = 0;
        
        elements.forEach(element => {
            const classes = Array.from(element.classList);
            const uniqueClasses = [...new Set(classes)];
            
            if (classes.length !== uniqueClasses.length) {
                element.className = uniqueClasses.join(' ');
                optimizedCount++;
            }
        });
        
        if (optimizedCount > 0) {
            console.log(`🎨 Optimized CSS classes on ${optimizedCount} elements`);
        }
    }
    
    combineSimilarElements() {
        // Combine consecutive similar elements to reduce DOM nodes
        const textElements = document.querySelectorAll('span, div, p');
        let combinedCount = 0;
        
        textElements.forEach(element => {
            const nextSibling = element.nextElementSibling;
            if (nextSibling && 
                nextSibling.tagName === element.tagName &&
                nextSibling.className === element.className &&
                element.textContent.trim() !== '' &&
                nextSibling.textContent.trim() !== '' &&
                element.children.length === 0 &&
                nextSibling.children.length === 0) {
                
                // Combine text content
                element.textContent += ' ' + nextSibling.textContent;
                nextSibling.remove();
                combinedCount++;
            }
        });
        
        if (combinedCount > 0) {
            console.log(`🔗 Combined ${combinedCount} similar elements`);
        }
    }
    
    removeEmptyElements() {
        const emptyElements = document.querySelectorAll('div:empty, span:empty, p:empty');
        let removedCount = 0;
        
        emptyElements.forEach(element => {
            // Don't remove elements with important attributes or classes
            if (!element.id && 
                !element.className.includes('loading') &&
                !element.className.includes('placeholder') &&
                !element.dataset.important) {
                element.remove();
                removedCount++;
            }
        });
        
        if (removedCount > 0) {
            console.log(`🗑️ Removed ${removedCount} empty elements`);
        }
    }
    
    setupLazyLoading() {
        console.log('Setting up advanced lazy loading...');
        
        // Enhanced image lazy loading
        const images = document.querySelectorAll('img:not([loading="eager"])');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            }, this.lazyLoadConfig);
            
            images.forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
                imageObserver.observe(img);
            });
            
            console.log(`🖼️ Set up lazy loading for ${images.length} images`);
        }
        
        // Lazy load for heavy content sections
        this.setupContentLazyLoading();
    }
    
    setupContentLazyLoading() {
        const heavySections = document.querySelectorAll('.products-grid, .collection-section, .info-section');
        
        if ('IntersectionObserver' in window) {
            const contentObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const section = entry.target;
                        section.classList.add('loaded');
                        
                        // Trigger any load functions for this section
                        if (section.dataset.loadFunction) {
                            const func = window[section.dataset.loadFunction];
                            if (typeof func === 'function') {
                                func();
                            }
                        }
                        
                        contentObserver.unobserve(section);
                    }
                });
            }, {
                root: null,
                rootMargin: '100px',
                threshold: 0.1
            });
            
            heavySections.forEach(section => {
                contentObserver.observe(section);
            });
            
            console.log(`📦 Set up content lazy loading for ${heavySections.length} sections`);
        }
    }
    
    setupVirtualScrolling() {
        // Virtual scrolling for large product lists
        const productGrids = document.querySelectorAll('.products-grid');
        
        productGrids.forEach(grid => {
            if (grid.children.length > 20) {
                this.implementVirtualScrolling(grid);
            }
        });
    }
    
    implementVirtualScrolling(container) {
        const items = Array.from(container.children);
        const itemHeight = 350; // Approximate product card height
        const containerHeight = container.clientHeight || window.innerHeight;
        const visibleItems = Math.ceil(containerHeight / itemHeight) + 5; // Buffer
        
        let startIndex = 0;
        let endIndex = Math.min(visibleItems, items.length);
        
        // Initially show only visible items
        const showVisibleItems = () => {
            items.forEach((item, index) => {
                if (index >= startIndex && index < endIndex) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        };
        
        // Setup scroll listener
        const handleScroll = this.debounce(() => {
            const scrollTop = window.pageYOffset;
            const containerTop = container.offsetTop;
            const newStartIndex = Math.max(0, Math.floor((scrollTop - containerTop) / itemHeight) - 2);
            const newEndIndex = Math.min(items.length, newStartIndex + visibleItems);
            
            if (newStartIndex !== startIndex || newEndIndex !== endIndex) {
                startIndex = newStartIndex;
                endIndex = newEndIndex;
                showVisibleItems();
            }
        }, 16); // ~60fps
        
        showVisibleItems();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', this.debounce(() => showVisibleItems(), 250));
        
        console.log(`📜 Virtual scrolling implemented for ${items.length} items`);
    }
    
    optimizeImages() {
        console.log('Optimizing images for better performance...');
        
        const images = document.querySelectorAll('img');
        let optimizedCount = 0;
        
        images.forEach(img => {
            // Add missing alt attributes
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', 'Emirates Gifts Product Image');
                optimizedCount++;
            }
            
            // Optimize image loading
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // Add error handling
            if (!img.dataset.errorHandled) {
                img.addEventListener('error', function() {
                    this.style.opacity = '0.7';
                    this.style.filter = 'grayscale(0.5)';
                    console.log('Image failed to load:', this.src);
                }, { once: true });
                img.dataset.errorHandled = 'true';
            }
        });
        
        console.log(`🖼️ Optimized ${images.length} images (${optimizedCount} missing alt attributes fixed)`);
    }
    
    optimizeStyleCalculations() {
        console.log('Optimizing style calculations...');
        
        // Batch DOM reads and writes
        this.batchDOMOperations();
        
        // Use CSS transforms instead of changing layout properties
        this.optimizeAnimations();
        
        // Debounce resize events
        this.optimizeResizeHandling();
    }
    
    batchDOMOperations() {
        // Create a system to batch DOM operations
        let pendingReads = [];
        let pendingWrites = [];
        let isFrameScheduled = false;
        
        const flushOperations = () => {
            // Perform all reads first
            pendingReads.forEach(operation => operation());
            pendingReads = [];
            
            // Then perform all writes
            pendingWrites.forEach(operation => operation());
            pendingWrites = [];
            
            isFrameScheduled = false;
        };
        
        const scheduleFrame = () => {
            if (!isFrameScheduled) {
                isFrameScheduled = true;
                requestAnimationFrame(flushOperations);
            }
        };
        
        // Export batching functions globally
        window.batchRead = (fn) => {
            pendingReads.push(fn);
            scheduleFrame();
        };
        
        window.batchWrite = (fn) => {
            pendingWrites.push(fn);
            scheduleFrame();
        };
        
        console.log('📊 DOM batching system activated');
    }
    
    optimizeAnimations() {
        // Use CSS transforms for animations instead of changing layout properties
        const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]');
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
            
            // Use transform instead of changing position properties
            if (element.style.left || element.style.top) {
                const left = parseFloat(element.style.left) || 0;
                const top = parseFloat(element.style.top) || 0;
                
                element.style.left = '';
                element.style.top = '';
                element.style.transform = `translate(${left}px, ${top}px)`;
            }
        });
        
        console.log(`🎭 Optimized animations for ${animatedElements.length} elements`);
    }
    
    optimizeResizeHandling() {
        // Debounce resize events to prevent excessive recalculations
        let resizeTimeout;
        const originalResize = window.onresize;
        
        window.addEventListener('resize', this.debounce(() => {
            // Batch resize operations
            window.batchRead(() => {
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;
                
                // Store dimensions for other operations
                document.documentElement.style.setProperty('--viewport-width', windowWidth + 'px');
                document.documentElement.style.setProperty('--viewport-height', windowHeight + 'px');
            });
            
            window.batchWrite(() => {
                // Trigger any resize-dependent operations
                if (originalResize) originalResize();
                
                // Dispatch custom optimized resize event
                window.dispatchEvent(new CustomEvent('optimizedResize', {
                    detail: {
                        width: window.innerWidth,
                        height: window.innerHeight
                    }
                }));
            });
        }, 150), { passive: true });
        
        console.log('📐 Optimized resize handling');
    }
    
    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.entryType === 'measure') {
                        console.log(`⚡ Performance: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
            
            // Monitor DOM operations
            performance.mark('dom-optimization-start');
            
            setTimeout(() => {
                performance.mark('dom-optimization-end');
                performance.measure('dom-optimization', 'dom-optimization-start', 'dom-optimization-end');
            }, 2000);
        }
        
        // Monitor First Contentful Paint
        this.monitorCoreWebVitals();
    }
    
    monitorCoreWebVitals() {
        // Monitor Core Web Vitals for performance insights
        if ('web-vitals' in window || typeof getCLS !== 'undefined') {
            console.log('📊 Core Web Vitals monitoring active');
        }
        
        // Simple FCP monitoring
        if ('PerformanceObserver' in window) {
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.name === 'first-contentful-paint') {
                        console.log(`🎯 First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
                        fcpObserver.disconnect();
                    }
                });
            });
            
            fcpObserver.observe({ entryTypes: ['paint'] });
        }
    }
    
    setupLazyLoading() {
        // Advanced lazy loading for content sections
        const lazyElements = document.querySelectorAll('[data-lazy], .lazy-load');
        
        if ('IntersectionObserver' in window && lazyElements.length > 0) {
            const lazyObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        
                        // Load lazy content
                        if (element.dataset.lazy) {
                            this.loadLazyContent(element);
                        }
                        
                        element.classList.remove('lazy-load');
                        element.classList.add('loaded');
                        lazyObserver.unobserve(element);
                    }
                });
            }, this.lazyLoadConfig);
            
            lazyElements.forEach(element => {
                lazyObserver.observe(element);
            });
            
            console.log(`⏳ Set up lazy loading for ${lazyElements.length} elements`);
        }
    }
    
    loadLazyContent(element) {
        const contentType = element.dataset.lazy;
        
        switch (contentType) {
            case 'products':
                // Load products for this section
                if (element.id && window[element.id + 'Loader']) {
                    window[element.id + 'Loader']();
                }
                break;
                
            case 'reviews':
                // Load reviews
                if (window.loadReviewsForSection) {
                    window.loadReviewsForSection(element);
                }
                break;
                
            case 'content':
                // Load dynamic content
                if (element.dataset.url) {
                    fetch(element.dataset.url)
                        .then(response => response.text())
                        .then(html => {
                            element.innerHTML = html;
                        })
                        .catch(error => {
                            console.error('Failed to load lazy content:', error);
                            element.innerHTML = '<p>Content temporarily unavailable</p>';
                        });
                }
                break;
        }
    }
    
    // Optimize specific operations
    optimizeProductLoading() {
        // Reduce the number of products loaded initially
        const productGrids = document.querySelectorAll('.products-grid');
        
        productGrids.forEach(grid => {
            const products = grid.querySelectorAll('.product-card');
            if (products.length > 12) {
                // Hide products beyond the first 12
                for (let i = 12; i < products.length; i++) {
                    products[i].style.display = 'none';
                    products[i].dataset.hidden = 'true';
                }
                
                // Add "Load More" functionality
                this.addLoadMoreButton(grid);
            }
        });
    }
    
    addLoadMoreButton(grid) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Products';
        loadMoreBtn.style.cssText = `
            display: block;
            margin: 20px auto;
            padding: 12px 24px;
            background: linear-gradient(135deg, #D4AF37, #B8941F);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        `;
        
        loadMoreBtn.addEventListener('click', () => {
            const hiddenProducts = grid.querySelectorAll('[data-hidden="true"]');
            const showCount = Math.min(6, hiddenProducts.length);
            
            for (let i = 0; i < showCount; i++) {
                hiddenProducts[i].style.display = '';
                hiddenProducts[i].removeAttribute('data-hidden');
            }
            
            if (grid.querySelectorAll('[data-hidden="true"]').length === 0) {
                loadMoreBtn.remove();
            }
        });
        
        grid.parentNode.insertBefore(loadMoreBtn, grid.nextSibling);
    }
    
    // Utility functions
    debounce(func, wait) {
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
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Performance reporting
    getPerformanceReport() {
        if ('performance' in window && performance.getEntriesByType) {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                return {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    firstByte: navigation.responseStart - navigation.requestStart,
                    domProcessing: navigation.domComplete - navigation.domLoading
                };
            }
        }
        return null;
    }
    
    // Method to enable/disable optimization
    toggleOptimization(enabled) {
        if (enabled && !this.isOptimized) {
            this.startOptimization();
        } else if (!enabled && this.isOptimized) {
            // Disable optimizations
            this.isOptimized = false;
            console.log('❌ DOM optimization disabled');
        }
    }
}

// Create global instance
const domOptimizer = new DOMOptimizer();

// Export for external access
window.domOptimizer = domOptimizer;

// Monitor page load time
window.addEventListener('load', () => {
    setTimeout(() => {
        const report = domOptimizer.getPerformanceReport();
        if (report) {
            console.log('📊 Performance Report:', report);
        }
        
        // Final optimization pass
        domOptimizer.optimizeProductLoading();
        
        console.log('🚀 Page fully optimized for speed');
    }, 1000);
});

console.log('⚡ DOM Optimization System Loaded');
console.log('🔧 Features: Lazy loading, virtual scrolling, image optimization, batched operations');
console.log('📈 Goal: Reduced DOM size, faster rendering, improved Core Web Vitals');