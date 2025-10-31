<?php
/**
 * مولد Sitemap تلقائي - متجر هدايا الإمارات
 * يقوم بتوليد sitemap.xml تلقائياً من بيانات المنتجات
 */

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: no-cache, must-revalidate');

// إعدادات الموقع الأساسية
define('SITE_URL', 'https://emirates-gifts.arabsad.com');

/**
 * إنشاء slug مبسط للرابط
 */
function createSimpleSlug($title) {
    $slug = strtolower($title);
    
    // تحويل العربية للإنجليزية المبسطة
    if (strpos($slug, 'عطر') !== false) {
        $slug = str_replace('عطر ', 'perfume-', $slug);
    } elseif (strpos($slug, 'ساعة') !== false) {
        $slug = str_replace('ساعة ', 'watch-', $slug);
    }
    
    // تنظيف الرموز الخاصة
    $slug = str_replace([' ', '(', ')', '.', '،', '؛', '/', '&'], ['-', '', '', '', '', '', '-', '-and-'], $slug);
    $slug = preg_replace('/-+/', '-', $slug); // إزالة الشرطات المتكررة
    $slug = trim($slug, '-');
    
    return substr($slug, 0, 50);
}

/**
 * تنسيق التاريخ لـ sitemap
 */
function formatDate($date = null) {
    return $date ? $date : date('Y-m-d');
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
    
    // بداية XML
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n\n";
    
    // الصفحات الرئيسية
    $main_pages = [
        ['url' => SITE_URL . '/', 'changefreq' => 'daily', 'priority' => '1.0'],
        ['url' => SITE_URL . '/index.html', 'changefreq' => 'daily', 'priority' => '1.0'],
        ['url' => SITE_URL . '/products.html', 'changefreq' => 'daily', 'priority' => '0.9'],
        ['url' => SITE_URL . '/cart.html', 'changefreq' => 'weekly', 'priority' => '0.6'],
        ['url' => SITE_URL . '/blog.html', 'changefreq' => 'weekly', 'priority' => '0.7']
    ];
    
    // إضافة الصفحات الرئيسية
    foreach ($main_pages as $page) {
        echo '  <url>' . "\n";
        echo '    <loc>' . htmlspecialchars($page['url']) . '</loc>' . "\n";
        echo '    <lastmod>' . formatDate() . '</lastmod>' . "\n";
        echo '    <changefreq>' . $page['changefreq'] . '</changefreq>' . "\n";
        echo '    <priority>' . $page['priority'] . '</priority>' . "\n";
        echo '  </url>' . "\n\n";
    }
    
    // إضافة صفحات العطور
    foreach ($perfumes_data as $perfume) {
        $slug = createSimpleSlug($perfume['title']);
        $product_url = SITE_URL . "/product-details.html?id={$perfume['id']}&category=perfume&slug={$slug}";
        
        echo '  <url>' . "\n";
        echo '    <loc>' . htmlspecialchars($product_url) . '</loc>' . "\n";
        echo '    <lastmod>' . formatDate() . '</lastmod>' . "\n";
        echo '    <changefreq>weekly</changefreq>' . "\n";
        echo '    <priority>0.8</priority>' . "\n";
        echo '  </url>' . "\n\n";
    }
    
    // إضافة صفحات الساعات
    foreach ($watches_data as $watch) {
        $slug = createSimpleSlug($watch['title']);
        $product_url = SITE_URL . "/product-details.html?id={$watch['id']}&category=watch&slug={$slug}";
        
        echo '  <url>' . "\n";
        echo '    <loc>' . htmlspecialchars($product_url) . '</loc>' . "\n";
        echo '    <lastmod>' . formatDate() . '</lastmod>' . "\n";
        echo '    <changefreq>weekly</changefreq>' . "\n";
        echo '    <priority>0.8</priority>' . "\n";
        echo '  </url>' . "\n\n";
    }
    
    echo '</urlset>' . "\n";
    
    // تسجيل إحصائيات
    $total_urls = count($main_pages) + count($perfumes_data) + count($watches_data);
    $log_message = date('Y-m-d H:i:s') . " - تم توليد sitemap بـ {$total_urls} رابط\n";
    error_log($log_message, 3, './sitemap-log.txt');
    
} catch (Exception $e) {
    // في حالة الخطأ، إنشاء sitemap أساسي
    echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    echo '  <url>' . "\n";
    echo '    <loc>' . SITE_URL . '</loc>' . "\n";
    echo '    <lastmod>' . date('Y-m-d') . '</lastmod>' . "\n";
    echo '    <changefreq>daily</changefreq>' . "\n";
    echo '    <priority>1.0</priority>' . "\n";
    echo '  </url>' . "\n";
    echo '</urlset>' . "\n";
    
    error_log(date('Y-m-d H:i:s') . " - خطأ في توليد sitemap: " . $e->getMessage() . "\n", 3, './sitemap-log.txt');
}
?>