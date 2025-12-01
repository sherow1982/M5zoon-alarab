#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكربت SEO وسكيما احترافي لريبو emirates-gifts
يعدل جميع ملفات HTML في مجلد products
"""

import sys
import re
from pathlib import Path
from datetime import datetime, timedelta

def extract_title(html):
    """استخراج العنوان من HTML"""
    m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
    if m:
        title = m.group(1).strip()
        # إزالة أي نص إضافي بعد |
        title = title.split('|')[0].strip()
        return title if title else "هدية من Emirates Gifts"
    
    m = re.search(r'<h1[^>]*>([^<]+)</h1>', html, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    
    return "هدية من Emirates Gifts"

def extract_image(html):
    """استخراج صورة من HTML"""
    m = re.search(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html, re.IGNORECASE)
    if m:
        src = m.group(1).strip()
        if src.startswith('http'):
            return src
        return f"https://sherow1982.github.io/emirates-gifts/{src.lstrip('/')}"
    
    return "https://sherow1982.github.io/emirates-gifts/logo.png"

def extract_price(html):
    """استخراج السعر من HTML"""
    patterns = [
        r'(\d+[\.,]?\d*)\s*AED',
        r'(\d+[\.,]?\d*)\s*د\.إ',
        r'(\d+[\.,]?\d*)\s*درهم',
        r'price["\']?\s*:\s*["\']?(\d+[\.,]?\d*)',
    ]
    
    for pattern in patterns:
        m = re.search(pattern, html, re.IGNORECASE)
        if m:
            val = m.group(1).replace(',', '.')
            try:
                return float(val)
            except:
                continue
    
    return 0

def build_product_url(file_path):
    """بناء URL للمنتج"""
    name = file_path.name
    return f"https://sherow1982.github.io/emirates-gifts/products/{name}"

def create_product_schema(title, image, url, price):
    """بناء Product Schema JSON-LD"""
    import json
    
    if not price:
        price = 0
    
    title = title.replace('"', '\\"').replace('\n', ' ').replace('\r', '')
    
    price_valid_until = (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d')
    
    schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title,
        "image": [image] if image else [],
        "description": f"{title} - هدايا فريدة من Emirates Gifts مع توصيل سريع",
        "brand": {
            "@type": "Brand",
            "name": "Emirates Gifts"
        },
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": "AED",
            "price": str(price),
            "priceValidUntil": price_valid_until,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Emirates Gifts"
            }
        }
    }
    
    return json.dumps(schema, ensure_ascii=False, indent=2)

def create_local_business_schema():
    """بناء LocalBusiness Schema JSON-LD"""
    import json
    
    schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Emirates Gifts",
        "image": "https://sherow1982.github.io/emirates-gifts/logo.png",
        "url": "https://sherow1982.github.io/emirates-gifts/",
        "telephone": "+201110760081",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "الإمارات العربية المتحدة",
            "addressLocality": "دبي",
            "addressRegion": "دبي",
            "postalCode": "00000",
            "addressCountry": "AE"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "25.2048",
            "longitude": "55.2708"
        },
        "openingHours": "Su-Sa 08:00-23:00",
        "priceRange": "$$"
    }
    
    return json.dumps(schema, ensure_ascii=False, indent=2)

def create_meta_tags(title, image, url, price):
    """بناء Meta Tags"""
    title = title.replace('"', '').replace("'", '').strip()
    desc = f"{title} - هدايا فريدة من Emirates Gifts"
    if len(desc) > 155:
        desc = desc[:152] + "..."
    
    emirates_cities = "دبي، أبوظبي، الشارقة، عجمان، رأس الخيمة، الفجيرة، أم القيوين"
    
    meta = f"""
    <!-- SEO Meta Tags (Auto) -->
    <meta charset="UTF-8">
    <title>{title} - Emirates Gifts | هدايا فريدة وعروض حصرية</title>
    <meta name="description" content="{desc} توصيل سريع لكل الإمارات">
    <meta name="keywords" content="{title}, Emirates Gifts, هدايا, تسوق اونلاين, الإمارات, {emirates_cities}">
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="geo.region" content="AE">
    <meta name="geo.placename" content="الإمارات">
    <meta name="geo.position" content="25.2048;55.2708">
    <link rel="canonical" href="{url}">
    <!-- Open Graph -->
    <meta property="og:title" content="{title} - Emirates Gifts">
    <meta property="og:description" content="{desc}">
    <meta property="og:image" content="{image}">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="Emirates Gifts">
    <meta property="og:locale" content="ar_AE">
    <meta property="product:price:amount" content="{price}">
    <meta property="product:price:currency" content="AED">
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{title} - Emirates Gifts">
    <meta name="twitter:description" content="{desc}">
    <meta name="twitter:image" content="{image}">
    """
    return meta

def inject_seo(html, title, image, url, price):
    """حقن SEO والسكيما في HTML"""
    
    if '</head>' not in html:
        if '<body' in html.lower():
            html = html.replace('<body', '</head><body', 1)
        else:
            html = html + '</head>'
    
    # إزالة Schema القديم
    html = re.sub(
        r'<script\s+type=["\']?application/ld\+json["\']?\s*>.*?</script>',
        '',
        html,
        flags=re.DOTALL | re.IGNORECASE
    )
    
    # بناء الحقن
    meta = create_meta_tags(title, image, url, price)
    product_schema = create_product_schema(title, image, url, price)
    local_schema = create_local_business_schema()
    
    injection = f"""
{meta}

<!-- Product Schema (Auto) -->
<script type="application/ld+json">
{product_schema}
</script>

<!-- LocalBusiness Schema (Auto) -->
<script type="application/ld+json">
{local_schema}
</script>

</head>"""
    
    html = html.replace('</head>', injection, 1)
    
    return html

def process_file(file_path):
    """معالجة ملف منتج واحد"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            html = f.read()
        
        print(f"     📖 قراءة الملف...")
        title = extract_title(html)
        print(f"     📝 العنوان: {title[:50]}...")
        
        image = extract_image(html)
        print(f"     🖼️ الصورة: موجودة")
        
        price = extract_price(html)
        print(f"     💰 السعر: {price} AED")
        
        url = build_product_url(file_path)
        
        updated = inject_seo(html, title, image, url, price)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated)
        
        print(f"   ✅ تم تحديث: {file_path.name}\n")
        return True
        
    except Exception as e:
        print(f"   ❌ خطأ في {file_path.name}: {str(e)}\n")
        return False

def main():
    print("\n" + "="*70)
    print("🎁 سكربت SEO/سكيما لملفات المنتجات - Emirates Gifts 🎁")
    print("="*70 + "\n")

    root = Path(".")
    products_dir = root / "products"

    if not products_dir.exists():
        print(f"❌ مجلد products غير موجود في: {root.resolve()}")
        sys.exit(1)

    html_files = sorted(list(products_dir.glob("*.html")))
    if not html_files:
        print("❌ لا يوجد أي ملفات HTML داخل products/\n")
        sys.exit(1)

    print(f"📦 تم العثور على {len(html_files)} صفحة")
    print(f"🚀 جاري بدء المعالجة...\n")
    print("-"*70 + "\n")

    ok = 0
    fail = 0

    for i, fp in enumerate(html_files, 1):
        print(f"[{i}/{len(html_files)}] معالجة: {fp.name}")
        if process_file(fp):
            ok += 1
        else:
            fail += 1

    print("-"*70)
    print("\n📊 النتائج النهائية:")
    print("="*70)
    print(f"✅ نجح: {ok} ملف")
    print(f"❌ فشل: {fail} ملف")
    if html_files:
        print(f"📈 نسبة النجاح: {(ok/len(html_files)*100):.1f}%")
    print("="*70)
    print("\n✨ انتهى التنفيذ بنجاح!\n")

if __name__ == "__main__":
    main()
