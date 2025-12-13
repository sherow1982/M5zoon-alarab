# 🔒 Content Security Policy (CSP) Fix

**المشكلة:** 
```
The Content Security Policy directive 'frame-ancestors' is ignored when delivered via a <meta> element.
```

---

## ⚠️ المشكلة

ملبرواطر Chrome (ومباطرها الأخرى) لا تزال معا بتوجيهات CSP مثلاً:
- `frame-ancestors`
- `report-uri`
- `sandbox`

عندما يتم توافرها عبر `<meta>` HTML بدلاً من HTTP Headers.

---

## ✅ الحل

### 1️⃣ **Remove Meta CSP Tag**

حذف السطر من HTML:

```html
<!-- حذف هذا -->
<meta http-equiv="Content-Security-Policy" content="...">
```

### 2️⃣ **Add HTTP Headers Instead**

استخدم الطريقة الصحيحة عبر HTTP Headers.

#### لل Apache (.htaccess)

```apache
<IfModule mod_headers.c>
    Header set Content-Security-Policy \
        "default-src 'self' https:; \
        script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; \
        style-src 'self' 'unsafe-inline'; \
        img-src 'self' data: https:; \
        font-src 'self' data:; \
        connect-src 'self' https://www.google-analytics.com https://www.facebook.com; \
        frame-src 'self' https://www.youtube.com https://www.facebook.com; \
        object-src 'none'; \
        base-uri 'self'; \
        form-action 'self'"
    
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
EndIfModule
```

**الملف:** `public/.htaccess`

#### لل Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    add_header Content-Security-Policy \
        "default-src 'self' https:; \
        script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; \
        style-src 'self' 'unsafe-inline'; \
        img-src 'self' data: https:; \
        font-src 'self' data:; \
        connect-src 'self' https://www.google-analytics.com https://www.facebook.com; \
        frame-src 'self' https://www.youtube.com https://www.facebook.com; \
        object-src 'none'; \
        base-uri 'self'; \
        form-action 'self'" always;
    
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

**الملف:** `nginx.conf`

#### لل Node.js/Express

```javascript
const helmet = require('helmet');
const express = require('express');
const app = express();

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'", 'https:'],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com', 'https://connect.facebook.net'],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:'],
    fontSrc: ["'self'", 'data:'],
    connectSrc: ["'self'", 'https://www.google-analytics.com', 'https://www.facebook.com'],
    frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.facebook.com'],
    objectSrc: ["'none'"],
    baseUri: ["'self'"],
    formAction: ["'self'"]
  }
}));

app.listen(3000);
```

#### لل Vercel/Netlify (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self' https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com https://www.facebook.com; frame-src 'self' https://www.youtube.com https://www.facebook.com; object-src 'none'; base-uri 'self'; form-action 'self'"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

---

## 📑 شرح CSP Directives

| السياسة | الوصف |
|---|---|
| `default-src` | المسار الافتراضية |
| `script-src` | مادر JavaScript |
| `style-src` | مادر CSS |
| `img-src` | مادر الصور |
| `font-src` | مادر الخطوط |
| `connect-src` | روابط AJAX/WebSocket |
| `frame-src` | iframes مسموحة |
| `object-src` | عناصر الوسائط |
| `base-uri` | أل عناصر base |
| `form-action` | وجهات النماذج |
| `frame-ancestors` | روابط مسموحة للربط (ليس عبر meta) |

---

## 🔐 حالات خاصة

### السماح بلادهاي موثوقة

```
script-src 'unsafe-inline' 'unsafe-eval'
```

⚠️ **وذرار أمانية عالية!** استخدم `nonce` بدلاً:

```html
<script nonce="random-nonce-value">
  console.log('Safe inline script');
</script>
```

### السماح بروابط عامة

```
img-src 'self' data: https: blob:
script-src 'self' https:
```

---

## ✅ الفحص

### Chrome DevTools

1. افتح DevTools (F12)
2. اذهب لتبويب Console
3. ابحث عن CSP errors

```
Refused to load the script 'https://example.com'
because it violates the following Content Security Policy directive:
```

### csp-evaluator.withgoogle.com

استخدم الأداة التالية للتحقق:
https://csp-evaluator.withgoogle.com

---

## 📇 الملفات المرافقة

- `public/.htaccess` - إعدادات Apache
- `nginx.conf` - إعدادات Nginx
- `vercel.json` - إعدادات Vercel (optional)

---

## 🙋 الخطوات القادمة

1. ارفع الملفات المناسبة لخادمك
2. اختبر على متصفح Chrome
3. فتح DevTools Console
4. بعد التعديل سيختفي التحذير

---

## ✅ التحقق من النجاح

Dev Tools سيعرض هذا بدلاً من التحذير:

```
✅ No CSP warnings
✅ No 'frame-ancestors' ignored messages
✅ Headers properly applied
```

---

**الحالة:** ✅ مصححاً
