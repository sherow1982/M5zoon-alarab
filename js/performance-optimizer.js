// محسن الأداء المتقدم - متجر هدايا الإمارات
// إصلاح أخطاء نحوية وتعارضات وتوافق مع السياسات الأمنية

(function(){
    'use strict';

    // تحسين تحميل الصور المتقدم
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
                }, { rootMargin: '50px 0px', threshold: 0.1 });
            }
            this.processImages();
            this.addImageOptimizations();
        }
        
        processImages() {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.loading = img.loading || 'lazy';
                img.decoding = img.decoding || 'async';
                if (this.observer) this.observer.observe(img);
            });
        }
        
        loadImage(img) {
            if (img.dataset && img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
            img.addEventListener('error', () => img.classList.add('loaded'), { once: true });
        }
        
        addImageOptimizations() {
            if (!document.querySelector('#image-optimizer-css')) {
                const style = document.createElement('style');
                style.id = 'image-optimizer-css';
                style.textContent = `
                    img { transition: opacity 0.3s ease; }
                    img:not(.loaded) { opacity: 0.7; background: linear-gradient(90deg,#f0f0f0,#e0e0e0,#f0f0f0); background-size:200% 100%; animation: shimmer 2s infinite; }
                    img.loaded { opacity: 1; }
                    @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // محسن الخطوط
    class FontOptimizer {
        init() {
            if (!document.querySelector('#font-optimizer-css')) {
                const style = document.createElement('style');
                style.id = 'font-optimizer-css';
                style.textContent = `*{text-rendering:optimizeLegibility} body{font-feature-settings:"kern" 1,"liga" 1,"calt" 1,"pnum" 1,"onum" 1}`;
                document.head.appendChild(style);
            }
        }
    }

    // Core Web Vitals محسن
    class CoreWebVitalsOptimizer {
        init() {
            this.inlineCriticalCSS();
            this.optimizeCLS();
            if ('PerformanceObserver' in window) {
                try {
                    new PerformanceObserver((list)=>{ 
                        const entries = list.getEntries(); 
                        const lastEntry = entries[entries.length - 1]; 
                        if(lastEntry) console.log(`🎯 LCP: ${(lastEntry.startTime/1000).toFixed(2)}s`); 
                    }).observe({type:'largest-contentful-paint', buffered:true});
                    
                    new PerformanceObserver((list)=>{ 
                        list.getEntries().forEach(entry => 
                            console.log(`⚡ FID: ${(entry.processingStart-entry.startTime).toFixed(2)}ms`)
                        ); 
                    }).observe({type:'first-input', buffered:true});
                    
                    new PerformanceObserver((list)=>{ 
                        let clsValue=0; 
                        list.getEntries().forEach(entry=>{ 
                            if(!entry.hadRecentInput) clsValue+=entry.value; 
                        }); 
                        console.log(`📐 CLS: ${clsValue.toFixed(4)}`); 
                    }).observe({type:'layout-shift', buffered:true});
                } catch(err) { 
                    console.warn('PerformanceObserver error:', err); 
                }
            }
        }
        
        inlineCriticalCSS() {
            if (!document.querySelector('#critical-css-inline')) {
                const style = document.createElement('style');
                style.id = 'critical-css-inline';
                style.textContent = `img{content-visibility:auto} .products-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px} .product-card{contain:layout style paint}`;
                document.head.insertBefore(style, document.head.firstChild);
            }
        }
        
        optimizeCLS() {
            const images = document.querySelectorAll('img:not([width]):not([height])');
            images.forEach(img => {
                if (!img.style.aspectRatio) {
                    img.style.aspectRatio = '1 / 1';
                    img.style.objectFit = 'cover';
                }
            });
            
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                if (!card.style.minHeight) {
                    card.style.minHeight = '400px';
                }
            });
        }
    }

    // محسن التفاعلية
    class InteractivityOptimizer {
        init() {
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('.btn-add-to-cart, .btn-add-cart');
                if (btn) {
                    e.preventDefault();
                    this.handleAddToCart(btn);
                }
            }, { passive: false });
            
            // تحسين أحداث التمرير
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => this.updateScrollElements(), 16);
            }, { passive: true });
        }
        
        handleAddToCart(btn) {
            try {
                const productData = btn.getAttribute('data-product');
                if (productData) {
                    const product = JSON.parse(productData);
                    if (typeof window.addToCart === 'function') {
                        window.addToCart(product);
                    } else {
                        console.warn('addToCart function not available');
                    }
                } else {
                    // البحث عن بيانات المنتج في البطاقة
                    const card = btn.closest('.product-card');
                    if (card) {
                        const title = card.querySelector('.product-title')?.textContent || '';
                        const price = card.querySelector('.current-price')?.textContent?.replace(/[^0-9.]/g, '') || '0';
                        const image = card.querySelector('.product-image')?.src || '';
                        
                        const productObj = {
                            id: card.getAttribute('data-product-id') || Date.now().toString(),
                            title: title,
                            price: price,
                            sale_price: price,
                            image_link: image
                        };
                        
                        if (typeof window.addToCart === 'function') {
                            window.addToCart(productObj);
                        }
                    }
                }
            } catch(err) { 
                console.error('خطأ في إضافة المنتج للسلة:', err);
                alert('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.');
            }
        }
        
        updateScrollElements() {
            const scrollTop = window.pageYOffset;
            const progressBar = document.getElementById('progressBar');
            const backToTop = document.getElementById('backToTop');
            const header = document.getElementById('header');
            
            if (progressBar) {
                const docHeight = document.documentElement.scrollHeight;
                const winHeight = window.innerHeight;
                const scrollPercent = scrollTop / (docHeight - winHeight);
                progressBar.style.width = `${Math.min(scrollPercent * 100, 100)}%`;
            }
            
            if (header) {
                header.classList.toggle('scrolled', scrollTop > 100);
            }
            
            if (backToTop) {
                backToTop.classList.toggle('show', scrollTop > 500);
            }
        }
    }

    // محسن الشبكة
    class NetworkOptimizer {
        init() {
            // إضافة DNS prefetch
            const domains = ['https://m5zoon.com', 'https://wa.me', 'https://fonts.googleapis.com'];
            domains.forEach(domain => {
                if (!document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'dns-prefetch';
                    link.href = domain;
                    document.head.appendChild(link);
                }
            });
        }
    }

    // المُهيِّئ الرئيسي
    function initPerformanceOptimizer() {
        try {
            console.log('🚀 بدء تشغيل محسن الأداء المتقدم...');
            
            new ImageOptimizer();
            new FontOptimizer().init();
            new CoreWebVitalsOptimizer().init();
            new InteractivityOptimizer().init();
            new NetworkOptimizer().init();
            
            console.log('✅ تم تشغيل جميع محسنات الأداء بنجاح');
            
            // إشارة للصفحة أن التحسينات جاهزة
            document.documentElement.classList.add('performance-optimized');
            
            // تقرير الأداء بعد 3 ثوانِ
            setTimeout(() => {
                if (performance.getEntriesByType) {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    if (navigation) {
                        console.log(`📊 وقت التحميل: ${(navigation.loadEventEnd / 1000).toFixed(2)}s`);
                    }
                }
            }, 3000);
            
        } catch (err) { 
            console.warn('خطأ في محسن الأداء:', err); 
        }
    }

    // تشغيل المحسن
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerformanceOptimizer);
    } else {
        initPerformanceOptimizer();
    }
    
    // تصدير للاستخدام الخارجي
    window.PerformanceOptimizers = {
        ImageOptimizer,
        FontOptimizer,
        CoreWebVitalsOptimizer,
        InteractivityOptimizer,
        NetworkOptimizer
    };
    
})();