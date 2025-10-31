// ... existing file content replaced below ...
// محسن الأداء المتقدم - متجر هدايا الإمارات
// نسخة مصححة مع تمكين رابط أيقونة العين لفتح صفحة التفاصيل دومًا

(function(){
    'use strict';

    // مراقبة تفويض النقرات لأزرار البطاقات بما فيها أيقونة العين
    function enableCardActionLinks(){
        document.addEventListener('click', (e)=>{
            const eyeBtn = e.target.closest('.quick-view-btn, .overlay-btn.eye-link');
            if(eyeBtn){
                e.preventDefault();
                // محاولة الحصول على أقرب بطاقة ومعرفها
                const card = eyeBtn.closest('.product-card');
                const id = card?.getAttribute('data-product-id') || eyeBtn.getAttribute('data-id');
                if(id){
                    window.location.href = `./product-details.html?id=${id}`;
                }
                return;
            }
        }, {passive:false});
    }

    // تفعيل عند التحميل
    function init(){
        try {
            enableCardActionLinks();
            console.log('✅ Eye button router enabled');
        } catch(err){
            console.warn('Eye button init error', err);
        }
    }

    if(document.readyState==='loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();
