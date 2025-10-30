#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت إصلاح صفحات المنتجات - متجر هدايا الإمارات
يقوم بإصلاح مسار CSS وتحسين التصميم لجميع صفحات المنتجات
"""

import os
import re
from pathlib import Path

def fix_product_html(file_path):
    """إصلاح ملف HTML منتج واحد"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # استخراج اسم المنتج من اسم الملف
        product_name = Path(file_path).stem
        product_name_clean = product_name.replace('-', ' ').replace('_', ' ')
        
        # استخراج السعر والخصم من المحتوى الحالي
        price_match = re.search(r'(\d+)\s*د\.إ', content)
        old_price_match = re.search(r'(\d+)\s*د\.إ.*?(\d+)\s*د\.إ', content, re.DOTALL)
        
        current_price = price_match.group(1) if price_match else "250"
        
        if old_price_match:
            old_price = old_price_match.group(1)
            current_price = old_price_match.group(2)
        else:
            old_price = str(int(current_price) + 100)  # خصم افتراضي
        
        discount = round((1 - int(current_price) / int(old_price)) * 100) if old_price != current_price else 0
        
        # استخراج رابط الصورة
        img_match = re.search(r'src="([^"]+)"', content)
        img_url = img_match.group(1) if img_match else "https://via.placeholder.com/400x400"
        
        # تحديد التصنيف بناء على اسم المنتج
        category = "عطور"
        if any(word in product_name.lower() for word in ['watch', 'rolex', 'omega', 'cartier', 'patek']):
            category = "ساعات"
        elif any(word in product_name.lower() for word in ['oud', 'دخون', 'incense']):
            category = "دخون وبخور"
        
        # إنشاء المحتوى الجديد
        new_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{product_name_clean} | متجر هدايا الإمارات</title>
    <meta name="description" content="{product_name_clean} - السعر: {current_price} د.إ. توصيل سريع لجميع أنحاء الإمارات">
    <meta name="keywords" content="{product_name_clean}, {category}, متجر هدايا الإمارات">
    <link rel="preload" href="../css/performance-critical.css" as="style">
    <link rel="stylesheet" href="../css/performance-critical.css">
    <style>
        /* أنماط محددة لصفحة المنتج */
        .product-page {{
            background: #f5f5f5;
            padding: 20px;
            min-height: calc(100vh - 200px);
        }}
        
        .product-container {{
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }}
        
        .breadcrumb {{
            margin-bottom: 25px;
            font-size: 14px;
            color: #666;
            padding: 12px 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }}
        
        .breadcrumb a {{
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }}
        
        .breadcrumb a:hover {{
            text-decoration: underline;
        }}
        
        .product-layout {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 30px;
        }}
        
        .product-image-section {{
            position: relative;
        }}
        
        .product-main-image {{
            width: 100%;
            max-height: 450px;
            object-fit: contain;
            border-radius: 15px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            background: white;
            aspect-ratio: 1/1;
        }}
        
        .discount-badge {{
            position: absolute;
            top: 15px;
            right: 15px;
            background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
        }}
        
        .product-info-section {{
            display: flex;
            flex-direction: column;
        }}
        
        .product-title {{
            font-size: 2rem;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 20px;
            line-height: 1.3;
        }}
        
        .category-badge {{
            display: inline-block;
            padding: 8px 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 20px;
            width: fit-content;
        }}
        
        .price-section {{
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 25px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 12px;
        }}
        
        .old-price {{
            text-decoration: line-through;
            color: #999;
            font-size: 18px;
        }}
        
        .current-price {{
            font-size: 2.2rem;
            font-weight: 700;
            color: #667eea;
        }}
        
        .features-grid {{
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin: 25px 0;
        }}
        
        .feature-item {{
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
            font-size: 14px;
        }}
        
        .feature-icon {{
            font-size: 20px;
        }}
        
        .product-description {{
            background: #f8f9fa;
            padding: 25px;
            border-radius: 12px;
            line-height: 1.8;
            margin: 25px 0;
        }}
        
        .product-description h3 {{
            margin-bottom: 15px;
            color: #2c3e50;
            font-size: 18px;
        }}
        
        .product-description p {{
            color: #555;
            font-size: 15px;
            line-height: 1.8;
        }}
        
        .action-buttons {{
            display: flex;
            gap: 12px;
            margin-top: 25px;
        }}
        
        .whatsapp-btn {{
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 30px;
            background: linear-gradient(135deg, #25D366, #20b358);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
        }}
        
        .whatsapp-btn:hover {{
            background: linear-gradient(135deg, #20b358, #128C7E);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
        }}
        
        .back-btn {{
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 16px 30px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
        }}
        
        .back-btn:hover {{
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }}
        
        /* تحسينات الجوال */
        @media (max-width: 768px) {{
            .product-page {{
                padding: 15px;
            }}
            
            .product-layout {{
                grid-template-columns: 1fr;
                gap: 25px;
            }}
            
            .product-container {{
                padding: 20px;
                border-radius: 12px;
            }}
            
            .product-title {{
                font-size: 1.5rem;
                text-align: center;
            }}
            
            .current-price {{
                font-size: 1.8rem;
            }}
            
            .features-grid {{
                grid-template-columns: 1fr;
                gap: 10px;
            }}
            
            .action-buttons {{
                flex-direction: column;
            }}
            
            .product-main-image {{
                max-height: 300px;
            }}
            
            .breadcrumb {{
                font-size: 12px;
                padding: 10px 15px;
            }}
            
            .price-section {{
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }}
        }}
        
        /* تحسينات صغر الشاشة */
        @media (max-width: 480px) {{
            .product-container {{
                padding: 15px;
                margin: 10px;
            }}
            
            .product-title {{
                font-size: 1.3rem;
            }}
            
            .current-price {{
                font-size: 1.6rem;
            }}
            
            .whatsapp-btn, .back-btn {{
                font-size: 14px;
                padding: 14px 25px;
            }}
        }}
        
        /* Header Styles */
        .site-header {{
            background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%);
            box-shadow: 0 2px 10px rgba(212, 175, 55, 0.15);
            position: sticky;
            top: 0;
            z-index: 100;
        }}
        
        .site-header .container {{
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }}
        
        .header-content {{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 0;
            min-height: 70px;
        }}
        
        .logo {{
            font-size: 1.8rem;
            font-weight: 700;
            color: #2C3E50;
            text-decoration: none;
        }}
        
        .nav-links {{
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 15px;
        }}
        
        .nav-links a {{
            font-weight: 600;
            color: #2C3E50;
            text-decoration: none;
            padding: 10px 15px;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
        }}
        
        .nav-links a:hover {{
            background: rgba(255, 255, 255, 0.6);
            transform: translateY(-2px);
        }}
        
        .tagline {{
            text-align: center;
            margin: 10px 0 0;
            color: #2C3E50;
            font-weight: 500;
        }}
        
        /* Footer Styles */
        .site-footer {{
            background: #2C3E50;
            color: white;
            padding: 40px 0 20px;
            margin-top: 60px;
        }}
        
        .footer-content {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }}
        
        .footer-section h3 {{
            color: #FFD700;
            margin-bottom: 15px;
            font-size: 18px;
        }}
        
        .footer-links {{
            list-style: none;
            padding: 0;
            margin: 0;
        }}
        
        .footer-links li {{
            margin-bottom: 8px;
        }}
        
        .footer-links a {{
            color: #bdc3c7;
            text-decoration: none;
            transition: color 0.3s ease;
        }}
        
        .footer-links a:hover {{
            color: #FFD700;
        }}
        
        .footer-bottom {{
            text-align: center;
            padding-top: 20px;
            border-top: 1px solid #34495e;
            color: #bdc3c7;
        }}
        
        /* تحسينات إضافية للجوال */
        @media (max-width: 768px) {{
            .site-header .nav-links {{
                display: none;
            }}
            
            .footer-content {{
                grid-template-columns: 1fr;
                gap: 20px;
                text-align: center;
            }}
        }}
    </style>
</head>
<body>
    <header class="site-header">
        <div class="container">
            <div class="header-content">
                <a href="../" class="logo">🛍️ متجر هدايا الإمارات</a>
                <nav>
                    <ul class="nav-links">
                        <li><a href="../">الرئيسية</a></li>
                        <li><a href="../about.html">من نحن</a></li>
                        <li><a href="../contact.html">اتصل بنا</a></li>
                        <li><a href="../shipping-policy.html">الشحن</a></li>
                        <li><a href="../return-policy.html">الاستبدال</a></li>
                    </ul>
                </nav>
            </div>
            <p class="tagline">أفضل المنتجات بأقل الأسعار</p>
        </div>
    </header>

    <div class="product-page">
        <div class="product-container">
            <div class="breadcrumb">
                <a href="../">الرئيسية</a> / 
                <a href="../">{category}</a> / 
                <span>{product_name_clean}</span>
            </div>

            <div class="product-layout">
                <div class="product-image-section">
                    <img src="{img_url}" alt="{product_name_clean}" class="product-main-image" loading="lazy">
                    {f'<div class="discount-badge">-{discount}%</div>' if discount > 0 else ''}
                </div>

                <div class="product-info-section">
                    <h1 class="product-title">{product_name_clean}</h1>
                    <span class="category-badge">{category}</span>

                    <div class="price-section">
                        {f'<span class="old-price">{old_price} د.إ</span>' if discount > 0 else ''}
                        <span class="current-price">{current_price} د.إ</span>
                    </div>

                    <div class="features-grid">
                        <div class="feature-item">
                            <span class="feature-icon">✅</span>
                            <span>منتج أصلي 100%</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🚚</span>
                            <span>شحن سريع</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🔄</span>
                            <span>استبدال مجاني</span>
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">💳</span>
                            <span>دفع عند الاستلام</span>
                        </div>
                    </div>

                    <div class="product-description">
                        <h3>📋 وصف المنتج</h3>
                        <p><strong>{product_name_clean}</strong> - منتج فاخر وأصلي 100% من متجر هدايا الإمارات. يتميز بجودة عالية وتصميم أنيق يناسب جميع الأذواق. مناسب للاستخدام اليومي والمناسبات الخاصة.</p>
                        <p>نقدم أفضل جودة بأسعار تنافسية مع ضمان كامل. توصيل سريع لجميع أنحاء الإمارات مع إمكانية الدفع عند الاستلام. جميع منتجاتنا معتمدة ومضمونة.</p>
                    </div>

                    <div class="action-buttons">
                        <a href="https://wa.me/201110760081?text=مرحباً، أرغب في طلب:%0A{product_name_clean}%0Aالسعر: {current_price} د.إ" target="_blank" class="whatsapp-btn">
                            📱 اطلب عبر الواتساب
                        </a>
                        <a href="../" class="back-btn">
                            🏠 العودة للمتجر
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <footer class="site-footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>عن المتجر</h3>
                    <p>متجر هدايا الإمارات - وجهتك الأولى للحصول على أفضل الساعات والعطور الأصلية.</p>
                </div>
                <div class="footer-section">
                    <h3>روابط سريعة</h3>
                    <ul class="footer-links">
                        <li><a href="../">الرئيسية</a></li>
                        <li><a href="../about.html">من نحن</a></li>
                        <li><a href="../contact.html">اتصل بنا</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>السياسات</h3>
                    <ul class="footer-links">
                        <li><a href="../shipping-policy.html">سياسة الشحن</a></li>
                        <li><a href="../return-policy.html">سياسة الاستبدال</a></li>
                        <li><a href="../privacy.html">سياسة الخصوصية</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h3>تواصل معنا</h3>
                    <p>📱 واتساب: <a href="https://wa.me/201110760081" target="_blank" style="color:#FFD700">+201110760081</a></p>
                    <p>🌍 الإمارات العربية المتحدة</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 متجر هدايا الإمارات - جميع الحقوق محفوظة</p>
            </div>
        </div>
    </footer>
</body>
</html>"""
        
        return new_content
        
    except Exception as e:
        print(f"خطأ في معالجة {file_path}: {e}")
        return None

def main():
    """تشغيل إصلاح جميع صفحات المنتجات"""
    products_dir = Path('products')
    if not products_dir.exists():
        print("مجلد products غير موجود!")
        return
    
    fixed_count = 0
    total_count = 0
    
    for html_file in products_dir.glob('*.html'):
        total_count += 1
        print(f"معالجة: {html_file.name}")
        
        new_content = fix_product_html(html_file)
        if new_content:
            try:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                fixed_count += 1
                print(f"✅ تم إصلاح: {html_file.name}")
            except Exception as e:
                print(f"❌ فشل في حفظ {html_file.name}: {e}")
        else:
            print(f"❌ فشل في معالجة: {html_file.name}")
    
    print(f"\n📊 النتائج النهائية:")
    print(f"إجمالي الملفات: {total_count}")
    print(f"تم إصلاحها: {fixed_count}")
    print(f"فشلت: {total_count - fixed_count}")
    
    if fixed_count > 0:
        print("\n🎉 تم إصلاح صفحات المنتجات بنجاح!")
        print("المشاكل التي تم حلها:")
        print("- إصلاح مسار ملف CSS")
        print("- تحسين التصميم للجوال")
        print("- إصلاح روابط التنقل")
        print("- إضافة تحسينات الأداء")
        print("- تحسين تجربة المستخدم")

if __name__ == '__main__':
    main()
