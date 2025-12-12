# 📜 دليل تثبيت السكيما (Schema Setup Guide)

## المشكلة مها

السكيما مفقودة والموقع ما بيعرض المنتجات تمام عا 

📌 **الحلول الموفرة:**

---

## 1️⃣ الملفات الناحية

### ✅ الملفات مرفوعة:

```
public/schema/
  └─ products-schema-ar.json    (العربي)
  └─ products-schema-en.json    (English)

lib/
  └─ schema-handler.js          (React Hook)
```

---

## 2️⃣ التثبيت في pages/layout.js

### لل Next.js App Router:

```javascript
// app/layout.js

import Head from 'next/head';
import { getProductsSchema } from '@/lib/schema-handler';

export default function RootLayout({ children }) {
  const isArabic = true; // ريً a على locale
  const schema = getProductsSchema(isArabic ? 'ar' : 'en');

  return (
    <html>
      <head>
        {/* Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': schema.context,
              '@type': schema.type,
              'name': schema.name,
              'description': schema.description,
              'url': schema.url,
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 3️⃣ التثبيت في صفحة المنتج:

### لل Product Page:

```javascript
// app/products/[id]/page.js

import { useEffect } from 'react';
import { getProductSchema, injectSchema } from '@/lib/schema-handler';

export default function ProductPage({ params, product }) {
  useEffect(() => {
    const schema = getProductSchema(product, 'ar'); // أو 'en'
    injectSchema(schema);
  }, [product]);

  return (
    <div>
      {/* Product content */}
    </div>
  );
}
```

---

## 4️⃣ التثبيت لل Pages Router (Pages Directory):

```javascript
// pages/_document.js

import { Html, Head, Main, NextScript } from 'next/document';
import { getProductsSchema } from '@/lib/schema-handler';

export default function Document() {
  const schema = getProductsSchema('ar');

  return (
    <Html>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': schema.context,
              '@type': schema.type,
              'name': schema.name,
              'description': schema.description,
              'url': schema.url,
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

---

## 5️⃣ التحقق من العمل

### أدوات الفحص:

1. **Google Rich Results Test:**
   - https://search.google.com/test/rich-results
   - انسخ ت الرابط الموقع
   - اضغط "Test URL"

2. **Schema.org Validator:**
   - https://validator.schema.org/
   - الق رابطك هنا

3. **Browser Dev Tools:**
   - F12 → Console
   - ابحث عن `<script type="application/ld+json">`

---

## 6️⃣ مثال لل Dynamic Products:

```javascript
// components/ProductList.js

import { useEffect, useState } from 'react';
import { injectSchema } from '@/lib/schema-handler';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // جلب المنتجات
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);

      // أضف schema لكل منتج
      data.forEach(product => {
        injectSchema(getProductSchema(product, 'ar'));
      });
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          {/* Product card */}
        </div>
      ))}
    </div>
  );
}
```

---

## 7️⃣ المشاكل الشائعة:

### ✅ الحلول:

| المشكلة | السبب | الحل |
|-------|--------|------|
| ما تظهر السكيما | قد تكون في _document.js | الق ممحا بسيطة في Head |
| JSON Invalid | أو Invalid JSON | استخدم JSON.stringify() |
| Prices Missing | البيانات ناقصة | اربط مع API مباشر |
| Language Issues | locale غير صحيح | تحقق من router.locale |

---

## 8️⃣ الفوائد:

✅ **أزيا السكيما:**

- 🕳️ **SEO أفضل** - Google يفهم المنتجات
- ⭐ **Rich Snippets** - عرض التقييمات
- 📄 **Google Merchant** - للعرض قيمه
- 📈 **Analytics** - تحسين CTR
- 🌏 **Voice Search** - تأثير على Alexa/Google Home

---

## 9️⃣ الملفات الجاهزة:

✅ **JSON Schema Files:**
- `public/schema/products-schema-ar.json` (رابط: https://github.com/sherow1982/emirates-gifts/blob/main/public/schema/products-schema-ar.json)
- `public/schema/products-schema-en.json` (رابط: https://github.com/sherow1982/emirates-gifts/blob/main/public/schema/products-schema-en.json)

✅ **Utility Function:**
- `lib/schema-handler.js` (رابط: https://github.com/sherow1982/emirates-gifts/blob/main/lib/schema-handler.js)

---

## ❓ الأسئلة الشائعة:

**Q: هل هذا يأثر على مشاهدة الموقع?**
الا: لا! السكيما للبحث فقط (Hidden from view)

**Q: يريد كل منتج سكيما منفرد?**
الا: نعم! استخدم `getProductSchema()` لكل منتج

---

**✨ تم العمل!**
