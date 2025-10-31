// Service Worker لمتجر هدايا الإمارات
// تحسين الأداء والتخزين المؤقت

const CACHE_NAME = 'emirates-gifts-v1.0.0';
const CACHE_VERSION = '20251101';

// قائمة الملفات للتخزين
const STATIC_CACHE_URLS = [
  './',
  './index.html',
  './products-showcase.html',
  './cart.html',
  './checkout.html',
  './about.html',
  './favicon.ico',
  './css/dkhoon-inspired-style.css',
  './css/mobile-responsive-fixes.css',
  './css/reviews-system.css',
  './js/products-loader.js',
  './js/cart-system.js',
  './js/ui.js',
  './data/otor.json',
  './data/sa3at.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
];

// قائمة الموارد الخارجية
const EXTERNAL_RESOURCES = [
  'https://images.unsplash.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdnjs.cloudflare.com'
];

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker: بدء التثبيت');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('💾 Service Worker: تخزين الملفات الأساسية');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker: تم تخزين جميع الملفات');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: خطأ في التثبيت:', error);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('⚙️ Service Worker: بدء التفعيل');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: حذف ذاكرة تخزين قديمة:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: تم تفعيل النظام بنجاح');
        return self.clients.claim();
      })
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  
  // تجاهل طلبات غير GET
  if (request.method !== 'GET') {
    return;
  }
  
  // تجاهل طلبات واتساب
  if (url.hostname === 'wa.me') {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
      .catch((error) => {
        console.error('❌ Service Worker: خطأ في معالجة الطلب:', error);
        return fetch(request);
      })
  );
});

// معالجة طلبات الجلب
async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  // إستراتيجية Cache-First للملفات الثابتة
  if (isStaticResource(url)) {
    return cacheFirst(request);
  }
  
  // إستراتيجية Stale-While-Revalidate للمحتوى الديناميكي
  if (isDynamicContent(url)) {
    return staleWhileRevalidate(request);
  }
  
  // إستراتيجية Network-First للبيانات
  if (isDataFile(url)) {
    return networkFirst(request);
  }
  
  // إستراتيجية افتراضية
  return fetch(request);
}

// تحديد نوع المورد
function isStaticResource(url) {
  const staticExtensions = ['.css', '.js', '.woff2', '.woff', '.ttf', '.ico'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com' ||
         url.hostname === 'cdnjs.cloudflare.com';
}

function isDynamicContent(url) {
  const dynamicPages = ['.html', './'];
  return dynamicPages.some(page => 
    url.pathname.endsWith(page) || 
    url.pathname === '/' ||
    url.pathname === '/index.html'
  );
}

function isDataFile(url) {
  return url.pathname.includes('/data/') && url.pathname.endsWith('.json');
}

// إستراتيجية Cache-First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    console.log('💾 Cache hit:', request.url);
    return cachedResponse;
  }
  
  console.log('🌐 Cache miss, جلب من الشبكة:', request.url);
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// إستراتيجية Stale-While-Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || await fetchPromise;
}

// إستراتيجية Network-First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('💾 فشل في الشبكة، استخدام الذاكرة:', request.url);
    const cache = await caches.open(CACHE_NAME);
    return await cache.match(request);
  }
}

// عمليات تنظيف الذاكرة
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    clearAllCaches();
  }
});

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('🗑️ تم حذف جميع الذاكرة المؤقتة');
}