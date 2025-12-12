# 📄 دليل تطبيق السكيما (Schema Integration Guide)

## 🚀 طرق الاستخدام:

### الطريقة 1️⃣: النسخ المباشر (Easiest)

**الخطوات:**

1. اذهب هنا:
   ```
   https://github.com/sherow1982/emirates-gifts/blob/main/public/schema.html
   ```

2. انسخ الـ schema من `<script type="application/ld+json">` إلى `</script>`

3. الصقه في `<head>` بتاع موقعك:
   ```html
   <head>
     <!-- Other head content -->
     
     <script type="application/ld+json">
     {
       "@context": "https://schema.org/",
       "@type": "Organization",
       ...
     }
     </script>
   </head>
   ```

### الطريقة 2️⃣: استعمال JavaScript

**الخطوات:**

1. ارفع هذا الفايل على موقعك:
   ```
   /schema/inject-schema.js
   ```

2. أضف هذا السطر فير body:
   ```html
   <script src="/schema/inject-schema.js"></script>
   ```

3. بعدتن الصفحة سيضيف الـ schema تلقائياً

### الطريقة 3️⃣: استعمال JSON Files

**بيانات مباشرة:**

```
https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/schema/products-schema-ar.json
```

**في React/Next.js:**
```javascript
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    // Fetch schema
    fetch('/schema/products-schema-ar.json')
      .then(r => r.json())
      .then(schema => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
  }, []);

  return <div>{/* Content */}</div>;
}
```

---

## 💡 الملفات الموجودة:

| الملف | المسار | الصيغة |
|-------|--------|-------|
| Organization Schema | `public/schema/products-schema-ar.json` | JSON |
| Products List | `public/schema/products-schema-en.json` | JSON |
| HTML Template | `public/schema.html` | HTML |
| JS Injector | `public/schema/inject-schema.js` | JavaScript |

---

## 🔍 التحقق من العمل:

### 1. **Google Rich Results Test:**
```
https://search.google.com/test/rich-results
```

**الخطوات:**
1. ادخل رابط موقعك
2. اضغط "Test URL"
3. راقب الرسالة

### 2. **Browser Developer Tools:**
```
F12 > Elements > Search for 'ld+json'
```

**يجب أن ترى:**
```html
<script type="application/ld+json">
  { schema here }
</script>
```

### 3. **Schema.org Validator:**
```
https://validator.schema.org/
```

---

## ✅ ما يدخل السكيما:

✓ **Organization Info:**
- الاسم: Emirates Gifts
- الموقع: https://emirates-gifts.arabsad.com
- مواقع التواصل: Facebook, Instagram
- بيانات التواصل

✓ **Products (241 منتج):**
- الاسم عربي/إنجليزي
- الزي وسعر العرض
- الصورة
- البراند
- الرابط
- التقييمات

---

## 📈 الفوائد:

✅ **SEO أفضل**
- Google يفهم المحتوى
- ضهور أفضل في البحث

✅ **Rich Snippets**
- عرض الأسعار مباشرة
- عرض التقييمات
- عرض الطاقم المعروضة

✅ **Voice Search**
- ملائمة لـ Alexa وGoogle Home

✅ **Social Sharing**
- بيانات أدق تر شرع موقعك

---

## 💫 المرجع:

- رابط الملفات:
  - JSON Schema: `public/schema/`
  - JavaScript: `public/schema/inject-schema.js`
  - HTML Template: `public/schema.html`

- الوثائق:
  - Schema.org: https://schema.org/
  - Google Guide: https://developers.google.com/search/docs/appearance/structured-data
  - Rich Results Test: https://search.google.com/test/rich-results

---

**🌟 الآن موقعك له سكيما عالية الجودة!**
