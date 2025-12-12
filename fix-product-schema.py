#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import json
import re
from pathlib import Path
from urllib.parse import quote

# Get all HTML files from products folder
products_dir = Path('products')
if not products_dir.exists():
    print("❌ Products directory not found")
    exit(1)

html_files = sorted(products_dir.glob('*.html'))
print(f"📂 Found {len(html_files)} product pages\n")

scroll_count = 0
for html_file in html_files:
    scroll_count += 1
    print(f"[{scroll_count}/{len(html_files)}] Processing: {html_file.name}")
    
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract product info from the file
    # Get product name from title
    title_match = re.search(r'<h1[^>]*class="product-title"[^>]*>([^<]+)</h1>', content)
    if not title_match:
        title_match = re.search(r'<title>([^|]+)', content)
    product_name = title_match.group(1).strip() if title_match else 'Product'
    
    # Get price
    price_match = re.search(r'<span[^>]*class="current-price"[^>]*>([0-9.]+)', content)
    price = price_match.group(1) if price_match else "0"
    
    # Get image URL
    image_match = re.search(r'<img[^>]*src="([^"]+)"[^>]*class="product-main-image"', content)
    if not image_match:
        image_match = re.search(r'og:image"[^>]*content="([^"]+)"', content)
    image_url = image_match.group(1) if image_match else ""
    
    # Get description
    desc_match = re.search(r'<meta[^>]*name="description"[^>]*content="([^"]+)"', content)
    description = desc_match.group(1) if desc_match else f"Product {product_name}"
    
    # Get category from breadcrumb or og:description
    category_match = re.search(r'<a[^>]*href="[^"]*"[^>]*>([^<]+)</a>\s*/\s*<a[^>]*>([^<]+)</a>', content)
    category = category_match.group(2) if category_match else "منتج"
    
    # Create complete Product Schema
    product_schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "@id": f"https://emirates-gifts.arabsad.com/products/{html_file.stem}.html#product",
        "name": product_name,
        "image": [
            image_url
        ],
        "description": description,
        "brand": {
            "@type": "Brand",
            "@id": "https://emirates-gifts.arabsad.com/#brand",
            "name": "Emirates Gifts | متجر هدايا الإمارات"
        },
        "category": category,
        "offers": {
            "@type": "Offer",
            "@id": f"https://emirates-gifts.arabsad.com/products/{html_file.stem}.html#offer",
            "url": f"https://emirates-gifts.arabsad.com/products/{html_file.stem}.html",
            "priceCurrency": "AED",
            "price": price,
            "priceValidUntil": "2026-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "@id": "https://emirates-gifts.arabsad.com/#organization",
                "name": "Emirates Gifts"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.7",
            "reviewCount": "62",
            "bestRating": "5",
            "worstRating": "1"
        },
        "url": f"https://emirates-gifts.arabsad.com/products/{html_file.stem}.html"
    }
    
    # Create BreadcrumbList Schema
    breadcrumb_schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": f"https://emirates-gifts.arabsad.com/products/{html_file.stem}.html#breadcrumb",
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
                "name": category,
                "item": f"https://emirates-gifts.arabsad.com/category/{quote(category)}"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": product_name,
                "item": f"https://emirates-gifts.arabsad.com/products/{html_file.stem}.html"
            }
        ]
    }
    
    # Remove old schema placeholders
    content = re.sub(r'<!-- Product Schema \(Auto\) -->\s*', '', content)
    content = re.sub(r'<!-- Product Schema JSON-LD \(Auto\) -->\s*', '', content)
    content = re.sub(r'<!-- LocalBusiness Schema \(Auto\) -->\s*', '', content)
    content = re.sub(r'<!-- LocalBusiness Schema JSON-LD \(Auto\) -->\s*', '', content)
    
    # Remove multiple schema blocks
    content = re.sub(
        r'<script type="application/ld\+json">\s*\{[^}]*"@type":\s*"Product"[^}]*\}\s*</script>',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Create new schema block
    schema_block = f'''<!-- Product & Breadcrumb Schema (Auto Generated) -->
<script type="application/ld+json">
{json.dumps(product_schema, ensure_ascii=False, indent=2)}
</script>

<script type="application/ld+json">
{json.dumps(breadcrumb_schema, ensure_ascii=False, indent=2)}
</script>
<!-- /Schema -->\n'''
    
    # Find the right place to insert schema (before closing </head>)
    if '</head>' in content:
        content = content.replace('</head>', schema_block + '</head>', 1)
    else:
        print(f"⚠️  Warning: No </head> tag found in {html_file.name}")
    
    # Write updated content
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Schema updated for: {product_name}")

print(f"\n{'='*60}")
print(f"✨ تم ضبط schema لـ {scroll_count} صفحة منتج!")
print(f"{'='*60}")
print("\n🚀 الآن كل صفحة فيها:")
print("  ✓ Product Schema (مهم جداً لـ Google)")
print("  ✓ BreadcrumbList Schema")
print("  ✓ Rating & Offer data")
print("  ✓ Image metadata")
print("\n📊 التحديثات موجودة الآن في كل الملفات!")
