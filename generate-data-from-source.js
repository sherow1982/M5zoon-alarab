#!/usr/bin/env node

/**
 * 🚀 Emirates Gifts - Read Actual Products Data
 * يقرأ البيانات الفعلية من ملفات المنتجات
 * ويستخدم روابط الصور الحقيقية من image_link
 */

const fs = require('fs');
const path = require('path');

const log = {
  info: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  warn: (msg) => console.warn(`⚠️  ${msg}`),
  header: (msg) => console.log(`\n${'═'.repeat(60)}\n🚀 ${msg}\n${'═'.repeat(60)}`)
};

// محاولة قراءة الملفات من عدة مجلدات
const POSSIBLE_PATHS = [
  'data/products.json',
  './data/products.json',
  '../data/products.json',
  'products.json',
  './products.json'
];

function findProductsFile() {
  log.header('🔍 البحث عن ملف المنتجات');
  
  for (const filePath of POSSIBLE_PATHS) {
    if (fs.existsSync(filePath)) {
      log.info(`✓ وجدت الملف: ${filePath}`);
      return filePath;
    }
  }
  
  log.error('لم أجد ملف products.json');
  log.warn('المسارات المتوقعة:');
  POSSIBLE_PATHS.forEach(p => console.log(`  • ${p}`));
  
  return null;
}

function loadProducts(filePath) {
  log.header('📥 تحميل بيانات المنتجات');
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    // التحقق من أن البيانات صحيحة
    let products = Array.isArray(data) ? data : data.products || [];
    
    log.info(`تم تحميل ${products.length} منتج`);
    return products;
  } catch (error) {
    log.error(`خطأ في قراءة الملف: ${error.message}`);
    return [];
  }
}

function createDirectories() {
  log.header('📁 إنشاء المجلدات');
  
  const dirs = ['data', 'public/feeds', 'public/schema'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.info(`مجلد منشأ: ${dir}`);
    }
  });
}

function createJsonFiles(products) {
  log.header('💾 إنشاء ملفات JSON');
  
  if (products.length === 0) {
    log.error('لا توجد منتجات للحفظ!');
    return;
  }
  
  // كل المنتجات
  fs.writeFileSync(
    'data/products.json',
    JSON.stringify(products, null, 2)
  );
  log.info(`products.json: ${products.length} منتج`);
  
  // ملخص
  const summary = {
    timestamp: new Date().toISOString(),
    total_products: products.length,
    products_with_images: products.filter(p => p.image_link || p.imae_link).length,
    status: 'success',
    feeds: {
      csv_ar: 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed-ar.csv',
      csv_en: 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed-en.csv',
      xml: 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed.xml',
      json: 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/data/products.json'
    }
  };
  
  fs.writeFileSync('data/summary.json', JSON.stringify(summary, null, 2));
  log.info('summary.json: ملخص البيانات');
}

function createCsvFeeds(products) {
  log.header('📄 إنشاء CSV Feeds');
  
  if (products.length === 0) {
    log.error('لا توجد منتجات!');
    return;
  }
  
  const BASE_URL = 'https://emirates-gifts.arabsad.com';
  
  // CSV عربي
  let csvAr = 'ID,Title,Description,Price,Sale_Price,Image,Availability,Brand,Category,URL\n';
  products.forEach((p, i) => {
    const imageLink = p.image_link || p.imae_link || '';
    const title = p.title || p.title_ar || `Product ${i + 1}`;
    const desc = p.description || '';
    const price = p.price || '0';
    const salePrice = p.sale_price || price;
    const category = p.category || 'General';
    const brand = p.brand || 'Emirates Gifts';
    
    csvAr += `${p.id || i + 1},"${title}","${desc}",${price} AED,${salePrice} AED,${imageLink},in stock,${brand},${category},${BASE_URL}/products/${p.id || i + 1}\n`;
  });
  
  fs.writeFileSync('public/feeds/merchant-feed-ar.csv', csvAr);
  log.info(`merchant-feed-ar.csv: ${products.length} منتج`);
  
  // CSV إنجليزي (نفس البيانات لكن بدون النسخة العربية من التايتل)
  let csvEn = 'ID,Title,Description,Price,Sale_Price,Image,Availability,Brand,Category,URL\n';
  products.forEach((p, i) => {
    const imageLink = p.image_link || p.imae_link || '';
    const title = p.title_en || p.title || `Product ${i + 1}`;
    const desc = p.description_en || p.description || '';
    const price = p.price || '0';
    const salePrice = p.sale_price || price;
    const category = p.category || 'General';
    const brand = p.brand || 'Emirates Gifts';
    
    csvEn += `${p.id || i + 1},"${title}","${desc}",${price} AED,${salePrice} AED,${imageLink},in stock,${brand},${category},${BASE_URL}/products/${p.id || i + 1}\n`;
  });
  
  fs.writeFileSync('public/feeds/merchant-feed-en.csv', csvEn);
  log.info(`merchant-feed-en.csv: ${products.length} منتج`);
  
  // CSV بسيط (بدون أحرف عربية)
  let csvSimple = 'ID,Title,Description,Price,Sale_Price,Image,Availability,Brand,Category,URL\n';
  products.forEach((p, i) => {
    const imageLink = p.image_link || p.imae_link || '';
    const title = (p.title_en || p.title || `Product ${i + 1}`).replace(/[\u0600-\u06FF]/g, '');
    const desc = (p.description_en || p.description || '').replace(/[\u0600-\u06FF]/g, '');
    const price = p.price || '0';
    const salePrice = p.sale_price || price;
    const category = (p.category || 'General').replace(/[\u0600-\u06FF]/g, '');
    const brand = (p.brand || 'Emirates Gifts').replace(/[\u0600-\u06FF]/g, '');
    
    csvSimple += `${p.id || i + 1},"${title}","${desc}",${price} AED,${salePrice} AED,${imageLink},in stock,${brand},${category},${BASE_URL}/products/${p.id || i + 1}\n`;
  });
  
  fs.writeFileSync('public/feeds/products-feed.csv', csvSimple);
  log.info(`products-feed.csv: ${products.length} منتج`);
}

function createXmlFeed(products) {
  log.header('📄 إنشاء XML Feed');
  
  if (products.length === 0) {
    log.error('لا توجد منتجات!');
    return;
  }
  
  const BASE_URL = 'https://emirates-gifts.arabsad.com';
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
  xml += '<channel>\n';
  xml += '<title>Emirates Gifts - Products Feed</title>\n';
  xml += `<link>${BASE_URL}</link>\n`;
  xml += '<description>Premium gifts collection</description>\n';
  
  products.forEach((p, i) => {
    const imageLink = p.image_link || p.imae_link || '';
    const title = p.title || `Product ${i + 1}`;
    const desc = p.description || '';
    const price = p.price || '0';
    const salePrice = p.sale_price || price;
    const category = p.category || 'General';
    const brand = p.brand || 'Emirates Gifts';
    const id = p.id || i + 1;
    
    xml += '<item>\n';
    xml += `  <g:id>${id}</g:id>\n`;
    xml += `  <title>${title}</title>\n`;
    xml += `  <description>${desc}</description>\n`;
    xml += `  <link>${BASE_URL}/products/${id}</link>\n`;
    xml += `  <g:image_link>${imageLink}</g:image_link>\n`;
    xml += `  <g:price>${price} AED</g:price>\n`;
    xml += `  <g:sale_price>${salePrice} AED</g:sale_price>\n`;
    xml += '  <g:availability>in stock</g:availability>\n';
    xml += '  <g:condition>new</g:condition>\n';
    xml += `  <g:brand>${brand}</g:brand>\n`;
    xml += `  <g:product_type>${category}</g:product_type>\n`;
    xml += '</item>\n';
  });
  
  xml += '</channel>\n';
  xml += '</rss>\n';
  
  fs.writeFileSync('public/feeds/merchant-feed.xml', xml);
  log.info(`merchant-feed.xml: ${products.length} منتج`);
}

function createSchemaFiles(products) {
  log.header('📄 إنشاء Schema Files');
  
  if (products.length === 0) {
    log.error('لا توجد منتجات!');
    return;
  }
  
  const BASE_URL = 'https://emirates-gifts.arabsad.com';
  
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    'name': 'منتجات Emirates Gifts',
    'description': 'قائمة منتجات عطور وساعات فاخرة',
    'url': BASE_URL,
    'itemListElement': products.map((p, i) => ({
      '@type': 'Product',
      'position': i + 1,
      'name': p.title || `Product ${i + 1}`,
      'description': p.description || '',
      'url': `${BASE_URL}/products/${p.id || i + 1}`,
      'image': p.image_link || p.imae_link || '',
      'brand': { '@type': 'Brand', 'name': p.brand || 'Emirates Gifts' },
      'offers': {
        '@type': 'Offer',
        'url': `${BASE_URL}/products/${p.id || i + 1}`,
        'priceCurrency': 'AED',
        'price': String(p.sale_price || p.price || '0'),
        'availability': 'https://schema.org/InStock'
      }
    }))
  };
  
  fs.writeFileSync('public/schema/products-schema.json', JSON.stringify(schema, null, 2));
  log.info(`products-schema.json: ${products.length} منتج`);
}

async function main() {
  console.log('\n' + '═'.repeat(60));
  console.log('🚀 Emirates Gifts - Generate Data from Source');
  console.log('═'.repeat(60) + '\n');
  
  try {
    // البحث عن ملف المنتجات
    const productsFile = findProductsFile();
    
    if (!productsFile) {
      log.error('لم أتمكن من إيجاد ملف المنتجات!');
      process.exit(1);
    }
    
    // تحميل البيانات
    const products = loadProducts(productsFile);
    
    if (products.length === 0) {
      log.error('ملف المنتجات فارغ أو بصيغة خاطئة!');
      process.exit(1);
    }
    
    // إنشاء المجلدات
    createDirectories();
    
    // إنشاء الملفات
    createJsonFiles(products);
    createCsvFeeds(products);
    createXmlFeed(products);
    createSchemaFiles(products);
    
    // النتائج النهائية
    log.header('✅ تمت العملية بنجاح!');
    console.log(`✓ عدد المنتجات: ${products.length}`);
    console.log(`✓ منتجات بصور: ${products.filter(p => p.image_link || p.imae_link).length}`);
    console.log(`\n✓ الملفات المنشأة:`);
    console.log('  • data/products.json');
    console.log('  • data/summary.json');
    console.log('  • public/feeds/merchant-feed-ar.csv');
    console.log('  • public/feeds/merchant-feed-en.csv');
    console.log('  • public/feeds/products-feed.csv');
    console.log('  • public/feeds/merchant-feed.xml');
    console.log('  • public/schema/products-schema.json');
    console.log('\n' + '═'.repeat(60) + '\n');
    
    process.exit(0);
  } catch (error) {
    log.error(`خطأ: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
