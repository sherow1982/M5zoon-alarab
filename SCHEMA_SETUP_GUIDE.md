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

Open your layout.js and add this code:

```javascript
import Head from 'next/head';
import { getProductsSchema } from '@/lib/schema-handler';

export default function RootLayout({ children }) {
  const isArabic = true; // Based on your locale
  const schema = getProductsSchema(isArabic ? 'ar' : 'en');

  return (
    <html>
      <head>
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
import { useEffect } from 'react';
import { getProductSchema, injectSchema } from '@/lib/schema-handler';

export default function ProductPage({ params, product }) {
  useEffect(() => {
    const schema = getProductSchema(product, 'ar');
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
   - Copy your website link
   - Click Test URL

2. **Schema.org Validator:**
   - https://validator.schema.org/
   - Paste your link here

3. **Browser Dev Tools:**
   - F12 then Console tab
   - Search for script type="application/ld+json"

---

## 6️⃣ مثال لل Dynamic Products:

```javascript
import { useEffect, useState } from 'react';
import { injectSchema } from '@/lib/schema-handler';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);

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
| ما تظهر السكيما | قد تكون في _document.js | Check Head placement |
| JSON Invalid | Bad JSON format | Use JSON.stringify() |
| Prices Missing | Data incomplete | Connect to API |
| Language Issues | Wrong locale | Check router.locale |

---

## 8️⃣ الفوائد:

✅ **أزيا السكيما:**

- Better SEO - Google understands products
- Rich Snippets - Shows ratings and prices
- Google Merchant - Better listings
- Analytics - Better CTR tracking
- Voice Search - Works with Alexa/Google Home

---

## 9️⃣ الملفات الجاهزة:

✅ **JSON Schema Files:**
- public/schema/products-schema-ar.json
- public/schema/products-schema-en.json

✅ **Utility Function:**
- lib/schema-handler.js

---

## ❓ الأسئلة الشائعة:

Q: Does this affect page viewing?
A: No! Schema is hidden from users (for search engines only)

Q: Do I need schema per product?
A: Yes! Use getProductSchema() for each product

Q: Where do I add this code?
A: In your layout.js or _document.js file

---

**Done! Your schema is set up correctly!**
