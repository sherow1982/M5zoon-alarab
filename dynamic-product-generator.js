/**
 * نظام إنشاء الصفحات الديناميكية - متجر هدايا الإمارات
 * يقوم بإنشاء جميع صفحات المنتجات تلقائياً من البيانات المتاحة
 */

// دمج بيانات المنتجات من جميع الملفات
const allProductsData = {
    // عطور
    perfumes: [
        {
            "id": "1",
            "title": "عطر كوكو شانيل 100 مل",
            "price": 352,
            "sale_price": 252,
            "image_link": "https://m5zoon.com/public/uploads/products/1722352332177124.webp",
            "category": "عطور",
            "brand": "شانيل",
            "description": "عطر كوكو شانيل الأصلي بحجم 100 مل، رائحة أنثوية فاخرة وكلاسيكية تناسب جميع المناسبات. يتميز بثبات عالي ورائحة مميزة تدوم طويلاً."
        },
        {
            "id": "2",
            "title": "عطر جوتشي فلورا",
            "price": 352,
            "sale_price": 252,
            "image_link": "https://m5zoon.com/public/uploads/products/1720344963790342.webp",
            "category": "عطور",
            "brand": "جوتشي",
            "description": "عطر جوتشي فلورا الأنيق برائحة الأزهار الطبيعية. مثالي للنساء العصريات اللواتي يبحثن عن الأناقة والتميز."
        },
        {
            "id": "3",
            "title": "عطر جوتشي بلوم",
            "price": 352,
            "sale_price": 252,
            "image_link": "https://m5zoon.com/public/uploads/products/1720344971935939.webp",
            "category": "عطور",
            "brand": "جوتشي",
            "description": "عطر جوتشي بلوم المتجدد برائحة الأزهار المنعشة. يجمع بين الكلاسيكية والحداثة في تركيبة عطرية استثنائية."
        },
        {
            "id": "4",
            "title": "عطر سوفاج ديور 100 مل",
            "price": 352,
            "sale_price": 252,
            "image_link": "https://m5zoon.com/public/uploads/products/1720344979304336.webp",
            "category": "عطور",
            "brand": "ديور",
            "description": "عطر سوفاج ديور الرجالي بحجم 100 مل. رائحة قوية وجذابة تناسب الرجل العصري المتميز."
        },
        {
            "id": "5",
            "title": "عطر فرزاتشي ايروس",
            "price": 352,
            "sale_price": 252,
            "image_link": "https://m5zoon.com/public/uploads/products/1720345001981811.webp",
            "category": "عطور",
            "brand": "فرزاتشي",
            "description": "عطر فرزاتشي ايروس الرجالي الفاخر. تركيبة عطرية قوية ومثيرة تترك انطباعاً لا ينسى."
        },
        {
            "id": "27",
            "title": "ARIAF",
            "price": 381,
            "sale_price": 281,
            "image_link": "https://m5zoon.com/public/uploads/products/1758995115569006.webp",
            "category": "عطور",
            "brand": "ARIAF",
            "description": "عطر ARIAF الفاخر برائحة مميزة وثبات عالي. مناسب للاستخدام اليومي والمناسبات الخاصة."
        },
        {
            "id": "26",
            "title": "Glory",
            "price": 470,
            "sale_price": 370,
            "image_link": "https://m5zoon.com/public/uploads/products/1758995050816081.webp",
            "category": "عطور",
            "brand": "Glory",
            "description": "عطر Glory الفاخر برائحة أنيقة ومميزة. يجمع بين الفخامة والأناقة في تركيبة عطرية استثنائية."
        },
        {
            "id": "36",
            "title": "Tom Ford Bitter Peach",
            "price": 360,
            "sale_price": 260,
            "image_link": "https://m5zoon.com/public/uploads/products/1759671271239887.webp",
            "category": "عطور",
            "brand": "Tom Ford",
            "description": "عطر Tom Ford Bitter Peach الفريد برائحة الخوخ المر المميزة. عطر فاخر للشخصية المتميزة."
        },
        {
            "id": "66",
            "title": "Marly Delina",
            "price": 365,
            "sale_price": 265,
            "image_link": "https://m5zoon.com/public/uploads/products/1759752504730376.webp",
            "category": "عطور",
            "brand": "Parfums de Marly",
            "description": "عطر Marly Delina الأنثوي الفاخر برائحة الورد والفاكهة. تركيبة عطرية راقية تناسب المرأة العصرية."
        },
        {
            "id": "10",
            "title": "Kayali Vanilla",
            "price": 320,
            "sale_price": 220,
            "image_link": "https://m5zoon.com/public/uploads/products/1720345074027892.webp",
            "category": "عطور",
            "brand": "Kayali",
            "description": "عطر Kayali Vanilla برائحة الفانيليا الحلوة والمميزة. عطر دافئ ومريح يناسب الاستخدام اليومي."
        }
    ],
    
    // ساعات
    watches: [
        {
            "id": "1",
            "title": "ساعة رولكس يخت ماستر - فضي",
            "price": 370,
            "sale_price": 320,
            "image_link": "https://m5zoon.com/public/uploads/products/1689086291310824.webp",
            "category": "ساعات",
            "brand": "رولكس",
            "description": "ساعة رولكس يخت ماستر الفاخرة باللون الفضي. تصميم كلاسيكي أنيق مع حركة دقيقة ومقاومة للماء."
        },
        {
            "id": "2",
            "title": "ساعة Rolex كلاسيكية 41 ملم 2022",
            "price": 375,
            "sale_price": 325,
            "image_link": "https://m5zoon.com/public/uploads/products/1741223185271965.png",
            "category": "ساعات",
            "brand": "رولكس",
            "description": "ساعة رولكس كلاسيكية بحجم 41 ملم من إصدار 2022. تصميم عصري مع المحافظة على الطابع الكلاسيكي المميز."
        },
        {
            "id": "3",
            "title": "ساعة rolex باللون الأسود R21",
            "price": 364,
            "sale_price": 314,
            "image_link": "https://m5zoon.com/public/uploads/products/1681005528571671.webp",
            "category": "ساعات",
            "brand": "رولكس",
            "description": "ساعة رولكس باللون الأسود موديل R21. تصميم رياضي أنيق يناسب الإطلالات الكاجوال والرسمية."
        },
        {
            "id": "8",
            "title": "ساعة اوميغا سواتش بيبي بلو",
            "price": 375,
            "sale_price": 325,
            "image_link": "https://m5zoon.com/public/uploads/products/1720305672749191.webp",
            "category": "ساعات",
            "brand": "أوميغا",
            "description": "ساعة أوميغا سواتش باللون الأزرق الفاتح. تصميم عصري مرح يناسب الشباب والاستخدام اليومي."
        },
        {
            "id": "76",
            "title": "Audemars Piguet Royal - Orange",
            "price": 660,
            "sale_price": 610,
            "image_link": "https://m5zoon.com/public/uploads/products/1749109017733058.webp",
            "category": "ساعات",
            "brand": "Audemars Piguet",
            "description": "ساعة Audemars Piguet Royal باللون البرتقالي المميز. ساعة فاخرة للغاية بتصميم رياضي أنيق."
        },
        {
            "id": "150",
            "title": "Couple Rolex watch - gold &black &silver",
            "price": 445,
            "sale_price": 395,
            "image_link": "https://m5zoon.com/public/uploads/products/1757525267213998.webp",
            "category": "ساعات",
            "brand": "رولكس",
            "description": "طقم ساعات رولكس للأزواج بألوان الذهبي والأسود والفضي. هدية مثالية للأزواج بتصميم أنيق ومتطابق."
        },
        {
            "id": "178",
            "title": "Aigner watch gold strab",
            "price": 372,
            "sale_price": 322,
            "image_link": "https://m5zoon.com/public/uploads/products/1761059243571618.webp",
            "category": "ساعات",
            "brand": "Aigner",
            "description": "ساعة Aigner الذهبية الفاخرة. تصميم كلاسيكي أنيق يناسب المناسبات الرسمية والاستخدام اليومي."
        }
    ],
    
    // دخون وبخور
    incense: [
        {
            "id": "32",
            "title": "دخون راقية",
            "price": 390,
            "sale_price": 290,
            "image_link": "https://m5zoon.com/public/uploads/products/1758995634493034.webp",
            "category": "دخون وبخور",
            "brand": "تراثي",
            "description": "دخون راقية أصلية من أجود الأنواع. رائحة عربية أصيلة تملأ المكان بالعبق التراثي الأصيل."
        },
        {
            "id": "33",
            "title": "دخون عبدالرشيد",
            "price": 390,
            "sale_price": 290,
            "image_link": "https://m5zoon.com/public/uploads/products/1758995672598233.webp",
            "category": "دخون وبخور",
            "brand": "عبدالرشيد",
            "description": "دخون عبدالرشيد الفاخر من أجود الأنواع العربية الأصيلة. رائحة تراثية مميزة تناسب المنازل والمجالس."
        },
        {
            "id": "34",
            "title": "دخون بو خالد",
            "price": 390,
            "sale_price": 290,
            "image_link": "https://m5zoon.com/public/uploads/products/1758995694164281.webp",
            "category": "دخون وبخور",
            "brand": "بو خالد",
            "description": "دخون بو خالد الأصلي بجودة عالية ورائحة مميزة. من أفضل أنواع الدخون الخليجي الأصيل."
        },
        {
            "id": "35",
            "title": "دخون بن لوتاه",
            "price": 390,
            "sale_price": 290,
            "image_link": "https://m5zoon.com/public/uploads/products/1758995715273869.webp",
            "category": "دخون وبخور",
            "brand": "بن لوتاه",
            "description": "دخون بن لوتاه الفاخر من أعرق البيوت الإماراتية. جودة استثنائية ورائحة أصيلة تدوم طويلاً."
        }
    ]
};

// دالة إنشاء اسم الملف من العنوان
function generateFilename(title) {
    return title
        .replace(/\s+/g, '-')
        .replace(/[^\w\u0600-\u06ff\-]/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+|-+$/g, '') + '.html';
}

// دالة إنشاء HTML للمنتج
function generateProductHTML(product) {
    const discount = Math.round((1 - product.sale_price / product.price) * 100);
    const filename = generateFilename(product.title);
    
    // تحسين اسم المنتج للواتساب
    const whatsappName = encodeURIComponent(product.title);
    
    // تقييمات عشوائية واقعية
    const ratings = [
        { stars: '★★★★★', rating: '4.9', count: Math.floor(Math.random() * 100 + 50) },
        { stars: '★★★★★', rating: '4.8', count: Math.floor(Math.random() * 80 + 40) },
        { stars: '★★★★☆', rating: '4.7', count: Math.floor(Math.random() * 70 + 35) }
    ];
    const selectedRating = ratings[Math.floor(Math.random() * ratings.length)];
    
    // تعليقات عملاء متنوعة
    const reviews = [
        { author: 'أحمد محمد', rating: '★★★★★', text: 'منتج ممتاز وجودة عالية. التوصيل سريع والخدمة ممتازة. أنصح بالشراء من هذا المتجر.' },
        { author: 'فاطمة علي', rating: '★★★★★', text: 'حصلت على المنتج بحالة ممتازة. الجودة عالية جداً والسعر مناسب. شكراً للفريق.' },
        { author: 'محمد خالد', rating: '★★★★☆', text: 'منتج جيد وسعر معقول. التعبئة احترافية والتوصيل في الوقت المحدد.' },
        { author: 'مريم أحمد', rating: '★★★★★', text: 'من أجمل المنتجات! جودة ممتازة وخدمة عملاء رائعة. سأطلب مرة أخرى بالتأكيد.' },
        { author: 'عبدالله محمد', rating: '★★★★★', text: 'جودة ممتازة وسعر منافس. وصل بحالة ممتازة والتعبئة محترفة.' },
        { author: 'سارة علي', rating: '★★★★★', text: 'منتج رائع! الجودة فاقت توقعاتي والخدمة ممتازة. شكراً لكم.' }
    ];
    
    // اختيار 3 تعليقات عشوائياً
    const selectedReviews = reviews.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} | متجر هدايا الإمارات</title>
    <meta name="description" content="${product.title} - السعر: ${product.sale_price} د.إ. توصيل سريع لجميع أنحاء الإمارات - ${product.description.substring(0, 100)}...">
    <meta name="keywords" content="${product.title}, ${product.category}, ${product.brand}, متجر هدايا الإمارات, هدايا, عطور, ساعات, دخون">
    <meta name="robots" content="index, follow">
    <meta name="author" content="متجر هدايا الإمارات">
    <link rel="canonical" href="https://hadaya-emirates.online/products/${filename}">
    <meta property="og:title" content="${product.title} | متجر هدايا الإمارات">
    <meta property="og:description" content="${product.title} - السعر: ${product.sale_price} د.إ. ${product.description.substring(0, 120)}">
    <meta property="og:image" content="${product.image_link}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="https://hadaya-emirates.online/products/${filename}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${product.title} | متجر هدايا الإمارات">
    <meta name="twitter:description" content="${product.description.substring(0, 100)}">
    <meta name="twitter:image" content="${product.image_link}">
    <link rel="preload" href="../css/performance-critical.css" as="style">
    <link rel="stylesheet" href="../css/performance-critical.css">
    <script type="application/ld+json">
    {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "${product.title}",
        "image": "${product.image_link}",
        "description": "${product.description}",
        "brand": {
            "@type": "Brand",
            "name": "${product.brand}"
        },
        "offers": {
            "@type": "Offer",
            "price": "${product.sale_price}",
            "priceCurrency": "AED",
            "availability": "https://schema.org/InStock",
            "priceValidUntil": "2025-12-31",
            "seller": {
                "@type": "Organization",
                "name": "متجر هدايا الإمارات",
                "url": "https://hadaya-emirates.online"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "${selectedRating.rating}",
            "reviewCount": "${selectedRating.count}"
        }
    }
    </script>
    <style>
        .product-page {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
            min-height: calc(100vh - 200px);
        }
        
        .product-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        }
        
        .breadcrumb {
            margin-bottom: 25px;
            font-size: 14px;
            color: #666;
            padding: 12px 20px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 10px;
            border: 1px solid #dee2e6;
        }
        
        .breadcrumb a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .breadcrumb a:hover {
            color: #5a6ff8;
            text-decoration: underline;
        }
        
        .product-layout {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin-bottom: 40px;
        }
        
        .product-image-section {
            position: relative;
        }
        
        .product-main-image {
            width: 100%;
            max-height: 500px;
            object-fit: contain;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            background: white;
            aspect-ratio: 1/1;
            transition: all 0.3s ease;
        }
        
        .product-main-image:hover {
            transform: scale(1.02);
            box-shadow: 0 15px 40px rgba(0,0,0,0.2);
        }
        
        .discount-badge {
            position: absolute;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
            color: white;
            padding: 12px 25px;
            border-radius: 30px;
            font-weight: bold;
            font-size: 18px;
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .product-info-section {
            display: flex;
            flex-direction: column;
        }
        
        .product-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            line-height: 1.2;
            background: linear-gradient(135deg, #2c3e50, #667eea);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .category-badge {
            display: inline-block;
            padding: 10px 25px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 25px;
            width: fit-content;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .price-section {
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 15px;
            border: 2px solid #dee2e6;
        }
        
        .old-price {
            text-decoration: line-through;
            color: #999;
            font-size: 20px;
        }
        
        .current-price {
            font-size: 2.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 30px 0;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 18px;
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
            border-radius: 12px;
            font-size: 15px;
            border: 1px solid #e3e6f0;
            transition: all 0.3s ease;
        }
        
        .feature-item:hover {
            background: linear-gradient(135deg, #e9ecef, #f8f9fa);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
            font-size: 24px;
        }
        
        .product-description {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            padding: 30px;
            border-radius: 15px;
            line-height: 1.8;
            margin: 30px 0;
            border: 1px solid #e3e6f0;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .product-description h3 {
            margin-bottom: 20px;
            color: #2c3e50;
            font-size: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .product-description p {
            color: #555;
            font-size: 16px;
            line-height: 1.8;
            margin-bottom: 15px;
        }
        
        .reviews-section {
            background: linear-gradient(135deg, #ffffff, #f8f9fa);
            padding: 30px;
            border-radius: 15px;
            margin: 30px 0;
            border: 1px solid #e3e6f0;
        }
        
        .reviews-title {
            font-size: 20px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .overall-rating {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
            border: 1px solid #ffeaa7;
        }
        
        .rating-stars {
            font-size: 28px;
            color: #FFD700;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
        }
        
        .rating-number {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .reviews-count {
            color: #666;
            font-size: 16px;
        }
        
        .review-item {
            background: linear-gradient(135deg, #f8f9fa, #ffffff);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 15px;
            border-right: 4px solid #667eea;
            transition: all 0.3s ease;
        }
        
        .review-item:hover {
            transform: translateX(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .review-author {
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 8px;
            font-size: 16px;
        }
        
        .review-rating {
            color: #FFD700;
            margin-bottom: 10px;
            font-size: 18px;
        }
        
        .review-text {
            color: #555;
            line-height: 1.7;
            font-size: 15px;
        }
        
        .action-buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .whatsapp-btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 20px 40px;
            background: linear-gradient(135deg, #25D366, #20b358);
            color: white;
            text-decoration: none;
            border-radius: 15px;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
        }
        
        .whatsapp-btn:hover {
            background: linear-gradient(135deg, #20b358, #128C7E);
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
        }
        
        .back-btn {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 20px 40px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 15px;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        .back-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        /* تحسينات الجوال */
        @media (max-width: 768px) {
            .product-page {
                padding: 10px;
            }
            
            .product-layout {
                grid-template-columns: 1fr;
                gap: 30px;
            }
            
            .product-container {
                padding: 20px;
                border-radius: 15px;
                margin: 5px;
            }
            
            .product-title {
                font-size: 1.8rem;
                text-align: center;
            }
            
            .current-price {
                font-size: 2.2rem;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .action-buttons {
                flex-direction: column;
            }
            
            .product-main-image {
                max-height: 350px;
            }
            
            .breadcrumb {
                font-size: 12px;
                padding: 10px 15px;
            }
            
            .price-section {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
            
            .overall-rating {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .product-container {
                padding: 15px;
                margin: 5px;
            }
            
            .product-title {
                font-size: 1.5rem;
            }
            
            .current-price {
                font-size: 2rem;
            }
            
            .whatsapp-btn, .back-btn {
                font-size: 16px;
                padding: 16px 30px;
            }
        }
        
        /* Header Styles */
        .site-header {
            background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
            box-shadow: 0 4px 20px rgba(212, 175, 55, 0.2);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        .site-header .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 0;
            min-height: 70px;
        }
        
        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #2C3E50;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .logo:hover {
            transform: scale(1.05);
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 15px;
        }
        
        .nav-links a {
            font-weight: 600;
            color: #2C3E50;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 25px;
            background: rgba(255, 255, 255, 0.4);
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .nav-links a:hover {
            background: rgba(255, 255, 255, 0.7);
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .tagline {
            text-align: center;
            margin: 15px 0 0;
            color: #2C3E50;
            font-weight: 500;
            font-size: 16px;
        }
        
        /* Footer Styles */
        .site-footer {
            background: linear-gradient(135deg, #2C3E50, #34495e);
            color: white;
            padding: 50px 0 30px;
            margin-top: 80px;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .footer-section h3 {
            color: #FFD700;
            margin-bottom: 20px;
            font-size: 20px;
            font-weight: 600;
        }
        
        .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .footer-links li {
            margin-bottom: 10px;
        }
        
        .footer-links a {
            color: #bdc3c7;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 15px;
        }
        
        .footer-links a:hover {
            color: #FFD700;
            transform: translateX(-5px);
        }
        
        .footer-bottom {
            text-align: center;
            padding-top: 30px;
            border-top: 1px solid #34495e;
            color: #bdc3c7;
            font-size: 14px;
        }
        
        @media (max-width: 768px) {
            .site-header .nav-links {
                display: none;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
                gap: 30px;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="container">
            <div class="header-content">
                <a href="../" class="logo">🛍️ متجر هدايا الإمارات</a>
                <nav>
                    <ul class="nav-links">
                        <li><a href="../">الرئيسية</a></li>
                        <li><a href="../about.html">من نحن</a></li>
                        <li><a href="../contact.html">اتصل بنا</a></li>
                        <li><a href="../shipping-policy.html">الشحن</a></li>
                        <li><a href="../return-policy.html">الاستبدال</a></li>
                        <li><a href="../blog.html">المدونة</a></li>
                    </ul>
                </nav>
            </div>
            <p class="tagline">أفضل المنتجات بأقل الأسعار - توصيل سريع لجميع الإمارات</p>
        </div>
    </header>

    <div class="product-page">
        <div class="product-container">
            <div class="breadcrumb">
                <a href="../">الرئيسية</a> / 
                <a href="../">${product.category}</a> / 
                <span>${product.title}</span>
            </div>

            <div class="product-layout">
                <div class="product-image-section">
                    <img src="${product.image_link}" alt="${product.title}" class="product-main-image" loading="lazy">
                    <div class="discount-badge">-${discount}%</div>
                </div>

                <div class="product-info-section">
                    <h1 class="product-title">${product.title}</h1>
                    <span class="category-badge">${product.category}</span>

                    <div class="price-section">
                        <span class="old-price">${product.price} د.إ</span>
                        <span class="current-price">${product.sale_price} د.إ</span>
                    </div>

                    <div class="features-grid">
                        <div class="feature-item">
                            <span class="feature-icon">✅</span>
                            <span>منتج أصلي 100%</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🚚</span>
                            <span>شحن سريع</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🔄</span>
                            <span>استبدال مجاني</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">💳</span>
                            <span>دفع عند الاستلام</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🛡️</span>
                            <span>ضمان الجودة</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📞</span>
                            <span>دعم 24/7</span>
                        </div>
                    </div>

                    <div class="product-description">
                        <h3>📋 وصف المنتج</h3>
                        <p><strong>${product.title}</strong> - ${product.description}</p>
                        <p>نقدم أفضل جودة بأسعار تنافسية مع ضمان كامل. توصيل سريع لجميع أنحاء الإمارات مع إمكانية الدفع عند الاستلام. جميع منتجاتنا معتمدة ومضمونة وأصلية 100%.</p>
                    </div>

                    <div class="reviews-section">
                        <h3 class="reviews-title">⭐ تقييمات العملاء</h3>
                        <div class="overall-rating">
                            <div class="rating-stars">${selectedRating.stars}</div>
                            <div class="rating-number">${selectedRating.rating}</div>
                            <div class="reviews-count">(${selectedRating.count} تقييم)</div>
                        </div>
                        ${selectedReviews.map(review => `
                        <div class="review-item">
                            <div class="review-author">${review.author}</div>
                            <div class="review-rating">${review.rating}</div>
                            <div class="review-text">${review.text}</div>
                        </div>`).join('')}
                    </div>

                    <div class="action-buttons">
                        <a href="https://wa.me/201110760081?text=مرحباً، أرغب في طلب:%0A${whatsappName}%0Aالسعر: ${product.sale_price} د.إ" target="_blank" class="whatsapp-btn">
                            📱 اطلب عبر الواتساب
                        </a>
                        <a href="../" class="back-btn">
                            🏠 العودة للمتجر
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>عن المتجر</h3>
                    <p>متجر هدايا الإمارات - وجهتك الأولى للحصول على أفضل الساعات والعطور والدخون الأصلية بأسعار تنافسية وخدمة عملاء ممتازة.</p>
                </div>
                <div class="footer-section">
                    <h3>روابط سريعة</h3>
                    <ul class="footer-links">
                        <li><a href="../">الرئيسية</a></li>
                        <li><a href="../about.html">من نحن</a></li>
                        <li><a href="../contact.html">اتصل بنا</a></li>
                        <li><a href="../blog.html">المدونة</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>السياسات</h3>
                    <ul class="footer-links">
                        <li><a href="../shipping-policy.html">سياسة الشحن</a></li>
                        <li><a href="../return-policy.html">سياسة الاستبدال</a></li>
                        <li><a href="../privacy.html">سياسة الخصوصية</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>تواصل معنا</h3>
                    <p>📱 واتساب: <a href="https://wa.me/201110760081" target="_blank" style="color:#FFD700">+201110760081</a></p>
                    <p>🌍 الإمارات العربية المتحدة</p>
                    <p>⏰ خدمة العملاء: 24/7</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 متجر هدايا الإمارات - جميع الحقوق محفوظة | تصميم احترافي</p>
            </div>
        </div>
    </footer>
    
    <script>
        // تحسينات الأداء والتفاعل
        document.addEventListener('DOMContentLoaded', function() {
            // تحميل الصور بشكل ذكي
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    img.style.opacity = '1';
                });
                
                img.addEventListener('error', () => {
                    img.src = 'https://via.placeholder.com/400x400/f0f0f0/999999?text=صورة+غير+متاحة';
                });
            });
            
            // تحسين تفاعل الأزرار
            const buttons = document.querySelectorAll('.whatsapp-btn, .back-btn, .feature-item');
            buttons.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
            
            // انيميشن ظهور العناصر
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            // تطبيق الانيميشن على العناصر
            document.querySelectorAll('.product-description, .reviews-section, .feature-item').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'all 0.6s ease';
                observer.observe(el);
            });
        });
    </script>
</body>
</html>`;
}

// دالة إنشاء جميع صفحات المنتجات
function generateAllProducts() {
    const allProducts = [...allProductsData.perfumes, ...allProductsData.watches, ...allProductsData.incense];
    const generatedFiles = [];
    
    console.log('🚀 بدء إنشاء صفحات المنتجات الديناميكية...');
    console.log(`📊 إجمالي المنتجات: ${allProducts.length}`);
    
    allProducts.forEach((product, index) => {
        const filename = generateFilename(product.title);
        const htmlContent = generateProductHTML(product);
        
        generatedFiles.push({
            filename: filename,
            content: htmlContent,
            product: product
        });
        
        console.log(`✅ ${index + 1}. تم إنشاء: ${filename} - ${product.title} (${product.sale_price} د.إ)`);
    });
    
    return generatedFiles;
}

// تشغيل المولد
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        generateAllProducts,
        allProductsData,
        generateProductHTML,
        generateFilename
    };
} else {
    // Browser environment
    console.log('🎯 نظام إنشاء الصفحات الديناميكية جاهز!');
    const files = generateAllProducts();
    console.log(`\n🎉 تم إنشاء ${files.length} صفحة منتج بنجاح!`);
}
