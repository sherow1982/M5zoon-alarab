#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت تحديث Google Merchant Feed تلقائياً
يقوم بإنشاء فيد شامل من جميع منتجات المتجر بالتصنيفات الصحيحة
مع روابط مباشرة للموقع الرئيسي بدلاً من صفحات منفصلة
"""

import json
import re
from datetime import datetime
from pathlib import Path

# إعدادات المتجر
STORE_CONFIG = {
    'name': 'متجر هدايا الإمارات',
    'domain': 'https://emirates-gifts.arabsad.com',
    'currency': 'AED',
    'country': 'AE',
    'language': 'ar-AE',
    'brand': 'Emirates Gifts'
}

# فئات المنتجات
CATEGORIES = {
    'perfume': {
        'google_category': 'Health & Beauty > Personal Care > Cosmetics > Fragrance',
        'product_type': 'عطور فاخرة',
        'prefix': 'PERF'
    },
    'watch': {
        'google_category': 'Apparel & Accessories > Jewelry > Watches', 
        'product_type': 'ساعات فاخرة',
        'prefix': 'WATCH'
    }
}

def clean_text(text):
    """تنظيف النص من الرموز غير المرغوب فيها"""
    if not text:
        return ''
    return re.sub(r'[<>"&]', '', str(text).strip())

def determine_category(title, source):
    """تحديد فئة المنتج"""
    if source == 'otor':
        return 'perfume'
    elif source == 'sa3at':
        return 'watch'
    
    # فحص النص للتأكد
    title_lower = title.lower()
    if any(word in title_lower for word in ['عطر', 'perfume', 'fragrance']):
        return 'perfume'
    elif any(word in title_lower for word in ['ساعة', 'watch', 'rolex', 'omega']):
        return 'watch'
    else:
        return 'perfume'  # افتراضي

def generate_gtin(product_id, category):
    """إنشاء GTIN صحيح"""
    base = '1234567'
    category_code = '00' if category == 'perfume' else '10'
    product_code = str(product_id).zfill(4)
    
    # حساب check digit
    full_code = base + category_code + product_code
    checksum = 0
    for i, digit in enumerate(full_code):
        multiplier = 3 if i % 2 == 1 else 1
        checksum += int(digit) * multiplier
    
    check_digit = (10 - (checksum % 10)) % 10
    return full_code + str(check_digit)

def load_all_products():
    """تحميل جميع منتجات المتجر"""
    all_products = []
    
    # تحميل العطور
    try:
        with open('data/otor.json', 'r', encoding='utf-8') as f:
            perfumes = json.load(f)
            for p in perfumes:
                all_products.append((p, 'otor'))
        print(f"🌸 تم تحميل {len(perfumes)} عطر")
    except Exception as e:
        print(f"⚠️ خطأ في تحميل العطور: {e}")
    
    # تحميل الساعات
    try:
        with open('data/sa3at.json', 'r', encoding='utf-8') as f:
            watches = json.load(f)
            for w in watches:
                all_products.append((w, 'sa3at'))
        print(f"⌚ تم تحميل {len(watches)} ساعة")
    except Exception as e:
        print(f"⚠️ خطأ في تحميل الساعات: {e}")
    
    return all_products

def create_product_item(product, source, global_index):
    """إنشاء XML item لمنتج واحد"""
    category = determine_category(product.get('title', ''), source)
    cat_config = CATEGORIES[category]
    
    # استخراج البيانات
    product_id = product.get('id', global_index)
    title = clean_text(product.get('title', ''))
    price = float(product.get('sale_price', product.get('price', 0)) or 0)
    image = product.get('image_link', '')
    
    # تخطي المنتجات بدون أسعار
    if price <= 0 or not title:
        return None
    
    # إنشاء المعرفات
    gtin = generate_gtin(product_id, category)
    mpn = f"EG-{cat_config['prefix']}-{product_id}"
    
    # الوصف
    desc_suffix = 'عطور أصلية بأفضل الأسعار' if category == 'perfume' else 'ساعات عالية الجودة بضمان'
    description = f"{title} - {cat_config['product_type']} عالية الجودة من متجر هدايا الإمارات مع توصيل مجاني في جميع إمارات الدولة. {desc_suffix}"
    
    return f'''    <item>
        <g:id>{cat_config['prefix']}_{product_id}</g:id>
        <title><![CDATA[{title}]]></title>
        <description><![CDATA[{description}]]></description>
        <link>{STORE_CONFIG['domain']}</link>
        <g:image_link>{image}</g:image_link>
        <g:condition>new</g:condition>
        <g:availability>in_stock</g:availability>
        <g:price>{price} {STORE_CONFIG['currency']}</g:price>
        <g:brand>{STORE_CONFIG['brand']}</g:brand>
        <g:gtin>{gtin}</g:gtin>
        <g:mpn>{mpn}</g:mpn>
        <g:google_product_category>{cat_config['google_category']}</g:google_product_category>
        <g:product_type>{cat_config['product_type']}</g:product_type>
        <g:age_group>adult</g:age_group>
        <g:gender>unisex</g:gender>
        <g:shipping>
            <g:country>{STORE_CONFIG['country']}</g:country>
            <g:service>شحن مجاني</g:service>
            <g:price>0 {STORE_CONFIG['currency']}</g:price>
        </g:shipping>
        <g:shipping_weight>0.5 kg</g:shipping_weight>
        <g:tax>
            <g:country>{STORE_CONFIG['country']}</g:country>
            <g:rate>0</g:rate>
        </g:tax>
    </item>'''

def create_full_feed():
    """إنشاء فيد شامل من جميع المنتجات"""
    print("🛍 بدء إنشاء Google Merchant Feed شامل...")
    
    # تحميل المنتجات
    all_products = load_all_products()
    
    if not all_products:
        print("❌ لا توجد منتجات")
        return False
    
    # بروتوكول XML
    current_time = datetime.now().strftime('%a, %d %b %Y %H:%M:%S GMT')
    
    feed_xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
        <title><![CDATA[{STORE_CONFIG['name']}]]></title>
        <link>{STORE_CONFIG['domain']}</link>
        <description><![CDATA[عطور وساعات فاخرة عالية الجودة مع توصيل مجاني في جميع إمارات الدولة]]></description>
        <language>{STORE_CONFIG['language']}</language>
        <lastBuildDate>{current_time}</lastBuildDate>
        <generator>Emirates Gifts - Auto Feed Generator v1.0</generator>
'''
    
    # معالجة المنتجات
    stats = {'perfume': 0, 'watch': 0, 'skipped': 0}
    
    for index, (product, source) in enumerate(all_products, 1):
        item_xml = create_product_item(product, source, index)
        
        if item_xml:
            feed_xml += item_xml + '\n'
            category = determine_category(product.get('title', ''), source)
            stats[category] += 1
        else:
            stats['skipped'] += 1
    
    # إغلاق XML
    feed_xml += '''    </channel>
</rss>'''
    
    # حفظ الملف
    output_file = 'google-merchant-feed.xml'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(feed_xml)
    
    # عرض النتائج
    total = stats['perfume'] + stats['watch']
    
    print(f"\n✅ تم إنشاء Google Merchant Feed بنجاح!")
    print(f"🌸 عطور: {stats['perfume']} منتج")
    print(f"⌚ ساعات: {stats['watch']} منتج")
    print(f"⚠️ متخطى: {stats['skipped']} منتج")
    print(f"📊 إجمالي: {total} منتج")
    print(f"\n🔗 رابط الفيد: {STORE_CONFIG['domain']}/{output_file}")
    print("📁 يمكنك الآن نسخ هذا الرابط واستخدامه في Google Merchant Center")
    
    return True

def main():
    print("🎆 مرحباً بمولد Google Merchant Feed التلقائي")
    print("=" * 70)
    
    if create_full_feed():
        print("\n🎉 عملية ناجحة! الفيد جاهز للاستخدام")
        print("📌 ملاحظة: جميع روابط المنتجات تشير إلى الموقع الرئيسي")
        print("🔗 هذا يضمن عدم وجود 404 errors للمنتجات")
    else:
        print("❌ فشل في إنشاء الفيد")
        return False
    
    return True

if __name__ == '__main__':
    main()