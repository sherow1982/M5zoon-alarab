# 📚 Product Pages Schema Implementation Guide
## Complete Guide for English & Arabic Product Detail Pages

---

## 🎁 Overview

This guide explains how to use the product detail page templates with proper schema markup for Google to recognize and display rich product snippets.

---

## 📁 File Structure

```
🎁 Product Detail Pages with Schema:

├─ public/en/product-details.html
│  └─ English product page (LTR)
│
├─ products/product-details-ar.html
│  └─ Arabic product page (RTL)
└─ PRODUCT_PAGES_GUIDE.md
   └─ This documentation
```

---

## 🔙 Required Variables (Placeholders)

Replace these placeholders in both English and Arabic templates:

### **Product Information**
```
{{productId}}              - Unique product identifier (e.g., "perfume_6")
{{productName}}            - English product name
{{productNameAR}}          - Arabic product name
{{productDescription}}     - English product description
{{productDescriptionAR}}   - Arabic product description
{{productSlug}}            - URL-friendly slug (e.g., "guerlain-shalimar")
{{emoji}}                  - Emoji representing product (e.g., "🌸")
```

### **Pricing & Availability**
```
{{price}}                  - Price in AED (e.g., "299")
{{priceValidUntil}}        - Price validity date (default: "2025-12-31")
{{inventoryCount}}         - Number in stock (e.g., "50")
{{avgRating}}              - Average rating 1-5 (e.g., "4.8")
{{ratingCount}}            - Total number of ratings (e.g., "25")
```

### **Classification**
```
{{category}}               - Product category (perfume, watch, care)
{{categoryName}}           - English category name
{{categoryNameAR}}         - Arabic category name
{{brandName}}              - English brand name
{{brandNameAR}}            - Arabic brand name
```

### **Identifiers**
```
{{gtin13}}                 - Global Trade Item Number (13-digit)
{{mpn}}                    - Manufacturer Part Number
```

---

## 🚚 URL Structure

### **English Product Pages**
```
Format: /en/product-details.html?id={{productId}}

Example:
https://emirates-gifts.arabsad.com/en/product-details.html?id=perfume_6

Alternative (with slug):
https://emirates-gifts.arabsad.com/en/product-details.html?id=perfume_6&category=perfume&slug=guerlain-shalimar
```

### **Arabic Product Pages**
```
Format: /products/{{productSlug}}-ar.html

Example:
https://emirates-gifts.arabsad.com/products/guerlain-shalimar-ar.html

With category:
https://emirates-gifts.arabsad.com/products/guerlain-shalimar-ar.html?category=perfume
```

---

## 🔏 Complete Schema Markup

### **1. Product Schema (JSON-LD)**

Includes all required and recommended fields:

```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product description",
  "image": ["image-1.jpg", "image-2.jpg", "image-3.jpg"],
  "brand": {"@type": "Brand", "name": "Brand Name"},
  "sku": "product-id",
  "gtin13": "1234567890123",
  "mpn": "MPN123",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "AED",
    "price": "299",
    "availability": "https://schema.org/InStock",
    "seller": {"@type": "Organization", "name": "Emirates Gifts Store"},
    "shippingDetails": {/* Shipping info */},
    "hasMerchantReturnPolicy": {/* Return policy */}
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "25"
  },
  "review": [{/* Review objects */}]
}
```

### **2. BreadcrumbList Schema**

For better navigation in Google Search:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"position": 1, "name": "Home", "item": "https://..."},
    {"position": 2, "name": "Products", "item": "https://..."},
    {"position": 3, "name": "Category", "item": "https://..."},
    {"position": 4, "name": "Product Name", "item": "https://..."}
  ]
}
```

### **3. Review Schema**

Fan of customer reviews with ratings:

```html
<div itemscope itemtype="https://schema.org/Review">
  <div itemprop="author">Author Name</div>
  <div itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
    <meta itemprop="ratingValue" content="5">
  </div>
  <div itemprop="reviewBody">Review text...</div>
</div>
```

---

## 🔍 Meta Tags Implementation

### **Open Graph Tags (Social Sharing)**
```html
<meta property="og:type" content="product">
<meta property="og:title" content="Product Name">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://...">
<meta property="og:url" content="https://...">
```

### **Canonical & Hreflang (Multi-language)**
```html
<!-- English page -->
<link rel="canonical" href="https://emirates-gifts.arabsad.com/en/product-details.html?id=...">
<link rel="alternate" hreflang="ar" href="https://emirates-gifts.arabsad.com/products/...ar.html" />
<link rel="alternate" hreflang="en" href="https://emirates-gifts.arabsad.com/en/product-details.html?id=..." />

<!-- Arabic page -->
<link rel="canonical" href="https://emirates-gifts.arabsad.com/products/...-ar.html">
<link rel="alternate" hreflang="ar" href="https://emirates-gifts.arabsad.com/products/...-ar.html" />
<link rel="alternate" hreflang="en" href="https://emirates-gifts.arabsad.com/en/product-details.html?id=..." />
```

---

## 🔡 Implementation Checklist

### **For Every Product Page:**

- [ ] Replace all {{placeholders}} with actual data
- [ ] Ensure product ID is unique
- [ ] Add high-quality product images (minimum 3)
- [ ] Include accurate price in AED
- [ ] Add customer reviews (minimum 2)
- [ ] Set inventory count
- [ ] Provide valid GTIN or MPN
- [ ] Include shipping details
- [ ] Specify return policy
- [ ] Test schema with Google Rich Results Tool

### **For SEO:**

- [ ] Create XML sitemap entry
- [ ] Submit to Google Search Console
- [ ] Verify canonical URLs
- [ ] Check hreflang implementation
- [ ] Test Open Graph tags
- [ ] Validate meta descriptions

---

## 📄 Example Implementation

### **English Product Page Example**

```html
<!-- File: /public/en/product-details.html -->
<!-- URL: https://emirates-gifts.arabsad.com/en/product-details.html?id=perfume_6 -->

<!-- Replace placeholders: -->
{{productId}}            → perfume_6
{{productName}}          → Guerlain Shalimar
{{productDescription}}   → Timeless oriental perfume...
{{price}}                → 899
{{category}}             → perfume
{{categoryName}}         → Fragrances
{{brandName}}            → Guerlain
{{avgRating}}            → 4.8
{{ratingCount}}          → 35
```

### **Arabic Product Page Example**

```html
<!-- File: /products/product-details-ar.html -->
<!-- URL: https://emirates-gifts.arabsad.com/products/guerlain-shalimar-ar.html -->

<!-- Replace placeholders: -->
{{productId}}            → perfume_6
{{productNameAR}}        → عطر غرلان شاليمار
{{productDescriptionAR}} → عطر شرقي خالد...
{{price}}                → 899
{{category}}             → perfume
{{categoryNameAR}}       → العطور
{{brandNameAR}}          → غرلان
{{avgRating}}            → 4.8
{{ratingCount}}          → 35
```

---

## 👫 How Google Uses This Data

### **Rich Product Snippets**
Google displays:
- Product name & image
- Price
- Availability
- Star rating & review count
- Free/paid shipping info

### **Google Shopping**
Required for shopping feed:
- Price (AED)
- Availability
- Product ID
- Images
- Brand
- Description

### **Knowledge Panel**
Can appear in Google Search when:
- All schema fields are complete
- Content matches user intent
- High quality and authority

---

## 🔌 Validation Tools

### **Test Your Implementation:**

1. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Validates Product, Review, and Breadcrumb schemas

2. **Schema.org Validator**
   - https://validator.schema.org/
   - Check JSON-LD syntax

3. **Structured Data Testing Tool**
   - https://search.google.com/structured-data/testing-tool
   - Identify issues and improvements

4. **Open Graph Preview**
   - https://www.opengraphcheck.com/
   - Test social sharing appearance

---

## 📑 Best Practices

### **Schema Markup**
- ✅ Always use JSON-LD format
- ✅ Include multiple images
- ✅ Add real customer reviews
- ✅ Keep data accurate and updated
- ✅ Use structured review data

### **SEO**
- ✅ Write unique descriptions
- ✅ Use relevant keywords
- ✅ Include shipping info
- ✅ Display return policy
- ✅ Show availability status

### **User Experience**
- ✅ Clear product images
- ✅ Competitive pricing display
- ✅ Easy add-to-cart process
- ✅ Prominent reviews section
- ✅ Trust badges/certifications

---

## 🔓 Troubleshooting

### **Schema Not Showing in Rich Results**

**Problem:** "No eligible content found"
- [ ] Verify all placeholders are replaced
- [ ] Check JSON-LD syntax
- [ ] Ensure product ID is unique
- [ ] Add minimum required fields
- [ ] Include at least 2 customer reviews

### **Missing Information**

**Problem:** "Rating not shown"
- [ ] Add `aggregateRating` with both value and count
- [ ] Ensure rating is 1-5
- [ ] Include minimum 3 reviews
- [ ] Validate rating format

### **Hreflang Issues**

**Problem:** "Alternate pages not linked"
- [ ] Check hreflang URLs are correct
- [ ] Verify both languages have hreflang tags
- [ ] Use self-referential hreflang
- [ ] Test with Google Search Console

---

## 🚚 Live Examples

### **English Product:**
```
https://emirates-gifts.arabsad.com/en/product-details.html?id=perfume_6&category=perfume&slug=guerlain-shalimar-oriental-classic
```

### **Arabic Product:**
```
https://emirates-gifts.arabsad.com/products/guerlain-shalimar-oriental-classic-ar.html
```

---

## 📒 Additional Resources

- [Google Product Schema Documentation](https://schema.org/Product)
- [Merchant Center Product Feed](https://support.google.com/merchants/answer/7052112)
- [Review Schema Best Practices](https://schema.org/Review)
- [Multi-Language SEO Guide](https://developers.google.com/search/docs/advanced/crawling/localization)

---

## ✨ Summary

Product detail pages now include:
- ✅ **Complete Product Schema** with all Google-required fields
- ✅ **Offer Schema** with pricing, shipping, and return policies
- ✅ **Review Schema** for customer testimonials
- ✅ **BreadcrumbList** for site navigation
- ✅ **Hreflang Tags** for bilingual SEO
- ✅ **Open Graph** for social media sharing
- ✅ **Mobile Responsive** design for all devices

**Ready for Google Rich Results!**

---

**Last Updated:** December 12, 2025  
**Version:** 1.0 Complete  
**Status:** ✅ Ready for Production
