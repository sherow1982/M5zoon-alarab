#!/usr/bin/env node

/**
 * 🚀 Emirates Gifts - Automated Product Data Update Script
 * يقوم بتحديث ملفات المنتجات والسكيما تلقائياً
 * 
 * الاستخدام:
 * node update-products.js
 * 
 * أو عبر GitHub Actions
 */

const fs = require('fs');
const path = require('path');

const PERFUMES = [
  {
    id: 'perfume_1',
    title: 'عطر كوكو شانيل 100 مل',
    price: 352,
    sale_price: 252,
    image_link: 'https://m5zoon.com/public/uploads/products/1722352332177124.webp',
    slug: 'عطر-كوكو-شانيل-100-مل',
    meta_description: 'عطر كوكو شانيل 100 مل - هدية فريدة من Emirates Gifts',
    brand: 'Chanel',
    rating: 4.8,
    review_count: 45,
  },
  {
    id: 'perfume_2',
    title: 'عطر جوتشي فلورا',
    price: 352,
    sale_price: 252,
    image_link: 'https://m5zoon.com/public/uploads/products/1720344963790342.webp',
    slug: 'عطر-جوتشي-فلورا',
    meta_description: 'عطر جوتشي فلورا - هدية فريدة من Emirates Gifts',
    brand: 'Gucci',
    rating: 4.8,
    review_count: 38,
  },
  {
    id: 'perfume_3',
    title: 'عطر جوتشي بلوم',
    price: 352,
    sale_price: 252,
    image_link: 'https://m5zoon.com/public/uploads/products/1720344971935939.webp',
    slug: 'عطر-جوتشي-بلوم',
    meta_description: 'عطر جوتشي بلوم - هدية فريدة من Emirates Gifts',
    brand: 'Gucci',
    rating: 4.8,
    review_count: 35,
  },
];

const WATCHES = [
  {
    id: 'watch_1',
    title: 'ساعة رولكس يخت ماستر - فضي',
    price: 370,
    sale_price: 320,
    image_link: 'https://m5zoon.com/public/uploads/products/1689086291310824.webp',
    slug: 'ساعة-رولكس-يخت-ماستر---فضي',
    meta_description: 'ساعة رولكس يخت ماستر - فضي - هدية فريدة من Emirates Gifts',
    brand: 'Rolex',
    rating: 4.9,
    review_count: 52,
  },
  {
    id: 'watch_2',
    title: 'ساعة Rolex كلاسيكية 41 ملم 2022',
    price: 375,
    sale_price: 325,
    image_link: 'https://m5zoon.com/public/uploads/products/1741223185271965.png',
    slug: 'ساعة-Rolex-كلاسيكية-41-ملم-2022',
    meta_description: 'ساعة Rolex كلاسيكية 41 ملم 2022 - هدية فريدة من Emirates Gifts',
    brand: 'Rolex',
    rating: 4.9,
    review_count: 48,
  },
];

function createProductSchema(products, lang = 'ar') {
  const isArabic = lang === 'ar';
  
  const itemListElement = products.map((product, index) => ({
    '@type': 'Product',
    'position': index + 1,
    'name': product.title,
    'description': product.meta_description,
    'url': isArabic
      ? `https://emirates-gifts.arabsad.com/products/${product.id}`
      : `https://emirates-gifts.arabsad.com/en/product/${product.id}`,
    'image': product.image_link,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'Emirates Gifts',
    },
    'category': product.id.includes('watch') ? (isArabic ? 'ساعات' : 'Watches') : (isArabic ? 'عطور' : 'Perfumes'),
    'offers': {
      '@type': 'Offer',
      'url': isArabic
        ? `https://emirates-gifts.arabsad.com/products/${product.id}`
        : `https://emirates-gifts.arabsad.com/en/product/${product.id}`,
      'priceCurrency': 'AED',
      'price': String(product.sale_price || product.price),
      'priceValidUntil': '2025-12-31',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Emirates Gifts',
      },
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': String(product.rating || 4.8),
      'reviewCount': String(product.review_count || 0),
    },
    'sku': product.id,
    'mpn': product.id,
  }));

  return {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    'name': isArabic
      ? 'منتجات الإمارات - Emirates Gifts'
      : 'Emirates Gifts - Premium Gifts',
    'description': isArabic
      ? 'قائمة منتجات عطور وساعات فاخرة من Emirates Gifts - هدايا مثالية'
      : 'Complete list of luxury perfumes and watches from Emirates Gifts - Premium gifts for special occasions',
    'url': isArabic
      ? 'https://emirates-gifts.arabsad.com'
      : 'https://emirates-gifts.arabsad.com/en',
    'itemListElement': itemListElement,
  };
}

function saveFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
  console.log(`✅ تم حفظ: ${filePath}`);
}

async function updateProducts() {
  console.log('🚀 بدء تحديث البيانات...');
  console.log('════════════════════════════════════════');

  try {
    // 1. تحديث ملفات JSON
    console.log('\n📊 تحديث ملفات المنتجات JSON...');
    const allProducts = [...PERFUMES, ...WATCHES];
    
    saveFile('data/perfumes.json', JSON.stringify(PERFUMES, null, 2));
    saveFile('data/watches.json', JSON.stringify(WATCHES, null, 2));
    saveFile('data/products.json', JSON.stringify(allProducts, null, 2));

    // 2. تحديث السكيما
    console.log('\n📄 تحديث ملفات السكيما...');
    const schemaAr = createProductSchema(allProducts, 'ar');
    const schemaEn = createProductSchema(allProducts, 'en');
    
    saveFile('public/schema/products-schema-ar.json', schemaAr);
    saveFile('public/schema/products-schema-en.json', schemaEn);

    // 3. إنشاء ملف ملخص البيانات
    console.log('\n📈 إنشاء ملف الملخص...');
    const summary = {
      'timestamp': new Date().toISOString(),
      'total_products': allProducts.length,
      'perfumes': PERFUMES.length,
      'watches': WATCHES.length,
      'status': 'success',
      'message': 'تم تحديث البيانات بنجاح',
    };
    
    saveFile('data/summary.json', summary);

    // 4. طباعة النتائج
    console.log('\n════════════════════════════════════════');
    console.log('✅ تم التحديث بنجاح!');
    console.log('════════════════════════════════════════');
    console.log(`📊 الإحصائيات:`);
    console.log(`   • عطور: ${PERFUMES.length}`);
    console.log(`   • ساعات: ${WATCHES.length}`);
    console.log(`   • إجمالي: ${allProducts.length}`);
    console.log(`   • الوقت: ${new Date().toLocaleString('ar-AE')}`);
    console.log('════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

updateProducts();
