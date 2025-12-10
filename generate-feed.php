<?php
/**
 * مولد فيد جوجل مرشنت سنتر - متجر هدايا الإمارات
 * يقوم بتوليد XML feed تلقائياً من بيانات المنتجات
 */

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

// إعدادات المتجر الأساسية
define('STORE_URL', 'https://emirates-gifts.arabsad.com');
define('STORE_TITLE', 'متجر هدايا الإمارات');
define('STORE_DESCRIPTION', 'فيد جوجل مرشنت سنتر الشامل لجميع منتجات متجر هدايا الإمارات - عطور وساعات فاخرة بأفضل الأسعار');

/**
 * تحديد العلامة التجارية من اسم المنتج
 */
function getBrand($title) {
    $title = strtolower($title);
    
    if (strpos($title, 'rolex') !== false || strpos($title, 'رولكس') !== false) {
        return 'Rolex';
    } elseif (strpos($title, 'tom ford') !== false) {
        return 'Tom Ford';
    } elseif (strpos($title, 'chanel') !== false || strpos($title, 'شانيل') !== false) {
        return 'Chanel';
    } elseif (strpos($title, 'gucci') !== false || strpos($title, 'جوتشي') !== false) {
        return 'Gucci';
    } elseif (strpos($title, 'dior') !== false || strpos($title, 'ديور') !== false) {
        return 'Dior';
    } elseif (strpos($title, 'versace') !== false) {
        return 'Versace';
    } elseif (strpos($title, 'omega') !== false || strpos($title, 'اوميغا') !== false) {
        return 'Omega';
    } elseif (strpos($title, 'cartier') !== false) {
        return 'Cartier';
    } elseif (strpos($title, 'yves saint laurent') !== false || strpos($title, 'ايف سان لوران') !== false) {
        return 'Yves Saint Laurent';
    } elseif (strpos($title, 'kayali') !== false) {
        return 'Kayali';
    } elseif (strpos($title, 'marly') !== false) {
        return 'Parfums de Marly';
    } elseif (strpos($title, 'penhaligons') !== false) {
        return 'Penhaligons';
    } elseif (strpos($title, 'hermes') !== false) {
        return 'Hermes';
    } elseif (strpos($title, 'patek philippe') !== false) {
        return 'Patek Philippe';
    } elseif (strpos($title, 'audemars piguet') !== false) {
        return 'Audemars Piguet';
    } elseif (strpos($title, 'emporio armani') !== false) {
        return 'Emporio Armani';
    } elseif (strpos($title, 'burberry') !== false) {
        return 'Burberry';
    } elseif (strpos($title, 'breitling') !== false) {
        return 'Breitling';
    } elseif (strpos($title, 'bulgari') !== false || strpos($title, 'سربنتي') !== false) {
        return 'Bulgari';
    } else {
        return 'هدايا الإمارات';
    }
}

/**
 * استخراج الألوان من اسم المنتج
 */
function extractColors($title) {
    $colors = [];
    $title_lower = strtolower($title);
    
    if (strpos($title, 'أسود') !== false || strpos($title, 'اسود') !== false || strpos($title_lower, 'black') !== false) {
        $colors[] = 'أسود';
    }
    if (strpos($title, 'أبيض') !== false || strpos($title, 'ابيض') !== false || strpos($title_lower, 'white') !== false) {
        $colors[] = 'أبيض';
    }
    if (strpos($title, 'أزرق') !== false || strpos($title, 'ازرق') !== false || strpos($title_lower, 'blue') !== false) {
        $colors[] = 'أزرق';
    }
    if (strpos($title, 'أخضر') !== false || strpos($title, 'اخضر') !== false || strpos($title_lower, 'green') !== false) {
        $colors[] = 'أخضر';
    }
    if (strpos($title, 'ذهبي') !== false || strpos($title_lower, 'gold') !== false || strpos($title, 'جولد') !== false) {
        $colors[] = 'ذهبي';
    }
    if (strpos($title, 'فضي') !== false || strpos($title_lower, 'silver') !== false || strpos($title, 'سيلفر') !== false) {
        $colors[] = 'فضي';
    }
    if (strpos($title, 'بني') !== false || strpos($title_lower, 'brown') !== false) {
        $colors[] = 'بني';
    }
    if (strpos($title, 'أحمر') !== false || strpos($title, 'احمر') !== false || strpos($title_lower, 'red') !== false) {
        $colors[] = 'أحمر';
    }
    if (strpos($title, 'أصفر') !== false || strpos($title, 'اصفر') !== false || strpos($title_lower, 'yellow') !== false || strpos($title, 'صفر') !== false) {
        $colors[] = 'أصفر';
    }
    if (strpos($title, 'برتقالي') !== false || strpos($title_lower, 'orange') !== false) {
        $colors[] = 'برتقالي';
    }
    
    return implode(' / ', $colors);
}

/**
 * إنشاء slug آمن للرابط
 */
function createSlug($title) {
    $slug = $title;
    $slug = str_replace([' ', '(', ')', '.', '،', '؛'], '-', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    $slug = trim($slug, '-');
    return urlencode(substr($slug, 0, 50));
}

/**
 * إنشاء رابط المنتج
 */
function createProductURL($product, $type) {
    $category_en = ($type === 'perfume') ? 'perfume' : 'watch';
    $slug = createSlug($product['title']);
    return STORE_URL . "/product-details.html?id={$product['id']}&category={$category_en}&slug={$slug}";
}

try {
    // تحميل بيانات العطور
    $perfumes_data = [];
    if (file_exists('./data/otor.json')) {
        $perfumes_json = file_get_contents('./data/otor.json');
        $perfumes_data = json_decode($perfumes_json, true) ?: [];
    }
    
    // تحميل بيانات الساعات
    $watches_data = [];
    if (file_exists('./data/sa3at.json')) {
        $watches_json = file_get_contents('./data/sa3at.json');
        $watches_data = json_decode($watches_json, true) ?: [];
    }
    
    // بدء XML
    echo '<?xml version="1.0" encoding="utf-8"?>' . "\n";
    echo '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' . "\n";
    echo '  <channel>' . "\n";
    echo '    <title>' . htmlspecialchars(STORE_TITLE . ' - فيد المنتجات الشامل') . '</title>' . "\n";
    echo '    <link>' . STORE_URL . '</link>' . "\n";
    echo '    <description>' . htmlspecialchars(STORE_DESCRIPTION) . '</description>' . "\n";
    echo '    <lastBuildDate>' . date('D, d M Y H:i:s O') . '</lastBuildDate>' . "\n\n";
    
    $total_products = 0;
    
    // إضافة العطور
    foreach ($perfumes_data as $perfume) {
        $total_products++;
        $brand = getBrand($perfume['title']);
        $colors = extractColors($perfume['title']);
        $product_url = createProductURL($perfume, 'perfume');
        
        // تحديد الحجم
        $size = '100ml'; // افتراضي
        if (strpos($perfume['title'], '50ml') !== false || strpos($perfume['title'], '50 مل') !== false) {
            $size = '50ml';
        } elseif (strpos($perfume['title'], '30ml') !== false || strpos($perfume['title'], '30 مل') !== false) {
            $size = '30ml';
        }
        
        $description = "عطر فاخر {$perfume['title']} بتركيبة عالية الجودة ورائحة مميزة تدوم طويلاً من أفضل الماركات العالمية. متوفر الآن في متجر هدايا الإمارات بأفضل الأسعار مع التوصيل المجاني في جميع أنحاء الإمارات.";
        
        echo '    <item>' . "\n";
        echo '      <g:id>' . htmlspecialchars($perfume['id']) . '</g:id>' . "\n";
        echo '      <g:title>' . htmlspecialchars(substr($perfume['title'], 0, 150)) . '</g:title>' . "\n";
        echo '      <g:description>' . htmlspecialchars($description) . '</g:description>' . "\n";
        echo '      <g:link>' . htmlspecialchars($product_url) . '</g:link>' . "\n";
        echo '      <g:image_link>' . htmlspecialchars($perfume['image_link']) . '</g:image_link>' . "\n";
        echo '      <g:condition>new</g:condition>' . "\n";
        echo '      <g:availability>in stock</g:availability>' . "\n";
        echo '      <g:price>' . $perfume['sale_price'] . '.00 AED</g:price>' . "\n";
        if ($perfume['price'] != $perfume['sale_price']) {
            echo '      <g:sale_price>' . $perfume['sale_price'] . '.00 AED</g:sale_price>' . "\n";
        }
        echo '      <g:brand>' . htmlspecialchars($brand) . '</g:brand>' . "\n";
        echo '      <g:product_type>Health &amp; Beauty &gt; Personal Care &gt; Cosmetics &gt; Fragrance</g:product_type>' . "\n";
        echo '      <g:google_product_category>2915</g:google_product_category>' . "\n";
        if ($colors) {
            echo '      <g:color>' . htmlspecialchars($colors) . '</g:color>' . "\n";
        }
        echo '      <g:size>' . $size . '</g:size>' . "\n";
        echo '      <g:shipping>' . "\n";
        echo '        <g:country>AE</g:country>' . "\n";
        echo '        <g:service>التوصيل المجاني</g:service>' . "\n";
        echo '        <g:price>0.00 AED</g:price>' . "\n";
        echo '      </g:shipping>' . "\n";
        echo '      <g:shipping_weight>0.3 kg</g:shipping_weight>' . "\n";
        echo '      <g:mpn>' . htmlspecialchars($perfume['id']) . '</g:mpn>' . "\n";
        echo '    </item>' . "\n\n";
    }
    
    // إضافة الساعات
    foreach ($watches_data as $watch) {
        $total_products++;
        $brand = getBrand($watch['title']);
        $colors = extractColors($watch['title']);
        $product_url = createProductURL($watch, 'watch');
        
        $description = "ساعة فاخرة {$watch['title']} بتصميم أنيق ومواصفات احترافية عالية الجودة ومقاومة للماء. ضمان الجودة من متجر هدايا الإمارات مع التوصيل المجاني في جميع أنحاء الإمارات.";
        
        echo '    <item>' . "\n";
        echo '      <g:id>' . htmlspecialchars($watch['id']) . '</g:id>' . "\n";
        echo '      <g:title>' . htmlspecialchars(substr($watch['title'], 0, 150)) . '</g:title>' . "\n";
        echo '      <g:description>' . htmlspecialchars($description) . '</g:description>' . "\n";
        echo '      <g:link>' . htmlspecialchars($product_url) . '</g:link>' . "\n";
        echo '      <g:image_link>' . htmlspecialchars($watch['image_link']) . '</g:image_link>' . "\n";
        echo '      <g:condition>new</g:condition>' . "\n";
        echo '      <g:availability>in stock</g:availability>' . "\n";
        echo '      <g:price>' . $watch['sale_price'] . '.00 AED</g:price>' . "\n";
        if ($watch['price'] != $watch['sale_price']) {
            echo '      <g:sale_price>' . $watch['sale_price'] . '.00 AED</g:sale_price>' . "\n";
        }
        echo '      <g:brand>' . htmlspecialchars($brand) . '</g:brand>' . "\n";
        echo '      <g:product_type>Apparel &amp; Accessories &gt; Jewelry &gt; Watches</g:product_type>' . "\n";
        echo '      <g:google_product_category>201</g:google_product_category>' . "\n";
        if ($colors) {
            echo '      <g:color>' . htmlspecialchars($colors) . '</g:color>' . "\n";
        }
        echo '      <g:shipping>' . "\n";
        echo '        <g:country>AE</g:country>' . "\n";
        echo '        <g:service>التوصيل المجاني</g:service>' . "\n";
        echo '        <g:price>0.00 AED</g:price>' . "\n";
        echo '      </g:shipping>' . "\n";
        echo '      <g:shipping_weight>0.5 kg</g:shipping_weight>' . "\n";
        echo '      <g:mpn>' . htmlspecialchars($watch['id']) . '</g:mpn>' . "\n";
        echo '    </item>' . "\n\n";
    }
    
    echo '  </channel>' . "\n";
    echo '</rss>' . "\n";
    
    // تسجيل إحصائيات (اختيارية)
    $log_message = date('Y-m-d H:i:s') . " - تم توليد فيد بـ {$total_products} منتج\n";
    error_log($log_message, 3, './feed-log.txt');
    
} catch (Exception $e) {
    // في حالة الخطأ، إنشاء فيد فارغ صالح
    echo '<?xml version="1.0" encoding="utf-8"?>' . "\n";
    echo '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' . "\n";
    echo '  <channel>' . "\n";
    echo '    <title>' . htmlspecialchars(STORE_TITLE . ' - خطأ في تحميل المنتجات') . '</title>' . "\n";
    echo '    <link>' . STORE_URL . '</link>' . "\n";
    echo '    <description>خطأ في تحميل بيانات المنتجات</description>' . "\n";
    echo '    <lastBuildDate>' . date('D, d M Y H:i:s O') . '</lastBuildDate>' . "\n";
    echo '  </channel>' . "\n";
    echo '</rss>' . "\n";
    
    error_log(date('Y-m-d H:i:s') . " - خطأ في توليد الفيد: " . $e->getMessage() . "\n", 3, './feed-log.txt');
}
?>