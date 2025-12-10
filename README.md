# 🎁 Emirates Gifts - متجر هدايا الإمارات

متجر إلكتروني عالي الجودة متخصص في بيع العطور الفاخرة والساعات عالية الجودة والهدايا المميزة في دولة الإمارات العربية المتحدة.

## 🌟 المميزات الرئيسية

✅ **شحن مجاني** - توصيل خلال 1-3 أيام عمل  
✅ **ضمان الإرجاع** - 14 يوم إرجاع كامل + مصاريف الشحن  
✅ **متجر متعدد اللغات** - النسخة العربية والإنجليزية  
✅ **تصميم Responsive** - يعمل على جميع الأجهزة  
✅ **محسّن للـ SEO** - hreflang, sitemap, schema markup  
✅ **Google Merchant Feed** - متكامل مع Google Shopping  
✅ **Progressive Web App** - Service Worker للوصول بدون إنترنت  
✅ **أمان عالي** - Content Security Policy, HTTPS enforced

## 📁 هيكل المشروع

```
emirates-gifts/
├── index.html              # الصفحة الرئيسية (عربي)
├── en/                     # النسخة الإنجليزية
│   └── index.html
├── products-showcase.html  # عرض جميع المنتجات
├── product-details.html    # تفاصيل المنتج
├── cart.html              # سلة التسوق
├── checkout.html          # صفحة الدفع
├── js/                    # ملفات JavaScript
│   └── main.js
├── css/                   # ملفات CSS
│   └── styles.css
├── assets/                # الصور والموارد
├── products/              # JSON files بيانات المنتجات
├── data/                  # البيانات والـ feeds
├── .htaccess             # إعدادات Apache (للـ Custom Domain فقط)
├── sitemap.xml           # Sitemap للـ SEO
├── robots.txt            # قواعد robots
├── sitemap-en.xml        # Sitemap للنسخة الإنجليزية
└── hreflang-sitemap.xml  # Sitemap للـ hreflang

```

## 🚀 البدء السريع

### المتطلبات
- متصفح ويب حديث
- Node.js (اختياري، فقط للـ development)
- Git

### التثبيت

1. **استنساخ الريبو**
```bash
git clone https://github.com/sherow1982/emirates-gifts.git
cd emirates-gifts
```

2. **تشغيل محلي (اختياري)**
```bash
# باستخدام Python
python -m http.server 8000

# أو باستخدام Node.js
npx http-server
```

3. **فتح في المتصفح**
```
http://localhost:8000
```

## 📦 الملفات المهمة

### ملفات الـ Feed (اختر واحد فقط)

```
✅ RECOMMENDED: merchant-feed.xml
   - ملف Google Shopping Feed الرئيسي
   - يحتوي على جميع المنتجات
   - تم آخر تحديث: تلقائياً

LEGACY (لا تستخدم):
❌ google-merchant-feed.xml
❌ google-merchant-feed-fixed.xml
❌ product-feed.json
❌ product-feed.xml
```

### ملفات Apache (للـ Custom Domain فقط)

```
✅ .htaccess           - قواعس إعادة التوجيه
✅ .htaccess-sitemap   - قواعس الـ Sitemap

للـ GitHub Pages: اتركها كما هي (لن تؤثر)
```

### ملفات الـ Generators (مرة واحدة فقط)

```
✅ KEEP:
   - generate_feed.py    (الـ Generator الرئيسي)
   - generate_sitemap.py (Sitemap generator)

❌ DELETE:
   - generate-feed.php       (قديم)
   - generate-sitemap.php    (قديم)
   - merchant-feed-generator.js
   - merchant-feed-generator-fixed.js
   - generate_products.py
   - generate_from_excel.py
   - generate_fixed_merchant_feed.py
```

## 🔧 الإعدادات المهمة

### 1. Custom Domain (CNAME)
```
# ملف CNAME موجود:
emiratesgifts.com

# تأكد من:
- DNS settings صحيحة
- SSL certificate مُثبت
```

### 2. Google Merchant Center
```
1. أضف الـ Feed:
   URL: https://sherow1982.github.io/emirates-gifts/merchant-feed.xml

2. حدّد:
   - البلد: United Arab Emirates
   - اللغة: Arabic
   - العملة: AED

3. تحقق من:
   ✅ جميع المنتجات معتمدة
   ✅ صور عالية الجودة
   ✅ الأسعار محدّثة
```

### 3. Google Search Console
```
1. أضف الموقع
2. أضف sitemaps:
   - sitemap.xml (العربي)
   - sitemap-en.xml (الإنجليزي)
   - hreflang-sitemap.xml (ملف hreflang)

3. اختبر robots.txt
```

## 📊 Feeds والـ SEO

### ملفات Sitemap المتاحة
- `sitemap.xml` - الصفحات الرئيسية (عربي)
- `sitemap-en.xml` - النسخة الإنجليزية
- `hreflang-sitemap.xml` - روابط hreflang للـ Alternate Languages
- `merchant-feed.xml` - Google Shopping Feed

### توليد Feed جديد (اختياري)
```bash
# تحديث merchant feed
python generate_feed.py

# تحديث sitemap
python generate_sitemap.py
```

## 🌐 نسخ اللغة

### العربية (الأساسي)
- **URL**: https://sherow1982.github.io/emirates-gifts/
- **Meta**: `lang="ar-AE"`, `dir="rtl"`

### الإنجليزية
- **URL**: https://sherow1982.github.io/emirates-gifts/en/
- **Meta**: `lang="en"`, `dir="ltr"`

### Hreflang Tags
```html
<!-- في الصفحة العربية -->
<link rel="alternate" hreflang="ar" href=".../">
<link rel="alternate" hreflang="en" href=".../en/">

<!-- في الصفحة الإنجليزية -->
<link rel="alternate" hreflang="en" href=".../en/">
<link rel="alternate" hreflang="ar" href=".../">
```

## 🔒 الأمان

✅ **HTTPS** - كل الاتصالات مشفرة  
✅ **Content Security Policy** - منع XSS attacks  
✅ **No PHP** - لا توجد ملفات backend (static site فقط)  
✅ **No localStorage exploits** - لا تخزين بيانات حساسة  
✅ **HSTS headers** - Enforce HTTPS  

## 📱 Progressive Web App

الموقع يدعم PWA:
- ✅ Service Worker
- ✅ Web Manifest
- ✅ Installable app
- ✅ Offline mode

## 🎯 الأهداف المستقبلية

- [ ] إضافة نظام المراجعات والتقييمات
- [ ] عرض ديناميكي للمنتجات من database
- [ ] نظام إدارة المخزون
- [ ] تكامل مع أنظمة الدفع (Apple Pay, Google Pay)
- [ ] Analytics متقدمة
- [ ] Chatbot AI للدعم الفني

## 📞 الدعم الفني

- **WhatsApp**: +20 111 076 0081
- **البريد الإلكتروني**: info@emirates-gifts.com
- **الموقع**: https://sherow1982.github.io/emirates-gifts/

## 📄 الترخيص والحقوق

© 2024 Emirates Gifts. جميع الحقوق محفوظة.

---

## 🛠️ نصائح للصيانة

1. **تحديث المنتجات**: عدّل ملفات JSON في folder `/products`
2. **تحديث الـ Feed**: شغّل `generate_feed.py` بعد أي تغيير
3. **اختبار الموقع**: استخدم Google PageSpeed Insights
4. **مراقبة الأخطاء**: تحقق من Google Search Console
5. **النسخ الاحتياطية**: احفظ commits على GitHub

**آخر تحديث**: ديسمبر 2024

