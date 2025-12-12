# Emirates Gifts - Products Schema Setup Guide

## 🎁 Overview

Full bilingual e-commerce setup with:
- **110+ Products** (expandable to 263)
- **Arabic & English** support
- **Complete Schema Markup** for SEO
- **Optimized for Google Search & Google Merchant Center**

---

## 💼 File Structure

```
emirates-gifts/
├─ public/
│  ├─ products-grid.html          # Main products grid (AR+EN toggle)
│  ├─ products-data.json         # 110 products database
│  ├─ all-products-263.json     # Full 263 products (expandable)
│  ├─ en/
│  │  ├─ product-template.html    # English product detail page
│  └─ robots.txt                 # SEO robots configuration
│
├─ products/
│  ├─ product-template-ar.html  # Arabic product detail page
└─ SETUP_SCHEMA.md               # This file
```

---

## 🔝 Schema Implementation

### Product Schema (JSON-LD)
All product pages include:

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": "product-image-url",
  "sku": "product-id",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "AED",
    "price": "amount",
    "availability": "InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "ratingCount": "100"
  }
}
```

### BreadcrumbList Schema

For better navigation in Google Search:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://emirates-gifts.arabsad.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://emirates-gifts.arabsad.com/products/"
    }
  ]
}
```

### Open Graph Tags

For social media sharing:
```html
<meta property="og:type" content="product">
<meta property="og:title" content="Product Name">
<meta property="og:description" content="Product description">
<meta property="og:image" content="product-image-url">
<meta property="og:url" content="https://emirates-gifts.arabsad.com/products/...">
```

---

## 🕺️ Bilingual SEO (hreflang)

Both templates include hreflang tags:

```html
<!-- Arabic page -->
<link rel="alternate" hreflang="ar" href="https://emirates-gifts.arabsad.com/products/..." />
<link rel="alternate" hreflang="en" href="https://emirates-gifts.arabsad.com/en/products/..." />

<!-- English page -->
<link rel="alternate" hreflang="en" href="https://emirates-gifts.arabsad.com/en/products/..." />
<link rel="alternate" hreflang="ar" href="https://emirates-gifts.arabsad.com/products/..." />
```

---

## 📼 Product Database Structure

### JSON Format (products-data.json)

```json
{
  "id": 1,
  "nameAR": "عطر أريف",
  "nameEN": "ARIAF Perfume",
  "category": "perfume",
  "priceAED": 299,
  "descAR": "عطر فاخر",
  "descEN": "Premium fragrance"
}
```

### Categories
- **perfume** - Luxury fragrances
- **watch** - Premium watches
- **care** - Hair & care products

---

## 🚚 robots.txt Configuration

Optimized for:
- Google Search indexing
- Google Image indexing
- Multi-language content
- Sitemap discovery

```
User-agent: *
Allow: /
Allow: /products/
Allow: /en/products/

Disallow: /data/
Disallow: /.git/
Disallow: /cart.html
Disallow: /checkout.html

Sitemap: https://emirates-gifts.arabsad.com/sitemap.xml
Sitemap: https://emirates-gifts.arabsad.com/sitemap-en.xml
Sitemap: https://emirates-gifts.arabsad.com/sitemap-index.xml
```

---

## 🔍 Google Merchant Center Integration

### Feed Specifications

**Required Fields:**
- ID (product id)
- Title (nameEN / nameAR)
- Description (descEN / descAR)
- Link (product URL)
- Image link (product image)
- Availability (InStock)
- Price (in AED)
- Currency (AED)

**Optional but Recommended:**
- Brand
- GTIN
- Condition
- SKU

---

## 🚞 Google Ads Integration

### Smart Shopping Campaign Setup

1. **Connect Merchant Center**
   - Verify domain ownership
   - Upload product feed
   - Map attributes to schema

2. **Pixel Tracking**
   ```html
   <!-- Add conversion tracking -->
   <script src="https://www.googleadservices.com/pagead/conversion.js"></script>
   ```

3. **Conversion Events**
   - View product
   - Add to cart
   - Purchase
   - Contact us

---

## 🚀 Expansion to 263 Products

### Current Status
- **Implemented:** 110 products (50 perfumes + 50 watches + 10 care)
- **Expandable:** All JSON files support unlimited products

### How to Add More Products

1. Edit `all-products-263.json`
2. Add new product objects to `products` array
3. Keep ID unique and sequential
4. Follow same structure (nameAR, nameEN, category, priceAED)
5. Update `summary.total` count

---

## 📄 Live URLs

### Main Pages
- **Products Grid:** https://emirates-gifts.arabsad.com/products-grid.html
- **Data API:** https://emirates-gifts.arabsad.com/all-products-263.json
- **English Template:** https://emirates-gifts.arabsad.com/en/product-template.html
- **Arabic Template:** https://emirates-gifts.arabsad.com/products/product-template-ar.html

### SEO Files
- **robots.txt:** https://emirates-gifts.arabsad.com/robots.txt
- **Sitemap Index:** https://emirates-gifts.arabsad.com/sitemap-index.xml
- **Arabic Sitemap:** https://emirates-gifts.arabsad.com/sitemap.xml
- **English Sitemap:** https://emirates-gifts.arabsad.com/sitemap-en.xml

---

## ✅ SEO Checklist

- [x] Product schema markup
- [x] BreadcrumbList schema
- [x] Open Graph tags
- [x] Hreflang for bilingual content
- [x] Mobile responsive design
- [x] Structured data validation
- [x] robots.txt configuration
- [x] Sitemap generation
- [x] Meta descriptions
- [x] Keyword optimization

---

## 🛠️ Tools for Validation

### Schema Validation
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- JSON-LD Validator: https://jsonld.com/validator/

### SEO Audit
- Google Search Console: https://search.google.com/search-console
- Screaming Frog: https://www.screamingfrog.co.uk/seo-spider/
- Ahrefs: https://ahrefs.com/
- SEMrush: https://www.semrush.com/

### Meta Tag Checker
- Meta Tags Preview: https://metatags.io/
- OpenGraph Preview: https://www.opengraphcheck.com/

---

## 📚 Additional Resources

### Documentation
- [Schema.org Product](https://schema.org/Product)
- [Google Search Central](https://developers.google.com/search)
- [Google Merchant Center Help](https://support.google.com/merchants)
- [Hreflang Guide](https://developers.google.com/search/docs/advanced/crawling/localization)

### Best Practices
- Keep product information accurate and up-to-date
- Use high-quality product images
- Write compelling product descriptions
- Maintain consistent pricing across platforms
- Update sitemap after adding/removing products

---

**Last Updated:** December 12, 2025  
**Status:** ✅ Production Ready  
**Support:** Fully Expandable to 263+ Products
