/**
 * Schema Handler - يضيف schema.org markup تلقائياً للصفحات
 * Schema Handler - Automatically adds schema.org markup to pages
 */

export const getProductsSchema = (lang = 'ar') => {
  const isArabic = lang === 'ar' || lang === 'ar-AE';
  
  const schemaData = {
    ar: {
      context: 'https://schema.org/',
      type: 'ItemList',
      name: 'منتجات الإمارات - Emirates Gifts',
      description: 'قائمة منتجات عطور وساعات فاخرة من Emirates Gifts - هدايا مثالية',
      url: 'https://emirates-gifts.arabsad.com',
    },
    en: {
      context: 'https://schema.org/',
      type: 'ItemList',
      name: 'Emirates Gifts - Premium Gifts',
      description: 'Complete list of luxury perfumes and watches from Emirates Gifts',
      url: 'https://emirates-gifts.arabsad.com/en',
    },
  };

  return schemaData[isArabic ? 'ar' : 'en'];
};

export const getProductSchema = (product, lang = 'ar') => {
  const isArabic = lang === 'ar' || lang === 'ar-AE';
  const baseUrl = isArabic 
    ? 'https://emirates-gifts.arabsad.com/products/' 
    : 'https://emirates-gifts.arabsad.com/en/product/';

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.title || product.name,
    'description': product.meta_description || product.description,
    'image': product.image_link || product.image,
    'url': `${baseUrl}${product.id}`,
    'sku': product.id,
    'mpn': product.id,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'Emirates Gifts',
    },
    'category': 'watch' in product.id ? 'Watches' : 'Perfumes',
    'offers': {
      '@type': 'Offer',
      'url': `${baseUrl}${product.id}`,
      'priceCurrency': 'AED',
      'price': String(product.sale_price || product.price),
      'priceValidUntil': new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
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
  };
};

export const injectSchema = (schema) => {
  if (typeof window !== 'undefined') {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
};

/**
 * React Hook - استخدم هذا في الصفحات
 * Usage in React:
 * 
 * import { useEffect } from 'react';
 * import { getProductsSchema, injectSchema } from '@/lib/schema-handler';
 * 
 * export default function Page() {
 *   useEffect(() => {
 *     injectSchema(getProductsSchema('ar'));
 *   }, []);
 *   
 *   return <div>...</div>;
 * }
 */

/**
 * Next.js App Router - استخدم في layout.js
 * Usage in layout.js:
 * 
 * import Head from 'next/head';
 * import { getProductsSchema } from '@/lib/schema-handler';
 * 
 * export default function Layout({ children }) {
 *   const schema = getProductsSchema('ar');
 *   
 *   return (
 *     <>
 *       <Head>
 *         <script
 *           type="application/ld+json"
 *           dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 *         />
 *       </Head>
 *       {children}
 *     </>
 *   );
 * }
 */
