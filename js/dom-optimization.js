// DOM Optimization System for Emirates Gifts Store
// Reduces DOM size, improves page speed, optimizes rendering performance

(function() {
    'use strict';
    
    console.log('🚀 DOM Optimization System Starting...');
    
    const DOMOptimizer = {
        metrics: {
            elementsOptimized: 0,
            unusedElementsRemoved: 0,
            cssRulesMinified: 0,
            imagesOptimized: 0,
            scriptsDeferred: 0,
            initialDOMSize: 0,
            finalDOMSize: 0
        },
        
        init() {
            this.metrics.initialDOMSize = document.querySelectorAll('*').length;
            console.log(`📊 Initial DOM size: ${this.metrics.initialDOMSize} elements`);
            
            this.optimizeImages();
            this.removeUnusedElements();
            this.optimizeCSS();
            this.deferNonCriticalScripts();
            this.addLazyLoading();
            this.optimizeEventListeners();
            
            setTimeout(() => {
                this.metrics.finalDOMSize = document.querySelectorAll('*').length;
                this.reportMetrics();
            }, 2000);
        },
        
        optimizeImages() {
            const images = document.querySelectorAll('img:not([data-optimized])');
            
            images.forEach((img, index) => {
                if (index < 4) {
                    img.loading = 'eager';
                    img.fetchPriority = 'high';
                } else {
                    img.loading = 'lazy';
                }
                
                img.decoding = 'async';
                
                if (!img.onerror) {
                    img.onerror = function() {
                        this.style.display = 'none';
                        this.parentElement?.classList.add('image-error');
                    };
                }
                
                img.setAttribute('data-optimized', 'true');
                this.metrics.imagesOptimized++;
            });
            
            console.log(`🖼️ Optimized ${this.metrics.imagesOptimized} images`);
        },
        
        removeUnusedElements() {
            const emptyElements = document.querySelectorAll('div:empty, span:empty, p:empty');
            emptyElements.forEach(element => {
                if (!element.classList.contains('keep') && !element.hasAttribute('data-keep')) {
                    element.remove();
                    this.metrics.unusedElementsRemoved++;
                }
            });
            
            console.log(`🧹 Removed ${this.metrics.unusedElementsRemoved} unused elements`);
        },
        
        optimizeCSS() {
            const criticalCSS = `
                <style id="critical-css">
                .header{position:fixed;top:0;width:100%;z-index:1000;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.1)}
                .hero{padding:120px 0 60px;background:linear-gradient(135deg,#f8f9ff,#fff);min-height:60vh}
                .btn-primary{background:linear-gradient(135deg,#D4AF37,#B8941F);color:#fff;padding:12px 24px;border:none;border-radius:25px}
                .products-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:25px;padding:20px 0}
                .product-card{background:#fff;border-radius:15px;box-shadow:0 8px 25px rgba(0,0,0,.1);transition:all .4s ease}
                </style>
            `;
            
            if (!document.getElementById('critical-css')) {
                document.head.insertAdjacentHTML('afterbegin', criticalCSS);
            }
        },
        
        deferNonCriticalScripts() {
            const scripts = document.querySelectorAll('script:not([data-critical]):not([defer])');
            
            scripts.forEach(script => {
                if (script.src && !script.hasAttribute('defer')) {
                    script.defer = true;
                    this.metrics.scriptsDeferred++;
                }
            });
            
            console.log(`📜 Deferred ${this.metrics.scriptsDeferred} scripts`);
        },
        
        addLazyLoading() {
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const target = entry.target;
                            
                            if (target.tagName === 'IMG' && target.dataset.src) {
                                target.src = target.dataset.src;
                                target.removeAttribute('data-src');
                                observer.unobserve(target);
                            }
                        }
                    });
                }, { rootMargin: '50px' });
                
                document.querySelectorAll('img[data-src]').forEach(element => {
                    observer.observe(element);
                });
            }
        },
        
        optimizeEventListeners() {
            const productGrids = document.querySelectorAll('.products-grid');
            
            productGrids.forEach(grid => {
                grid.addEventListener('click', (event) => {
                    const productCard = event.target.closest('.product-card');
                    if (productCard && !event.target.closest('button')) {
                        const productUrl = productCard.querySelector('a[href]')?.href;
                        if (productUrl) {
                            window.open(productUrl, '_blank');
                        }
                    }
                }, { passive: true });
            });
        },
        
        reportMetrics() {
            const improvement = ((this.metrics.initialDOMSize - this.metrics.finalDOMSize) / this.metrics.initialDOMSize * 100).toFixed(1);
            
            console.log('📈 DOM OPTIMIZATION COMPLETE:');
            console.log(`📊 DOM reduced: ${this.metrics.initialDOMSize} → ${this.metrics.finalDOMSize} (${improvement}% better)`);
            console.log(`🖼️ Images: ${this.metrics.imagesOptimized}`);
            console.log(`🧹 Removed: ${this.metrics.unusedElementsRemoved}`);
        }
    };
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => DOMOptimizer.init());
    } else {
        DOMOptimizer.init();
    }
    
    window.DOMOptimizer = DOMOptimizer;
    
})();