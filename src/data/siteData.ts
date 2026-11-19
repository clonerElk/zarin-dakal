export interface TechnicalPhotoItem {
  id: string;
  src: string;
  componentTag: string;
  specCode: string;
  title: string;
  caption: string;
  technicalPoints: string[];
  section: 'hero' | 'guyed' | 'self_supporting' | 'services';
}

/**
 * All 14 real uploaded engineering photographs mapped accurately to their exact
 * structural sections. Strictly ZERO project names, client names, or locations.
 */
export const HERO_FEATURE_PHOTO: TechnicalPhotoItem = {
  id: 'self-supporting-icao-loaded',
  src: '/assets/aistudio/images_9e929c53.jfif',
  componentTag: 'دکل خودایستا مشبک',
  specCode: 'ICAO · 4-LEG · RF ARRAY',
  title: 'دکل خودایستا چهارپایه با رنگ‌آمیزی هوانوردی و بارگذاری کامل مخابراتی',
  caption:
    'سازه مشبک چهارپایه با پوشش اپوکسی استاندارد هوانوردی (نوارهای متناوب قرمز و سفید ICAO)، مجهز به آرایه چندطبقه آنتن‌های سکتور و دیش‌های مایکروویو کاوردار و پارابولیک با پایداری پیچشی بالا.',
  technicalPoints: [
    'رنگ‌آمیزی ۷ باند متناوب قرمز و سفید مطابق ضمیمه ۱۴ ایکائو',
    'تحمل بار هم‌زمان چندین دیش مایکروویو قطور و آنتن‌های سکتور',
    'طراحی‌شده مطابق آیین‌نامه TIA-222-G برای سرعت بادهای بحرانی',
  ],
  section: 'hero',
};

export const GUYED_SECTION_PHOTOS: TechnicalPhotoItem[] = [
  {
    id: 'guyed-multitier-elevation',
    src: '/assets/aistudio/images__6__bbef8ec6.jfif',
    componentTag: 'دکل مهاری سری G45',
    specCode: '120° MULTI-TIER GUYED',
    title: 'ساختار عمودی دکل مهاری با مهاربندی چندطبقه متقارن',
    caption:
      'نمایی از سازه مشبک مثلثی گالوانیزه گرم با مقطع یکنواخت و چندین ردیف سیم بکسل مهار فولادی. توزیع متقارن نیروی کششی در زوایای ۱۲۰ درجه، وزن فولاد مصرفی و فشار روی پایه مرکزی را به حداقل می‌رساند.',
    technicalPoints: [
      'مقطع مثلثی ثابت با مقاومت کمانشی بالا در ارتفاع‌های بلند',
      'انتقال بارهای جانبی باد از طریق سیم‌های مهار به بلوک‌های پیرامونی',
      'بهینه برای استقرار روی سازه پشت‌بام و سایت‌های ارتباطی باز',
    ],
    section: 'guyed',
  },
  {
    id: 'guyed-triangular-baseplate',
    src: '/assets/aistudio/images__10__9e7feb60.jfif',
    componentTag: 'بیس‌پلیت مثلثی و پایه',
    specCode: 'BASE PLATE · ANCHOR BOLTS',
    title: 'اتصال بیس‌پلیت مثلثی گالوانیزه و سکشن اول روی فونداسیون بتنی',
    caption:
      'صفحه پایه مثلثی تمام‌گالوانیزه متصل به انکربولت‌های فونداسیون بتنی با سه سوکت لوله‌ای جوش‌کاری‌شده و پیچ‌های مهاری که سکشن اول دکل مهاری و میلگردهای زیگزاگ پیوسته را به شکل کاملاً صلب در جای خود قفل می‌کند.',
    technicalPoints: [
      'ورق فولادی ضخیم گالوانیزه گرم مقاوم در برابر رطوبت و خوردگی',
      'سه سوکت تراز‌شده با پیچ و مهره برای مونتاژ دقیق پایه‌های لوله‌ای',
      'انتقال یکنواخت بار محوری عمودی به هسته فونداسیون بتنی',
    ],
    section: 'guyed',
  },
  {
    id: 'guyed-component-anatomy',
    src: '/assets/aistudio/images__8__e0d4e35b.jfif',
    componentTag: 'آناتومی متعلقات مهاری',
    specCode: 'FULL HARDWARE KIT',
    title: 'مجموعه استاندارد قطعات، اتصالات و متعلقات دکل مهاری',
    caption:
      'کیت مهندسی کامل دکل مهاری شامل سکشن‌های مشبک مثلثی، کمربند مهار، صفحه بادبزنی توزیع نیرو، بست‌های سیم بکسل گالوانیزه، میل‌مهار انکربولت و بیس‌پلیت مثلثی با دقت ابعادی کارگاهی.',
    technicalPoints: [
      'کمربند مهار مثلثی جهت مهاربندی بدون تغییر شکل لوله‌های اصلی',
      'بست‌های بکسل گالوانیزه گرم و میل‌مهارهای مقاوم در برابر برش',
      'تولید یکپارچه تمامی اجزا با تلرانس دقیق جهت مونتاژ سریع در ارتفاع',
    ],
    section: 'guyed',
  },
  {
    id: 'guyed-production-sections',
    src: '/assets/aistudio/images__13__31b7ae33.jfif',
    componentTag: 'سکشن‌های مشبک G35 / G45',
    specCode: '3.0m MODULAR LATTICE',
    title: 'تولید انبوه سکشن‌های ۳ متری دکل مهاری با میلگرد زیگزاگ پیوسته',
    caption:
      'سکشن‌های ۳ متری دکل مهاری ساخته‌شده از سه لوله فولادی بدون درز و شبکه میلگرد زیگزاگ یکپارچه (بندینگ پیوسته) با سوراخ‌کاری دقیق انتهای پایه‌ها برای اتصال نر و مادگی بدون لقی.',
    technicalPoints: [
      'جوشکاری پیوسته CO2 و کنترل ابعادی روی فیکسچرهای دقیق کارگاهی',
      'پوشش گالوانیزه گرم غوطه‌وری داخل و خارج لوله‌ها',
      'قابلیت حمل آسان و مونتاژ مدولار تا ارتفاع ۶۶ متر',
    ],
    section: 'guyed',
  },
];

export const SELF_SUPPORTING_SECTION_PHOTOS: TechnicalPhotoItem[] = [
  {
    id: 'ss4-icao-striped',
    src: '/assets/aistudio/images__1__95882128.jfif',
    componentTag: 'دکل خودایستا ۴ پایه',
    specCode: 'SS-4L · ICAO PAINTING',
    title: 'دکل خودایستا چهارپایه مشبک با نواربندی هوانوردی و نردبان مرکزی',
    caption:
      'سازه مخروطی چهارپایه با اتصالات پیچ‌ومهره‌ای گاست‌پلیت و مهاربندی ضربدری سنگین. مسیر اختصاصی نردبان دسترسی و سینی عبور کابل‌های فیدر RF در محور مرکزی سازه تعبیه شده است.',
    technicalPoints: [
      'صلبیت پیچشی حداکثری بدون نیاز به سیم مهار و فضای پیرامونی',
      'رنگ‌آمیزی صنعتی دو جزئی قرمز و سفید مقاوم در برابر اشعه UV',
      'مسیر ایمن صعود و عبور منظم کابل‌های مخابراتی تا رأس دکل',
    ],
    section: 'self_supporting',
  },
  {
    id: 'ss3-tubular-flange',
    src: '/assets/aistudio/images__2__faf4828c.jfif',
    componentTag: 'دکل خودایستا ۳ پایه لوله‌ای',
    specCode: 'SS-3L · FLANGE JOINTS',
    title: 'دکل خودایستا سه‌پایه لوله‌ای با اتصالات فلنجی سنگین',
    caption:
      'سازه خودایستای سه‌پایه ساخته‌شده از لوله‌های فولادی ضخیم با فلنج‌های دایره‌ای چندپیچ و پله‌های افقی تمام‌گالوانیزه. سطح مقطع دایره‌ای لوله‌ها نیروی درگ باد را نسبت به مقاطع نبشی به شکل چشمگیری کاهش می‌دهد.',
    technicalPoints: [
      'ضریب نیروی باد کمتر به دلیل آیرودینامیک مقاطع لوله‌ای',
      'فلنج‌های تراش‌خورده با پیچ‌های پرمقاومت گرید ۸.۸ و ۱۰.۹',
      'نردبان عمودی یکپارچه به همراه ریل ایمنی کار در ارتفاع',
    ],
    section: 'self_supporting',
  },
  {
    id: 'ss-heavy-microwave-array',
    src: '/assets/aistudio/images__4__6f2e14cb.jfif',
    componentTag: 'ظرفیت بارگذاری RF',
    specCode: 'HIGH-LOAD MICROWAVE',
    title: 'پلتفرم سرویس و استقرار دیش‌های مایکروویو سنگین روی دکل خودایستا',
    caption:
      'نمایی نزدیک از بخش فوقانی دکل خودایستا با پلتفرم گریتینگ گالوانیزه و پایه‌های اختصاصی نصب دیش‌های مایکروویو قطور کاوردار؛ طراحی‌شده جهت حفظ پایداری زاویه لینک رادیویی در تندبادهای شدید.',
    technicalPoints: [
      'انحراف زاویه‌ای ناچیز (Twist & Sway) برای لینک‌های مایکروویو حساس',
      'پلتفرم گریتینگ مشبک جهت سرویس ایمن تجهیزات توسط تکنسین‌ها',
      'پایپ‌مانت‌ها و براکت‌های تقویت‌شده برای دیش‌های با قطر بالا',
    ],
    section: 'self_supporting',
  },
  {
    id: 'ss4-galvanized-security',
    src: '/assets/aistudio/images__5__a6ed4722.jfif',
    componentTag: 'سازه تمام‌گالوانیزه و ایمنی',
    specCode: 'ASTM A123 · ANTI-CLIMB',
    title: 'دکل خودایستا چهارپایه تمام‌گالوانیزه با نردبان کابل و حفاظت پایه',
    caption:
      'اسکلت مشبک چهارپایه تمام‌گالوانیزه با مهاربندی K-Brace و X-Brace، سینی عمودی کابل‌کشی و حصار ضدصعود در بخش پایینی سازه جهت محافظت فیزیکی از دسترسی غیرمجاز به تجهیزات ارتفاعی.',
    technicalPoints: [
      'پوشش یکنواخت گالوانیزه گرم با عمر مفید بیش از ۲۵ سال',
      'نردبان کابل مجزا جهت جلوگیری از آسیب مکانیکی به فیدرها',
      'حصار حفاظتی و سیستم ضدصعود استاندارد در تراز پایه دکل',
    ],
    section: 'self_supporting',
  },
];

export interface ServiceShowcaseItem {
  id: string;
  index: string;
  title: string;
  standard: string;
  description: string;
  deliverables: string[];
  span: string;
  photo: TechnicalPhotoItem;
}

export const ENGINEERING_SERVICES: ServiceShowcaseItem[] = [
  {
    id: 'design-foundation-base',
    index: '۰۱',
    title: 'طراحی سازه، محاسبات فونداسیون و بیس‌پلیت',
    standard: 'TIA-222-G · مبحث ششم مقررات ملی',
    description:
      'تحلیل دینامیکی باد، بار یخ، زلزله و واژگونی به همراه طراحی دقیق فونداسیون مسلح، سیستم ارتینگ زیر ۲ اهم و ساخت بیس‌پلیت‌های گالوانیزه با سوکت‌های شیب‌دار جهت توزیع ایمن نیروها.',
    deliverables: ['دفترچه محاسبات سازه', 'طراحی فونداسیون و انکربولت', 'بیس‌پلیت ۳ و ۴ پایه گالوانیزه'],
    span: 'lg:col-span-6',
    photo: {
      id: 'service-4leg-baseplate',
      src: '/assets/aistudio/images__12__91d1f77f.jfif',
      componentTag: 'بیس‌پلیت ۴ پایه گالوانیزه',
      specCode: 'STRUCTURAL BASE PLATE',
      title: 'بیس‌پلیت مربعی سنگین با چهار سوکت پایه‌گیر گالوانیزه گرم',
      caption:
        'صفحه پایه فولادی گالوانیزه مستقر روی سکوی بتنی با چهار سوکت لوله‌ای زاویه‌دار و سوراخ‌کاری دقیق پیچ‌ومهره، مسئول انتقال بارهای فشاری و کششی سازه به فونداسیون بدون تمرکز تنش.',
      technicalPoints: [
        'جوشکاری نفوذی کامل سوکت‌ها به ورق پایه پیش از گالوانیزه گرم',
        'هم‌سطح‌سازی دقیق روی فونداسیون بتنی جهت شاقول بودن محور دکل',
        'مقاومت بالا در برابر خوردگی در تماس با رطوبت محیطی',
      ],
      section: 'services',
    },
  },
  {
    id: 'fabrication-galvanizing',
    index: '۰۲',
    title: 'تولید کارگاهی و گالوانیزه گرم استاندارد',
    standard: 'ASTM A123 · ISO 1461',
    description:
      'تولید مستقیم سکشن‌های دکل مهاری (G35، G45، G65) و قطعات دکل‌های خودایستا با جوشکاری صنعتی CO2 و غوطه‌وری کامل در وان مذاب روی (گالوانیزه گرم) جهت دوام بیش از ۲۵ سال در اقلیم‌های مرطوب و صنعتی.',
    deliverables: ['کنترل ضخامت پوشش روی ۸۵ میکرون', 'جوشکاری روی جیگ و فیکسچر', 'رنگ‌آمیزی اپوکسی ICAO'],
    span: 'lg:col-span-6',
    photo: {
      id: 'service-galvanized-yard',
      src: '/assets/aistudio/images__11__98954a7f.jfif',
      componentTag: 'تولید و گالوانیزه گرم',
      specCode: 'HOT-DIP GALVANIZED',
      title: 'سکشن‌های مشبک دکل پس از فرآیند گالوانیزه گرم غوطه‌وری',
      caption:
        'مجموعه سکشن‌های تولیدشده و گالوانیزه گرم با پوشش یکنواخت روی در سطح داخلی و خارجی لوله‌ها و میلگردهای زیگزاگ؛ آماده بارگیری و مونتاژ سریع بدون نیاز به عملیات برش‌کاری در محل نصب.',
      technicalPoints: [
        'پوشش کامل سطوح داخلی لوله‌ها و درزهای جوش در حمام مذاب روی',
        'یکنواختی ابعادی تمامی سکشن‌ها برای تعویض‌پذیری کامل قطعات',
        'مقاومت ممتاز در برابر زنگ‌زدگی در مناطق ساحلی و بارانی',
      ],
      section: 'services',
    },
  },
  {
    id: 'heavy-erection-crane',
    index: '۰۳',
    title: 'نصب، برپایی سازه‌های سنگین و مونتاژ ارتفاعی',
    standard: 'پروتکل ایمنی HSE · نصب با جرثقیل و دکل‌بندی',
    description:
      'اجرای کامل عملیات برپایی دکل‌های خودایستا و مهاری با بهره‌گیری از جرثقیل‌های تلسکوپی و تیم‌های متخصص دکل‌بند، با رعایت دقیق گشتاور بستن پیچ‌ها و تراز عمودی در هر طبقه.',
    deliverables: ['نصب با جرثقیل تلسکوپی', 'مونتاژ دستی در نقاط صعب‌العبور', 'کنترل گشتاور اتصالات'],
    span: 'lg:col-span-4',
    photo: {
      id: 'service-crane-erection',
      src: '/assets/aistudio/images__3__fcd02ba0.jfif',
      componentTag: 'برپایی سازه با جرثقیل',
      specCode: 'HEAVY CRANE ERECTION',
      title: 'عملیات جایگذاری سکشن فوقانی دکل خودایستا توسط جرثقیل',
      caption:
        'باربرداری کنترل‌شده سکشن مشبک مونتاژشده روی زمین و هدایت دقیق آن بر روی تراز نصب دکل خودایستا با استفاده از جرثقیل تلسکوپی سنگین، جهت افزایش سرعت اجرا و ایمنی حداکثری عملیات.',
      technicalPoints: [
        'پیش‌مونتاژ دقیق سکشن‌ها روی زمین برای کاهش زمان کار در ارتفاع',
        'استفاده از اسلینگ‌ها و تجهیزات باربرداری دارای گواهی سلامت',
        'هم‌راستاسازی فوری فلنج‌ها و قفل کردن پیچ‌های سازه‌ای',
      ],
      section: 'services',
    },
  },
  {
    id: 'rigging-turnbuckles',
    index: '۰۴',
    title: 'تامین اتصالات کششی، مهاربندی و رگلاژ تخصصی',
    standard: 'TIA-222 Tension Spec · گرید ۸.۸',
    description:
      'استفاده از مهارکش‌های فورج‌شده استاندارد، صفحات بادبزنی توزیع نیرو و پیچ‌ومهره‌های گالوانیزه پرمقاومت همراه با رگلاژ کششی سیم مهارها و شاقول‌سازی دقیق محور دکل.',
    deliverables: ['مهارکش و صفحه مهار استاندارد', 'تنظیم کشش با تنش‌سنج', 'شاقول‌سازی دقیق محوری'],
    span: 'lg:col-span-4',
    photo: {
      id: 'service-turnbuckle-plates',
      src: '/assets/aistudio/images__9__89efc875.jfif',
      componentTag: 'مهارکش و صفحه مهار',
      specCode: 'FORGED TURNBUCKLE KIT',
      title: 'مهارکش فورج‌شده، صفحات بادبزنی توزیع نیرو و پیچ‌ومهره گالوانیزه',
      caption:
        'قطعات کلیدی سیستم مهاربندی شامل مهارکش چشمی فورج‌شده جهت رگلاژ دقیق کشش سیم بکسل، صفحات بادبزنی چندسوراخ برای توزیع متوازن بار طبقات مهار و مجموعه پیچ، مهره و واشر فنری گالوانیزه.',
      technicalPoints: [
        'رزوه‌های دقیق مهارکش جهت تنظیم میلی‌متری شاقول دکل',
        'صفحات توزیع نیرو با ضخامت مهندسی برای جلوگیری از له‌شدگی سوراخ‌ها',
        'واشرهای فنری قفل‌کننده جهت جلوگیری از بازشدن پیچ‌ها زیر ارتعاش باد',
      ],
      section: 'services',
    },
  },
  {
    id: 'earthing-lightning-pm',
    index: '۰۵',
    title: 'سیستم ارتینگ، صاعقه‌گیر و سرویس نگهداری دوره‌ای (PM)',
    standard: 'IEC 62305 · مقاومت زیر ۲ اهم',
    description:
      'اجرای چاه ارت استاندارد، نصب صاعقه‌گیر و چراغ چشمک‌زن هوانوردی LED، نصب تجهیزات ارتفاعی و انجام بازرسی‌های ادواری شامل آچارکشی، کنترل کشش سیم مهار و پایش سلامت پوشش سازه.',
    deliverables: ['اجرای چاه ارت زیر ۲ اهم', 'نصب صاعقه‌گیر و چراغ دکل', 'آچارکشی و رگلاژ دوره‌ای PM'],
    span: 'lg:col-span-4',
    photo: {
      id: 'service-apex-rigger',
      src: '/assets/aistudio/images__7__70baefdb.jfif',
      componentTag: 'تجهیز ارتفاعی و سرویس PM',
      specCode: 'APEX RIGGING & HSE',
      title: 'عملیات نصب تجهیزات، صاعقه‌گیر و بازرسی ارتفاعی در رأس دکل',
      caption:
        'تکنسین دکل‌بند مجهز به هارنس ایمنی در بالاترین نقطه دکل مهاری در حال نصب تجهیزات روشنایی، بررسی اتصالات سیم مهار طبقه فوقانی، صاعقه‌گیر و چراغ اعلام خطر هوانوردی.',
      technicalPoints: [
        'تجهیز کامل به سیستم حفاظت سقوط و ایمنی کار در ارتفاع',
        'بازرسی ادواری سیم مهارها، بست‌ها، چراغ دکل و هم‌بندی ارت',
        'نصب و تنظیم دقیق پروژکتورها، آنتن‌ها و دیش‌های مخابراتی',
      ],
      section: 'services',
    },
  },
];

export const ALL_LIGHTBOX_PHOTOS: TechnicalPhotoItem[] = [
  HERO_FEATURE_PHOTO,
  ...GUYED_SECTION_PHOTOS,
  ...SELF_SUPPORTING_SECTION_PHOTOS,
  ...ENGINEERING_SERVICES.map((s) => s.photo),
];

export interface ComparisonMetric {
  label: string;
  guyedValue: string;
  self3Value: string;
  self4Value: string;
  guyedScore: number;
  self3Score: number;
  self4Score: number;
}

export const TOWER_COMPARISON_METRICS: ComparisonMetric[] = [
  {
    label: 'حداکثر ارتفاع اقتصادی',
    guyedValue: '۱۲ تا ۶۶ متر',
    self3Value: '۱۸ تا ۶۰ متر',
    self4Value: '۲۴ تا ۹۰ متر',
    guyedScore: 76,
    self3Score: 70,
    self4Score: 98,
  },
  {
    label: 'بهینگی فضای اشغالی (کم‌جایی)',
    guyedValue: 'شعاع مهار ۳۰٪ تا ۵۰٪ ارتفاع',
    self3Value: 'فونداسیون مثلثی فشرده',
    self4Value: 'فونداسیون مربعی بدون مهار',
    guyedScore: 42,
    self3Score: 92,
    self4Score: 84,
  },
  {
    label: 'ظرفیت بارگذاری آنتن و دیش',
    guyedValue: 'سبک تا نیمه‌سنگین (G35-G65)',
    self3Value: 'نیمه‌سنگین تا سنگین',
    self4Value: 'فوق‌سنگین (سایت‌های مادر)',
    guyedScore: 62,
    self3Score: 84,
    self4Score: 98,
  },
  {
    label: 'مقاومت در برابر باد و پیچش',
    guyedValue: 'تا ۱۶۰ کیلومتر بر ساعت',
    self3Value: 'تا ۱۷۵ کیلومتر بر ساعت',
    self4Value: 'تا ۲۰۰ کیلومتر بر ساعت',
    guyedScore: 78,
    self3Score: 88,
    self4Score: 98,
  },
  {
    label: 'صرفه اقتصادی و سرعت اجرا',
    guyedValue: 'بسیار اقتصادی و سریع',
    self3Value: 'بهینه در فضای محدود شهری',
    self4Value: 'سازه سنگین بلندمدت',
    guyedScore: 96,
    self3Score: 72,
    self4Score: 58,
  },
];
