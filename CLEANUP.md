# 🗑️ Cleanup Guide - Remove Legacy Files

هذا الملف يوضح ما يجب حذفه من الريبو لتنظيف المشروع.

## ❌ الملفات اللازم حذفها

### 1. Legacy PHP Files (لا يعملون على GitHub Pages)

```bash
rm generate-feed.php
rm generate-sitemap.php
```

**لماذا:**
- GitHub Pages يعمل static hosting فقط
- PHP requires backend server
- Python versions (generate_feed.py, generate_sitemap.py) يعملون بالفعل

### 2. Duplicate Google Merchant Feeds

```bash
rm google-merchant-feed.xml
rm google-merchant-feed-fixed.xml
rm product-feed.xml
rm product-feed.json
```

**لماذا:**
- `merchant-feed.xml` is the only feed needed
- Duplicates cause confusion and versioning issues
- Google Merchant Center expects single feed

### 3. Duplicate JavaScript Generators

```bash
rm merchant-feed-generator.js
rm merchant-feed-generator-fixed.js
```

**لماذا:**
- Feed generation is automated via Python scripts
- JavaScript generators are unnecessary
- Python is easier to maintain for data processing

### 4. Duplicate Python Generators

```bash
rm generate_products.py
rm generate_from_excel.py
rm generate_fixed_merchant_feed.py
```

**لماذا:**
- `generate_feed.py` handles everything
- Multiple generators cause inconsistency
- `generate_sitemap.py` handles sitemaps

### 5. TSV Feed File (Optional)

```bash
rm emirates_complete_merchant_feed.tsv
# أو احفظه للرجوع اليها
```

**لماذا:**
- XML feed is the standard (merchant-feed.xml)
- TSV files are older format
- No longer needed

---

## ✅ الملفات الواجب البقاء عليها

### Python Generators (KEEP)
```
✅ generate_feed.py         # Google Shopping Feed generator
✅ generate_sitemap.py      # Sitemap generator
```

### Product Data (KEEP)
```
✅ products/perfumes.json   # Product data
✅ products/watches.json    # Product data
```

### SEO Files (KEEP)
```
✅ merchant-feed.xml        # Google Shopping Feed
✅ sitemap.xml             # Main sitemap
✅ sitemap-en.xml          # English sitemap
✅ hreflang-sitemap.xml    # Language alternates
✅ robots.txt              # SEO robots
```

### Apache Files (KEEP - but won't affect GitHub Pages)
```
✅ .htaccess               # على custom domain
✅ .htaccess-sitemap       # على custom domain
```

### HTML Pages (KEEP)
```
✅ index.html
✅ en/index.html
✅ products-showcase.html
✅ product-details.html
✅ cart.html
✅ checkout.html
✅ blog.html
✅ privacy-policy.html
✅ terms-conditions.html
✅ shipping-policy.html
✅ return-policy.html
```

### Assets (KEEP)
```
✅ js/main.js
✅ css/styles.css
✅ assets/ (all images)
✅ favicon.ico
✅ site.webmanifest
✅ sw.js (Service Worker)
```

---

## 🚀 Cleanup Commands

### طريقة آمنة (Safe)

```bash
# انشئ branch للتنظيف
git checkout -b cleanup/remove-legacy-files

# حذف الملفاتً واحدة
rm generate-feed.php
rm generate-sitemap.php
rm google-merchant-feed.xml
rm google-merchant-feed-fixed.xml
rm product-feed.xml
rm product-feed.json
rm merchant-feed-generator.js
rm merchant-feed-generator-fixed.js
rm generate_products.py
rm generate_from_excel.py
rm generate_fixed_merchant_feed.py
rm emirates_complete_merchant_feed.tsv

# ارفع مع commit
git add .
git commit -m "cleanup: remove legacy and duplicate files"
git push origin cleanup/remove-legacy-files
```

Then create Pull Request and review before merging.

### طريقة سريعة (Fast)

```bash
# إذا كنت متأكداً

# احذف جميع الملفات في أمر واحد
git rm generate-feed.php generate-sitemap.php google-merchant-feed.xml google-merchant-feed-fixed.xml product-feed.xml product-feed.json merchant-feed-generator.js merchant-feed-generator-fixed.js generate_products.py generate_from_excel.py generate_fixed_merchant_feed.py emirates_complete_merchant_feed.tsv

# ارفع
git commit -m "cleanup: remove legacy and duplicate files"
git push origin main
```

---

## ⚠️ تحذيرات

⚠️ **قبل حذف أي قاعدة بيانات:**
- تأكد من بعمل backup
- تأكد أن بياناتك محفوظة
- اعمل cleanup على branch منفصلة أولاً

⚠️ **لا تحذف:
- `merchant-feed.xml` ✅
- `generate_feed.py` ✅
- `generate_sitemap.py` ✅
- `products/*.json` ✅
- `sitemap*.xml` ✅
- أي ملفات HTML ✅

---

## ✔️ Cleanup Checklist

```
[ ] طلب Create backup
[ ] لى Verify generate_feed.py works
[ ] لل Verify generate_sitemap.py works
[ ] ا Create cleanup branch
[ ] لم Delete PHP files (2 files)
[ ] لل Delete duplicate feeds (4 files)
[ ] لل Delete JS generators (2 files)
[ ] من Delete old Python generators (3 files)
[ ] لب Test locally
[ ] ا Create Pull Request
[ ] ا Review changes
[ ] ما Merge to main
[ ] ما Delete cleanup branch
[ ] لم Verify site works
```

---

## 📄 Storage Saved

```
Before cleanup: ~2.5 MB
After cleanup:  ~1.8 MB
Saved:          ~700 KB
```

---

**Last Updated:** December 2024
**Status:** Ready to execute
