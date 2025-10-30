// محسن الأداء المتقدم - متجر هدايا الإمارات
// يحل جميع مشاكل PageSpeed Insights ويحسن Core Web Vitals

// تحسين تحميل الصور المتقدم
class ImageOptimizer {
    constructor() {
        this.imageQueue = [];
        this.isProcessing = false;
        this.observer = null;
        this.init();
    }
    
    init() {
        // تحسين تحميل الصور بـ Intersection Observer
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
            
            this.processImages();
        }
        
        // تطبيق تحسينات إضافية للصور
        this.addImageOptimizations();
    }
    
    processImages() {
        // معالجة جميع الصور في الموقع
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // إضافة lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // إضافة decoding async
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }
            
            // تحسين الأبعاد للـ CLS
            if (!img.style.aspectRatio && img.naturalWidth && img.naturalHeight) {
                img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
            }
            
            // مراقبة الصورة
            if (this.observer) {
                this.observer.observe(img);
            }
        });
    }
    
    loadImage(img) {
        return new Promise((resolve, reject) => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            
            img.onload = () => {
                img.classList.add('loaded');
                resolve();
            };
            
            img.onerror = reject;
        });
    }
    
    addImageOptimizations() {
        // إضافة CSS للانتقالات السلسة
        if (!document.querySelector('#image-optimizer-css')) {
            const css = `
                <style id="image-optimizer-css">
                img {
                    transition: opacity 0.3s ease;
                }
                img:not(.loaded) {
                    opacity: 0.7;
                    background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
                img.loaded {
                    opacity: 1;
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', css);
        }
    }
}

// محسن الخطوط والنصوص
class FontOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // تحميل الخطوط بشكل محسن
        this.optimizeFonts();
        
        // تحسين عرض النصوص
        this.optimizeTextRendering();
    }
    
    optimizeFonts() {
        // إضافة preload للخطوط المهمة
        const fontPreloads = [
            { href: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvalIhTp2Yn6YqUmoNEg.woff2', type: 'woff2' },
            { href: 'https://fonts.gstatic.com/s/nototajarabic/v24/CdCrD8CFnNOoFOK7FvUUO-kqFqDOEfS3gvgWLgjlKqk.woff2', type: 'woff2' }
        ];
        
        fontPreloads.forEach(font => {
            if (!document.querySelector(`link[href="${font.href}"]`)) {
                const link = document.createElement('link');\n                link.rel = 'preload';\n                link.href = font.href;\n                link.as = 'font';\n                link.type = `font/${font.type}`;\n                link.crossOrigin = 'anonymous';\n                document.head.appendChild(link);\n            }\n        });\n    }\n    \n    optimizeTextRendering() {\n        // إضافة CSS لتحسين عرض النصوص\n        if (!document.querySelector('#font-optimizer-css')) {\n            const css = `\n                <style id="font-optimizer-css">\n                * {\n                    font-display: swap;\n                    text-rendering: optimizeLegibility;\n                }\n                body {\n                    font-feature-settings: \"kern\" 1, \"liga\" 1, \"calt\" 1, \"pnum\" 1, \"tnum\" 0, \"onum\" 1, \"lnum\" 0, \"dlig\" 0;\n                }\n                </style>\n            `;\n            document.head.insertAdjacentHTML('beforeend', css);\n        }\n    }\n}\n\n// محسن شبكة التوصيل (CDN)\nclass CDNOptimizer {\n    constructor() {\n        this.init();\n    }\n    \n    init() {\n        // إضافة DNS prefetch للموارد الخارجية\n        this.addDNSPrefetch();\n        \n        // تحسين تحميل الموارد الخارجية\n        this.optimizeExternalResources();\n    }\n    \n    addDNSPrefetch() {\n        const domains = [\n            'https://m5zoon.com',\n            'https://wa.me',\n            'https://fonts.googleapis.com',\n            'https://fonts.gstatic.com'\n        ];\n        \n        domains.forEach(domain => {\n            if (!document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`)) {\n                const link = document.createElement('link');\n                link.rel = 'dns-prefetch';\n                link.href = domain;\n                document.head.appendChild(link);\n            }\n        });\n    }\n    \n    optimizeExternalResources() {\n        // تحسين تحميل الموارد الخارجية\n        const externalImages = document.querySelectorAll('img[src*="m5zoon.com"]');\n        externalImages.forEach(img => {\n            // إضافة كروس أوريجن للصور الخارجية\n            if (!img.hasAttribute('crossorigin')) {\n                img.setAttribute('crossorigin', 'anonymous');\n            }\n            \n            // إضافة referrerpolicy\n            if (!img.hasAttribute('referrerpolicy')) {\n                img.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');\n            }\n        });\n    }\n}\n\n// محسن Core Web Vitals المتقدم\nclass CoreWebVitalsOptimizer {\n    constructor() {\n        this.metrics = {};\n        this.init();\n    }\n    \n    init() {\n        // تحسين LCP (Largest Contentful Paint)\n        this.optimizeLCP();\n        \n        // تحسين CLS (Cumulative Layout Shift)\n        this.optimizeCLS();\n        \n        // تحسين FID (First Input Delay)\n        this.optimizeFID();\n        \n        // مراقبة الأداء\n        this.monitorPerformance();\n    }\n    \n    optimizeLCP() {\n        // تحسين أكبر عنصر قابل للعرض\n        const heroElements = document.querySelectorAll('h1, .hero-image, .product-image:first-of-type');\n        heroElements.forEach(element => {\n            if (element.tagName === 'IMG') {\n                element.setAttribute('fetchpriority', 'high');\n                element.removeAttribute('loading'); // إزالة lazy loading من الصور المهمة\n            }\n        });\n        \n        // تحسين Critical CSS\n        this.inlineCriticalCSS();\n    }\n    \n    optimizeCLS() {\n        // منع Layout Shift للصور\n        const images = document.querySelectorAll('img:not([width]):not([height])');\n        images.forEach(img => {\n            // إضافة أبعاد افتراضية لمنع CLS\n            if (!img.style.aspectRatio) {\n                img.style.aspectRatio = '1 / 1'; // نسبة افتراضية\n                img.style.objectFit = 'cover';\n            }\n        });\n        \n        // تحسين البطاقات لمنع CLS\n        const cards = document.querySelectorAll('.product-card');\n        cards.forEach(card => {\n            if (!card.style.minHeight) {\n                card.style.minHeight = '400px'; // ارتفاع ثابت للبطاقات\n            }\n        });\n    }\n    \n    optimizeFID() {\n        // تأخير JavaScript غير المهم\n        this.deferNonCriticalJS();\n        \n        // تقسيم المهام الطويلة\n        this.breakLongTasks();\n    }\n    \n    inlineCriticalCSS() {\n        const criticalCSS = `\n            /* Critical CSS محسن */\n            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }\n            .product-card { contain: layout style paint; }\n            img { content-visibility: auto; }\n            .products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }\n        `;\n        \n        if (!document.querySelector('#critical-css-inline')) {\n            const style = document.createElement('style');\n            style.id = 'critical-css-inline';\n            style.textContent = criticalCSS;\n            document.head.insertBefore(style, document.head.firstChild);\n        }\n    }\n    \n    deferNonCriticalJS() {\n        // تأخير تحميل JavaScript غير الضروري\n        const scripts = document.querySelectorAll('script:not([async]):not([defer])');\n        scripts.forEach(script => {\n            if (!script.src.includes('reviews-system') && !script.src.includes('cart-system')) {\n                script.defer = true;\n            }\n        });\n    }\n    \n    breakLongTasks() {\n        // تقسيم المهام الطويلة باستخدام requestIdleCallback\n        const scheduleTask = (task) => {\n            if ('requestIdleCallback' in window) {\n                requestIdleCallback(task, { timeout: 1000 });\n            } else {\n                setTimeout(task, 0);\n            }\n        };\n        \n        window.scheduleDeferredTask = scheduleTask;\n    }\n    \n    monitorPerformance() {\n        // مراقبة Core Web Vitals\n        if ('PerformanceObserver' in window) {\n            // مراقبة LCP\n            new PerformanceObserver((list) => {\n                const entries = list.getEntries();\n                const lastEntry = entries[entries.length - 1];\n                this.metrics.LCP = lastEntry.startTime;\n                console.log(`🎯 LCP: ${(lastEntry.startTime / 1000).toFixed(2)}s`);\n            }).observe({ type: 'largest-contentful-paint', buffered: true });\n            \n            // مراقبة FID\n            new PerformanceObserver((list) => {\n                const entries = list.getEntries();\n                entries.forEach(entry => {\n                    this.metrics.FID = entry.processingStart - entry.startTime;\n                    console.log(`⚡ FID: ${this.metrics.FID.toFixed(2)}ms`);\n                });\n            }).observe({ type: 'first-input', buffered: true });\n            \n            // مراقبة CLS\n            new PerformanceObserver((list) => {\n                let clsValue = 0;\n                list.getEntries().forEach(entry => {\n                    if (!entry.hadRecentInput) {\n                        clsValue += entry.value;\n                    }\n                });\n                this.metrics.CLS = clsValue;\n                console.log(`📐 CLS: ${clsValue.toFixed(4)}`);\n            }).observe({ type: 'layout-shift', buffered: true });\n        }\n    }\n}\n\n// محسن الموارد والتخزين المؤقت\nclass ResourceOptimizer {\n    constructor() {\n        this.init();\n    }\n    \n    init() {\n        // تحسين Service Worker للتخزين المؤقت\n        this.registerServiceWorker();\n        \n        // تحسين تحميل المورد\n        this.optimizeResourceLoading();\n        \n        // ضغط البيانات\n        this.enableDataCompression();\n    }\n    \n    registerServiceWorker() {\n        if ('serviceWorker' in navigator) {\n            // إنشاء Service Worker بسيط للتخزين المؤقت\n            const swCode = `\n                const CACHE_NAME = 'emirates-gifts-v1';\n                const urlsToCache = [\n                    './',\n                    './woodmart-lite.css',\n                    './js/reviews-system.js',\n                    './js/cart-system.js',\n                    './js/main.js'\n                ];\n                \n                self.addEventListener('install', (event) => {\n                    event.waitUntil(\n                        caches.open(CACHE_NAME)\n                            .then((cache) => cache.addAll(urlsToCache))\n                    );\n                });\n                \n                self.addEventListener('fetch', (event) => {\n                    event.respondWith(\n                        caches.match(event.request)\n                            .then((response) => response || fetch(event.request))\n                    );\n                });\n            `;\n            \n            const blob = new Blob([swCode], { type: 'application/javascript' });\n            const swUrl = URL.createObjectURL(blob);\n            \n            navigator.serviceWorker.register(swUrl)\n                .then(() => console.log('✅ Service Worker registered successfully'))\n                .catch(error => console.log('❌ Service Worker registration failed:', error));\n        }\n    }\n    \n    optimizeResourceLoading() {\n        // تحميل الموارد المهمة بأولوية عالية\n        const criticalResources = [\n            './woodmart-lite.css',\n            './js/reviews-system.js'\n        ];\n        \n        criticalResources.forEach(resource => {\n            const link = document.createElement('link');\n            link.rel = 'preload';\n            link.href = resource;\n            link.as = resource.endsWith('.css') ? 'style' : 'script';\n            document.head.appendChild(link);\n        });\n    }\n    \n    enableDataCompression() {\n        // تحسين طلبات AJAX\n        const originalFetch = window.fetch;\n        window.fetch = function(...args) {\n            const [resource, config = {}] = args;\n            \n            // إضافة ضغط للطلبات\n            config.headers = {\n                ...config.headers,\n                'Accept-Encoding': 'gzip, deflate, br'\n            };\n            \n            return originalFetch(resource, config);\n        };\n    }\n}\n\n// محسن التفاعلية والاستجابة\nclass InteractivityOptimizer {\n    constructor() {\n        this.init();\n    }\n    \n    init() {\n        // تحسين أحداث النقر\n        this.optimizeClickEvents();\n        \n        // تحسين التمرير\n        this.optimizeScrollEvents();\n        \n        // تحسين أحداث اللمس\n        this.optimizeTouchEvents();\n    }\n    \n    optimizeClickEvents() {\n        // استخدام passive event listeners\n        document.addEventListener('click', (e) => {\n            // تحسين معالجة النقرات\n            if (e.target.classList.contains('btn-add-to-cart')) {\n                e.preventDefault();\n                this.handleAddToCartOptimized(e.target);\n            }\n        }, { passive: false });\n    }\n    \n    optimizeScrollEvents() {\n        // تحسين أحداث التمرير باستخدام throttling\n        let scrollTimeout;\n        const optimizedScrollHandler = () => {\n            // منطق التمرير المحسن\n            const scrollTop = window.pageYOffset;\n            const docHeight = document.documentElement.scrollHeight;\n            const winHeight = window.innerHeight;\n            const scrollPercent = scrollTop / (docHeight - winHeight);\n            \n            // تحديث شريط التقدم إذا وجد\n            const progressBar = document.querySelector('.scroll-progress');\n            if (progressBar) {\n                progressBar.style.width = `${scrollPercent * 100}%`;\n            }\n        };\n        \n        window.addEventListener('scroll', () => {\n            clearTimeout(scrollTimeout);\n            scrollTimeout = setTimeout(optimizedScrollHandler, 16); // 60fps\n        }, { passive: true });\n    }\n    \n    optimizeTouchEvents() {\n        // تحسين أحداث اللمس للهواتف\n        document.addEventListener('touchstart', (e) => {\n            // تحسين استجابة اللمس\n            if (e.target.classList.contains('product-card')) {\n                e.target.style.transform = 'scale(0.98)';\n            }\n        }, { passive: true });\n        \n        document.addEventListener('touchend', (e) => {\n            if (e.target.classList.contains('product-card')) {\n                e.target.style.transform = 'scale(1)';\n            }\n        }, { passive: true });\n    }\n    \n    handleAddToCartOptimized(button) {\n        // معالجة محسنة لإضافة المنتجات للسلة\n        return new Promise((resolve) => {\n            const productData = JSON.parse(button.getAttribute('data-product'));\n            const ratingData = JSON.parse(button.getAttribute('data-rating') || '{}');\n            \n            // استخدام requestAnimationFrame للتحديثات السلسة\n            requestAnimationFrame(() => {\n                if (window.EmiratesGiftsStore && window.EmiratesGiftsStore.addToCart) {\n                    window.EmiratesGiftsStore.addToCart(productData, ratingData);\n                }\n                resolve();\n            });\n        });\n    }\n}\n\n// محسن الشبكة والاتصال\nclass NetworkOptimizer {\n    constructor() {\n        this.connectionType = 'unknown';\n        this.init();\n    }\n    \n    init() {\n        // تحديد نوع الاتصال\n        this.detectConnection();\n        \n        // تحسين الطلبات حسب الاتصال\n        this.optimizeForConnection();\n    }\n    \n    detectConnection() {\n        if ('connection' in navigator) {\n            this.connectionType = navigator.connection.effectiveType;\n            console.log(`📡 نوع الاتصال: ${this.connectionType}`);\n            \n            // مراقبة تغييرات الاتصال\n            navigator.connection.addEventListener('change', () => {\n                this.connectionType = navigator.connection.effectiveType;\n                this.optimizeForConnection();\n            });\n        }\n    }\n    \n    optimizeForConnection() {\n        // تحسين المحتوى حسب سرعة الاتصال\n        if (this.connectionType === 'slow-2g' || this.connectionType === '2g') {\n            // تحسينات للاتصالات البطيئة\n            this.enableDataSaver();\n        } else if (this.connectionType === '4g') {\n            // تحسينات للاتصالات السريعة\n            this.enableHighQualityMode();\n        }\n    }\n    \n    enableDataSaver() {\n        // تقليل جودة الصور للاتصالات البطيئة\n        document.documentElement.classList.add('data-saver-mode');\n        \n        // CSS للوضع الاقتصادي\n        const dataSaverCSS = `\n            <style>\n            .data-saver-mode img {\n                filter: contrast(0.9) brightness(0.9);\n            }\n            .data-saver-mode .product-card {\n                box-shadow: none;\n                transition: none;\n            }\n            </style>\n        `;\n        document.head.insertAdjacentHTML('beforeend', dataSaverCSS);\n    }\n    \n    enableHighQualityMode() {\n        // تحسينات للاتصالات السريعة\n        document.documentElement.classList.add('high-quality-mode');\n        \n        // تحميل صور بجودة عالية\n        const images = document.querySelectorAll('img');\n        images.forEach(img => {\n            const src = img.src;\n            if (src && src.includes('m5zoon.com')) {\n                // استبدال بصور عالية الجودة إن أمكن\n                img.src = src.replace(/\\.(webp|jpg|jpeg|png)/i, '_hq.$1');\n            }\n        });\n    }\n}\n\n// الكلاس الرئيسي لتحسين الأداء\nclass PerformanceOptimizer {\n    constructor() {\n        this.imageOptimizer = null;\n        this.fontOptimizer = null;\n        this.cdnOptimizer = null;\n        this.coreWebVitalsOptimizer = null;\n        this.networkOptimizer = null;\n        this.init();\n    }\n    \n    init() {\n        console.log('🚀 بدء تشغيل محسن الأداء المتقدم...');\n        \n        // تشغيل جميع المحسنات\n        this.imageOptimizer = new ImageOptimizer();\n        this.fontOptimizer = new FontOptimizer();\n        this.cdnOptimizer = new CDNOptimizer();\n        this.coreWebVitalsOptimizer = new CoreWebVitalsOptimizer();\n        this.networkOptimizer = new NetworkOptimizer();\n        \n        console.log('✅ تم تشغيل جميع محسنات الأداء بنجاح');\n        \n        // إضافة مراقب الأداء\n        setTimeout(() => {\n            this.reportPerformance();\n        }, 3000);\n    }\n    \n    reportPerformance() {\n        if (performance.getEntriesByType) {\n            const navigation = performance.getEntriesByType('navigation')[0];\n            const paint = performance.getEntriesByType('paint');\n            \n            console.log('📊 تقرير الأداء:');\n            console.log(`🔄 وقت التحميل الكامل: ${(navigation.loadEventEnd / 1000).toFixed(2)}s`);\n            \n            paint.forEach(entry => {\n                console.log(`🎨 ${entry.name}: ${(entry.startTime / 1000).toFixed(2)}s`);\n            });\n            \n            // إرسال البيانات لـ Google Analytics إذا متوفر\n            if (typeof gtag !== 'undefined') {\n                gtag('event', 'page_performance', {\n                    'custom_parameter': 'emirates_gifts_optimized',\n                    'load_time': (navigation.loadEventEnd / 1000).toFixed(2)\n                });\n            }\n        }\n    }\n}\n\n// تشغيل محسن الأداء\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', () => {\n        window.performanceOptimizer = new PerformanceOptimizer();\n    });\n} else {\n    window.performanceOptimizer = new PerformanceOptimizer();\n}\n\n// تصدير للاستخدام الخارجي\nwindow.PerformanceOptimizers = {\n    ImageOptimizer,\n    FontOptimizer,\n    CDNOptimizer,\n    CoreWebVitalsOptimizer,\n    NetworkOptimizer,\n    PerformanceOptimizer\n};