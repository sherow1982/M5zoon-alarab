# Google Merchant Center Feed - Emirates Gifts

## Overview

This document explains how to use the Google Merchant Center feed for Emirates Gifts store.

## Feed File Location

📁 **File:** `google_merchant_feed_en.tsv`

## Feed Format

**Format:** Tab-Separated Values (TSV)
**Character Encoding:** UTF-8
**Language:** English
**Products:** 206 total
  - 100 Perfumes
  - 106 Watches

## Product Data Structure

The feed includes the following attributes for each product:

### Required Fields (Google Merchant Center)
```
- id: Unique product identifier (e.g., perfume_001, watch_001)
- title: Product title (max 150 characters)
- description: Full product description
- link: Direct product page URL
- image_link: Product image URL
- price: Original price in AED
- availability: in stock / out of stock
```

### Enhanced Fields (Recommended)
```
- sale_price: Discounted price (15-20% off)
- brand: Product brand name
- category: Product category
- condition: Product condition (new/refurbished/used)
- gtin: Global Trade Item Number
- mpn: Manufacturer Part Number
- shipping: Shipping cost
- quantity: Product quantity/size
- material: Material/composition
- gender: Target gender (Unisex/Male/Female)
```

## Product Categories

### 1. Perfumes (100 products)
- **Range:** perfume_001 to perfume_100
- **Brands:** Chanel, Dior, Tom Ford, Guerlain, Creed, Versace, Giorgio Armani, Prada, and more
- **Types:** Eau de Parfum, Eau de Toilette, Eau de Cologne, Fragrance
- **Price Range:** 250-400 AED
- **Discount:** 15% off on sale price

### 2. Watches (106 products)
- **Range:** watch_001 to watch_106
- **Brands:** Rolex, Omega, Tag Heuer, Breitling, IWC, Patek Philippe, and more
- **Styles:** Luxury, Sport, Classic, Dress, Casual, Aviation, Diving
- **Price Range:** 300-500 AED
- **Discount:** 20% off on sale price

## How to Use This Feed

### Step 1: Access Google Merchant Center
1. Go to [Google Merchant Center](https://merchants.google.com/)
2. Sign in with your Google account
3. Select your Emirates Gifts store

### Step 2: Upload the Feed
1. Navigate to **Products > Feeds**
2. Click **Create feed**
3. Choose feed type: **File**
4. Upload `google_merchant_feed_en.tsv`
5. Select **TSV** as the file format
6. Choose upload method: **Upload file** or **Fetch from URL**

### Step 3: Configure Feed Settings
1. **Feed name:** `Emirates Gifts English Products`
2. **Target country:** United Arab Emirates
3. **Language:** English
4. **Schedule:** Daily or as needed
5. **Processing rules:** Add any custom rules (optional)

### Step 4: Validate the Feed
1. Check for errors in the **Processing tab**
2. Fix any data quality issues
3. Ensure all products are validated

## Data Format Examples

### Perfume Example
```
ID: perfume_001
Title: Chanel Eau de Parfum - Floral Collection 1 100ML
Brand: Chanel
Price: 250.00 AED
Sale Price: 212.50 AED
Image: https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Chanel+1
Link: https://emirates-gifts.ae/en/product-details.html?id=perfume_001&category=perfume&slug=chanel-eau-de
```

### Watch Example
```
ID: watch_001
Title: Rolex Luxury Watch Black - 1 Premium Collection
Brand: Rolex
Price: 300.00 AED
Sale Price: 240.00 AED
Image: https://via.placeholder.com/300x300/D4AF37/FFFFFF?text=Rolex+Watch+1
Link: https://emirates-gifts.ae/en/product-details.html?id=watch_001&category=watch&slug=rolex-luxury-watch
```

## Common Issues and Solutions

### Issue: "Image URL not accessible"
**Solution:** Ensure image URLs are publicly accessible and use HTTPS protocol

### Issue: "Price format incorrect"
**Solution:** Use format: `250.00` (with decimal point and 2 digits)

### Issue: "Missing required fields"
**Solution:** Ensure all required fields are present: id, title, description, link, image_link, price, availability

### Issue: "Invalid URL format"
**Solution:** Use complete URLs with protocol (https://) for all links

## Feed Maintenance

### Regular Updates
- Update feed weekly or when product data changes
- Verify all product links are working
- Check image URLs for broken links
- Update prices and availability regularly

### Monitoring
- Check Google Merchant Center for warnings/errors
- Monitor product approval status
- Track feed processing logs
- Review data quality metrics

## Performance Tips

1. **Image Quality:** Use high-quality product images (minimum 300x300px)
2. **Descriptions:** Write clear, detailed product descriptions
3. **Pricing:** Ensure prices are accurate and competitive
4. **Links:** Test all product links before uploading
5. **Brand:** Use official brand names for better categorization
6. **Availability:** Keep stock status updated

## Integration with Ads Platforms

This feed is compatible with:
- **Google Shopping:** Product ads on Google Search
- **Performance Max:** Automated ad campaigns
- **Display Ads:** Product remarketing
- **YouTube Shopping:** Product recommendations

## Support

For issues with Google Merchant Center:
- Visit [Google Merchant Center Help](https://support.google.com/merchants/)
- Check [Feed requirements guide](https://support.google.com/merchants/answer/7052112)
- Contact Google support directly

---

**Last Updated:** December 12, 2025
**Feed Version:** 1.0
**Total Products:** 206
