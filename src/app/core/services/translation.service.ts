import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  // Signal to track current language. Default is English.
  currentLang = signal<'en' | 'ar'>('en');

  private translations: Record<string, { en: string; ar: string }> = {
    // Navbar
    'logo_title': { en: 'LearnPortal Dashboard', ar: 'لوحة تحكم بوابة التعليم' },
    'admin_profile': { en: 'Admin Profile', ar: 'ملف المشرف' },
    
    // Page list header
    'page_title': { en: 'Course Management', ar: 'إدارة الكورسات' },
    'page_subtitle': { en: 'View, search, filter, and manage your educational courses', ar: 'عرض، بحث، تصفية، وإدارة الكورسات التعليمية الخاصة بك' },
    
    // Actions & buttons
    'btn_add_course': { en: 'Add Course', ar: 'إضافة كورس' },
    'btn_edit': { en: 'Edit', ar: 'تعديل' },
    'btn_delete': { en: 'Delete', ar: 'حذف' },
    'btn_view': { en: 'View', ar: 'عرض' },
    'btn_cancel': { en: 'Cancel', ar: 'إلغاء' },
    'btn_save': { en: 'Save', ar: 'حفظ' },
    'btn_update': { en: 'Update', ar: 'تحديث' },
    'btn_retry': { en: 'Retry', ar: 'إعادة المحاولة' },
    'btn_reset': { en: 'Reset', ar: 'إعادة ضبط' },
    'btn_back_dashboard': { en: 'Back to Dashboard', ar: 'العودة للوحة التحكم' },
    
    // Filters & Placeholders
    'filter_search_placeholder': { en: 'Search by course name...', ar: 'ابحث عن اسم الكورس...' },
    'filter_search_label': { en: 'Search Courses', ar: 'بحث الكورسات' },
    'filter_status_label': { en: 'Status', ar: 'الحالة' },
    'filter_all_statuses': { en: 'All Statuses', ar: 'كل الحالات' },
    
    // Headers & Columns
    'col_course_name': { en: 'Course Name', ar: 'اسم الكورس' },
    'col_instructor': { en: 'Instructor', ar: 'المدرب' },
    'col_category': { en: 'Category', ar: 'التصنيف' },
    'col_duration': { en: 'Duration', ar: 'المدة' },
    'col_price': { en: 'Price', ar: 'السعر' },
    'col_status': { en: 'Status', ar: 'الحالة' },
    'col_created_date': { en: 'Created Date', ar: 'تاريخ الإنشاء' },
    'col_actions': { en: 'Actions', ar: 'الإجراءات' },
    'col_description': { en: 'Description', ar: 'الوصف' },
    
    // UX States
    'state_loading': { en: 'Loading courses...', ar: 'جاري تحميل الكورسات...' },
    'state_loading_details': { en: 'Loading course details...', ar: 'جاري تحميل تفاصيل الكورس...' },
    'state_empty_title': { en: 'No results found', ar: 'لم يتم العثور على نتائج' },
    'state_empty_msg': { en: 'Try adjusting your search filters or add a new course to get started.', ar: 'جرّب تعديل فلاتر البحث أو أضف كورساً جديداً للبدء.' },
    'state_error_title': { en: 'An error occurred', ar: 'حدث خطأ ما' },
    'state_error_msg': { en: 'Failed to load courses. Please make sure the JSON Mock Server is running on port 3000.', ar: 'فشل تحميل الكورسات. يرجى التأكد من تشغيل خادم المحاكاة (JSON Server) على منفذ 3000.' },
    'state_not_found_title': { en: 'Course Not Found', ar: 'الكورس غير موجود' },
    'state_not_found_msg': { en: 'Could not load course details. Ensure the course exists or mock server is active.', ar: 'تعذر تحميل تفاصيل الكورس. تأكد من أن الكورس موجود أو أن الخادم يعمل.' },

    // Details View
    'details_page_title': { en: 'Course Details', ar: 'تفاصيل الكورس' },
    'details_instructed_by': { en: 'Instructed by', ar: 'تحت إشراف' },
    'details_description_title': { en: 'Course Description', ar: 'وصف الكورس' },
    'details_no_description': { en: 'No description provided for this course.', ar: 'لا يوجد وصف متوفر لهذا الكورس.' },
    
    // Form Page
    'form_title_add': { en: 'Add New Course', ar: 'إضافة كورس جديد' },
    'form_title_edit': { en: 'Edit Course', ar: 'تعديل الكورس' },
    'form_label_name': { en: 'Course Name', ar: 'اسم الكورس' },
    'form_placeholder_name': { en: 'e.g. Angular Advanced Concepts', ar: 'مثال: مفاهيم أنجولار المتقدمة' },
    'form_label_instructor': { en: 'Instructor Name', ar: 'اسم المدرب' },
    'form_placeholder_instructor': { en: 'e.g. Ahmed Ali', ar: 'مثال: أحمد علي' },
    'form_label_category': { en: 'Category', ar: 'التصنيف' },
    'form_label_status': { en: 'Status', ar: 'الحالة' },
    'form_label_duration': { en: 'Duration (Hours)', ar: 'المدة (بالساعات)' },
    'form_placeholder_duration': { en: 'e.g. 24', ar: 'مثال: 24' },
    'form_label_price': { en: 'Price (EGP)', ar: 'السعر (بالجنيه المصري)' },
    'form_placeholder_price': { en: 'e.g. 1500', ar: 'مثال: 1500' },
    'form_label_description': { en: 'Description (Optional)', ar: 'الوصف (اختياري)' },
    'form_placeholder_description': { en: 'Enter course description details...', ar: 'أدخل تفاصيل وصف الكورس...' },
    
    // Validations
    'err_name_required': { en: 'Course Name is required.', ar: 'اسم الكورس مطلوب.' },
    'err_name_minlength': { en: 'Course Name must be at least 3 characters long.', ar: 'اسم الكورس يجب أن يكون 3 أحرف على الأقل.' },
    'err_instructor_required': { en: 'Instructor Name is required.', ar: 'اسم المدرب مطلوب.' },
    'err_category_required': { en: 'Category is required.', ar: 'التصنيف مطلوب.' },
    'err_status_required': { en: 'Status is required.', ar: 'الحالة مطلوبة.' },
    'err_duration_required': { en: 'Duration is required.', ar: 'المدة مطلوبة.' },
    'err_duration_min': { en: 'Duration must be greater than 0.', ar: 'المدة يجب أن تكون أكبر من 0.' },
    'err_price_required': { en: 'Price is required.', ar: 'السعر مطلوب.' },
    'err_price_min': { en: 'Price cannot be negative.', ar: 'لا يمكن أن يكون السعر سالباً.' },
    'err_desc_maxlength': { en: 'Description cannot exceed 500 characters.', ar: 'لا يمكن أن يتجاوز الوصف 500 حرف.' },
    
    // Toasts & Dialogs
    'toast_created': { en: 'Course created successfully!', ar: 'تم إنشاء الكورس بنجاح!' },
    'toast_updated': { en: 'Course updated successfully!', ar: 'تم تحديث الكورس بنجاح!' },
    'toast_deleted': { en: 'Course deleted successfully!', ar: 'تم حذف الكورس بنجاح!' },
    'toast_load_details_err': { en: 'Failed to load course details. Directing back...', ar: 'فشل في تحميل تفاصيل الكورس. جاري العودة للخلف...' },
    'toast_update_err': { en: 'Failed to update course. Try again.', ar: 'فشل في تحديث الكورس. أعد المحاولة.' },
    'toast_create_err': { en: 'Failed to create course. Try again.', ar: 'فشل في إنشاء الكورس. أعد المحاولة.' },
    'toast_delete_err': { en: 'Failed to delete course. Please try again.', ar: 'فشل في حذف الكورس. أعد المحاولة.' },
    'dialog_title': { en: 'Confirm Deletion', ar: 'تأكيد الحذف' },
    'dialog_message': { en: 'Are you sure you want to delete the course ', ar: 'هل أنت متأكد من رغبتك في حذف كورس ' },
    'dialog_subtext': { en: 'This action cannot be undone.', ar: 'هذا الإجراء لا يمكن التراجع عنه.' },
    'unit_hours': { en: 'hrs', ar: 'ساعة' },
    'items_per_page': { en: 'Items per page', ar: 'عدد العناصر في الصفحة' }
  };

  private readonly categoryTranslations: Record<string, { en: string; ar: string }> = {
    'Frontend': { en: 'Frontend', ar: 'واجهات أمامية' },
    'Backend': { en: 'Backend', ar: 'برمجة خلفية' },
    'Mobile': { en: 'Mobile', ar: 'تطبيقات موبايل' },
    'Design': { en: 'Design', ar: 'تصميم واجهات' },
    'DevOps': { en: 'DevOps', ar: 'إدارة عمليات التطوير' },
    'Data Science': { en: 'Data Science', ar: 'علوم بيانات' },
    'Other': { en: 'Other', ar: 'أخرى' }
  };

  private readonly statusTranslations: Record<string, { en: string; ar: string }> = {
    'Active': { en: 'Active', ar: 'نشط' },
    'Draft': { en: 'Draft', ar: 'مسودة' },
    'Archived': { en: 'Archived', ar: 'مؤرشف' }
  };

  // Seed course names translations
  private readonly courseNameTranslations: Record<string, { en: string; ar: string }> = {
    'Angular Fundamentals': { en: 'Angular Fundamentals', ar: 'أساسيات أنجولار' },
    'NestJS Advanced Patterns': { en: 'NestJS Advanced Patterns', ar: 'أنماط متقدمة في NestJS' },
    'UI/UX Design Essentials': { en: 'UI/UX Design Essentials', ar: 'أساسيات تصميم واجهات وتجربة المستخدم' },
    'Docker & Kubernetes for DevOps': { en: 'Docker & Kubernetes for DevOps', ar: 'دوكر وكوبيرنيتس للـ DevOps' },
    'React Native Mobile App Development': { en: 'React Native Mobile App Development', ar: 'تطوير تطبيقات الموبايل بـ React Native' },
    'Introduction to Python Data Science': { en: 'Introduction to Python Data Science', ar: 'مقدمة في علم البيانات بلغة بايثون' },
    'TypeScript Deep Dive': { en: 'TypeScript Deep Dive', ar: 'تعمق في لغة TypeScript' },
    'Go Programming Language (Golang)': { en: 'Go Programming Language (Golang)', ar: 'لغة برمجة جو (Golang)' },
    'TailwindCSS Premium Workflows': { en: 'TailwindCSS Premium Workflows', ar: 'سير عمل TailwindCSS المتميز' },
    'GitHub Actions CI/CD Pipelines': { en: 'GitHub Actions CI/CD Pipelines', ar: 'خطوط أنابيب CI/CD بـ GitHub Actions' }
  };

  // Seed instructor names translations
  private readonly instructorTranslations: Record<string, { en: string; ar: string }> = {
    'Ahmed Ali': { en: 'Ahmed Ali', ar: 'أحمد علي' },
    'Moustafa Sayed': { en: 'Moustafa Sayed', ar: 'مصطفى سيد' },
    'Sara Mahmoud': { en: 'Sara Mahmoud', ar: 'سارة محمود' },
    'Karim Hassan': { en: 'Karim Hassan', ar: 'كريم حسن' },
    'Amr Khaled': { en: 'Amr Khaled', ar: 'عمرو خالد' },
    'Nour Eldin': { en: 'Nour Eldin', ar: 'نور الدين' },
    'Tarek Kamal': { en: 'Tarek Kamal', ar: 'طارق كمال' },
    'Sherif Amr': { en: 'Sherif Amr', ar: 'شريف عمرو' },
    'Hassan Ezzat': { en: 'Hassan Ezzat', ar: 'حسن عزت' },
    'Dina Mansour': { en: 'Dina Mansour', ar: 'دينا منصور' }
  };

  // Seed course description translations
  private readonly descriptionTranslations: Record<string, { en: string; ar: string }> = {
    'Learn the absolute basics of Angular, including components, data binding, directives, and building standalone web applications from scratch.': {
      en: 'Learn the absolute basics of Angular, including components, data binding, directives, and building standalone web applications from scratch.',
      ar: 'تعلم الأساسيات المطلقة لـ Angular، بما في ذلك المكونات، وربط البيانات، والتوجيهات، وبناء تطبيقات ويب مستقلة من الصفر.'
    },
    'Master advanced architectural patterns in NestJS, including Microservices, ...': {
      en: 'Master advanced architectural patterns in NestJS, including Microservices, ...',
      ar: 'Master advanced architectural patterns in NestJS, including Microservices, ...'
    }, // Adding fallback matching directly
    'Master advanced architectural patterns in NestJS, including Microservices, CQRS, custom decorators, and database integrations.': {
      en: 'Master advanced architectural patterns in NestJS, including Microservices, CQRS, custom decorators, and database integrations.',
      ar: 'احترف الأنماط المعمارية المتقدمة في NestJS، بما في ذلك الخدمات المصغرة، وCQRS، والمزخرفات المخصصة، وتكامل قواعد البيانات.'
    },
    'An introductory guide to design thinking, low-fidelity wireframing, high-fidelity prototypes, and user testing with Figma.': {
      en: 'An introductory guide to design thinking, low-fidelity wireframing, high-fidelity prototypes, and user testing with Figma.',
      ar: 'دليل تمهيدي للتفكير التصميمي، والمخططات الهيكلية منخفضة الدقة، والنماذج الأولية عالية الدقة، واختبار المستخدمين باستخدام Figma.'
    },
    'Containerize your applications with Docker and orchestrate them at scale with Kubernetes clusters. Covers CI/CD integrations.': {
      en: 'Containerize your applications with Docker and orchestrate them at scale with Kubernetes clusters. Covers CI/CD integrations.',
      ar: 'ضع تطبيقاتك في حاويات باستخدام Docker وقم بإدارتها على نطاق واسع باستخدام مجموعات Kubernetes. يغطي تكاملات CI/CD.'
    },
    'Build high-performance cross-platform iOS and Android applications using React Native and Expo.': {
      en: 'Build high-performance cross-platform iOS and Android applications using React Native and Expo.',
      ar: 'قم ببناء تطبيقات عالية الأداء تعمل على مختلف المنصات لنظامي iOS و Android باستخدام React Native و Expo.'
    },
    'Start your journey in data science. Learn NumPy, Pandas, Matplotlib, and basic predictive models with Scikit-Learn.': {
      en: 'Start your journey in data science. Learn NumPy, Pandas, Matplotlib, and basic predictive models with Scikit-Learn.',
      ar: 'ابدأ رحلتك في علم البيانات. تعلم NumPy و Pandas و Matplotlib والنماذج التنبؤية الأساسية باستخدام Scikit-Learn.'
    },
    'Unlock the full power of TypeScript. Master generics, advanced types, utility types, and strict compilation checks.': {
      en: 'Unlock the full power of TypeScript. Master generics, advanced types, utility types, and strict compilation checks.',
      ar: 'افتح القوة الكاملة للغة TypeScript. احترف الأنواع العامة، والأنواع المتقدمة، والأنواع المساعدة، وفحوصات الترجمة الصارمة.'
    },
    'Fast-paced introduction to Go. Learn concurrency with goroutines, interfaces, packages, and building RESTful APIs.': {
      en: 'Fast-paced introduction to Go. Learn concurrency with goroutines, interfaces, packages, and building RESTful APIs.',
      ar: 'مقدمة سريعة للغة Go. تعلم البرمجة المتزامنة باستخدام goroutines، والواجهات، والحزم، وبناء واجهات برمجة تطبيقات RESTful.'
    },
    'Learn utility-first CSS techniques to build highly responsive, customized layouts without writing complex vanilla CSS stylesheet rules.': {
      en: 'Learn utility-first CSS techniques to build highly responsive, customized layouts without writing complex vanilla CSS stylesheet rules.',
      ar: 'تعلم تقنيات CSS المعتمدة على الفئات المساعدة لبناء تخطيطات مخصصة وسريعة الاستجابة دون كتابة قواعد CSS معقدة.'
    },
    'Automate your building, testing, and deployment workflows using GitHub Actions. Build custom actions and secrets orchestration.': {
      en: 'Automate your building, testing, and deployment workflows using GitHub Actions. Build custom actions and secrets orchestration.',
      ar: 'أتمت عمليات البناء والاختبار والنشر الخاصة بك باستخدام GitHub Actions. قم ببناء إجراءات مخصصة وإدارة الأسرار.'
    }
  };

  constructor() {
    // Automatically bind side-effects to switch HTML dir and lang properties dynamically
    effect(() => {
      const lang = this.currentLang();
      if (typeof document !== 'undefined') {
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        if (lang === 'ar') {
          document.body.classList.add('rtl-mode');
        } else {
          document.body.classList.remove('rtl-mode');
        }
      }
    });
  }

  /**
   * Get translated text value for static dictionary keys
   */
  get(key: string): string {
    return this.translations[key]?.[this.currentLang()] || key;
  }

  /**
   * Translate category dynamically based on language state
   */
  translateCategory(category: string): string {
    return this.categoryTranslations[category]?.[this.currentLang()] || category;
  }

  /**
   * Translate course status dynamically based on language state
   */
  translateStatus(status: string): string {
    return this.statusTranslations[status]?.[this.currentLang()] || status;
  }

  /**
   * Translate course name dynamically (for seed courses)
   */
  translateCourseName(name: string): string {
    return this.courseNameTranslations[name]?.[this.currentLang()] || name;
  }

  /**
   * Translate instructor name dynamically (for seed instructors)
   */
  translateInstructor(name: string): string {
    return this.instructorTranslations[name]?.[this.currentLang()] || name;
  }

  /**
   * Translate description dynamically (for seed descriptions)
   */
  translateDescription(desc: string): string {
    return this.descriptionTranslations[desc]?.[this.currentLang()] || desc;
  }

  /**
   * Toggle between english and arabic layout views
   */
  toggleLanguage(): void {
    this.currentLang.set(this.currentLang() === 'en' ? 'ar' : 'en');
  }
}
