/**
 * دليل فعاليات دمشق - الجافاسكريبت
 * BWP401 - د. باسل الخطيب
 * تم التكيف مع التصميم الحالي بدون تعديل HTML/CSS
 */

// ==================== بيانات الفعاليات ====================
const eventsData = [
    {
        id: 1,
        title: "مهرجان دمشق السينمائي",
        category: "مهرجانات",
        date: "2025-11-15",
        location: "دار الحرية للثقافة",
        image: "image/damascus-film-festival.jpeg",
        featured: true,
        description: "أحد أهم المهرجانات السينمائية في سوريا"
    },
    {
        id: 2,
        title: "مهرجان الموسيقى الشامية",
        category: "مهرجانات",
        date: "2025-12-01",
        location: "المسرح القومي",
        image: "image/sham-music-festival.jpeg",
        featured: true,
        description: "احتفالية بالموسيقى الشامية الأصيلة"
    },
    {
        id: 3,
        title: "معرض دمشق الدولي للكتاب",
        category: "معارض",
        date: "2026-01-25",
        location: "معرض دمشق الدولي",
        image: "image/damascus-book-fair.jpeg",
        featured: false,
        description: "أكبر معرض للكتاب في سوريا"
    },
    {
        id: 4,
        title: "ماراثون دمشق",
        category: "فعاليات رياضية",
        date: "2026-01-05",
        location: "ساحة الأمويين",
        image: "image/damascus-marathon.jpeg",
        featured: true,
        description: "سباق ماراثون سنوي ضخم في شوارع دمشق"
    },
    {
        id: 5,
        title: "أمسية شعرية",
        category: "فعاليات ثقافية",
        date: "2026-11-05",
        location: "مركز الثقافة العربية",
        image: "image/poetry-evening.jpeg",
        featured: false,
        description: "أمسية شعرية راقية يشارك فيها أشهر الشعراء السوريين"
    },
    {
        id: 6,
        title: "احتفالية المولد النبوي",
        category: "فعاليات دينية",
        date: "2026-10-08",
        location: "الجامع الأموي",
        image: "image/mawlid-damascus.jpeg",
        featured: true,
        description: "احتفالات روحية بذكرى المولد النبوي الشريف"
    }
];

// ==================== سلايدر الفعاليات البارزة ====================
class EventsSlider {

    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoSlideInterval = null;
        this.init();
    }

    init() {
        this.slides = eventsData.filter(event => event.featured);

        if (this.slides.length > 0 && document.getElementById('featuredEvents')) {
            this.createSlider();
            this.startAutoSlide();
            this.addSliderStyles();
        }
    }

    createSlider() {
        const sliderContainer = document.getElementById('featuredEvents');

        sliderContainer.innerHTML = `
            <div class="featured-slider">
                <div class="slider-track" id="sliderTrack"></div>
                <button class="slider-btn prev-btn">‹</button>
                <button class="slider-btn next-btn">›</button>
                <div class="slider-dots" id="sliderDots"></div>
            </div>
        `;

        this.renderSlides();
        this.renderDots();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // الأزرار
        document.querySelector('.prev-btn')?.addEventListener('click', () => this.prevSlide());
        document.querySelector('.next-btn')?.addEventListener('click', () => this.nextSlide());

        // التمرير بالسحب على الجوال
        let startX = 0;
        let endX = 0;
        const sliderTrack = document.getElementById('sliderTrack');

        if (sliderTrack) {
            sliderTrack.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
            });

            sliderTrack.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                this.handleSwipe(startX, endX);
            });
        }
    }

    handleSwipe(startX, endX) {
        const swipeThreshold = 50;
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    renderSlides() {
        const sliderTrack = document.getElementById('sliderTrack');
        if (!sliderTrack) return;

        sliderTrack.innerHTML = this.slides.map((slide, index) => `
            <div class="slide ${index === this.currentSlide ? 'active' : ''}">
                <div class="slide-content">
                    <img src="${slide.image}" alt="${slide.title}" 
                         onerror="this.classList.add('image-error')">
                    <div class="slide-info">
                        <span class="event-badge">${slide.category}</span>
                        <h3>${slide.title}</h3>
                        <p>${slide.description}</p>
                        <div class="slide-meta">
                            <span class="date">📅 ${this.formatDate(slide.date)}</span>
                            <span class="location">📍 ${slide.location}</span>
                        </div>
                        <a href="event.html?id=${slide.id}" class="slide-btn">عرض التفاصيل</a>
                    </div>
                </div>
            </div>
        `).join('');

        sliderTrack.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }

    renderDots() {
        const dotsContainer = document.getElementById('sliderDots');
        if (!dotsContainer) return;

        dotsContainer.innerHTML = this.slides.map((_, index) =>
            `<button class="dot ${index === this.currentSlide ? 'active' : ''}" 
                    data-index="${index}"></button>`
        ).join('');

        // إضافة event listeners للنقاط
        dotsContainer.querySelectorAll('.dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                this.goToSlide(index);
            });
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }

    updateSlider() {
        this.renderSlides();
        this.renderDots();
        this.resetAutoSlide();
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    resetAutoSlide() {
        this.stopAutoSlide();
        this.startAutoSlide();
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
        }
    }

    addSliderStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .featured-slider {
                position: relative;
                overflow: hidden;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                height: 450px;
            }
            .slider-track {
                display: flex;
                transition: transform 0.5s ease-in-out;
                height: 100%;
            }
            .slide {
                min-width: 100%;
                position: relative;
                height: 100%;
            }
            .slide-content {
                position: relative;
                height: 100%;
                width: 100%;
            }
            .slide-content img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                transition: transform 0.3s ease;
            }
            .slide.active .slide-content img {
                transform: scale(1.05);
            }
            .slide-content img.image-error {
                background: linear-gradient(135deg, #2F4F4F 0%, #708090 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2em;
                text-align: center;
                padding: 20px;
            }
            .slide-info {
                position: absolute;
                bottom: 0;
                right: 0;
                left: 0;
                background: linear-gradient(transparent, rgba(47, 79, 79, 0.95));
                color: white;
                padding: 25px;
                transition: all 0.3s ease;
            }
            .slide:hover .slide-info {
                background: linear-gradient(transparent, rgba(47, 79, 79, 0.98));
            }
            .event-badge {
                background: #D2691E;
                color: white;
                padding: 5px 12px;
                border-radius: 15px;
                font-size: 0.8em;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 10px;
            }
            .slide-info h3 {
                color: #FFD54F;
                margin-bottom: 10px;
                font-size: 1.4em;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            .slide-info p {
                margin-bottom: 15px;
                opacity: 0.9;
                line-height: 1.5;
            }
            .slide-meta {
                display: flex;
                gap: 20px;
                margin-bottom: 15px;
                flex-wrap: wrap;
            }
            .slide-meta span {
                display: flex;
                align-items: center;
                gap: 5px;
                font-size: 0.9em;
                opacity: 0.9;
            }
            .slide-btn {
                display: inline-block;
                background: #D2691E;
                color: white;
                padding: 10px 25px;
                border-radius: 25px;
                text-decoration: none;
                font-weight: bold;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .slide-btn:hover {
                background: transparent;
                border-color: #FFD54F;
                color: #FFD54F;
                transform: translateY(-2px);
            }
            .slider-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255,255,255,0.9);
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 1.5em;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #2F4F4F;
            }
            .slider-btn:hover {
                background: white;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                transform: translateY(-50%) scale(1.1);
            }
            .prev-btn { 
                right: 20px; 
            }
            .next-btn { 
                left: 20px; 
            }
            .slider-dots {
                position: absolute;
                bottom: 20px;
                right: 50%;
                transform: translateX(50%);
                display: flex;
                gap: 10px;
                z-index: 10;
            }
            .dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                border: none;
                background: rgba(255,255,255,0.5);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .dot.active {
                background: #FFD54F;
                transform: scale(1.3);
            }
            .dot:hover {
                background: white;
                transform: scale(1.2);
            }

            /* تصميم متجاوب */
            @media (max-width: 768px) {
                .featured-slider {
                    height: 350px;
                }
                .slide-info {
                    padding: 15px;
                }
                .slide-info h3 {
                    font-size: 1.2em;
                }
                .slide-meta {
                    gap: 10px;
                    flex-direction: column;
                }
                .slider-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 1.2em;
                }
                .prev-btn { right: 10px; }
                .next-btn { left: 10px; }
            }
        `;
        document.head.appendChild(style);
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-SA', options);
    }
}



// ==================== نظام فلترة الفعاليات ====================
class EventsFilter {
    constructor() {
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.filteredEvents = [];
        this.init();
    }

    init() {
        if (document.getElementById('searchInput')) {
            this.setupEventListeners();
            this.setupFilterStyles();
            this.applyFilters();
        }
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filteredEvents = [...eventsData];

        // فلترة حسب البحث
        if (this.searchTerm) {
            filteredEvents = filteredEvents.filter(event =>
                event.title.toLowerCase().includes(this.searchTerm) ||
                event.description.toLowerCase().includes(this.searchTerm) ||
                event.location.toLowerCase().includes(this.searchTerm) ||
                event.category.toLowerCase().includes(this.searchTerm)
            );
        }

        // فلترة حسب التصنيف
        if (this.currentCategory !== 'all') {
            filteredEvents = filteredEvents.filter(event =>
                event.category === this.currentCategory
            );
        }

        this.filteredEvents = filteredEvents;
        this.highlightSections();
        this.showResultsCount();
    }

    highlightSections() {
        // إخفاء جميع الأقسام أولاً
        const sections = ['مهرجانات', 'معارض', 'فعاليات-دينية', 'فعاليات-ثقافية', 'فعاليات-رياضية'];
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                element.style.opacity = '0.3';
                element.style.transition = 'opacity 0.3s ease';
            }
        });

        // إظهار الأقسام التي تحتوي على فعاليات مطابقة
        if (this.filteredEvents.length > 0) {
            const visibleCategories = [...new Set(this.filteredEvents.map(event => {
                switch (event.category) {
                    case 'مهرجانات': return 'مهرجانات';
                    case 'معارض': return 'معارض';
                    case 'فعاليات دينية': return 'فعاليات-دينية';
                    case 'فعاليات ثقافية': return 'فعاليات-ثقافية';
                    case 'فعاليات رياضية': return 'فعاليات-رياضية';
                    default: return null;
                }
            }))].filter(Boolean);

            visibleCategories.forEach(category => {
                const element = document.getElementById(category);
                if (element) {
                    element.style.opacity = '1';
                }
            });
        } else {
            // إذا لم توجد نتائج، إظهار جميع الأقسام ولكن بتأثير مختلف
            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    element.style.opacity = '0.6';
                }
            });
        }
    }

    showResultsCount() {
        let resultsElement = document.getElementById('filterResults');

        if (!resultsElement) {
            resultsElement = document.createElement('div');
            resultsElement.id = 'filterResults';
            resultsElement.style.cssText = `
                text-align: center;
                padding: 15px;
                margin: 10px 0;
                background: #f8f9fa;
                border-radius: 10px;
                border-right: 4px solid #D2691E;
                font-weight: bold;
                color: #2F4F4F;
            `;

            const filterContainer = document.querySelector('.events-filter');
            if (filterContainer) {
                filterContainer.parentNode.insertBefore(resultsElement, filterContainer.nextSibling);
            }
        }

        if (this.filteredEvents.length === 0) {
            resultsElement.innerHTML = '❌ لم يتم العثور على فعاليات تطابق معايير البحث';
            resultsElement.style.background = '#ffe6e6';
            resultsElement.style.borderRightColor = '#dc3545';
        } else if (this.searchTerm || this.currentCategory !== 'all') {
            resultsElement.innerHTML = `✅ تم العثور على ${this.filteredEvents.length} فعالية`;
            resultsElement.style.background = '#e6ffe6';
            resultsElement.style.borderRightColor = '#28a745';
        } else {
            resultsElement.innerHTML = `📅 جميع الفعاليات (${this.filteredEvents.length} فعالية)`;
            resultsElement.style.background = '#f8f9fa';
            resultsElement.style.borderRightColor = '#D2691E';
        }
    }

    setupFilterStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .events-filter {
                transition: all 0.3s ease;
            }
            .events-filter:focus-within {
                box-shadow: 0 0 0 3px rgba(210, 105, 30, 0.2);
            }
            #searchInput:focus, #categoryFilter:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(210, 105, 30, 0.2);
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== تحقق نموذج اتصل بنا ====================
class ContactFormValidator {
    constructor() {
        this.init();
    }

    init() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            this.setupFormStyles();
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateForm(contactForm);
            });

            // تحقق فوري عند ترك الحقول
            contactForm.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldStatus(field));
            });
        }
    }

    validateForm(form) {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        let isValid = true;
        const errors = [];

        // تحقق من جميع الحقول
        if (!this.validateField(name)) {
            isValid = false;
            errors.push('الاسم الكامل مطلوب');
        }

        if (!this.validateField(email)) {
            isValid = false;
            errors.push('البريد الإلكتروني غير صحيح');
        }

        if (!this.validateField(message)) {
            isValid = false;
            errors.push('الرسالة مطلوبة');
        }

        if (isValid) {
            this.showSuccess('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
            form.reset();
            this.clearAllFieldStatus();
        } else {
            this.showError('يرجى تصحيح الأخطاء التالية:<br>' + errors.map(err => `• ${err}`).join('<br>'));
        }
    }

    validateField(field) {
        const value = field.value.trim();

        if (field.id === 'name') {
            if (value === '') {
                this.showFieldError(field, 'الاسم الكامل مطلوب');
                return false;
            } else if (value.length < 2) {
                this.showFieldError(field, 'الاسم يجب أن يكون أكثر من حرفين');
                return false;
            } else {
                this.showFieldSuccess(field);
                return true;
            }
        }

        if (field.id === 'email') {
            if (value === '') {
                this.showFieldError(field, 'البريد الإلكتروني مطلوب');
                return false;
            } else if (!this.isValidEmail(value)) {
                this.showFieldError(field, 'صيغة البريد الإلكتروني غير صحيحة');
                return false;
            } else {
                this.showFieldSuccess(field);
                return true;
            }
        }

        if (field.id === 'message') {
            if (value === '') {
                this.showFieldError(field, 'الرسالة مطلوبة');
                return false;
            } else if (value.length < 10) {
                this.showFieldError(field, 'الرسالة يجب أن تكون أكثر من 10 أحرف');
                return false;
            } else {
                this.showFieldSuccess(field);
                return true;
            }
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(field, message) {
        field.classList.add('field-error');
        field.classList.remove('field-success');

        let errorElement = field.parentNode.querySelector('.field-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-feedback';
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.className = 'field-feedback field-error';
    }

    showFieldSuccess(field) {
        field.classList.add('field-success');
        field.classList.remove('field-error');

        let feedbackElement = field.parentNode.querySelector('.field-feedback');
        if (feedbackElement) {
            feedbackElement.className = 'field-feedback field-success';
            feedbackElement.textContent = '✓ صحيح';
        }
    }

    clearFieldStatus(field) {
        field.classList.remove('field-error', 'field-success');
        const feedbackElement = field.parentNode.querySelector('.field-feedback');
        if (feedbackElement) {
            feedbackElement.remove();
        }
    }

    clearAllFieldStatus() {
        const form = document.getElementById('contactForm');
        form.querySelectorAll('input, textarea').forEach(field => {
            this.clearFieldStatus(field);
        });
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        // إزالة أي رسائل سابقة
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-${type}`;
        messageDiv.innerHTML = message;

        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(messageDiv, form);

        // إخفاء الرسالة تلقائياً بعد 5 ثواني
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 5000);
    }

    setupFormStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .field-error {
                border-color: #dc3545 !important;
                background: #fff5f5 !important;
            }
            .field-success {
                border-color: #28a745 !important;
                background: #f8fff8 !important;
            }
            .field-feedback {
                font-size: 0.875em;
                margin-top: 5px;
                padding: 5px 10px;
                border-radius: 5px;
                transition: all 0.3s ease;
            }
            .field-feedback.field-error {
                color: #dc3545;
                background: #ffe6e6;
                border-right: 3px solid #dc3545;
            }
            .field-feedback.field-success {
                color: #28a745;
                background: #e6ffe6;
                border-right: 3px solid #28a745;
            }
            .form-message {
                padding: 15px 20px;
                margin: 20px 0;
                border-radius: 10px;
                font-weight: bold;
                text-align: center;
                transition: all 0.3s ease;
            }
            .form-success {
                background: #e6ffe6;
                color: #28a745;
                border-right: 4px solid #28a745;
            }
            .form-error {
                background: #ffe6e6;
                color: #dc3545;
                border-right: 4px solid #dc3545;
            }
        `;
        document.head.appendChild(style);
    }
}

// ==================== دوال مساعدة ====================
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
}

function addToCalendar(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        alert(`✅ تمت إضافة "${event.title}" إلى التقويم\nالتاريخ: ${formatDate(event.date)}\nالمكان: ${event.location}`);
    }
}

function shareEvent(eventId) {
    const event = eventsData.find(e => e.id === eventId);
    if (event) {
        const shareText = `تفضل بمشاهدة ${event.title} في ${event.location} بتاريخ ${formatDate(event.date)}`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: event.title,
                text: shareText,
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
                alert('🔗 تم نسخ رابط الفعالية، يمكنك مشاركته الآن');
            });
        }
    }
}

// ==================== التهيئة الرئيسية ====================
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 تم تحميل دليل فعاليات دمشق بنجاح');

    // تهيئة السلايدر (الصفحة الرئيسية فقط)
    window.eventsSlider = new EventsSlider();

    // تهيئة نظام الفلترة (صفحة الفعاليات فقط)
    window.eventsFilter = new EventsFilter();

    // تهيئة تحقق النموذج (صفحة اتصل بنا فقط)
    window.contactValidator = new ContactFormValidator();

    // إضافة تأثيرات تفاعلية إضافية
    addInteractiveEffects();
});

// تأثيرات تفاعلية إضافية
function addInteractiveEffects() {
    // تأثير التمرير السلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // تأثير ظهور العناصر عند التمرير
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // إضافة تأثيرات للعناصر
    document.querySelectorAll('article, section > div').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}
