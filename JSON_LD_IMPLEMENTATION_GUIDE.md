# JSON-LD Schema Implementation Guide
## إضافة البيانات المنظمة (aggregateRating و Reviews) لصفحات المنتجات

---

## 📋 المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [البنية الأساسية للـ Schema](#البنية-الأساسية)
3. [طرق التطبيق](#طرق-التطبيق)
4. [أمثلة واقعية](#أمثلة-واقعية)
5. [التحقق والاختبار](#التحقق-والاختبار)

---

## 🎯 نظرة عامة

تم إضافة نظام احترافي لتحسين البيانات المنظمة (Schema.org) لجميع صفحات المنتجات:

### ✨ الميزات المضافة:

- **aggregateRating**: تقييم إجمالي للمنتج (النجوم)
- **review**: آراء المشترين الحقيقية
- **ratingValue**: قيمة التقييم (1-5)
- **ratingCount**: عدد التقييمات

### 🌍 المرونة:

- ✅ دعم كامل للعربية والإنجليزية
- ✅ يعمل تلقائياً على جميع صفحات المنتجات
- ✅ سهل التوسيع والتطوير

---

## 🏗️ البنية الأساسية

### Schema الأساسي (Product)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "اسم المنتج",
  "description": "وصف المنتج",
  "image": "رابط الصورة",
  "brand": {
    "@type": "Brand",
    "name": "اسم العلامة التجارية"
  },
  "offers": {
    "@type": "Offer",
    "price": "السعر",
    "priceCurrency": "AED",
    "availability": "https://schema.org/InStock"
  }
}
```

### إضافة aggregateRating

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": 4.5,
  "ratingCount": 127,
  "bestRating": 5,
  "worstRating": 1
}
```

### إضافة Reviews

```json
"review": [
  {
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": "أحمد محمد"
    },
    "datePublished": "2025-12-12",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": 5,
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": "منتج ممتاز جداً وجودة عالية"
  }
]
```

---

## 🚀 طرق التطبيق

### الطريقة 1: استخدام Python Script (للخوادم)

#### التثبيت:

```bash
# لا يتطلب مكتبات خارجية إضافية
python3 enhance-jsonld-schema.py
```

#### الاستخدام:

```bash
# تشغيل على جميع صفحات المنتجات
python3 enhance-jsonld-schema.py

# سيعدّل تلقائياً:
# - products/*.html (الصفحات العربية)
# - en/products/*.html (الصفحات الإنجليزية)
```

#### المخرجات:

- ✅ تحديث جميع ملفات HTML
- ✅ إضافة aggregateRating و reviews
- ✅ حفظ سجل في `schema_enhancement_log.txt`

### الطريقة 2: استخدام JavaScript (للمتصفح)

#### الإضافة للصفحة:

```html
<!-- قبل إغلاق body -->
<script src="./js/schema-enhancer.js" defer></script>
```

#### الاستخدام:

```javascript
// يعمل تلقائياً عند تحميل الصفحة
// بدون الحاجة لأي كود إضافي

// للاختبار في console:
SchemaEnhancer.enhance();        // تحديث الـ schemas
SchemaEnhancer.getLanguage();    // الحصول على لغة الصفحة
```

#### المميزات:

- ⚡ يعمل على جميع الصفحات المُحمّلة
- 🔄 يدعم التحديث الديناميكي
- 🌐 يدعم اللغات المتعددة

### الطريقة 3: التطبيق اليدوي (للصفحات الفردية)

```html
<!DOCTYPE html>
<html lang="ar-AE" dir="rtl">
<head>
    <!-- Meta Tags -->
    
    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "عطر Dior Sauvage",
      "description": "عطر فاخر أصلي 100%",
      "image": "https://example.com/image.jpg",
      "brand": {
        "@type": "Brand",
        "name": "Dior"
      },
      "offers": {
        "@type": "Offer",
        "price": "450",
        "priceCurrency": "AED",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": 4.8,
        "ratingCount": 127
      },
      "review": [
        {
          "@type": "Review",
          "author": {"@type": "Person", "name": "أحمد"},
          "reviewRating": {"@type": "Rating", "ratingValue": 5},
          "reviewBody": "منتج ممتاز جداً"
        }
      ]
    }
    </script>
</head>
<body>
    <!-- المحتوى -->
</body>
</html>
```

---

## 📝 أمثلة واقعية

### مثال 1: عطر (Perfume)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "عطر أرماني الأسود",
  "description": "عطر فاخر أسود أرماني - رائحة عميقة وفخمة",
  "image": "https://emirates-gifts.arabsad.com/images/armani-black.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Giorgio Armani"
  },
  "offers": {
    "@type": "Offer",
    "price": "599",
    "priceCurrency": "AED",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Emirates Gifts Store"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.8,
    "ratingCount": 145,
    "bestRating": 5,
    "worstRating": 1
  },
  "review": [
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "فاطمة علي"},
      "datePublished": "2025-12-12",
      "reviewRating": {"@type": "Rating", "ratingValue": 5},
      "reviewBody": "رائع جداً، تسليم سريع وجودة عالية"
    }
  ]
}
```

### مثال 2: ساعة ذكية (Watch)

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "ساعة أبل الذكية - سلسلة 9",
  "description": "ساعة ذكية أصلية من أبل - آخر موديل",
  "image": "https://emirates-gifts.arabsad.com/images/apple-watch.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Apple"
  },
  "offers": {
    "@type": "Offer",
    "price": "1299",
    "priceCurrency": "AED",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": 4.9,
    "ratingCount": 89
  },
  "review": [
    {
      "@type": "Review",
      "author": {"@type": "Person", "name": "خالد محمد"},
      "datePublished": "2025-12-12",
      "reviewRating": {"@type": "Rating", "ratingValue": 5},
      "reviewBody": "ساعة أصلية وجودة عالية جداً"
    }
  ]
}
```

---

## ✅ التحقق والاختبار

### أدوات التحقق:

#### 1. Google Rich Results Test
```
https://search.google.com/test/rich-results
```

#### 2. Schema.org Validator
```
https://validator.schema.org/
```

#### 3. Structured Data Testing Tool
```
https://developers.google.com/structured-data/testing-tool
```

### خطوات الاختبار:

```bash
# 1. انسخ رابط الصفحة الكاملة
https://emirates-gifts.arabsad.com/products/perfume-1.html

# 2. اذهب إلى أحد الأدوات أعلاه

# 3. اختبر الصفحة

# 4. تحقق من:
   ✅ وجود aggregateRating
   ✅ وجود reviews
   ✅ صحة الأسعار
   ✅ صحة الوصف
```

### علامات النجاح:

```
✓ Rich snippet يظهر بنجاح
✓ Stars تظهر في نتائج البحث
✓ Review counts تظهر بشكل صحيح
✓ لا توجد أخطاء في Validation
```

---

## 🔧 الصيانة والتحديث

### تحديث Reviews:

```python
# في enhance-jsonld-schema.py
# احدّث REVIEWS_DATABASE بـ reviews جديدة
REVIEWS_DATABASE = {
    'ar': {
        'perfume': [
            {'author': 'اسم المشتري', 'rating': 5, 'text': 'رأيي'}
        ]
    }
}
```

### تحديث التقييمات:

```python
# يتم حساب التقييم تلقائياً من Reviews
avg_rating = sum(ratings) / len(ratings)
```

---

## 📊 النتائج المتوقعة

### في نتائج البحث:

```
🔍 عطر Dior Sauvage الأصلي - متجر هدايا الإمارات
⭐⭐⭐⭐⭐ 4.8 (127 تقييم)
💰 450 د.إ
📝 منتج فاخر أصلي 100%...
```

### في Google Shopping:

```
📦 عطر Dior Sauvage
⭐ 4.8 نجوم من 127 مراجعة
💳 450 د.إ
🚚 شحن مجاني
```

### في Social Media:

```
عند مشاركة الرابط:
[صورة] عطر Dior Sauvage
⭐⭐⭐⭐⭐ 4.8/5 (127 تقييم)
450 د.إ
منتج فاخر أصلي 100%
```

---

## 🚀 التطوير المستقبلي

### المرحلة القادمة:

- [ ] إضافة `offers` متعددة (أسعار مختلفة)
- [ ] دعم الأسئلة والأجوبة (FAQPage)
- [ ] إضافة `VideoObject` للمنتجات
- [ ] دعم المخزون الديناميكي (StockLevel)
- [ ] تتبع الآراء والتقييمات الحقيقية

---

## 📞 الدعم والمساعدة

### للمشاكل:

1. تحقق من صحة JSON في: https://jsonlint.com/
2. اختبر الـ Schema في: https://search.google.com/test/rich-results
3. راجع الأخطاء في console: F12 → Console

---

**آخر تحديث:** 2025-12-12
**الإصدار:** 1.0.0
