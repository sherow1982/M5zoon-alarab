// محسن الأداء المتقدم - متجر هدايا الإمارات
// نسخة مصححة ومحسّنة بدون أخطاء نحوية

(function() {
    'use strict';

    // محسن الصور المتقدم
    class ImageOptimizer {
        constructor() {
            this.observer = null;
            this.init();
        }
        
        init() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadImage(entry.target);
                            this.observer.unobserve(entry.target);
                        }
                    });
                }, { 
                    rootMargin: '50px 0px', 
                    threshold: 0.1 
                });
            }
            
            this.processImages();
            this.addImageOptimizations();
        }
        
        processImages() {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (!img.hasAttribute('loading')) {
                    img.setAttribute('loading', 'lazy');
                }
                if (!img.hasAttribute('decoding')) {
                    img.setAttribute('decoding', 'async');
                }
                if (this.observer) {
                    this.observer.observe(img);
                }
            });
        }
        
        loadImage(img) {
            if (img.dataset && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            
            const onLoad = () => {
                img.classList.add('loaded');
                img.removeEventListener('load', onLoad);
                img.removeEventListener('error', onLoad);
            };
            
            img.addEventListener('load', onLoad, { once: true });
            img.addEventListener('error', onLoad, { once: true });
        }
        
        addImageOptimizations() {
            if (!document.querySelector('#image-optimizer-css')) {
                const style = document.createElement('style');
                style.id = 'image-optimizer-css';
                style.textContent = `
                    img {
                        transition: opacity 0.3s ease;
                    }
                    img:not(.loaded) {
                        opacity: 0.7;
                        background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
                        background-size: 200% 100%;
                        animation: imageShimmer 2s infinite;
                    }
                    img.loaded {
                        opacity: 1;
                    }
                    @keyframes imageShimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // محسن الخطوط
    class FontOptimizer {
        init() {
            this.optimizeFontDisplay();
            this.addFontOptimizations();
        }
        
        optimizeFontDisplay() {
            const fontLinks = document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis"]');
            fontLinks.forEach(link => {
                if (link.href.indexOf('display=swap') === -1) {
                    link.href += (link.href.indexOf('?') > -1 ? '&' : '?') + 'display=swap';
                }
            });
        }
        
        addFontOptimizations() {
            if (!document.querySelector('#font-optimizer-css')) {
                const style = document.createElement('style');
                style.id = 'font-optimizer-css';
                style.textContent = `
                    * {
                        font-display: swap;
                        text-rendering: optimizeLegibility;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }
                    body {
                        font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // محسن Core Web Vitals
    class CoreWebVitalsOptimizer {
        constructor() {
            this.metrics = {};
        }
        
        init() {
            this.inlineCriticalCSS();
            this.optimizeCLS();
            this.optimizeLCP();
            this.monitorPerformance();
        }
        
        inlineCriticalCSS() {
            if (!document.querySelector('#critical-css-inline')) {
                const style = document.createElement('style');
                style.id = 'critical-css-inline';
                style.textContent = `
                    img {
                        content-visibility: auto;
                        contain-intrinsic-size: 300px 300px;
                    }
                    .products-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                        gap: 25px;
                    }
                    .product-card {
                        contain: layout style paint;
                        will-change: transform;
                    }
                `;
                document.head.insertBefore(style, document.head.firstChild);
            }
        }
        
        optimizeCLS() {
            // منع Layout Shift للصور
            const images = document.querySelectorAll('img:not([width]):not([height])');
            images.forEach(img => {
                if (!img.style.aspectRatio && !img.width && !img.height) {
                    img.style.aspectRatio = '1 / 1';
                    img.style.objectFit = 'cover';
                }
            });
            
            // منع CLS لبطاقات المنتجات
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                if (!card.style.minHeight) {
                    card.style.minHeight = '420px';
                }
            });
        }
        
        optimizeLCP() {
            // تحسين أكبر عنصر قابل للعرض
            const heroImages = document.querySelectorAll('.hero-image, .product-image:first-of-type');
            heroImages.forEach(img => {
                img.setAttribute('fetchpriority', 'high');
                img.removeAttribute('loading'); // إزالة lazy loading من الصور المهمة
            });
        }
        
        monitorPerformance() {
            if ('PerformanceObserver' in window) {
                try {
                    // مراقبة LCP
                    const lcpObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        if (lastEntry) {
                            this.metrics.LCP = lastEntry.startTime;
                            console.log(`🎯 LCP: ${(lastEntry.startTime / 1000).toFixed(2)}s`);
                        }
                    });
                    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
                    
                    // مراقبة FID
                    const fidObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            const fid = entry.processingStart - entry.startTime;
                            this.metrics.FID = fid;
                            console.log(`⚡ FID: ${fid.toFixed(2)}ms`);
                        });
                    });
                    fidObserver.observe({ type: 'first-input', buffered: true });
                    
                    // مراقبة CLS
                    const clsObserver = new PerformanceObserver((list) => {
                        let clsValue = 0;
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            if (!entry.hadRecentInput) {
                                clsValue += entry.value;
                            }
                        });
                        this.metrics.CLS = clsValue;
                        console.log(`📐 CLS: ${clsValue.toFixed(4)}`);
                    });
                    clsObserver.observe({ type: 'layout-shift', buffered: true });
                    
                } catch (error) {
                    console.warn('خطأ في PerformanceObserver:', error);
                }
            }
        }
    }

    // محسن التفاعلية
    class InteractivityOptimizer {
        init() {
            this.optimizeClickEvents();
            this.optimizeScrollEvents();
        }
        
        optimizeClickEvents() {
            // معالجة عامة لجميع أزرار السلة
            document.addEventListener('click', (e) => {
                const addButton = e.target.closest('.btn-add-to-cart, .btn-add-cart');
                if (addButton && !addButton.disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.handleAddToCart(addButton);
                }
            }, { passive: false });
        }
        
        handleAddToCart(button) {
            try {
                // استخراج بيانات المنتج
                let productData = null;
                const dataProduct = button.getAttribute('data-product');
                
                if (dataProduct) {
                    productData = JSON.parse(dataProduct);
                } else {
                    // استخراج بيانات من البطاقة
                    const card = button.closest('.product-card');
                    if (card) {
                        const title = card.querySelector('.product-title')?.textContent?.trim();
                        const priceEl = card.querySelector('.current-price, .sale-price');
                        const price = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '0';
                        const image = card.querySelector('.product-image, img')?.src;
                        const productId = card.getAttribute('data-product-id') || Date.now().toString();
                        
                        productData = {
                            id: productId,
                            title: title || 'منتج',
                            price: price,
                            sale_price: price,
                            image_link: image || '',
                            image: image || ''
                        };
                    }
                }
                
                if (productData && window.addToCart) {
                    window.addToCart(productData);
                } else if (window.CartSystem && window.CartSystem.addToCart) {
                    window.CartSystem.addToCart(productData);
                } else {
                    console.warn('No cart system available');
                    alert('عذراً، نظام السلة غير متاح. يرجى إعادة تحميل الصفحة.');
                }
                
            } catch (error) {
                console.error('خطأ في معالجة زر السلة:', error);
            }
        }
        
        optimizeScrollEvents() {
            let scrollTimeout;
            const updateScrollElements = () => {
                const scrollTop = window.pageYOffset;
                const progressBar = document.getElementById('progressBar');
                const backToTop = document.getElementById('backToTop');
                const header = document.getElementById('header');
                
                // شريط التقدم
                if (progressBar) {
                    const docHeight = document.documentElement.scrollHeight;
                    const winHeight = window.innerHeight;
                    const scrollPercent = scrollTop / (docHeight - winHeight);
                    progressBar.style.width = Math.min(scrollPercent * 100, 100) + '%';
                }
                
                // هيدر متغير
                if (header) {
                    if (scrollTop > 100) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }
                
                // زر العودة للأعلى
                if (backToTop) {
                    if (scrollTop > 500) {
                        backToTop.classList.add('show');
                    } else {
                        backToTop.classList.remove('show');
                    }
                }
            };
            
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(updateScrollElements, 16); // ~60fps
            }, { passive: true });
        }
    }

    // محسن الشبكة
    class NetworkOptimizer {
        init() {
            this.addDNSPrefetch();
            this.optimizeResourceHints();
        }
        
        addDNSPrefetch() {
            const domains = [
                'https://m5zoon.com',
                'https://wa.me',
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
                'https://cdnjs.cloudflare.com'
            ];
            
            domains.forEach(domain => {
                const existing = document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`);
                if (!existing) {
                    const link = document.createElement('link');
                    link.rel = 'dns-prefetch';
                    link.href = domain;
                    document.head.appendChild(link);
                }
            });
        }
        
        optimizeResourceHints() {
            // preconnect للموارد المهمة
            const preconnectDomains = ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'];
            
            preconnectDomains.forEach(domain => {
                const existing = document.querySelector(`link[href="${domain}"][rel="preconnect"]`);
                if (!existing) {
                    const link = document.createElement('link');
                    link.rel = 'preconnect';
                    link.href = domain;
                    link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                }
            });
        }
    }

    // محسن الذاكرة
    class MemoryOptimizer {
        init() {
            // تنظيف الذاكرة بشكل دوري
            setInterval(() => {
                this.cleanupMemory();
            }, 300000); // كل 5 دقائق
        }
        
        cleanupMemory() {
            // إزالة العناصر المؤقتة
            const notifications = document.querySelectorAll('.success-notification, .cart-notification');
            notifications.forEach(notification => {
                if (notification.parentNode) {
                    notification.remove();
                }
            });
            
            // تنظيف localStorage من البيانات القديمة
            try {
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.includes('temp-') || key.includes('cache-')) {
                        const data = localStorage.getItem(key);
                        if (data) {
                            const parsed = JSON.parse(data);
                            if (parsed.expiry && Date.now() > parsed.expiry) {
                                localStorage.removeItem(key);
                            }
                        }
                    }
                });
            } catch (error) {
                console.warn('خطأ في تنظيف الذاكرة:', error);
            }
        }
    }

    // المُهيِّئ الرئيسي
    function initPerformanceOptimizer() {
        console.log('🚀 بدء تشغيل محسن الأداء المتقدم...');
        
        try {
            const imageOptimizer = new ImageOptimizer();
            const fontOptimizer = new FontOptimizer();
            const coreWebVitalsOptimizer = new CoreWebVitalsOptimizer();
            const interactivityOptimizer = new InteractivityOptimizer();
            const networkOptimizer = new NetworkOptimizer();
            const memoryOptimizer = new MemoryOptimizer();
            
            fontOptimizer.init();
            coreWebVitalsOptimizer.init();
            interactivityOptimizer.init();
            networkOptimizer.init();
            memoryOptimizer.init();
            
            console.log('✅ تم تشغيل جميع محسنات الأداء بنجاح');
            
            // علامة على أن التحسينات مفعّلة
            document.documentElement.classList.add('performance-optimized');
            
            // تقرير الأداء بعد 3 ثواني
            setTimeout(() => {
                if (performance.getEntriesByType) {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation && navigation.loadEventEnd) {
                        console.log(`📊 وقت التحميل الكامل: ${(navigation.loadEventEnd / 1000).toFixed(2)}s`);
                    }
                    
                    const paintEntries = performance.getEntriesByType('paint');
                    paintEntries.forEach(entry => {
                        console.log(`🎨 ${entry.name}: ${(entry.startTime / 1000).toFixed(2)}s`);
                    });
                }
            }, 3000);
            
        } catch (error) { 
            console.warn('خطأ في تهيئة محسن الأداء:', error); 
        }
    }

    // تشغيل المحسن
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerformanceOptimizer);
    } else {
        initPerformanceOptimizer();
    }
    
    // تصدير للاستخدام الخارجي
    if (typeof window !== 'undefined') {
        window.PerformanceOptimizers = {
            ImageOptimizer,
            FontOptimizer,
            CoreWebVitalsOptimizer,
            InteractivityOptimizer,
            NetworkOptimizer,
            MemoryOptimizer
        };
    }
    
})();