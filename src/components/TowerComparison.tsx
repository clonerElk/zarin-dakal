import { useState } from 'react';
import { Maximize2, PhoneCall } from 'lucide-react';
import {
  GUYED_SECTION_PHOTOS,
  SELF_SUPPORTING_SECTION_PHOTOS,
  TOWER_COMPARISON_METRICS,
  type TechnicalPhotoItem,
} from '../data/siteData';
import { COMPANY_PHONE, COMPANY_PHONE_HREF, type TowerType } from '../utils/engineeringCalc';
import { ComparisonCanvas } from './ComparisonCanvas';

interface TowerProfile {
  id: TowerType;
  label: string;
  code: string;
  headline: string;
  summary: string;
  footprintLabel: string;
  maxHeight: string;
  windRating: string;
  bestFor: string[];
}

const TOWER_PROFILES: TowerProfile[] = [
  {
    id: 'guyed',
    label: 'دکل مهاری (G35 / G45 / G65)',
    code: 'GUYED LATTICE',
    headline: 'سبک، سریع و اقتصادی با پایداری کششی سیم مهار',
    summary:
      'سازه مشبک مثلثی با مقطع یکنواخت که توسط ۳ ردیف سیم بکسل فولادی در زوایای ۱۲۰ درجه مهار می‌شود. بهترین گزینه برای پشت‌بام‌ها، شبکه‌های وایرلس و سایت‌های مخابراتی نیازمند وزن سازه کمتر و اجرای سریع.',
    footprintLabel: 'شعاع مهار ۳۰٪ تا ۵۰٪ ارتفاع',
    maxHeight: '66.0m',
    windRating: '160 km/h',
    bestFor: [
      'سایت‌های پشت‌بامی با محدودیت بار مرده سازه',
      'لینک‌های رادیویی و اینترنت بی‌سیم سازمانی',
      'نصب مدولار سریع با کمترین حجم بتن‌ریزی و مصرف فولاد',
    ],
  },
  {
    id: 'self_supporting_3',
    label: 'خودایستا ۳ پایه',
    code: 'SELF-SUPPORT 3L',
    headline: 'استحکام مستقل بدون نیاز به سیم مهار و فضای پیرامونی',
    summary:
      'سازه مخروطی مثلثی خودایستا با پایه‌های لوله‌ای یا نبشی و اتصالات فلنجی دقیق. تمام نیروهای جانبی باد از طریق فونداسیون مرکزی به زمین منتقل می‌شود و نیازی به فضای مهاربندی اطراف دکل ندارد.',
    footprintLabel: 'پایه مثلثی فشرده (بدون سیم مهار)',
    maxHeight: '60.0m',
    windRating: '175 km/h',
    bestFor: [
      'سایت‌های شهری پرتراکم با زمین محدود',
      'ایستگاه‌های BTS موبایل و مخابرات شهری',
      'محوطه‌های صنعتی با تردد ماشین‌آلات پیرامون دکل',
    ],
  },
  {
    id: 'self_supporting_4',
    label: 'خودایستا ۴ پایه',
    code: 'SELF-SUPPORT 4L',
    headline: 'حداکثر ظرفیت بارگذاری آنتن و مقاومت در مناطق بحرانی',
    summary:
      'سازه مشبک چهارپایه سنگین با صلبیت پیچشی بالا برای حمل هم‌زمان چندین دیش مایکروویو قطور، پلتفرم‌های سرویس گریتینگ و پایداری بلندمدت در ارتفاعات کوهستانی با بار یخ و باد شدید.',
    footprintLabel: 'فونداسیون مربعی گسترده',
    maxHeight: '90.0m',
    windRating: '200 km/h',
    bestFor: [
      'سایت‌های مادر مخابراتی و ایستگاه‌های رادیویی پرظرفیت',
      'مناطق بادخیز و کوهستانی تا سرعت ۲۰۰ کیلومتر بر ساعت',
      'سایت‌های صنعتی سنگین نیازمند پلتفرم سرویس و حفاظت پایه',
    ],
  },
];

interface PhotoShowcaseGridProps {
  heading: string;
  code: string;
  subtitle: string;
  photos: TechnicalPhotoItem[];
  highlighted: boolean;
  onOpenLightbox: (id: string) => void;
}

function TowerPhotoStrip({
  heading,
  code,
  subtitle,
  photos,
  highlighted,
  onOpenLightbox,
}: PhotoShowcaseGridProps) {
  return (
    <div
      className={`rounded-md border p-5 sm:p-6 transition-colors ${
        highlighted
          ? 'bg-[#0B1220] border-[#00E5FF]/55'
          : 'bg-[#080E1A] border-slate-800/90'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 mb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 text-xs mb-1.5">
            <span className="font-telemetry text-[#00E5FF] font-semibold">{code}</span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-slate-400">جزئیات واقعی ساخت و اجرا</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">{heading}</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {photos.map((photo) => (
          <article
            key={photo.id}
            className="group flex flex-col rounded-md overflow-hidden border border-slate-700/55 hover:border-[#00E5FF]/65 bg-[#060B15] transition-colors"
          >
            <button
              type="button"
              onClick={() => onOpenLightbox(photo.id)}
              data-testid={`photo-card-${photo.id}`}
              className="relative aspect-[4/3] w-full overflow-hidden bg-[#050911] cursor-pointer text-right"
            >
              <img
                src={photo.src}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#050911]/90 via-transparent to-transparent"
              />
              <span className="absolute top-2.5 left-2.5 inline-flex items-center justify-center w-8 h-8 rounded bg-[#050911]/80 border border-slate-600/60 text-slate-200 group-hover:text-[#00E5FF] group-hover:border-[#00E5FF]/70 transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </span>
              <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-white truncate">{photo.componentTag}</span>
                <span className="font-telemetry text-[#00E5FF] shrink-0">{photo.specCode.split('·')[0].trim()}</span>
              </div>
            </button>

            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <h4 className="text-sm font-bold text-white leading-6">{photo.title}</h4>
                <p className="text-xs text-slate-300 leading-6">{photo.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => onOpenLightbox(photo.id)}
                className="self-start text-xs font-semibold text-[#00E5FF] hover:text-white transition-colors cursor-pointer"
              >
                مشاهده جزئیات فنی تصویر +
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

interface TowerComparisonProps {
  onOpenLightbox: (photoId: string) => void;
}

export function TowerComparison({ onOpenLightbox }: TowerComparisonProps) {
  const [selected, setSelected] = useState<TowerType>('guyed');
  const activeProfile = TOWER_PROFILES.find((p) => p.id === selected) ?? TOWER_PROFILES[0];

  return (
    <section
      id="comparison"
      className="scroll-mt-16 py-20 sm:py-28 bg-[#050911] border-t border-slate-800/80"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header + Segmented Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs sm:text-sm font-medium text-[#00E5FF]">
              سیستم‌های تخصصی سازه مخابراتی
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              دکل‌های مهاری (G35 / G45 / G65) و دکل‌های خودایستا (۳ پایه و ۴ پایه)
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-7">
              مدل سه‌بعدی و شاخص‌های مهندسی هر تیپ سازه را مقایسه کنید و جزئیات واقعی قطعات، اتصالات و
              ساختارهای اجراشده در هر دسته را بررسی نمایید.
            </p>
          </div>

          {/* Interactive Segmented Switcher */}
          <div
            role="tablist"
            aria-label="انتخاب نوع دکل برای مقایسه"
            className="inline-flex flex-wrap gap-1.5 p-1.5 bg-[#0B1220] border border-slate-700/60 rounded-md self-start"
          >
            {TOWER_PROFILES.map((profile) => {
              const isActive = profile.id === selected;
              return (
                <button
                  key={profile.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelected(profile.id)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#E63946] text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  {profile.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Split Grid: 3D Live Model + Technical Comparative Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive 3D Viewport Panel */}
          <div className="lg:col-span-6 flex flex-col border border-slate-700/55 rounded-md overflow-hidden bg-[#080E1A]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#0B1220]">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-telemetry text-[#00E5FF] font-semibold">{activeProfile.code}</span>
                <span aria-hidden="true" className="text-slate-600">/</span>
                <span className="text-slate-300">برای چرخش سازه، روی مدل بکشید</span>
              </div>
              <span className="font-telemetry text-xs text-slate-400">3D CAD PREVIEW</span>
            </div>

            <ComparisonCanvas activeType={selected} />

            {/* Profile Specs Strip below 3D Canvas */}
            <div className="p-5 sm:p-6 border-t border-slate-800 bg-[#0B1220] space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{activeProfile.headline}</h3>
                <p className="mt-2 text-sm text-slate-300 leading-7">{activeProfile.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block">حداکثر ارتفاع</span>
                  <span className="font-telemetry text-base font-bold text-white mt-0.5 block">
                    {activeProfile.maxHeight}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">طراحی باد</span>
                  <span className="font-telemetry text-base font-bold text-[#00E5FF] mt-0.5 block">
                    {activeProfile.windRating}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">اشغال فضا</span>
                  <span className="text-xs font-semibold text-slate-200 mt-1 block">
                    {activeProfile.footprintLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Matrix & Direct Consultation Action */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <div className="border border-slate-700/55 rounded-md bg-[#0B1220] p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">شاخص‌های مهندسی مقایسه‌ای</h3>
                <span className="font-telemetry text-xs text-slate-400">G-SERIES vs SS-SERIES</span>
              </div>

              <div className="space-y-4">
                {TOWER_COMPARISON_METRICS.map((row) => {
                  const score =
                    selected === 'guyed'
                      ? row.guyedScore
                      : selected === 'self_supporting_3'
                        ? row.self3Score
                        : row.self4Score;
                  const value =
                    selected === 'guyed'
                      ? row.guyedValue
                      : selected === 'self_supporting_3'
                        ? row.self3Value
                        : row.self4Value;

                  return (
                    <div key={row.label} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                        <span className="text-slate-300 font-medium">{row.label}</span>
                        <span className="text-white font-semibold text-left">{value}</span>
                      </div>
                      <div className="h-2 w-full bg-[#050911] rounded overflow-hidden border border-slate-800">
                        <div
                          className="h-full bg-gradient-to-l from-[#00E5FF] to-[#E63946] transition-transform duration-300 origin-right"
                          style={{ transform: `scaleX(${score / 100})` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Best Use Cases + Direct Click-to-Call Engineering Consultation */}
            <div className="border border-slate-700/55 rounded-md bg-[#0B1220] p-5 sm:p-6 space-y-4">
              <h3 className="text-base font-bold text-white">کاربردهای پیشنهادی {activeProfile.label}</h3>
              <ul className="space-y-2.5 text-sm text-slate-300">
                {activeProfile.bestFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span aria-hidden="true" className="font-telemetry text-[#00E5FF] mt-0.5">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  برای انتخاب دقیق تیپ سازه متناسب با شرایط باد و فضای سایت تماس بگیرید:
                </span>
                <a
                  href={COMPANY_PHONE_HREF}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-[#050911] bg-[#00E5FF] hover:bg-[#38ecff] rounded transition-colors whitespace-nowrap shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>مشاوره تخصصی</span>
                  <span className="font-telemetry">{COMPANY_PHONE}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Real Uploaded Photographs Mapped Strictly to Guyed & Self-Supporting Systems */}
        <div className="space-y-8 pt-2">
          <TowerPhotoStrip
            heading="ساختار و قطعات واقعی دکل‌های مهاری (G35 / G45 / G65)"
            code="GUYED SYSTEMS · 4 SPEC VIEWS"
            subtitle="سکشن‌های ۳ متری مشبک مثلثی، بیس‌پلیت گالوانیزه، کیت کامل متعلقات و مهاربندی چندطبقه ۱۲۰ درجه."
            photos={GUYED_SECTION_PHOTOS}
            highlighted={selected === 'guyed'}
            onOpenLightbox={onOpenLightbox}
          />

          <TowerPhotoStrip
            heading="ساختار و جزئیات واقعی دکل‌های خودایستا (۳ پایه و ۴ پایه)"
            code="SELF-SUPPORTING · 4 SPEC VIEWS"
            subtitle="سازه‌های مشبک چهارپایه و سه‌پایه لوله‌ای، فلنج‌های چندپیچ، پلتفرم مایکروویو و سیستم حفاظت پایه."
            photos={SELF_SUPPORTING_SECTION_PHOTOS}
            highlighted={selected !== 'guyed'}
            onOpenLightbox={onOpenLightbox}
          />
        </div>
      </div>
    </section>
  );
}
