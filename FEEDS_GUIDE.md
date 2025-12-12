# 📄 دليل استخدام الفيدات (Feeds Guide)

## 📋 الملفات الموفرة:

### 1. **CSV Feeds**

#### عربي - Arabic CSV:
```
https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed-ar.csv
```
✅ يحتوي على أسماء منتجات عربية
✅ للاستخدام مع Google Merchant Center عربي

#### English - English CSV:
```
https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed-en.csv
```
✅ يحتوي على أسماء منتجات إنجليزية
✅ للاستخدام مع Google Merchant Center العالمي

#### Simple CSV (No Arabic):
```
https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/products-feed.csv
```
✅ بدون أحرف عربية
✅ للأنظمة التي لا تدعم UTF-8

### 2. **XML Feed**

```
https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed.xml
```
✅ للأنظمة الاحترافية
✅ متوافق مع Google

### 3. **JSON Data**

```
https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/data/products.json
```
✅ بيانات JSON مباشرة
✅ للاستخدام مع JavaScript/React

---

## 🚀 كيفية استخدام الفيدات:

### لل_Google Merchant Center:

1. اذهب لـ: https://merchantcenter.google.com
2. اختر: Products > Feeds
3. اضغط: Create feed
4. اختر النوع: CSV or XML
5. الصق الرابط:
   - عربي: `merchant-feed-ar.csv`
   - انجليزي: `merchant-feed-en.csv`
6. اضغط: Create

### لل_Google Shopping Ads:

1. اذهب لـ: Google Ads
2. Tools & settings > Business data
3. Product feeds
4. نفس الطريقة بتاعة Merchant Center

---

## 📊 مواصفات الفيد:

### CSV الأعمدة:
```
ID, Title, Description, Price, Sale Price, Image Link, 
Availability, Condition, Brand, Category, URL
```

### XML العناصر:
```
<item>
  <g:id>product_id</g:id>
  <title>Product Title</title>
  <description>Description</description>
  <g:price>Price</g:price>
  <g:sale_price>Sale Price</g:sale_price>
  <g:image_link>Image URL</g:image_link>
  <g:availability>in stock</g:availability>
  <g:condition>new</g:condition>
  <g:brand>Brand Name</g:brand>
  <g:product_type>Category</g:product_type>
</item>
```

---

## ✅ البيانات الموجودة:

✓ **241 منتج:**
- 66 عطر
- 175 ساعة

✓ **لكل منتج:**
- أسم (English + Arabic)
- سعر أصلي
- سعر عرض
- صورة
- رابط المنتج
- براند
- فئة
- معلومات قيمة (rating + reviews)

---

## 🚀 التحديث التلقائي:

✅ **يومي الساعة 3 صباحاً UTC (5 صباحاً +02):**
- الفيدات تتحدث تلقائياً
- البيانات تعيد رفعها

✅ **عند أي تغيير على main branch:**
- الفيدات تتحدث فوراً

---

## ❌ بيانات المنتجات:

### عطور:
- perfume_1: Coco Chanel 100ml - 252 AED
- perfume_2: Gucci Flora - 252 AED
- perfume_3: Gucci Bloom - 252 AED

### ساعات:
- watch_1: Rolex Yacht Master Silver - 320 AED
- watch_2: Rolex Classic 41mm - 325 AED

---

## 🌟 الفوائد:

✅ **عرض مباشر على:**
- Google Shopping
- Google Ads
- Facebook Shop
- أي منصة أخرى

✅ **بيانات كاملة:**
- أسعار محدثة
- صور أصلية
- أوصاف دقيقة
- روابط صحيحة

---

**Ready to use! Just copy the feed URL and paste it in your platform. 🚀**
