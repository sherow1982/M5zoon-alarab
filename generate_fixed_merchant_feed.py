#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Google Merchant Feed Generator المُصلح - متجر هدايا الإمارات
يحل مشكلة التصنيف الخاطئ للعطور والساعات
"""

import json
import xml.etree.ElementTree as ET
from datetime import datetime
import re
from pathlib import Path
import logging

# إعداد اللوغ
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# إعدادات المتجر
STORE_CONFIG = {
    'name': 'متجر هدايا الإمارات',
    'domain': 'https://emirates-gifts.arabsad.com',
    'currency': 'AED',
    'country': 'AE',
    'language': 'ar',
    'brand': 'Emirates Gifts',
    'gtin_prefix': '1234567',
    'mpn_prefix': 'EG'
}

# فئات المنتجات Google
GOOGLE_CATEGORIES = {
    'perfume': {
        'google_category': 'Health & Beauty > Personal Care > Cosmetics > Fragrance',
        'product_type': 'عطور فاخرة',
        'condition': 'new',
        'age_group': 'adult',
        'gender': 'unisex'
    },
    'watch': {
        'google_category': 'Apparel & Accessories > Jewelry > Watches',
        'product_type': 'ساعات فاخرة',
        'condition': 'new',
        'age_group': 'adult',
        'gender': 'unisex'
    },
    'gift': {
        'google_category': 'Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts',
        'product_type': 'هدايا مميزة',
        'condition': 'new',
        'age_group': 'adult',
        'gender': 'unisex'
    }
}

# كلمات مفتاحية للتصنيف
PERFUME_KEYWORDS = [
    'عطر', 'عطور', 'perfume', 'fragrance', 'cologne', 'eau', 'scent',
    'chanel', 'dior', 'versace', 'tom ford', 'gucci', 'ysl', 'saint laurent',
    'hermes', 'kayali', 'penhaligons', 'xerjoff', 'marly', 'delina', 'oriana',
    'safanad', 'vanilla', 'oud', 'دخون', 'فواحة', 'عبق', 'عبير'
]

WATCH_KEYWORDS = [
    'ساعة', 'ساعات', 'watch', 'watches', 'timepiece',
    'rolex', 'omega', 'patek philippe', 'audemars piguet', 'cartier',
    'breitling', 'submariner', 'datejust', 'daytona', 'gmt',
    'اوميغا', 'رولكس', 'باتيك', 'كارتييه', 'بريتلينغ',
    'يخت ماستر', 'ديت جاست', 'دايتونا', 'سواتش', 'اويستر'
]

def classify_product(product, data_source):
    """تصنيف المنتج حسب مصدر البيانات والنص"""
    # أولوية لمصدر البيانات
    if data_source == 'perfumes':
        return 'perfume'
    elif data_source == 'watches':
        return 'watch'
    
    # تصنيف بناء على النص
    title = (product.get('title', '') or '').lower()
    
    # حساب نقاط الساعات
    watch_score = sum(1 for keyword in WATCH_KEYWORDS if keyword.lower() in title)
    
    # حساب نقاط العطور
    perfume_score = sum(1 for keyword in PERFUME_KEYWORDS if keyword.lower() in title)
    
    # قرار التصنيف
    if watch_score > perfume_score and watch_score > 0:
        return 'watch'
    elif perfume_score > 0:
        return 'perfume'
    else:
        return 'gift'

def generate_gtin(product_id, category):
    """إنشاء GTIN موحد"""
    category_code = {'perfume': '00', 'watch': '10', 'gift': '20'}[category]
    base = STORE_CONFIG['gtin_prefix'] + category_code
    padded_id = str(product_id).zfill(4)
    
    code = base + padded_id
    # حساب check digit
    checksum = sum(int(digit) * (3 if i % 2 else 1) for i, digit in enumerate(code))
    check_digit = (10 - (checksum % 10)) % 10
    
    return code + str(check_digit)

def generate_mpn(product_id, title, category):
    """إنشاء MPN موحد"""
    category_prefix = {'perfume': 'PERF', 'watch': 'WATCH', 'gift': 'GIFT'}[category]
    sanitized_title = re.sub(r'[^\u0600-\u06FF\w\s]', '', title)[:8].replace(' ', '')
    return f"{STORE_CONFIG['mpn_prefix']}-{category_prefix}-{sanitized_title}-{product_id}"

def sanitize_text(text, max_length=150):
    """تنظيف النص"""
    if not text:
        return ''
    return re.sub(r'[<>"&]', '', str(text)).strip()[:max_length]

def generate_description(product, category):
    """إنشاء وصف مفصل"""
    category_text = {
        'perfume': 'عطور فاخرة',
        'watch': 'ساعات أنيقة',
        'gift': 'هدايا مميزة'
    }[category]
    
    base_desc = f"{product['title']} - {category_text} عالية الجودة من متجر هدايا الإمارات"
    
    additional_info = {
        'perfume': ' مع توصيل مجاني في جميع إمارات الدولة. عطور أصلية بأفضل الأسعار.',
        'watch': ' مع توصيل مجاني في جميع إمارات الدولة. ساعات عالية الجودة بضمان الجودة.',
        'gift': ' مع توصيل مجاني في جميع إمارات الدولة. هدايا مثالية لجميع المناسبات.'
    }[category]
    
    return sanitize_text(base_desc + additional_info, 500)

def load_products_data():
    """تحميل بيانات المنتجات"""
    products = []
    
    # تحميل العطور
    try:
        with open('data/otor.json', 'r', encoding='utf-8') as f:
            perfumes = json.load(f)
            for product in perfumes:
                products.append((product, 'perfumes'))
        logger.info(f"تم تحميل {len(perfumes)} عطر")
    except FileNotFoundError:
        logger.warning("لم يتم العثور على ملف العطور")
    
    # تحميل الساعات
    try:
        with open('data/sa3at.json', 'r', encoding='utf-8') as f:
            watches = json.load(f)
            for product in watches:
                products.append((product, 'watches'))
        logger.info(f"تم تحميل {len(watches)} ساعة")
    except FileNotFoundError:
        logger.warning("لم يتم العثور على ملف الساعات")
    
    return products

def create_product_xml(product_data, index):
    """إنشاء XML لمنتج واحد"""
    product, data_source = product_data
    category = classify_product(product, data_source)
    category_config = GOOGLE_CATEGORIES[category]
    
    # البيانات الأساسية
    product_id = product.get('id', f"{data_source.upper()}_{index}")
    title = sanitize_text(product.get('title', 'منتج'))
    price = float(product.get('sale_price', product.get('price', 0)) or 0)
    
    # تخطي المنتجات بدون أسعار صحيحة
    if price <= 0:
        logger.warning(f"تخطي المنتج {title} - سعر غير صحيح")
        return None
    
    # إنشاء المعرفات
    gtin = generate_gtin(product_id, category)
    mpn = generate_mpn(product_id, title, category)
    description = generate_description(product, category)
    
    # URL المنتج
    slug = re.sub(r'[^\u0600-\u06FF\w\s-]', '', title.lower()).replace(' ', '-')[:50]
    product_url = f"{STORE_CONFIG['domain']}/products/{slug}-{product_id}.html"
    
    # إنشاء XML element
    item = ET.Element('item')
    
    # إضافة العناصر المطلوبة
    ET.SubElement(item, '{http://base.google.com/ns/1.0}id').text = str(product_id)
    ET.SubElement(item, 'title').text = title
    ET.SubElement(item, 'description').text = description
    ET.SubElement(item, 'link').text = product_url
    ET.SubElement(item, '{http://base.google.com/ns/1.0}image_link').text = product.get('image_link', '')
    ET.SubElement(item, '{http://base.google.com/ns/1.0}condition').text = category_config['condition']
    ET.SubElement(item, '{http://base.google.com/ns/1.0}availability').text = 'in_stock'
    ET.SubElement(item, '{http://base.google.com/ns/1.0}price').text = f"{price} {STORE_CONFIG['currency']}"
    ET.SubElement(item, '{http://base.google.com/ns/1.0}brand').text = STORE_CONFIG['brand']
    ET.SubElement(item, '{http://base.google.com/ns/1.0}gtin').text = gtin
    ET.SubElement(item, '{http://base.google.com/ns/1.0}mpn').text = mpn
    ET.SubElement(item, '{http://base.google.com/ns/1.0}google_product_category').text = category_config['google_category']
    ET.SubElement(item, '{http://base.google.com/ns/1.0}product_type').text = category_config['product_type']
    ET.SubElement(item, '{http://base.google.com/ns/1.0}age_group').text = category_config['age_group']
    ET.SubElement(item, '{http://base.google.com/ns/1.0}gender').text = category_config['gender']
    
    # معلومات الشحن
    shipping = ET.SubElement(item, '{http://base.google.com/ns/1.0}shipping')
    ET.SubElement(shipping, '{http://base.google.com/ns/1.0}country').text = STORE_CONFIG['country']
    ET.SubElement(shipping, '{http://base.google.com/ns/1.0}service').text = 'شحن مجاني'
    ET.SubElement(shipping, '{http://base.google.com/ns/1.0}price').text = f"0 {STORE_CONFIG['currency']}"
    
    ET.SubElement(item, '{http://base.google.com/ns/1.0}shipping_weight').text = '0.5 kg'
    
    # معلومات الضرائب
    tax = ET.SubElement(item, '{http://base.google.com/ns/1.0}tax')
    ET.SubElement(tax, '{http://base.google.com/ns/1.0}country').text = STORE_CONFIG['country']
    ET.SubElement(tax, '{http://base.google.com/ns/1.0}rate').text = '0'
    
    return item, category

def generate_merchant_feed():
    """إنشاء Google Merchant Feed كامل"""
    logger.info("بدء إنشاء Google Merchant Feed 🛍")
    
    # تحميل البيانات
    products = load_products_data()
    
    if not products:
        logger.error("لا توجد منتجات لمعالجتها")
        return False
    
    # إنشاء RSS root
    ET.register_namespace('g', 'http://base.google.com/ns/1.0')
    rss = ET.Element('rss', {
        'version': '2.0',
        '{http://www.w3.org/2000/xmlns/}g': 'http://base.google.com/ns/1.0'
    })
    
    channel = ET.SubElement(rss, 'channel')
    
    # معلومات القناة
    ET.SubElement(channel, 'title').text = STORE_CONFIG['name']
    ET.SubElement(channel, 'link').text = STORE_CONFIG['domain']
    ET.SubElement(channel, 'description').text = 'متجر إلكتروني متخصص في بيع العطور والساعات الفاخرة'
    ET.SubElement(channel, 'language').text = f"{STORE_CONFIG['language']}-{STORE_CONFIG['country']}"
    ET.SubElement(channel, 'lastBuildDate').text = datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
    ET.SubElement(channel, 'generator').text = 'Emirates Gifts Store - Fixed Merchant Feed Generator v2.1'
    
    # إحصائيات
    stats = {'perfume': 0, 'watch': 0, 'gift': 0, 'skipped': 0}
    
    # معالجة المنتجات
    for index, product_data in enumerate(products, 1):
        result = create_product_xml(product_data, index)
        
        if result:
            item, category = result
            channel.append(item)
            stats[category] += 1
        else:
            stats['skipped'] += 1
    
    # حفظ الملف
    tree = ET.ElementTree(rss)
    ET.indent(tree, space="    ")
    
    output_file = 'merchant-feed-fixed.xml'
    with open(output_file, 'wb') as f:
        tree.write(f, encoding='utf-8', xml_declaration=True)
    
    # عرض الإحصائيات
    total_products = sum(stats[cat] for cat in ['perfume', 'watch', 'gift'])
    
    logger.info("✅ تم إنشاء Google Merchant Feed بنجاح!")
    logger.info(f"🌸 عطور: {stats['perfume']}")
    logger.info(f"⌚ ساعات: {stats['watch']}")
    logger.info(f"🎁 هدايا: {stats['gift']}")
    logger.info(f"⚠️ متخطى: {stats['skipped']}")
    logger.info(f"📊 إجمالي: {total_products} منتج")
    logger.info(f"📁 تم حفظ الملف: {output_file}")
    
    return True

def validate_feed(feed_file):
    """التحقق من صحة Feed"""
    try:
        tree = ET.parse(feed_file)
        root = tree.getroot()
        
        # فحص الهيكل
        if root.tag != 'rss':
            logger.error("هيكل RSS غير صحيح")
            return False
        
        # عد المنتجات
        items = root.findall('.//item')
        logger.info(f"تم العثور على {len(items)} منتج في Feed")
        
        # فحص التصنيفات
        perfume_items = [item for item in items if 'Fragrance' in (item.find('.//{http://base.google.com/ns/1.0}google_product_category') or ET.Element('')).text or '']
        watch_items = [item for item in items if 'Watches' in (item.find('.//{http://base.google.com/ns/1.0}google_product_category') or ET.Element('')).text or '']
        
        logger.info(f"✅ عطور مصنفة بشكل صحيح: {len(perfume_items)}")
        logger.info(f"✅ ساعات مصنفة بشكل صحيح: {len(watch_items)}")
        
        return True
        
    except Exception as e:
        logger.error(f"خطأ في التحقق: {e}")
        return False

if __name__ == '__main__':
    print("🛍 مولد Google Merchant Feed المُصلح - متجر هدايا الإمارات")
    print("=" * 70)
    
    if generate_merchant_feed():
        print("\n🔍 جاري التحقق من صحة Feed...")
        if validate_feed('merchant-feed-fixed.xml'):
            print("\n🎉 تم إنشاء Google Merchant Feed صحيح ومُصلح بنجاح!")
            print("📁 يمكنك الآن رفع الملف merchant-feed-fixed.xml إلى Google Merchant Center")
        else:
            print("⚠️ تم إنشاء Feed ولكن يوجد بعض التحذيرات")
    else:
        print("❌ فشل في إنشاء Feed")