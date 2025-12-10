#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
حقن السكيما والميتا تاغ لكل صفحات المنتجات في مجلد products باستخدام BeautifulSoup.
هذا السكربت يقرأ الإعدادات من ملف JSON خارجي لزيادة المرونة.
"""

import sys
import re
import json
from pathlib import Path
from datetime import datetime, timedelta

try:
    from bs4 import BeautifulSoup
except ImportError:
    print("مكتبة BeautifulSoup غير مثبتة. يرجى تثبيتها باستخدام: pip install beautifulsoup4")
    sys.exit(1)

# --- ثوابت ---
DEFAULT_PRODUCT_TITLE = "منتج مميز من هدايا الإمارات"
MAIN_IMAGE_SELECTOR = "img.product-image, .main-product-image img, #product-image" # CSS selector for main product image
PRICE_REGEX_PATTERNS = [
    r'([\d,]+(?:\.\d{1,2})?)\s*AED',
    r'([\d,]+(?:\.\d{1,2})?)\s*د\.إ',
    r'([\d,]+(?:\.\d{1,2})?)\s*درهم',
]


def get_script_and_root_dirs():
    """الحصول على مسارات المجلدات الرئيسية."""
    script_dir = Path(__file__).parent.resolve()
    root_dir = script_dir.parent
    return script_dir, root_dir


def setup_logging():
    """إعداد نظام تسجيل الأحداث (Logging)."""
    # يمكن إضافة إعدادات تسجيل أكثر تفصيلاً هنا في المستقبل
    sys.exit(1)


def load_config(config_path):
    """تحميل الإعدادات من ملف JSON."""
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"❌ خطأ في تحميل أو قراءة ملف الإعدادات {config_path}: {e}")
        sys.exit(1)


def extract_product_info(soup, config):
    """استخراج معلومات المنتج من كائن BeautifulSoup."""
    info = {}
    # استخراج العنوان
    title_tag = soup.find('title')
    h1_tag = soup.find('h1')
    if title_tag and title_tag.string:
        info['title'] = title_tag.string.split('|')[0].strip()
    elif h1_tag and h1_tag.string:
        info['title'] = h1_tag.string.strip()
    else:
        info['title'] = DEFAULT_PRODUCT_TITLE
        print("   ⚠️ لم يتم العثور على عنوان، سيتم استخدام قيمة افتراضية.")

    # استخراج الصورة
    img_tag = soup.select_one(MAIN_IMAGE_SELECTOR) or soup.find('img')
    if img_tag and img_tag.get('src'):
        src = img_tag['src']
        info['image'] = src if src.startswith('http') else f"{config['base_url']}{src if src.startswith('/') else '/' + src}"
    else:
        info['image'] = f"{config['base_url']}{config['default_image']}"
        print("   ⚠️ لم يتم العثور على صورة، سيتم استخدام صورة افتراضية.")
    
    # استخراج السعر
    html_text = soup.get_text()
    price = 0.0
    for pattern in PRICE_REGEX_PATTERNS:
        m = re.search(pattern, html_text, re.IGNORECASE)
        if m:
            try:
                # إزالة فاصل الآلاف (,) ثم تحويل فاصل العشرية (إذا كان ,) إلى .
                price_str = m.group(1).replace(',', '')
                price = float(price_str)
                break
            except ValueError:
                # محاولة بديلة للتعامل مع صيغة مثل 1,23
                try:
                    price = float(m.group(1).replace(',', '.'))
                    break
                except ValueError:
                    continue
                continue
    info['price'] = price
    if price == 0.0:
        print("   ⚠️ لم يتم العثور على سعر، سيتم استخدام القيمة 0.0.")

    return info


def build_product_url(file_path, base_url):
    """بناء رابط المنتج الكامل."""
    return f"{base_url}/products/{file_path.name}"


def create_product_schema(info, url, config):
    """إنشاء سكيما المنتج بصيغة JSON-LD."""
    price_valid_until = (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d')
    schema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": info['title'],
        "image": [info['image']],
        "description": f"{info['title']} - هدايا فريدة من {config['brand_name']} مع توصيل سريع",
        "brand": {
            "@type": "Brand",
            "name": config['brand_name']
        },
        "offers": {
            "@type": "Offer",
            "url": url,
            "priceCurrency": config['product_defaults']['currency'],
            "price": str(info['price']),
            "priceValidUntil": price_valid_until,
            "itemCondition": config['product_defaults']['condition'],
            "availability": config['product_defaults']['availability'],
            "seller": {
                "@type": "Organization",
                "name": config['brand_name']
            }
        }
    }
    return schema


def create_local_business_schema(config):
    """إنشاء سكيما النشاط التجاري المحلي بصيغة JSON-LD."""
    details = config['business_details']
    schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": details['name'],
        "image": f"{config['base_url']}{config['default_image']}",
        "url": config['base_url'],
        "telephone": details['telephone'],
        "address": details['address'],
        "geo": details['geo'],
        "openingHours": details['openingHours'],
        "priceRange": details['priceRange']
    }
    return schema


def update_meta_tag(soup, name, content, is_property=False):
    """تحديث أو إنشاء ميتا تاغ."""
    attr = 'property' if is_property else 'name'
    tag = soup.find('meta', {attr: name})
    if not tag:
        tag = soup.new_tag('meta')
        tag[attr] = name
        soup.head.append(tag)
    tag['content'] = content


def inject_seo(soup, info, url, config):
    """حقن بيانات SEO و JSON-LD في كائن BeautifulSoup."""
    if not soup.head:
        soup.head = soup.new_tag('head')
        soup.body.insert_before(soup.head)

    # إزالة السكيما والميتا تاغ القديمة التي تم إنشاؤها تلقائيًا
    for tag in soup.find_all(lambda t: t.string and 'Auto-generated' in t.string):
        tag.find_parent().decompose()
    for script in soup.find_all('script', type='application/ld+json'):
        script.decompose()

    # تحديث عنوان الصفحة
    if soup.title:
        soup.title.string = f"{info['title']} - {config['brand_name']} | هدايا فريدة وعروض حصرية"
    else:
        new_title = soup.new_tag('title')
        new_title.string = f"{info['title']} - {config['brand_name']}"
        soup.head.append(new_title)

    # تحديث الميتا تاغ
    desc = f"{info['title']} - هدايا فريدة من {config['brand_name']} مع توصيل سريع لكل الإمارات"
    desc = (desc[:152] + '...') if len(desc) > 155 else desc
    
    update_meta_tag(soup, 'description', desc)
    update_meta_tag(soup, 'keywords', f"{info['title']}, {config['brand_name']}, هدايا, تسوق اونلاين, الإمارات")
    update_meta_tag(soup, 'og:title', f"{info['title']} - {config['brand_name']}", is_property=True)
    update_meta_tag(soup, 'og:description', desc, is_property=True)
    update_meta_tag(soup, 'og:image', info['image'], is_property=True)
    update_meta_tag(soup, 'og:url', url, is_property=True)
    update_meta_tag(soup, 'og:site_name', config['brand_name'], is_property=True)
    update_meta_tag(soup, 'twitter:card', 'summary_large_image')
    update_meta_tag(soup, 'twitter:title', f"{info['title']} - {config['brand_name']}")
    update_meta_tag(soup, 'twitter:description', desc)
    update_meta_tag(soup, 'twitter:image', info['image'])

    # إضافة Canonical URL
    if not soup.find('link', rel='canonical'):
        canonical_tag = soup.new_tag('link', rel='canonical', href=url)
        soup.head.append(canonical_tag)

    # إنشاء وحقن السكيما
    product_schema = create_product_schema(info, url, config)
    local_schema = create_local_business_schema(config)

    product_script = soup.new_tag('script', type='application/ld+json')
    product_script.string = json.dumps(product_schema, ensure_ascii=False, indent=2)
    
    local_script = soup.new_tag('script', type='application/ld+json')
    local_script.string = json.dumps(local_schema, ensure_ascii=False, indent=2)

    soup.head.append(soup.new_string("\n<!-- Auto-generated SEO and Schema -->\n"))
    soup.head.append(product_script)
    soup.head.append("\n")
    soup.head.append(local_script)
    soup.head.append("\n")


def process_file(file_path, config):
    """معالجة ملف HTML واحد."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, 'html.parser')

        product_info = extract_product_info(soup, config)
        product_url = build_product_url(file_path, config['base_url'])
        
        inject_seo(soup, product_info, product_url, config)

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(str(soup.prettify(formatter='html5')))

        print(f"   ✅ {file_path.name}")
        return True
    except Exception as e:
        print(f"   ❌ {file_path.name}: {e}")
        return False


def main():
    """الدالة الرئيسية لتشغيل السكربت."""
    print("\n" + "="*70)
    print("🎁 سكربت سكيما وSEO لجميع المنتجات الثابتة في emirates-gifts 🎁")
    print("="*70 + "\n")

    script_dir, root_dir = get_script_and_root_dirs()
    config = load_config(script_dir / "seo_config.json")

    products_dir = root_dir / "products"
    if not products_dir.exists():
        print(f"❌ مجلد products غير موجود في: {products_dir.resolve()}")
        sys.exit(1)

    html_files = sorted(list(products_dir.glob("*.html")))
    if not html_files:
        print("❌ لا يوجد أي ملفات HTML داخل products/\n")
        sys.exit(1)

    print(f"📦 {len(html_files)} صفحة منتج في products/\n")
    ok = 0
    fail = 0
    for i, fp in enumerate(html_files, 1):
        print(f"[{i}/{len(html_files)}] معالجة: {fp.name} ...", end=' ')
        if process_file(fp, config):
            ok += 1
        else:
            fail += 1

    print("\n" + "="*70)
    print(f"✅ نجح: {ok} ملف")
    print(f"❌ فشل: {fail} ملف")
    if html_files:
        print(f"📈 نسبة النجاح: {(ok/len(html_files)*100):.1f}%")
    print("="*70)
    print("\n✨ انتهى التنفيذ بنجاح! الآن كل صفحة منتج تحتوي عناصر سكيما JSON-LD حقيقية\n")


if __name__ == "__main__":
    main()
