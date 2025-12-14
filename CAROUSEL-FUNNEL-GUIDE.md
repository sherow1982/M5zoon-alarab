# 🏘 دليل الكاروسيل والفانل والعداد

**الحالة:** ✅ كامل جاهز للاستخدام
**التاريخ:** 14 ديسمبر 2025

---

## 📋 المحتويات

1. [المميزات](#المميزات)
2. [الملفات](#الملفات)
3. [الاستخدام](#الاستخدام)
4. [الأمثلة](#الأمثلة)
5. [المتغيرات والدوال](#المتغيرات-والدوال)
6. [تتبع الفانل](#تتبع-الفانل)

---

## ✨ المميزات

### 🎠 الكاروسيل (Carousel)
```
✅ صور متعددة
✅ أزرار التنقل (سابق/تالي)
✅ نقاط التنقل (Dots)
✅ دعم اللمس (Touch/Swipe)
✅ لوحة المفاتيح (Arrow Keys)
✅ تشغيل تلقائي (Autoplay)
✅ انتقال سلس (Smooth Transitions)
✅ Responsive Design
```

### 🔢 عداد الكمية (Quantity Counter)
```
✅ زر طرح (-)
✅ زر إضافة (+)
✅ حقل إدخال مباشر
✅ تحديد الحد الأدنى والأقصى
✅ لوحة المفاتيح (Arrows)
✅ تحقق من الصحة (Validation)
✅ حالات معطلة (Disabled States)
```

### 📊 تتبع الفانل (Funnel Tracker)
```
✅ 5 مراحل: View → Click → Add to Cart → Checkout → Purchase
✅ حفظ البيانات محلياً (LocalStorage)
✅ حساب معدل التحويل
✅ تكامل Google Analytics
✅ إحصائيات مفصلة
```

---

## 📁 الملفات

### JavaScript
```
js/product-carousel-funnel.js
└── ProductCarousel Class
    ├── init()
    ├── next() / prev() / goTo()
    ├── showImage()
    ├── handleSwipe()
    └── startAutoplay()

└── QuantityCounter Class
    ├── init()
    ├── getQuantity() / setQuantity()
    ├── increase() / decrease()
    ├── validate()
    └── updateButtonStates()

└── FunnelTracker Class
    ├── track(step, data)
    ├── trackView() / trackClick() / etc.
    ├── getConversionRate()
    ├── getStats()
    └── save() / load()
```

### CSS
```
css/product-carousel-quantity.css
├── Carousel Styles
│   ├── [data-product-carousel]
│   ├── Carousel Controls
│   ├── Carousel Dots
│   └── Animations
├── Quantity Counter Styles
│   ├── [data-quantity-counter]
│   ├── Buttons
│   └── Input Field
├── Responsive Design
├── Dark Mode
├── Accessibility
└── Animations
```

### HTML Demo
```
examples/product-carousel-demo.html
└── عرض توضيحي كامل مع أمثلة
```

---

## 🚀 الاستخدام

### 1️⃣ إضافة الملفات

```html
<!-- CSS -->
<link rel="stylesheet" href="./css/product-carousel-quantity.css">

<!-- JavaScript -->
<script src="./js/product-carousel-funnel.js" defer></script>
```

### 2️⃣ الكاروسيل

```html
<div data-product-carousel>
    <div class="carousel-container">
        <div data-carousel-item class="active">
            <img src="image1.jpg" alt="صورة 1">
        </div>
        <div data-carousel-item>
            <img src="image2.jpg" alt="صورة 2">
        </div>
        <div data-carousel-item>
            <img src="image3.jpg" alt="صورة 3">
        </div>
    </div>
    
    <!-- Navigation -->
    <button data-carousel-prev class="carousel-prev">‹</button>
    <button data-carousel-next class="carousel-next">›</button>
    
    <!-- Dots -->
    <div data-carousel-dots></div>
</div>
```

### 3️⃣ عداد الكمية

```html
<div data-quantity-counter>
    <button data-quantity-minus>−</button>
    <input type="number" min="1" max="100" value="1">
    <button data-quantity-plus>+</button>
</div>
```

### 4️⃣ الأزرار

```html
<button id="add-to-cart-btn" class="btn btn-primary">
    🛒 أضف للسلة
</button>
```

---

## 💻 الأمثلة

### الكاروسيل

```javascript
// تم التهيئة تلقائياً
const carousel = window.productCarousel;

// التحكم اليدوي
carousel.next();          // الصورة التالية
carousel.prev();          // الصورة السابقة
carousel.goTo(2);         // اذهب إلى صورة معينة
carousel.startAutoplay(); // ابدأ التشغيل التلقائي
carousel.stopAutoplay();  // أوقف التشغيل التلقائي
```

### عداد الكمية

```javascript
// تم التهيئة تلقائياً
const counter = window.quantityCounter;

// الحصول على القيمة
const qty = counter.getQuantity(); // مثل: 5

// تعيين القيمة
counter.setQuantity(10);
counter.increase();  // زيادة بمقدار 1
counter.decrease();  // تقليل بمقدار 1
```

### الفانل

```javascript
// تم التهيئة تلقائياً
const funnel = window.funnelTracker;

// تتبع الأحداث
funnel.trackView();
funnel.trackClick();
funnel.trackAddToCart({
    productId: 'prod-123',
    productName: 'عطر فاخر',
    quantity: 2,
    price: 299.99
});
funnel.trackCheckout();
funnel.trackPurchase({ orderId: 'order-456' });

// الحصول على الإحصائيات
const stats = funnel.getStats();
console.log(stats);
// Output:
// {
//   steps: { view: 5, click: 4, add_to_cart: 2, checkout: 1, purchase: 0 },
//   conversionRate: "40.00",
//   timestamp: "2025-12-14T02:07:00.000Z"
// }

// معدل التحويل
const rate = funnel.getConversionRate('view', 'add_to_cart');
console.log(rate); // "40.00"
```

---

## 🔧 المتغيرات والدوال

### Carousel Methods

| الدالة | الوصف | مثال |
|------|-------|-------|
| `next()` | الصورة التالية | `carousel.next()` |
| `prev()` | الصورة السابقة | `carousel.prev()` |
| `goTo(index)` | اذهب لصورة محددة | `carousel.goTo(2)` |
| `startAutoplay()` | ابدأ التشغيل التلقائي | `carousel.startAutoplay()` |
| `stopAutoplay()` | أوقف التشغيل التلقائي | `carousel.stopAutoplay()` |
| `showImage(index)` | عرض صورة محددة | `carousel.showImage(1)` |

### QuantityCounter Methods

| الدالة | الوصف | مثال |
|------|-------|-------|
| `getQuantity()` | الحصول على القيمة الحالية | `const qty = counter.getQuantity()` |
| `setQuantity(value)` | تعيين القيمة | `counter.setQuantity(5)` |
| `increase()` | زيادة بمقدار 1 | `counter.increase()` |
| `decrease()` | تقليل بمقدار 1 | `counter.decrease()` |
| `validate()` | تحقق من الصحة | `counter.validate()` |

### FunnelTracker Methods

| الدالة | الوصف | مثال |
|------|-------|-------|
| `track(step, data)` | تتبع خطوة | `funnel.track('add_to_cart', {...})` |
| `trackView()` | تتبع المشاهدة | `funnel.trackView()` |
| `trackClick()` | تتبع النقرة | `funnel.trackClick()` |
| `trackAddToCart(data)` | تتبع الإضافة للسلة | `funnel.trackAddToCart({...})` |
| `trackCheckout()` | تتبع الدفع | `funnel.trackCheckout()` |
| `trackPurchase(data)` | تتبع الشراء | `funnel.trackPurchase({...})` |
| `getConversionRate(from, to)` | معدل التحويل | `funnel.getConversionRate('view', 'add_to_cart')` |
| `getStats()` | الإحصائيات كاملة | `funnel.getStats()` |

---

## 📊 تتبع الفانل

### مراحل الفانل

```
1. View (عرض)
   └─ المستخدم يفتح صفحة المنتج

2. Click (نقرة)
   └─ المستخدم ينقر على عناصر المنتج

3. Add to Cart (إضافة للسلة)
   └─ المستخدم يضيف المنتج للسلة

4. Checkout (الدفع)
   └─ المستخدم ينتقل لصفحة الدفع

5. Purchase (الشراء)
   └─ المستخدم ينهي الشراء بنجاح
```

### حفظ البيانات

```javascript
// يتم الحفظ تلقائياً في localStorage
localStorage.getItem('funnel_data');

// Output (مثال):
// {
//   "view": 5,
//   "click": 4,
//   "add_to_cart": 2,
//   "checkout": 1,
//   "purchase": 0
// }
```

### Google Analytics Integration

```javascript
// يتم التكامل تلقائياً إذا كان gtag محملاً
if (window.gtag) {
    gtag('event', 'funnel_view', {
        product_id: 'prod-123',
        product_name: 'عطر فاخر',
        price: 299.99
    });
}
```

---

## 🎨 التخصيص

### CSS Variables

```css
/* في css/product-carousel-quantity.css */

/* الألوان */
--color-primary: #D4AF37;
--color-text: #333;
--color-border: #e0e0e0;

/* الحجم */
--carousel-height: 500px;
--counter-button-size: 38px;

/* المدة */
--transition-duration: 0.3s;
--carousel-slide-duration: 5000ms;
```

### التغيير السريع

```html
<!-- زر مخصص بحجم -->
<div data-quantity-counter style="--counter-button-size: 42px;">
    ...
</div>

<!-- ألوان مخصصة -->
<div data-product-carousel style="--color-primary: #FF6B6B;">
    ...
</div>
```

---

## 📱 Responsive

### Breakpoints

```
✅ Desktop: 1200px+
✅ Tablet: 768px - 1199px
✅ Mobile: 480px - 767px
✅ Small Mobile: < 480px
```

### اختبار

```javascript
// اختبر على أجهزة مختلفة
// Desktop: الكاروسيل كامل + عداد عادي
// Tablet: الكاروسيل مختزل + عداد مدمج
// Mobile: الكاروسيل صغير + عداد أصغر
```

---

## ♿ الوصول (Accessibility)

```html
<!-- Keyboard Navigation -->
← → : التنقل بين الصور
↑ ↓ : زيادة/تقليل الكمية

<!-- Focus States -->
Tab: التنقل بين العناصر
Enter: تفعيل الأزرار

<!-- Screen Readers -->
aria-label="..."
role="button"
```

---

## 🧪 الاختبار

### التحقق من الكاروسيل

```javascript
// 1. فتح الكنسول (F12)
// 2. اختبر الحركات
window.productCarousel.next();  // يجب أن تظهر الصورة التالية
window.productCarousel.prev();  // يجب أن تظهر الصورة السابقة

// 3. تحقق من التشغيل التلقائي
// الصور تتغير كل 5 ثوان تلقائياً
```

### التحقق من العداد

```javascript
// 1. فتح الكنسول
// 2. اختبر العداد
window.quantityCounter.getQuantity();  // يجب أن يعود: 1
window.quantityCounter.setQuantity(5); // يجب أن تصبح: 5

// 3. اختبر الحدود
window.quantityCounter.setQuantity(101);  // يجب أن تصبح: 100 (الحد الأقصى)
window.quantityCounter.setQuantity(-1);   // يجب أن تصبح: 1 (الحد الأدنى)
```

### التحقق من الفانل

```javascript
// 1. فتح الكنسول
// 2. اختبر الفانل
window.funnelTracker.getStats();
// يجب أن ترى: { steps: { view: 1, click: 0, ... }, ... }

// 3. محاكاة السلوك
window.funnelTracker.trackClick();
window.funnelTracker.trackClick();
window.funnelTracker.trackAddToCart({ productId: 'test' });
window.funnelTracker.getConversionRate('view', 'add_to_cart');
// يجب أن يعود: "50.00"
```

---

## 🐛 استكشاف الأخطاء

### الكاروسيل لا يعمل

```javascript
// 1. تحقق من وجود العناصر
console.log(document.querySelector('[data-product-carousel]'));

// 2. تحقق من وجود الصور
console.log(document.querySelectorAll('[data-carousel-item]'));

// 3. تحقق من التهيئة
console.log(window.productCarousel);
```

### العداد لا يعمل

```javascript
// 1. تحقق من وجود العناصر
console.log(document.querySelector('[data-quantity-counter]'));

// 2. تحقق من الأزرار
console.log(document.querySelector('[data-quantity-minus]'));
console.log(document.querySelector('[data-quantity-plus]'));

// 3. تحقق من التهيئة
console.log(window.quantityCounter);
```

---

## 📚 الموارد

- [Demo](./examples/product-carousel-demo.html)
- [CSS Styles](./css/product-carousel-quantity.css)
- [JavaScript](./js/product-carousel-funnel.js)

---

**الحالة:** ✅ كامل جاهز للاستخدام

**آخر تحديث:** 14 ديسمبر 2025
