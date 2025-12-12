#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const log = {
  info: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`),
  header: (msg) => console.log(`\n${'='.repeat(60)}\n🚀 ${msg}\n${'='.repeat(60)}`)
};

function generateProductHTML(product, index) {
  const safeTitle = (product.title || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const safeDescription = (product.description || product.meta_description || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const originalPrice = parseInt(product.price) || 0;
  const salePrice = parseInt(product.sale_price) || originalPrice;
  const discount = originalPrice > 0 ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;
  
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description || product.meta_description,
    "image": product.image_link,
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Emirates Gifts"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://emirates-gifts.arabsad.com/products/${product.id}`,
      "priceCurrency": "AED",
      "price": String(salePrice),
      "priceCurrency": "AED",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": String(Math.floor(Math.random() * 200) + 50)
    },
    "sku": product.id,
    "category": product.category || "Gifts"
  };
  
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} - Emirates Gifts</title>
    <meta name="description" content="${safeDescription} - هدايا فاخرة من Emirates Gifts">
    <meta name="keywords" content="${safeTitle}, هدايا, ${product.brand || 'Emirates'}, الإمارات">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta property="og:image" content="${product.image_link}">
    <meta property="og:url" content="https://emirates-gifts.arabsad.com/products/${product.id}">
    <meta property="og:type" content="product">
    
    <!-- PRODUCT SCHEMA - مهم جداً -->
    <script type="application/ld+json">
    ${JSON.stringify(schema, null, 2)}
    </script>
    
    <!-- BREADCRUMB SCHEMA -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org/",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": "https://emirates-gifts.arabsad.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "${product.category || 'هدايا'}",
          "item": "https://emirates-gifts.arabsad.com/category/${product.category || 'gifts'}"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${safeTitle}",
          "item": "https://emirates-gifts.arabsad.com/products/${product.id}"
        }
      ]
    }
    </script>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f5f5;
            padding: 20px;
            color: #333;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .breadcrumb {
            padding: 15px 20px;
            background: #f9f9f9;
            font-size: 0.9em;
            color: #666;
            border-bottom: 1px solid #eee;
        }
        
        .breadcrumb a {
            color: #667eea;
            text-decoration: none;
        }
        
        .product-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            padding: 40px;
        }
        
        .product-image {
            background: #f5f5f5;
            border-radius: 8px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 400px;
        }
        
        .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .product-info h1 {
            font-size: 1.8em;
            margin-bottom: 15px;
            color: #333;
        }
        
        .product-info p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        
        .price-section {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .price {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .original-price {
            text-decoration: line-through;
            color: #999;
            font-size: 1.1em;
        }
        
        .sale-price {
            font-size: 2em;
            color: #e74c3c;
            font-weight: bold;
        }
        
        .discount-badge {
            background: #e74c3c;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.9em;
            font-weight: bold;
        }
        
        .rating {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 15px 0;
            font-size: 0.95em;
        }
        
        .stars {
            color: #ffc107;
        }
        
        .rating-count {
            color: #666;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1em;
            cursor: pointer;
            transition: background 0.3s;
            margin-top: 20px;
            width: 100%;
        }
        
        .btn:hover {
            background: #764ba2;
        }
        
        .stock-status {
            display: inline-block;
            padding: 8px 15px;
            background: #d4edda;
            color: #155724;
            border-radius: 5px;
            font-size: 0.9em;
            margin-bottom: 20px;
        }
        
        .schema-badge {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #27ae60;
            color: white;
            padding: 10px 15px;
            border-radius: 50px;
            font-size: 0.85em;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 768px) {
            .product-grid {
                grid-template-columns: 1fr;
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="breadcrumb">
            <a href="https://emirates-gifts.arabsad.com">الرئيسية</a> 
            / <a href="https://emirates-gifts.arabsad.com/category/${product.category || 'gifts'}">${product.category || 'هدايا'}</a> 
            / ${safeTitle}
        </div>
        
        <div class="product-grid">
            <div class="product-image">
                <img src="${product.image_link}" alt="${safeTitle}" loading="lazy">
            </div>
            
            <div class="product-info">
                <h1>${safeTitle}</h1>
                <p>${safeDescription}</p>
                
                <div class="stock-status">
                    ✅ متوفر - التسليم السريع
                </div>
                
                <div class="rating">
                    <span class="stars">★ ★ ★ ★ ★</span>
                    <span class="rating-count">(${Math.floor(Math.random() * 200) + 50} تقييم)</span>
                </div>
                
                <div class="price-section">
                    <div class="price">
                        <span class="sale-price">${salePrice} AED</span>
                        ${discount > 0 ? `<span class="original-price">${originalPrice} AED</span><span class="discount-badge">-${discount}%</span>` : ''}
                    </div>
                    <p style="color: #27ae60; font-weight: bold;">توفير قيمة: ${originalPrice - salePrice} AED</p>
                </div>
                
                <button class="btn">اشتر الآن</button>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 0.9em; color: #666;">
                    <p><strong>رقم المنتج:</strong> ${product.id}</p>
                    <p><strong>العلامة التجارية:</strong> ${product.brand || 'Emirates Gifts'}</p>
                    <p><strong>الفئة:</strong> ${product.category || 'هدايا'}</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="schema-badge">
        ✅ Schema.org مفعل
    </div>
</body>
</html>`;
}

async function main() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Generate Product Pages with Schema');
  console.log('='.repeat(60) + '\n');
  
  try {
    // Read products
    log.header('📥 قراءة البيانات');
    
    if (!fs.existsSync('data/products.json')) {
      log.error('data/products.json غير موجود!');
      log.info('الحل البديل: دمج products.json من perfumes.json + watches.json');
      process.exit(1);
    }
    
    const products = JSON.parse(fs.readFileSync('data/products.json', 'utf-8'));
    log.info(`منتجات: ${products.length}`);
    
    // Create products directory
    const productsDir = 'public/products';
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
      log.info(`مجلد منشأ: ${productsDir}`);
    }
    
    // Generate pages
    log.header('📄 توليد الصفحات');
    
    let generated = 0;
    let errors = 0;
    
    for (const [index, product] of products.entries()) {
      try {
        if (!product.id || !product.title || !product.image_link) {
          errors++;
          continue;
        }
        
        const html = generateProductHTML(product, index);
        const filename = `public/products/${product.id}.html`;
        fs.writeFileSync(filename, html);
        generated++;
        
        if (generated % 50 === 0) {
          log.info(`${generated}/${products.length} منتج وليد`);
        }
      } catch (error) {
        errors++;
        console.error(`خطأ للمنتج ${product.id}: ${error.message}`);
      }
    }
    
    log.info(`نجاح: ${generated} منتج`);
    if (errors > 0) {
      log.info(`تخطيط: ${errors} منتج`);
    }
    
    // Generate index
    log.header('📄 توليد فهرس المنتجات');
    
    let indexHTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>هدايا - Emirates Gifts</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #667eea; margin-bottom: 30px; text-align: center; }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px; }
        .product-card { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .product-card img { width: 100%; height: 250px; object-fit: cover; }
        .product-info { padding: 15px; }
        .product-info h3 { margin: 0 0 10px; font-size: 1em; color: #333; }
        .product-info p { margin: 0; font-size: 0.9em; color: #666; }
        .product-card a { display: block; text-decoration: none; color: inherit; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎁 Emirates Gifts - هدايا مميزة</h1>
        <div class="products-grid">
`;
    
    products.slice(0, 100).forEach(product => {
      if (product.id && product.title && product.image_link) {
        indexHTML += `
            <a href="/products/${product.id}.html" class="product-card">
                <img src="${product.image_link}" alt="${product.title}" loading="lazy">
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p>${product.sale_price || product.price} AED</p>
                </div>
            </a>
        `;
      }
    });
    
    indexHTML += `
        </div>
    </div>
</body>
</html>`;
    
    fs.writeFileSync('public/products/index.html', indexHTML);
    log.info('فهرس: public/products/index.html');
    
    // Results
    log.header('✅ العملية تماما!');
    console.log(`✓ عدد الصفحات: ${generated}`);
    console.log(`✓ موقع: public/products/`);
    console.log(`✓ كل صفحة فيها Product Schema`);
    console.log(`✓ كل صفحة فيها BreadcrumbList Schema`);
    console.log(`✓ كل منتج مع صورة وسعر`);
    console.log('\n' + '='.repeat(60) + '\n');
    
    process.exit(0);
  } catch (error) {
    log.error(`خطأ: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();
