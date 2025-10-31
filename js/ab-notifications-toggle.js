// نظام A/B لإشعارات المبيعات - متجر هدايا الإمارات
// مفتاح تشغيل/إيقاف في localStorage لأغراض A/B Testing

class ABNotificationsToggle {
    constructor() {
        this.storageKey = 'emirates_sales_notifications_enabled';
        this.isEnabled = this.getNotificationState();
        this.init();
    }

    init() {
        this.createToggleButton();
        this.setupNotificationSystem();
        this.addToggleStyles();
        console.log(`📊 نظام A/B لإشعارات المبيعات: ${this.isEnabled ? 'مفعّل' : 'معطّل'}`);
    }

    getNotificationState() {
        const stored = localStorage.getItem(this.storageKey);
        // إذا لم يتم تعيين حالة، فعّل تلقائياً (لأغراض A/B)
        return stored !== null ? JSON.parse(stored) : true;
    }

    setNotificationState(enabled) {
        this.isEnabled = enabled;
        localStorage.setItem(this.storageKey, JSON.stringify(enabled));
        this.updateToggleButton();
        this.toggleNotificationSystem();
        
        // تسجيل الحدث لأغراض A/B
        this.logABEvent(enabled ? 'notifications_enabled' : 'notifications_disabled');
    }

    createToggleButton() {
        // إنشاء زر التحكم
        const toggleContainer = document.createElement('div');
        toggleContainer.id = 'notifications-toggle-container';
        toggleContainer.innerHTML = `
            <div class="toggle-panel">
                <div class="toggle-info">
                    <i class="fas fa-bell toggle-icon"></i>
                    <span class="toggle-label">إشعارات المبيعات</span>
                </div>
                <button class="toggle-btn ${this.isEnabled ? 'enabled' : 'disabled'}" id="notificationsToggle">
                    <div class="toggle-slider"></div>
                    <span class="toggle-status">${this.isEnabled ? 'مفعّل' : 'معطّل'}</span>
                </button>
            </div>
        `;
        
        document.body.appendChild(toggleContainer);
        
        // ربط الوظيفة
        const toggleBtn = document.getElementById('notificationsToggle');
        toggleBtn.addEventListener('click', () => {
            this.setNotificationState(!this.isEnabled);
            this.showToggleMessage();
        });
    }

    updateToggleButton() {
        const toggleBtn = document.getElementById('notificationsToggle');
        const toggleStatus = toggleBtn?.querySelector('.toggle-status');
        
        if (toggleBtn) {
            toggleBtn.className = `toggle-btn ${this.isEnabled ? 'enabled' : 'disabled'}`;
            if (toggleStatus) {
                toggleStatus.textContent = this.isEnabled ? 'مفعّل' : 'معطّل';
            }
        }
    }

    setupNotificationSystem() {
        if (this.isEnabled) {
            this.startNotifications();
        } else {
            this.stopNotifications();
        }
    }

    toggleNotificationSystem() {
        if (this.isEnabled) {
            this.startNotifications();
        } else {
            this.stopNotifications();
        }
    }

    startNotifications() {
        // بدء عرض إشعارات المبيعات
        this.notificationInterval = setInterval(() => {
            this.showSalesNotification();
        }, 15000); // إشعار كل 15 ثانية
        
        // إشعار فوري عند التفعيل
        setTimeout(() => {
            this.showSalesNotification();
        }, 3000);
        
        console.log('✅ تم تفعيل إشعارات المبيعات');
    }

    stopNotifications() {
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
            this.notificationInterval = null;
        }
        
        // إخفاء أي إشعارات ظاهرة
        document.querySelectorAll('.sales-notification').forEach(notification => {
            notification.remove();
        });
        
        console.log('⛔ تم إيقاف إشعارات المبيعات');
    }

    showSalesNotification() {
        if (!this.isEnabled) return;
        
        const notifications = [
            { 
                icon: '🎆', 
                text: 'عميل من دبي اشترى عطر توم فورد قبل 5 دقائق',
                time: 'قبل 5 دقائق'
            },
            { 
                icon: '⭐', 
                text: 'عميلة من أبو ظبي طلبت ساعة رولكس',
                time: 'قبل 8 دقائق'
            },
            { 
                icon: '🎉', 
                text: 'تم بيع 3 عطور من مجموعة شانيل في الساعة الأخيرة',
                time: 'آخر ساعة'
            },
            { 
                icon: '🛍️', 
                text: 'عميل من الشارقة أضاف مجموعة هدايا للسلة',
                time: 'قبل 12 دقيقة'
            },
            { 
                icon: '✨', 
                text: 'تم تقييم عطر ديور بـ 5 نجوم من عميل في دبي',
                time: 'قبل 15 دقيقة'
            }
        ];
        
        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        this.displayNotification(randomNotification);
    }

    displayNotification(notificationData) {
        // إزالة إشعارات قديمة
        document.querySelectorAll('.sales-notification').forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'sales-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${notificationData.icon}</div>
                <div class="notification-text">
                    <div class="notification-message">${notificationData.text}</div>
                    <div class="notification-time">${notificationData.time}</div>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // إزالة تلقائية بعد 8 ثوان
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutLeft 0.5s ease';
                setTimeout(() => notification.remove(), 500);
            }
        }, 8000);
    }

    showToggleMessage() {
        const message = this.isEnabled ? 
            '✅ تم تفعيل إشعارات المبيعات' : 
            '⛔ تم إيقاف إشعارات المبيعات';
        
        const toggleMessage = document.createElement('div');
        toggleMessage.className = 'toggle-message';
        toggleMessage.innerHTML = `
            <div class="toggle-message-content">
                <i class="fas fa-${this.isEnabled ? 'check-circle' : 'times-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        toggleMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${this.isEnabled ? '#25D366' : '#ff4757'};
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: 'Cairo', sans-serif;
            font-weight: 600;
            font-size: 1.1rem;
            animation: scaleIn 0.3s ease;
        `;
        
        document.body.appendChild(toggleMessage);
        
        setTimeout(() => {
            toggleMessage.style.animation = 'scaleOut 0.3s ease';
            setTimeout(() => toggleMessage.remove(), 300);
        }, 2000);
    }

    logABEvent(event) {
        // تسجيل أحداث A/B لاحقاً
        const abData = JSON.parse(localStorage.getItem('emirates_ab_events') || '[]');
        
        abData.push({
            event: event,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent.substring(0, 50)
        });
        
        // الاحتفاظ بآخر 100 حدث
        if (abData.length > 100) {
            abData.splice(0, abData.length - 100);
        }
        
        localStorage.setItem('emirates_ab_events', JSON.stringify(abData));
        console.log(`📈 A/B Event: ${event}`);
    }

    // إحصائيات A/B
    getABStats() {
        const events = JSON.parse(localStorage.getItem('emirates_ab_events') || '[]');
        
        const stats = {
            total_events: events.length,
            enabled_count: events.filter(e => e.event === 'notifications_enabled').length,
            disabled_count: events.filter(e => e.event === 'notifications_disabled').length,
            current_state: this.isEnabled ? 'مفعّل' : 'معطّل',
            last_change: events.length > 0 ? events[events.length - 1].timestamp : 'N/A'
        };
        
        console.table(stats);
        return stats;
    }

    addToggleStyles() {
        const style = document.createElement('style');
        style.id = 'ab-notifications-toggle-styles';
        style.textContent = `
            #notifications-toggle-container {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 9999;
                font-family: 'Cairo', sans-serif;
            }
            
            .toggle-panel {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 2px solid #D4AF37;
                border-radius: 15px;
                padding: 15px 20px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s ease;
            }
            
            .toggle-panel:hover {
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
                transform: translateY(-2px);
            }
            
            .toggle-info {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #333;
            }
            
            .toggle-icon {
                font-size: 1.2rem;
                color: #D4AF37;
            }
            
            .toggle-label {
                font-weight: 600;
                font-size: 0.9rem;
                white-space: nowrap;
            }
            
            .toggle-btn {
                position: relative;
                width: 60px;
                height: 30px;
                border: 2px solid #ddd;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
                overflow: hidden;
                background: #f0f0f0;
            }
            
            .toggle-btn.enabled {
                background: linear-gradient(135deg, #25D366, #20B358);
                border-color: #25D366;
            }
            
            .toggle-btn.disabled {
                background: #ff4757;
                border-color: #ff4757;
            }
            
            .toggle-slider {
                position: absolute;
                top: 2px;
                right: 2px;
                width: 22px;
                height: 22px;
                background: white;
                border-radius: 50%;
                transition: all 0.3s ease;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            }
            
            .toggle-btn.enabled .toggle-slider {
                transform: translateX(-28px);
            }
            
            .toggle-status {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 0.7rem;
                font-weight: bold;
                color: white;
                opacity: 0.9;
            }
            
            .sales-notification {
                position: fixed;
                top: 100px;
                left: 20px;
                background: linear-gradient(135deg, #ffffff, #f8f9fa);
                border: 2px solid #D4AF37;
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                z-index: 9998;
                max-width: 300px;
                animation: slideInLeft 0.5s ease;
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            
            .notification-icon {
                font-size: 1.5rem;
                flex-shrink: 0;
            }
            
            .notification-text {
                flex: 1;
            }
            
            .notification-message {
                font-weight: 600;
                color: #333;
                font-size: 0.9rem;
                line-height: 1.4;
                margin-bottom: 4px;
            }
            
            .notification-time {
                font-size: 0.75rem;
                color: #666;
                opacity: 0.8;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #999;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: color 0.3s;
            }
            
            .notification-close:hover {
                color: #666;
            }
            
            .toggle-message {
                font-family: 'Cairo', sans-serif;
            }
            
            .toggle-message-content {
                display: flex;
                align-items: center;
                gap: 15px;
                font-size: 1.1rem;
            }
            
            .toggle-message i {
                font-size: 1.4rem;
            }
            
            /* انيميشن */
            @keyframes slideInLeft {
                from {
                    transform: translateX(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutLeft {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(-100%);
                    opacity: 0;
                }
            }
            
            @keyframes scaleIn {
                from {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes scaleOut {
                from {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                to {
                    transform: translate(-50%, -50%) scale(0.5);
                    opacity: 0;
                }
            }
            
            /* تحسينات للهواتف */
            @media (max-width: 768px) {
                #notifications-toggle-container {
                    bottom: 10px;
                    left: 10px;
                    right: 10px;
                }
                
                .toggle-panel {
                    padding: 12px 15px;
                    justify-content: center;
                }
                
                .toggle-label {
                    font-size: 0.8rem;
                }
                
                .sales-notification {
                    left: 10px;
                    right: 10px;
                    max-width: none;
                    top: 80px;
                }
                
                .notification-message {
                    font-size: 0.85rem;
                }
            }
            
            @media (max-width: 480px) {
                .toggle-label {
                    display: none;
                }
                
                .toggle-btn {
                    width: 50px;
                    height: 25px;
                }
                
                .toggle-slider {
                    width: 19px;
                    height: 19px;
                }
                
                .toggle-btn.enabled .toggle-slider {
                    transform: translateX(-23px);
                }
            }
        `;
        
        if (!document.getElementById('ab-notifications-toggle-styles')) {
            document.head.appendChild(style);
        }
    }

    // وظائف عامة للتحكم
    enable() {
        this.setNotificationState(true);
    }

    disable() {
        this.setNotificationState(false);
    }

    toggle() {
        this.setNotificationState(!this.isEnabled);
    }

    getStatus() {
        return {
            enabled: this.isEnabled,
            storage_key: this.storageKey,
            stats: this.getABStats()
        };
    }

    // مسح بيانات A/B
    clearABData() {
        localStorage.removeItem('emirates_ab_events');
        console.log('🧽 تم مسح بيانات A/B Testing');
    }

    // تصدير بيانات A/B
    exportABData() {
        const events = JSON.parse(localStorage.getItem('emirates_ab_events') || '[]');
        const stats = this.getABStats();
        
        const exportData = {
            timestamp: new Date().toISOString(),
            stats: stats,
            events: events,
            current_state: this.isEnabled
        };
        
        // إنشاء ملف للتحميل
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ab-test-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📄 تم تصدير بيانات A/B Testing');
    }
}

// تفعيل نظام A/B
const abNotificationsToggle = new ABNotificationsToggle();

// تصدير للاستخدام العام
window.ABNotificationsToggle = ABNotificationsToggle;
window.abNotificationsToggle = abNotificationsToggle;

// أوامر الوحة console للتحكم في A/B
// abNotificationsToggle.enable() - تفعيل
// abNotificationsToggle.disable() - تعطيل
// abNotificationsToggle.toggle() - تبديل
// abNotificationsToggle.getStatus() - عرض الحالة
// abNotificationsToggle.getABStats() - عرض إحصائيات
// abNotificationsToggle.exportABData() - تصدير بيانات
// abNotificationsToggle.clearABData() - مسح البيانات