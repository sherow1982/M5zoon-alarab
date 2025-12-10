// Service Worker لمتجر هدايا الإمارات
// إصدار محسّن v2.1.1 - إصلاح شامل للأخطاء
// تحسين الأداء، التخزين المؤقت، والعمل اوفلاين
// تاريخ التحديث: 1 نوفمبر 2025 - 01:30 صباحاً

const VERSION = '2.1.1';
const BUILD_DATE = '2025-11-01';

// أسماء الذاكرة المؤقتة
const CACHE_NAMES = {
    STATIC: `emirates-gifts-static-v${VERSION}`,
    DYNAMIC: `emirates-gifts-dynamic-v${VERSION}`,
    DATA: `emirates-gifts-data-v${VERSION}`,
    IMAGES: `emirates-gifts-images-v${VERSION}`
};

// الملفات الأساسية (تخزين فوري)
const CORE_ASSETS = [
    './',
    './index.html',
    './favicon.ico',
    './site.webmanifest',
    './robots.txt'
];

// ملفات CSS و JavaScript
const ASSET_FILES = [
    './css/dkhoon-inspired-style.css',
    './css/mobile-responsive-fixes.css',
    './js/products-loader.js',
    './js/cart-system.js',
    './js/ui.js'
];

// صفحات HTML هامة
const HTML_PAGES = [
    './products-showcase.html',
    './product-details.html',
    './cart.html',
    './checkout.html',
    './about.html',
    './shipping-policy.html',
    './return-policy.html',
    './privacy-policy.html',
    './terms-conditions.html'
];

// بيانات المنتجات
const DATA_FILES = [
    './data/otor.json',
    './data/sa3at.json'
];

// موارد خارجية هامة
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// وظائف مساعدة
const Utils = {
    log: (message, type = 'info') => {
        const emoji = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
        console.log(`${emoji[type]} SW v${VERSION}: ${message}`);
    },
    
    isOwnOrigin: (url) => {
        return url.startsWith(self.location.origin);
    },
    
    shouldCache: (url) => {
        const urlObj = new URL(url);
        // لا نخزن روابط واتساب
        if (urlObj.hostname === 'wa.me') return false;
        // لا نخزن طلبات POST/PUT/DELETE
        return true;
    },
    
    createErrorResponse: (status = 503, title = 'غير متاح', message = 'الصفحة غير متاحة') => {
        const html = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>متجر هدايا الإمارات - ${title}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Cairo', sans-serif;
                        background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                        color: #2c3e50;
                        direction: rtl;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    .container {
                        max-width: 500px;
                        background: white;
                        padding: 50px 40px;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                        text-align: center;
                    }
                    .icon {
                        font-size: 5rem;
                        margin-bottom: 30px;
                        color: ${status === 404 ? '#e74c3c' : '#f39c12'};
                    }
                    h1 {
                        color: #2c3e50;
                        margin-bottom: 20px;
                        font-size: 2rem;
                        font-weight: 800;
                    }
                    p {
                        color: #666;
                        margin-bottom: 30px;
                        line-height: 1.6;
                        font-size: 1.1rem;
                    }
                    .btn {
                        background: linear-gradient(135deg, #D4AF37, #B8860B);
                        color: white;
                        padding: 15px 30px;
                        text-decoration: none;
                        border-radius: 25px;
                        display: inline-block;
                        margin: 10px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        border: none;
                        cursor: pointer;
                        font-size: 1rem;
                    }
                    .btn:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
                    }
                    .btn-secondary {
                        background: transparent;
                        color: #D4AF37;
                        border: 2px solid #D4AF37;
                    }
                    .btn-secondary:hover {
                        background: #D4AF37;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">${status === 404 ? '🚫' : '🔌'}</div>
                    <h1>${title}</h1>
                    <p>${message}</p>
                    <div>
                        <a href="./" class="btn">🏠 الرئيسية</a>
                        <button onclick="window.location.reload()" class="btn btn-secondary">🔄 إعادة المحاولة</button>
                    </div>
                </div>
            </body>
            </html>
        `;
        
        return new Response(html, {
            status,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store'
            }
        });
    }
};

// Cache-First Strategy - للموارد الثابتة
async function cacheFirst(request) {
    try {
        const cache = await caches.open(CACHE_NAMES.STATIC);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            Utils.log(`إرجاع من الذاكرة: ${request.url}`);
            
            // تحديث في الخلفية (بدون انتظار)
            fetch(request).then(response => {
                if (response.ok) {
                    cache.put(request, response.clone());
                    Utils.log(`تم تحديث الذاكرة في الخلفية: ${request.url}`);
                }
            }).catch(() => {
                // فشل صامت
            });
            
            return cachedResponse;
        }
        
        Utils.log(`تحميل من الشبكة: ${request.url}`);
        const networkResponse = await fetch(request, {
            cache: 'default',
            credentials: 'same-origin'
        });
        
        if (networkResponse.ok) {
            await cache.put(request, networkResponse.clone());
            Utils.log(`تم حفظ في الذاكرة: ${request.url}`, 'success');
        }
        
        return networkResponse;
        
    } catch (error) {
        Utils.log(`فشل cache-first لـ ${request.url}: ${error.message}`, 'error');
        throw error;
    }
}

// Network-First Strategy - للصفحات HTML
async function networkFirst(request) {
    try {
        Utils.log(`محاولة الشبكة أولاً: ${request.url}`);
        
        const networkResponse = await fetch(request, {
            cache: 'default',
            credentials: 'same-origin'
        });
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAMES.DYNAMIC);
            await cache.put(request, networkResponse.clone());
            Utils.log(`تم حفظ HTML جديد: ${request.url}`, 'success');
        }
        
        return networkResponse;
        
    } catch (error) {
        Utils.log(`فشل الشبكة، محاولة الذاكرة: ${request.url}`, 'warning');
        
        const cache = await caches.open(CACHE_NAMES.DYNAMIC);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            Utils.log(`إرجاع HTML من الذاكرة: ${request.url}`);
            return cachedResponse;
        }
        
        // عودة صفحة خطأ مخصصة
        if (request.headers.get('accept')?.includes('text/html')) {
            const url = new URL(request.url);
            if (url.pathname.includes('product-details')) {
                return Utils.createErrorResponse(404, 'المنتج غير موجود', 'لم يتم العثور على هذا المنتج. يرجى العودة للرئيسية والبحث مرة أخرى.');
            }
            return Utils.createErrorResponse(503, 'غير متاح حالياً', 'لا يمكن الوصول إلى الصفحة. يرجى التحقق من اتصالك بالإنترنت.');
        }
        
        throw error;
    }
}

// Stale-While-Revalidate Strategy - لبيانات JSON
async function staleWhileRevalidate(request) {
    try {
        const cache = await caches.open(CACHE_NAMES.DATA);
        const cachedResponse = await cache.match(request);
        
        // إرجاع فوري للنسخة المخزنة
        const responsePromise = cachedResponse || 
            fetch(request).then(response => {
                if (response.ok) {
                    cache.put(request, response.clone());
                }
                return response;
            });
        
        // تحديث في الخلفية إذا وجدت نسخة مخزنة
        if (cachedResponse) {
            Utils.log(`إرجاع JSON من الذاكرة مع تحديث خلفي: ${request.url}`);
            
            fetch(request, { cache: 'no-cache' })
                .then(response => {
                    if (response.ok) {
                        cache.put(request, response.clone());
                        Utils.log(`تم تحديث JSON في الخلفية: ${request.url}`, 'success');
                    }
                })
                .catch(err => {
                    Utils.log(`فشل تحديث JSON في الخلفية: ${err.message}`, 'warning');
                });
        } else {
            Utils.log(`تحميل JSON من الشبكة: ${request.url}`);
        }
        
        return responsePromise;
        
    } catch (error) {
        Utils.log(`فشل stale-while-revalidate لـ ${request.url}: ${error.message}`, 'error');
        throw error;
    }
}

// تثبيت Service Worker
self.addEventListener('install', function(event) {
    Utils.log(`بدء تثبيت Service Worker - Build: ${BUILD_DATE}`);
    
    event.waitUntil(
        Promise.allSettled([
            // تخزين الملفات الأساسية
            caches.open(CACHE_NAMES.STATIC).then(cache => {
                Utils.log('تخزين الملفات الأساسية');
                return Promise.allSettled(
                    [...CORE_ASSETS, ...ASSET_FILES, ...EXTERNAL_RESOURCES]
                        .map(url => cache.add(url).catch(err => 
                            Utils.log(`فشل في تخزين ${url}: ${err.message}`, 'warning')
                        ))
                );
            }),
            
            // تخزين الصفحات
            caches.open(CACHE_NAMES.DYNAMIC).then(cache => {
                Utils.log('تخزين الصفحات HTML');
                return Promise.allSettled(
                    HTML_PAGES.map(url => cache.add(url).catch(err => 
                        Utils.log(`فشل في تخزين ${url}: ${err.message}`, 'warning')
                    ))
                );
            }),
            
            // تخزين بيانات JSON
            caches.open(CACHE_NAMES.DATA).then(cache => {
                Utils.log('تخزين بيانات المنتجات');
                return Promise.allSettled(
                    DATA_FILES.map(url => cache.add(url).catch(err => 
                        Utils.log(`فشل في تخزين ${url}: ${err.message}`, 'warning')
                    ))
                );
            })
        ]).then(results => {
            const successful = results.filter(r => r.status === 'fulfilled').length;
            const failed = results.filter(r => r.status === 'rejected').length;
            Utils.log(`تم تثبيت SW - نجح: ${successful}, فشل: ${failed}`, 'success');
        })
    );
    
    // تفعيل فوري بدون انتظار
    self.skipWaiting();
});

// تفعيل Service Worker
self.addEventListener('activate', function(event) {
    Utils.log('بدء تفعيل Service Worker');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            const currentCaches = Object.values(CACHE_NAMES);
            const cachesToDelete = cacheNames.filter(cacheName => 
                cacheName.startsWith('emirates-gifts') && !currentCaches.includes(cacheName)
            );
            
            if (cachesToDelete.length > 0) {
                Utils.log(`حذف ${cachesToDelete.length} ذاكرة قديمة`, 'info');
                return Promise.all(
                    cachesToDelete.map(cacheName => {
                        Utils.log(`حذف ذاكرة قديمة: ${cacheName}`);
                        return caches.delete(cacheName);
                    })
                );
            }
            
            return Promise.resolve();
        }).then(() => {
            Utils.log('تم تفعيل Service Worker بنجاح', 'success');
            return self.clients.claim();
        })
    );
});

// معالج طلبات HTTP
self.addEventListener('fetch', function(event) {
    const request = event.request;
    const url = new URL(request.url);
    
    // تجاهل طلبات غير GET
    if (request.method !== 'GET') {
        return;
    }
    
    // تجاهل روابط واتساب
    if (url.hostname === 'wa.me' || url.hostname === 'web.whatsapp.com') {
        return;
    }
    
    // تجاهل chrome-extension و moz-extension
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
        return;
    }
    
    const pathname = url.pathname;
    const isOwnDomain = url.origin === self.location.origin;
    
    // التعامل مع الطلبات حسب نوع الملف
    event.respondWith(
        (async () => {
            try {
                // بيانات JSON - stale-while-revalidate
                if (pathname.endsWith('.json')) {
                    return await staleWhileRevalidate(request);
                }
                
                // الصور - cache-first مع تخزين طويل
                if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
                    return await handleImageRequest(request);
                }
                
                // CSS و JS - cache-first
                if (pathname.match(/\.(css|js)$/) || 
                    url.hostname === 'cdnjs.cloudflare.com' ||
                    url.hostname === 'fonts.googleapis.com' ||
                    url.hostname === 'fonts.gstatic.com') {
                    return await cacheFirst(request);
                }
                
                // صفحات HTML - network-first
                if (isOwnDomain && (
                    pathname.endsWith('.html') || 
                    pathname === '/' || 
                    !pathname.includes('.')))
                {
                    return await networkFirst(request);
                }
                
                // باقي الطلبات
                return await fetch(request);
                
            } catch (error) {
                Utils.log(`خطأ عام في معالجة ${request.url}: ${error.message}`, 'error');
                
                // محاولة أخيرة من الذاكرة
                const allCaches = Object.values(CACHE_NAMES);
                for (const cacheName of allCaches) {
                    const cache = await caches.open(cacheName);
                    const response = await cache.match(request);
                    if (response) {
                        Utils.log(`عودة من ذاكرة ${cacheName}: ${request.url}`);
                        return response;
                    }
                }
                
                throw error;
            }
        })()
    );
});

// معالجة طلبات الصور
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(CACHE_NAMES.IMAGES);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // فحص تاريخ الانتهاء (7 أيام)
            const cachedDate = new Date(cachedResponse.headers.get('date') || cachedResponse.headers.get('last-modified') || 0);
            const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            
            if (cachedDate.getTime() > weekAgo) {
                Utils.log(`إرجاع صورة من الذاكرة: ${request.url}`);
                return cachedResponse;
            }
        }
        
        // تحميل من الشبكة
        const networkResponse = await fetch(request, { cache: 'default' });
        
        if (networkResponse.ok && networkResponse.status === 200) {
            await cache.put(request, networkResponse.clone());
            Utils.log(`تم حفظ صورة جديدة: ${request.url}`);
        }
        
        return networkResponse;
        
    } catch (error) {
        // عودة للنسخة المخزنة في حالة الخطأ
        const cache = await caches.open(CACHE_NAMES.IMAGES);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            Utils.log(`عودة لصورة مخزنة (خطأ شبكة): ${request.url}`, 'warning');
            return cachedResponse;
        }
        
        Utils.log(`فشل في تحميل الصورة: ${request.url}`, 'error');
        throw error;
    }
}

// معالجة رسائل من العميل
self.addEventListener('message', function(event) {
    const data = event.data;
    
    if (data?.type === 'SKIP_WAITING') {
        Utils.log('تخطي الانتظار وتفعيل فوراً');
        self.skipWaiting();
    } else if (data?.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: VERSION,
            buildDate: BUILD_DATE,
            cacheNames: CACHE_NAMES
        });
    } else if (data?.type === 'CLEAR_CACHE') {
        clearAllCaches().then(() => {
            event.ports[0].postMessage({ success: true });
        }).catch(error => {
            event.ports[0].postMessage({ success: false, error: error.message });
        });
    }
});

// تنظيف جميع الذواكر
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        const emiratesGiftsCaches = cacheNames.filter(name => name.includes('emirates-gifts'));
        
        if (emiratesGiftsCaches.length > 0) {
            Utils.log(`حذف ${emiratesGiftsCaches.length} ذاكرة`);
            await Promise.all(
                emiratesGiftsCaches.map(cacheName => {
                    Utils.log(`حذف: ${cacheName}`);
                    return caches.delete(cacheName);
                })
            );
            Utils.log('تم حذف جميع الذواكر', 'success');
        }
        
    } catch (error) {
        Utils.log(`خطأ في حذف الذواكر: ${error.message}`, 'error');
        throw error;
    }
}

// مزامنة الخلفية (إذا كان مدعوماً)
self.addEventListener('sync', function(event) {
    if (event.tag === 'background-sync') {
        Utils.log('مزامنة بيانات خلفية');
        event.waitUntil(syncProductData());
    } else if (event.tag === 'cache-cleanup') {
        Utils.log('تنظيف الذاكرة دورياً');
        event.waitUntil(performCacheCleanup());
    }
});

// مزامنة بيانات المنتجات
async function syncProductData() {
    try {
        const cache = await caches.open(CACHE_NAMES.DATA);
        
        for (const dataUrl of DATA_FILES) {
            try {
                const response = await fetch(dataUrl, { 
                    cache: 'no-cache',
                    credentials: 'same-origin'
                });
                
                if (response.ok) {
                    await cache.put(dataUrl, response.clone());
                    Utils.log(`تم تحديث: ${dataUrl}`, 'success');
                }
            } catch (error) {
                Utils.log(`فشل في مزامنة ${dataUrl}: ${error.message}`, 'warning');
            }
        }
        
    } catch (error) {
        Utils.log(`خطأ في مزامنة البيانات: ${error.message}`, 'error');
    }
}

// تنظيف الذاكرة دورياً
async function performCacheCleanup() {
    try {
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 أيام
        const now = Date.now();
        
        // تنظيف ذاكرة الصور
        const imageCache = await caches.open(CACHE_NAMES.IMAGES);
        const imageRequests = await imageCache.keys();
        
        let cleanedImages = 0;
        for (const request of imageRequests) {
            const response = await imageCache.match(request);
            if (response) {
                const responseDate = new Date(response.headers.get('date') || 0).getTime();
                if (now - responseDate > maxAge) {
                    await imageCache.delete(request);
                    cleanedImages++;
                }
            }
        }
        
        if (cleanedImages > 0) {
            Utils.log(`تم حذف ${cleanedImages} صورة قديمة`, 'info');
        }
        
        Utils.log('تم تنظيف الذاكرة بنجاح', 'success');
        
    } catch (error) {
        Utils.log(`خطأ في تنظيف الذاكرة: ${error.message}`, 'error');
    }
}

// معالجة تغيير التحكم
self.addEventListener('controllerchange', function() {
    Utils.log('تم تغيير التحكم في Service Worker');
});

// تسجيل بدء التشغيل
Utils.log(`Service Worker جاهز للعمل - إصدار ${VERSION} (بناء: ${BUILD_DATE})`, 'success');