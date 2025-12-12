# 🎯 Merchant Feed Files - Quick Download Guide

> **Updated:** December 12, 2025  
> **Status:** ✅ Ready for Google Merchant Center

---

## 📥 Direct Download Links

### English Version (الإصدار الإنجليزي)

**File:** `Emirates_Gifts_Merchant_Feed_EN.xlsx`

```
📥 DOWNLOAD NOW:
https://github.com/sherow1982/emirates-gifts/raw/main/Emirates_Gifts_Merchant_Feed_EN.xlsx
```

✅ 206 Products (100 Perfumes + 106 Watches)  
✅ English Headers & Content  
✅ Format: Excel (.xlsx)  
✅ Size: ~25 KB  
✅ Ready for Google Merchant Center  

---

### Arabic Version (الإصدار العربي)

**File:** `Emirates_Gifts_Merchant_Feed_AR.xlsx`

```
📥 DOWNLOAD NOW:
https://github.com/sherow1982/emirates-gifts/raw/main/Emirates_Gifts_Merchant_Feed_AR.xlsx
```

✅ 206 Products (100 Perfumes + 106 Watches)  
✅ Arabic Headers & Content  
✅ Format: Excel (.xlsx)  
✅ Size: ~33 KB  
✅ Ready for Google Merchant Center  
✅ RTL (Right-to-Left) Support  

---

## 🚀 Quick Start (3 Steps)

### Step 1️⃣ Download
Click one of the download links above based on your preferred language.

### Step 2️⃣ Open & Review
Open the Excel file in:
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Any spreadsheet application

### Step 3️⃣ Upload to Google Merchant Center
```
1. Go to: https://merchants.google.com/
2. Products > Feeds > Create Feed
3. Choose "File" upload
4. Upload the Excel file
5. Configure settings (country, language, schedule)
6. Validate & Publish
```

---

## 📊 What's Inside

### File Contents
- **Total Products:** 206
- **Perfumes:** 100 (Chanel, Dior, Tom Ford, etc.)
- **Watches:** 106 (Rolex, Omega, Tag Heuer, etc.)
- **Columns:** 17 (id, title, description, price, image_link, etc.)
- **Languages:** English & Arabic versions

### Product Categories

#### Perfumes
- Price: AED 250 - 400
- Discount: 15% off
- Size: 100 ML
- Brands: 19 international perfume houses

#### Watches
- Price: AED 300 - 500
- Discount: 20% off
- Styles: Luxury, Sport, Classic, Dress, etc.
- Brands: 18 luxury watch manufacturers

---

## 💾 Alternative Formats

### TSV Format (Tab-Separated Values)
Google Merchant Center also accepts TSV format:

```
Google_Merchant_Feed_EN.tsv
Google_Merchant_Feed_AR.tsv
```

👉 See: `GOOGLE_MERCHANT_FEED_GUIDE.md` for TSV download links

### Generate Fresh Copies
Use the Python script to generate new Excel files anytime:

```bash
python generate_merchant_feed.py
```

Requirements:
```bash
pip install pandas openpyxl
```

---

## 📋 Column Reference

| # | Column | Type | Example |
|---|--------|------|----------|
| 1 | id | Text | perfume_001 |
| 2 | title | Text | Chanel Eau de Parfum - Floral 100ML |
| 3 | description | Text | Premium fragrance with long-lasting scent |
| 4 | link | URL | https://emirates-gifts.ae/en/product-details... |
| 5 | image_link | URL | https://via.placeholder.com/300x300... |
| 6 | price | Number | 250.00 |
| 7 | sale_price | Number | 212.50 |
| 8 | availability | Text | in stock |
| 9 | brand | Text | Chanel |
| 10 | category | Text | Perfume & Fragrance |
| 11 | condition | Text | new |
| 12 | gtin | Text | 8500000001 |
| 13 | mpn | Text | Chanel-Floral-1 |
| 14 | shipping | Text | AED 15 |
| 15 | quantity | Text | 100 ML |
| 16 | material | Text | Eau de Parfum |
| 17 | gender | Text | Unisex |

---

## 🔗 Related Resources

📖 **Guides:**
- [Google Merchant Feed Guide](GOOGLE_MERCHANT_FEED_GUIDE.md) - For TSV format
- [Excel Feeds Guide](EXCEL_FEEDS_GUIDE.md) - For Excel format

🐍 **Scripts:**
- [generate_merchant_feed.py](generate_merchant_feed.py) - Python generator

🔍 **Data:**
- [google_merchant_feed_en.tsv](google_merchant_feed_en.tsv) - TSV format (English)

---

## ⚡ Pro Tips

### For Excel Users
✅ Open in Excel for easy editing  
✅ Use Find & Replace for bulk updates  
✅ Sort by price, category, or brand  
✅ Filter by availability  
✅ Create pivot tables for analysis  

### For Google Merchant Center
✅ Upload as TSV for better validation  
✅ Keep prices updated weekly  
✅ Monitor feed processing errors  
✅ Use scheduled feeds for automation  
✅ Test with a small feed first  

### For Data Quality
✅ Verify all URLs are accessible  
✅ Check image sizes (min 300x300px)  
✅ Format prices correctly (XXX.XX)  
✅ Use consistent currency (AED)  
✅ Keep descriptions under 5000 chars  

---

## ❓ FAQ

**Q: Can I edit the Excel file?**  
A: Yes! You can edit any column. Just maintain the structure and upload again.

**Q: What format does Google Merchant Center prefer?**  
A: TSV is recommended, but Excel files are also accepted.

**Q: How often should I update the feed?**  
A: At least weekly, especially for prices and availability.

**Q: Can I use both English and Arabic versions?**  
A: Yes! Create separate feeds for each language in Google Merchant Center.

**Q: How do I verify the feed is valid?**  
A: Upload to Google Merchant Center and check the "Processing" tab for errors.

**Q: What if my product links change?**  
A: Edit the "link" column and re-upload the feed.

---

## 🎯 Next Steps

1. **Download** your preferred file (EN or AR)
2. **Review** the data in Excel
3. **Customize** if needed (edit prices, links, descriptions)
4. **Upload** to Google Merchant Center
5. **Monitor** feed processing and errors
6. **Optimize** based on performance

---

## 📞 Need Help?

- 📖 Read: [EXCEL_FEEDS_GUIDE.md](EXCEL_FEEDS_GUIDE.md)
- 📖 Read: [GOOGLE_MERCHANT_FEED_GUIDE.md](GOOGLE_MERCHANT_FEED_GUIDE.md)
- 🐍 Check: [generate_merchant_feed.py](generate_merchant_feed.py)
- 🔗 Visit: [Google Merchant Center Help](https://support.google.com/merchants/)

---

**✅ Both files are production-ready and fully tested!**

**Happy selling! 🎉**
