#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const log = {
  info: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  header: (msg) => console.log(`\n${'='.repeat(60)}\n🚀 ${msg}\n${'='.repeat(60)}`)
};

const BASE_URL = 'https://emirates-gifts.arabsad.com';

function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    log.error(`خطأ في قراءة ${filePath}: ${error.message}`);
    return [];
  }
}

function normalizeProduct(product, category) {
  return {
    id: product.id || `${category.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`,
    title: product.title || product.name || '',
    title_ar: product.title || '',
    title_en: product.title || '',
    description: product.description || product.meta_description || '',
    description_ar: product.description || product.meta_description || '',
    description_en: product.description || product.meta_description || '',
    price: parseInt(product.price) || 0,
    sale_price: parseInt(product.sale_price) || parseInt(product.price) || 0,
    image_link: product.image_link || product.imae_link || '',
    brand: product.brand || category,
    category: category,
    rating: product.rating || 4.5,
    review_count: product.review_count || 0,
    url: `${BASE_URL}/products/${product.id}`
  };
}

function createDirectories() {
  const dirs = ['data', 'public/feeds', 'public/schema'];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      log.info(`مجلد منشأ: ${dir}`);
    }
  });
}

function createFeeds(products) {
  log.header('📄 إنشاء الفيدات');
  
  // CSV عربي
  let csvAr = 'ID,Title,Description,Price,Sale_Price,Image,Availability,Brand,Category,URL\n';
  products.forEach(p => {
    csvAr += `${p.id},"${p.title}","${p.description}",${p.price} AED,${p.sale_price} AED,${p.image_link},in stock,${p.brand},${p.category},${p.url}\n`;
  });
  fs.writeFileSync('public/feeds/merchant-feed-ar.csv', csvAr);
  log.info(`CSV عربي: ${products.length} منتج`);
  
  // CSV إنجليزي
  let csvEn = 'ID,Title,Description,Price,Sale_Price,Image,Availability,Brand,Category,URL\n';
  products.forEach(p => {
    csvEn += `${p.id},"${p.title_en}","${p.description_en}",${p.price} AED,${p.sale_price} AED,${p.image_link},in stock,${p.brand},${p.category},${p.url}\n`;
  });
  fs.writeFileSync('public/feeds/merchant-feed-en.csv', csvEn);
  log.info(`CSV إنجليزي: ${products.length} منتج`);
  
  // CSV بسيط
  let csvSimple = 'ID,Title,Description,Price,Sale_Price,Image,Availability,Brand,Category,URL\n';
  products.forEach(p => {
    csvSimple += `${p.id},${p.title},"${p.description}",${p.price} AED,${p.sale_price} AED,${p.image_link},in stock,${p.brand},${p.category},${p.url}\n`;
  });
  fs.writeFileSync('public/feeds/products-feed.csv', csvSimple);
  log.info(`CSV بسيط: ${products.length} منتج`);
  
  // XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n';
  xml += '<channel>\n';
  xml += '<title>Emirates Gifts - Products Feed</title>\n';
  xml += `<link>${BASE_URL}</link>\n`;
  xml += '<description>Premium gifts collection</description>\n';
  
  products.forEach(p => {
    xml += '<item>\n';
    xml += `  <g:id>${p.id}</g:id>\n`;
    xml += `  <title>${p.title}</title>\n`;
    xml += `  <description>${p.description}</description>\n`;
    xml += `  <link>${p.url}</link>\n`;
    xml += `  <g:image_link>${p.image_link}</g:image_link>\n`;
    xml += `  <g:price>${p.price} AED</g:price>\n`;
    xml += `  <g:sale_price>${p.sale_price} AED</g:sale_price>\n`;
    xml += '  <g:availability>in stock</g:availability>\n';
    xml += '  <g:condition>new</g:condition>\n';
    xml += `  <g:brand>${p.brand}</g:brand>\n`;
    xml += `  <g:product_type>${p.category}</g:product_type>\n`;
    xml += '</item>\n';
  });
  
  xml += '</channel>\n';
  xml += '</rss>\n';
  fs.writeFileSync('public/feeds/merchant-feed.xml', xml);
  log.info(`XML Feed: ${products.length} منتج`);
}

function createSchema(products) {
  log.header('📄 إنشاء Schema');
  
  const schema = {
    '@context': 'https://schema.org/',
    '@type': 'ItemList',
    'name': 'منتجات Emirates Gifts',
    'description': 'قائمة هدايا مختارة: عطور وساعات فاخرة',
    'url': BASE_URL,
    'itemListElement': products.slice(0, 100).map((p, i) => ({
      '@type': 'Product',
      'position': i + 1,
      'name': p.title,
      'description': p.description,
      'url': p.url,
      'image': p.image_link,
      'brand': { '@type': 'Brand', 'name': p.brand },
      'offers': {
        '@type': 'Offer',
        'url': p.url,
        'priceCurrency': 'AED',
        'price': String(p.sale_price),
        'availability': 'https://schema.org/InStock'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': String(p.rating),
        'reviewCount': String(p.review_count)
      }
    }))
  };
  
  fs.writeFileSync('public/schema/products-schema.json', JSON.stringify(schema, null, 2));
  log.info(`Schema: ${Math.min(products.length, 100)} منتج`);
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Emirates Gifts - Merge Products Data');
  console.log('='.repeat(60) + '\n');
  
  try {
    // قراءة البيانات
    log.header('📥 قراءة البيانات');
    
    const perfumes = readJsonFile('data/perfumes.json');
    log.info(`عطور: ${perfumes.length}`);
    
    const watches = readJsonFile('data/watches.json');
    log.info(`ساعات: ${watches.length}`);
    
    if (perfumes.length === 0 || watches.length === 0) {
      log.error('واحد من الملفات فارغ!');
      process.exit(1);
    }
    
    // تطبيع البيانات
    log.header('📝 تطبيع البيانات');
    const normalizedPerfumes = perfumes.map(p => normalizeProduct(p, 'Perfumes'));
    const normalizedWatches = watches.map(p => normalizeProduct(p, 'Watches'));
    
    // دمج البيانات
    const allProducts = [...normalizedPerfumes, ...normalizedWatches];
    log.info(`إجمالي: ${allProducts.length} منتج`);
    
    // إنشاء المجلدات
    createDirectories();
    
    // حفظ البيانات
    log.header('💾 حفظ البيانات');
    fs.writeFileSync('data/products.json', JSON.stringify(allProducts, null, 2));
    log.info('products.json: نجاح');
    
    // الملخص
    const summary = {
      timestamp: new Date().toISOString(),
      total_products: allProducts.length,
      perfumes: perfumes.length,
      watches: watches.length,
      status: 'success',
      feeds: {
        csv_ar: 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed-ar.csv',
        csv_en: 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed-en.csv',
        xml: 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/public/feeds/merchant-feed.xml',
        json: 'https://raw.githubusercontent.com/sherow1982/emirates-gifts/main/data/products.json'
      }
    };
    fs.writeFileSync('data/summary.json', JSON.stringify(summary, null, 2));
    log.info('summary.json: نجاح');
    
    // إنشاء الفيدات
    createFeeds(allProducts);
    createSchema(allProducts);
    
    // النتائج النهاية
    log.header('✅ العملية ناجحة!');
    console.log(`✓ إجمالي المنتجات: ${allProducts.length}`);
    console.log(`✓ منتجات بصور: ${allProducts.filter(p => p.image_link).length}`);
    console.log(`✓ الفيدات: CSV (3) + XML + JSON + Schema`);
    console.log('\n' + '='.repeat(60) + '\n');
    
    process.exit(0);
  } catch (error) {
    log.error(`خطأ: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
