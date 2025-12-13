# طريقة تثبيت نظام حفظ الطلبات

## ما النظام ؟

عند تأكيد العميل لالطلبال على الموقع ‍، يتم تسجيل بياناته مباشرة على GitHub بو بسيطة بدون اي تعقيد:

```
📅 صلب بيانات ‍ على موقعك
    ↓
📤 إرسال ل API Webhook
    ↓
📋 حفظ JSON + CSV على GitHub
    ↓
🎉 صفحة شكر
```

---

## قبل البداية

أنت تحتاج إلى:

1. **GitHub Personal Token** - لرفع الملفات
2. **Backend Server** - لمعالجة طلبات العملاء

---

## خطوات التثبيت

### الخطوة 1: إنشاء GitHub Token

1. الذهاب إلى: https://github.com/settings/tokens
2. اضغط `Generate new token` › `Generate new token (classic)`
3. فعل الإذانات:
   - ` repo` (كامل)
   - `workflow`
4. اضغط `Generate token`
5. **انسخ التوكن** (فوراً - لن تراه مجدداً)

---

### الخطوة 2: تثبيت Backend على Val.com (الطريقة السهلة)

1. اذهب إلى: https://val.com
2. اضغط "Create" › "From Code"
3. انسخ كود من: `.github/workflows/save-order-webhook.js`
4. احفظ باسم: `emirates-orders`
5. في Environment Variables أضف:
   ```
   GITHUB_TOKEN = [التوكن اللي نسخته]
   ```
6. اضغط "Deploy"
7. انسخ الـ URL (هيكون زي: `https://username--emirates-orders.web.val.run`)

---

### الخطوة 3: حدّث الموقع بـ Backend URL

في `js/checkout-page.js` غيّر:

```javascript
// البحث عن هاي الجملة:
const response = await fetch('https://sherow1982--emirates-gifts.web.val.run/', {

// وبدّلها بـ:
const response = await fetch('YOUR_VAL_URL_HERE', {
```

مثال:
```javascript
const response = await fetch('https://sherow1982--emirates-orders.web.val.run/', {
```

---

## اختبار النظام

### 1. اختبر من الموقع:
   - اضغط "إضافة للسلة"
   - روح "السلة"
   - ملأ البيانات
   - اضغط "تأكيد الطلب"
   - المفروض ترى "جاري..."

### 2. تحقق من GitHub:
   - اذهب إلى: https://github.com/sherow1982/emirates-gifts/tree/main/orders
   - يجب تشوف ملف JSON جديد مثل: `2025123456-1702475000000.json`
   - وأيضاً `new-orders.csv` محدث

### 3. تحقق من Console (F12):
   ```
   ✅ Order saved to GitHub
   ```

---

## مكان الطلبات

### JSON Orders:
```
https://github.com/sherow1982/emirates-gifts/tree/main/orders
```

### CSV Summary:
```
https://github.com/sherow1982/emirates-gifts/blob/main/orders/new-orders.csv
```

---

## استكشاف الأخطاء

### خطأ: "Order saved to GitHub" لم تظهر

**الحل:**
1. افتح Console (F12)
2. شوف الخطأ
3. تأكد من Backend URL صحيح
4. تأكد من GITHUB_TOKEN صحيح

### خطأ: 401 Unauthorized

**الحل:**
- جدّد GitHub Token
- تأكد من صلاحيات `repo` و `workflow` مفعلة

### خطأ: Timeout

**الحل:**
- تأكد من Backend URL يعمل
- اختبر الـ URL مباشرة في البراوزر

---

## الآن النظام جاهز! 🚀

كل طلب جديد = ملف JSON + سطر في CSV

✅ كامل تلقائي بدون يدوي
✅ محفوظ على GitHub
✅ آمن وموثوق
