// مولد سُلَج عربي + راوتر مسارات جميلة لصفحات المنتجات
// يدعم GitHub Pages بدون خادم عبر إعادة توجيه إلى product-details.html مع query params

(function(){
  'use strict';

  // توليد سُلَج عربي آمن من العنوان
  function arabicSlugify(text){
    if(!text) return '';
    // إزالة التشكيل والرموز الزائدة
    const stripped = text
      .replace(/[\u0617-\u061A\u064B-\u0652]/g,'') // التشكيل
      .replace(/[\u200B-\u200F\uFEFF]/g,'') // مسافات صفرية
      .replace(/["'`^~!@#$%&*()+=\[\]{}|;:,.<>?\\\/]/g,' ') // رموز
      .replace(/\s+/g,' ') // مسافات متكررة
      .trim();
    // استبدال المسافات بشرطات وإبقاء العربية واللاتينية والأرقام فقط
    const slug = stripped
      .replace(/[^\p{L}\p{N}\s-]/gu,'')
      .replace(/\s+/g,'-')
      .replace(/-+/g,'-');
    return slug;
  }

  // إنشاء رابط المسار الجميل
  function buildPrettyURL(product){
    const slug = arabicSlugify(product.title);
    const cat = product.categoryEn || (product.category==='ساعات'?'watch':'perfume');
    // مسار وهمي جميل + Query احتياطي لضمان العمل على GitHub Pages
    const pathname = `/product/${encodeURIComponent(slug)}`;
    const search = `?id=${encodeURIComponent(product.id)}&category=${encodeURIComponent(cat)}&slug=${encodeURIComponent(slug)}`;
    return pathname + search;
  }

  // دالة عمومية تُستخدم من المكونات الأخرى
  window.SlugRouter = { arabicSlugify, buildPrettyURL };

  // في صفحات البطاقات: استبدال روابط العين/التفاصيل بالمسار الجميل
  function enhanceCardsLinks(){
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card=>{
      const id = card.getAttribute('data-product-id');
      const title = card.querySelector('.product-title')?.textContent?.trim() || '';
      const catText = (card.querySelector('.product-category')?.textContent || '').toLowerCase();
      const categoryEn = /ساعات|watch|rolex|omega|patek|cartier|audemars|breitling/i.test(catText+title)?'watch':'perfume';
      const product = { id, title, categoryEn };
      const url = buildPrettyURL(product);
      // أيقونة العين
      const eye = card.querySelector('.overlay-btn, .eye-link');
      if(eye){ eye.setAttribute('onclick', `location.href='${url}'`); }
      // العنوان كرابط إن وجد
      const titleEl = card.querySelector('a.product-title-link');
      if(titleEl){ titleEl.setAttribute('href', url); }
    });
  }

  // في صفحة product-details: دعم قراءة المسار الجميل
  function hydrateFromPrettyPath(){
    const path = decodeURIComponent(location.pathname);
    if(path.startsWith('/product/')){
      const slug = path.replace('/product/','').replace(/\/+/g,'/');
      const params = new URLSearchParams(location.search);
      // إن لم توجد معلمات، أعد توجيه بتمرير slug كـ query ليعمل الجلب من JSON
      if(!params.get('id')){
        const redirect = `/product-details.html?slug=${encodeURIComponent(slug)}`;
        history.replaceState(null,'', redirect);
      }
    }
  }

  // تفعيل تلقائي عند DOM جاهز
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', ()=>{
      try{ enhanceCardsLinks(); }catch(e){}
      try{ hydrateFromPrettyPath(); }catch(e){}
    });
  } else {
    try{ enhanceCardsLinks(); }catch(e){}
    try{ hydrateFromPrettyPath(); }catch(e){}
  }

})();