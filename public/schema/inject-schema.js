/**
 * Schema Injector - يضيف schema.org markup تلقائياً للموقع
 * Automatically injects schema.org structured data
 */

(function() {
  'use strict';

  // تحديد اللغة
  const lang = document.documentElement.lang || 'ar';
  const isArabic = lang.startsWith('ar');
  const baseUrl = isArabic 
    ? 'https://emirates-gifts.arabsad.com' 
    : 'https://emirates-gifts.arabsad.com/en';

  // البيانات الثابتة
  const schemaData = {
    '@context': 'https://schema.org/',
    '@type': 'Organization',
    'name': 'Emirates Gifts',
    'url': baseUrl,
    'logo': baseUrl + '/logo.png',
    'description': isArabic 
      ? 'متجر هدايا فاخرة متخصص في العطور والساعات السويسرية'
      : 'Luxury gifts shop specialized in perfumes and Swiss watches',
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'Customer Support',
      'email': 'support@emirates-gifts.arabsad.com'
    },
    'sameAs': [
      'https://www.facebook.com/emirates-gifts',
      'https://www.instagram.com/emirates-gifts',
      'https://www.tiktok.com/@emirates-gifts'
    ]
  };

  // إضافة الـ schema
  function injectSchema(data) {
    // تحقق إذا كان الـ schema موجود بالفعل
    let existingScript = document.querySelector(
      'script[type="application/ld+json"]:not([id])'
    );
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data, null, 2);
      document.head.appendChild(script);
      console.log('✅ Schema injected successfully');
    } else {
      console.log('ℹ️ Schema already exists');
    }
  }

  // انتظر حتى يكون DOM جاهز
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectSchema(schemaData);
    });
  } else {
    injectSchema(schemaData);
  }

  // دالة عامة للاستخدام
  window.injectProductSchema = function(product) {
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': product.title,
      'description': product.description,
      'image': product.image,
      'brand': {
        '@type': 'Brand',
        'name': product.brand || 'Emirates Gifts'
      },
      'offers': {
        '@type': 'Offer',
        'url': product.url,
        'priceCurrency': 'AED',
        'price': String(product.sale_price || product.price),
        'availability': 'https://schema.org/InStock',
        'seller': {
          '@type': 'Organization',
          'name': 'Emirates Gifts'
        }
      },
      'aggregateRating': product.rating ? {
        '@type': 'AggregateRating',
        'ratingValue': String(product.rating),
        'reviewCount': String(product.review_count || 0)
      } : undefined
    };

    injectSchema(productSchema);
  };

  // دالة لإضافة رابط البيانات المنظمة
  window.getSchemasJSON = function() {
    return {
      organization: schemaData,
      products: baseUrl + '/data/products.json'
    };
  };

})();
