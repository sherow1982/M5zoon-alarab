# Excel Merchant Feed Files - Emirates Gifts

## 📊 Overview

This guide explains how to generate, download, and use Excel merchant feed files for Google Merchant Center.

## 🎯 Available Files

### Option 1: Generate Excel Files Locally

**Script:** `generate_merchant_feed.py`

#### Requirements
```bash
pip install pandas openpyxl
```

#### Usage
```bash
python generate_merchant_feed.py
```

#### Output
- `Emirates_Gifts_Merchant_Feed_EN.xlsx` (206 products, English)
- `Emirates_Gifts_Merchant_Feed_AR.xlsx` (206 products, Arabic)

---

## 📥 Download Pre-Generated Files

### English Version
**File:** `Emirates_Gifts_Merchant_Feed_EN.xlsx`

**Features:**
- ✅ 206 products (100 perfumes + 106 watches)
- ✅ All data in English
- ✅ Column headers in English
- ✅ Ready for Google Merchant Center
- ✅ Ready for Google Shopping Ads

**Download Link:**
```
https://github.com/sherow1982/emirates-gifts/raw/main/Emirates_Gifts_Merchant_Feed_EN.xlsx
```

### Arabic Version
**File:** `Emirates_Gifts_Merchant_Feed_AR.xlsx`

**Features:**
- ✅ 206 products (100 perfumes + 106 watches)
- ✅ All data in Arabic
- ✅ Column headers in Arabic (الرأس)
- ✅ Ready for Google Merchant Center
- ✅ Supports RTL (Right-to-Left) display

**Download Link:**
```
https://github.com/sherow1982/emirates-gifts/raw/main/Emirates_Gifts_Merchant_Feed_AR.xlsx
```

---

## 📋 Excel File Structure

### Column Headers (English)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| **id** | Text | Unique product ID | perfume_001, watch_001 |
| **title** | Text | Product name | Chanel Eau de Parfum - Floral 100ML |
| **description** | Text | Full description | Premium fragrance with long-lasting scent |
| **link** | URL | Product page URL | https://emirates-gifts.ae/en/product-details... |
| **image_link** | URL | Product image URL | https://via.placeholder.com/... |
| **price** | Number | Original price | 250.00 |
| **sale_price** | Number | Discounted price | 212.50 |
| **availability** | Text | Stock status | in stock / out of stock |
| **brand** | Text | Brand name | Chanel, Rolex, etc. |
| **category** | Text | Product category | Perfume & Fragrance / Watches & Accessories |
| **condition** | Text | Product condition | new / refurbished / used |
| **gtin** | Text | Global Trade Item Number | 8500000001 |
| **mpn** | Text | Manufacturer Part Number | Chanel-Floral-1 |
| **shipping** | Text | Shipping cost | AED 15 / AED 20 |
| **quantity** | Text | Size/Quantity | 100 ML / 1 |
| **material** | Text | Material/Type | Eau de Parfum / Gold Case |
| **gender** | Text | Target gender | Unisex / Male / Female |

### Column Headers (Arabic)

| العمود | النوع | الوصف | مثال |
|--------|------|--------|-------|
| **معرف** | نص | معرف المنتج الفريد | perfume_001 |
| **العنوان** | نص | اسم المنتج | عطر شانيل - مجموعة الزهري |
| **الوصف** | نص | وصف كامل | عطر فاخر برائحة طويلة الأمد |
| **الرابط** | URL | رابط صفحة المنتج | https://emirates-gifts.ae/ar/product-details... |
| **رابط الصورة** | URL | رابط صورة المنتج | https://via.placeholder.com/... |
| **السعر** | رقم | السعر الأصلي | 250.00 |
| **سعر البيع** | رقم | السعر المخفض | 212.50 |
| **التوفر** | نص | حالة المخزون | متوفر / غير متوفر |
| **العلامة التجارية** | نص | اسم العلامة التجارية | شانيل، رولكس، إلخ |
| **الفئة** | نص | فئة المنتج | العطور والروائح |
| **الحالة** | نص | حالة المنتج | جديد / مجدد / مستعمل |
| **GTIN** | نص | رقم التجارة العالمي | 8500000001 |
| **MPN** | نص | رقم الجزء من المصنع | Chanel-Floral-1 |
| **الشحن** | نص | تكلفة الشحن | درهم 15 / درهم 20 |
| **الكمية** | نص | الحجم/الكمية | 100 مل / 1 |
| **المادة** | نص | المادة/النوع | عطر / علبة ذهبية |
| **الجنس** | نص | الفئة المستهدفة | جنسي / ذكر / أنثى |

---

## 📦 Product Data Summary

### Perfumes (100 products)
- **ID Range:** perfume_001 to perfume_100
- **Brands:** 19 international perfume brands
- **Price Range:** AED 250 - 400
- **Discount:** 15% off
- **Size:** 100 ML each
- **Types:** Eau de Parfum, Eau de Toilette, Cologne, etc.

### Watches (106 products)
- **ID Range:** watch_001 to watch_106
- **Brands:** 18 luxury watch brands
- **Price Range:** AED 300 - 500
- **Discount:** 20% off
- **Quantity:** 1 unit each
- **Styles:** Luxury, Sport, Classic, Dress, Casual, Aviation, Diving, etc.

---

## 🚀 How to Use with Google Merchant Center

### Step 1: Download the Excel File
1. Choose your preferred language version:
   - **English:** `Emirates_Gifts_Merchant_Feed_EN.xlsx`
   - **Arabic:** `Emirates_Gifts_Merchant_Feed_AR.xlsx`

2. Click the download link or:
   - Go to GitHub repository
   - Find the file
   - Click "Download raw file"

### Step 2: Convert to TSV (Optional but Recommended)

Google Merchant Center prefers TSV format:

```python
import pandas as pd

# Read Excel
df = pd.read_excel('Emirates_Gifts_Merchant_Feed_EN.xlsx')

# Save as TSV
df.to_csv('emirates_feed.tsv', sep='\t', index=False)
```

### Step 3: Upload to Google Merchant Center

1. Go to [Google Merchant Center](https://merchants.google.com/)
2. Navigate to **Products > Feeds**
3. Click **Create feed**
4. Select **File** as the upload method
5. Choose **TSV** as the format (or Excel if supported)
6. Upload your file
7. Configure feed settings:
   - Feed name: `Emirates Gifts - EN/AR`
   - Target country: United Arab Emirates
   - Language: English/Arabic
   - Schedule: Daily or as needed

### Step 4: Validate the Feed

1. Check the **Processing** tab for errors
2. Fix any data quality issues
3. Ensure all products are validated (no errors)
4. Monitor the **Issues** tab for warnings

---

## ✅ Validation Checklist

Before uploading to Google Merchant Center, verify:

- [ ] All required fields are present (id, title, description, link, image_link, price, availability)
- [ ] No empty cells in critical columns
- [ ] URLs are valid and accessible
- [ ] Prices are in correct format (XXX.XX)
- [ ] Images are 300x300px minimum
- [ ] Product links are working
- [ ] No duplicate product IDs
- [ ] File format is correct (Excel or TSV)
- [ ] Character encoding is UTF-8
- [ ] Total products count matches (206)

---

## 🔧 Troubleshooting

### Issue: "File format not supported"
**Solution:** Convert Excel to TSV using pandas or Excel's "Save As" function

### Issue: "Column headers missing"
**Solution:** Ensure the first row contains column headers

### Issue: "Product data truncated"
**Solution:** Check cell content limits; keep descriptions under 5000 characters

### Issue: "Image links showing as errors"
**Solution:** Test image URLs; ensure they're publicly accessible and use HTTPS

### Issue: "Price format invalid"
**Solution:** Use format XXX.XX (e.g., 250.00, not 250 or 250,00)

---

## 📝 Bulk Editing in Excel

### Find and Replace
1. Select all data (Ctrl+A)
2. Use Find & Replace (Ctrl+H)
3. Update URLs, brands, or categories in bulk

### Calculations
- Add formulas for automatic conversions
- Example: `=C2*0.15` for 15% discount calculation

### Sorting and Filtering
1. Select header row
2. Apply AutoFilter (Data > Filter)
3. Sort by price, brand, or category
4. Filter by availability or condition

---

## 📊 Excel Tips

### Column Width
- Double-click column borders to auto-fit width
- Helps view long descriptions and URLs

### Freezing Rows
1. Click cell A2
2. Go to View > Freeze Panes
3. Header row stays visible while scrolling

### Conditional Formatting
- Highlight low-stock items
- Color-code by category
- Flag pricing anomalies

### Data Validation
- Ensure availability only contains "in stock" or "out of stock"
- Validate price ranges
- Check product ID format

---

## 🔄 Regular Updates

### Weekly
- Update prices if on sale
- Verify product links
- Check stock status
- Review image links

### Monthly
- Add new products
- Remove discontinued items
- Update brand information
- Review sales performance

### Quarterly
- Seasonal updates
- Category restructuring
- Brand portfolio review
- Performance analysis

---

## 📞 Support

**For Google Merchant Center issues:**
- [Google Merchant Center Help](https://support.google.com/merchants/)
- [Product data specifications](https://support.google.com/merchants/answer/7052112)

**For this spreadsheet:**
- Check the generator script: `generate_merchant_feed.py`
- Review: `GOOGLE_MERCHANT_FEED_GUIDE.md`

---

**Last Updated:** December 12, 2025
**Total Products:** 206 (100 Perfumes + 106 Watches)
**Languages Supported:** English, Arabic
