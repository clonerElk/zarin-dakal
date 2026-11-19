import { ChevronDown, Maximize2, PhoneCall } from 'lucide-react';
import { HERO_FEATURE_PHOTO } from '../data/siteData';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_HREF } from '../utils/engineeringCalc';
import { HeroCanvas } from './HeroCanvas';

interface HeroSectionProps {
  onStartAssembly: () => void;
  onOpenLightbox: (photoId: string) => void;
}

export function HeroSection({ onStartAssembly, onOpenLightbox }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen pt-24 pb-16 flex flex-col justify-center overflow-hidden blueprint-grid"
    >
      {/* Subtle 3D wireframe-to-solid tower backdrop */}
      <HeroCanvas />

      {/* Atmospheric vignette ensuring 4.5:1+ contrast behind Persian copy */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-l from-[#050911] via-[#050911]/82 to-[#050911]/35 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050911] to-transparent pointer-events-none"
      />

      <div className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Primary Right Column (RTL): Brand Headline, Engineering Copy, CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#00E5FF] font-medium">
              <span>{COMPANY_NAME}</span>
              <span aria-hidden="true" className="text-slate-600">/</span>
              <span className="font-telemetry text-slate-300">TIA-222-G · ASTM A123 · ICAO</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-black text-white leading-[1.22] tracking-tight max-w-2xl">
              طراحی، ساخت و اجرای تخصصی دکل‌های مخابراتی
              <span className="block mt-2 text-[#CBD5E1] font-bold">
                مهاری <span className="font-telemetry text-[#00E5FF] text-2xl sm:text-4xl">G35–G65</span> و خودایستا
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-8 max-w-xl">
              مهندسی دقیق سازه‌های مخابراتی از تحلیل بار باد و اجرای فونداسیون مسلح تا تولید کارگاهی
              سکشن‌های گالوانیزه گرم، مهاربندی کالیبره‌شده، چاه ارت زیر ۲ اهم، صاعقه‌گیر و نصب ایمن در ارتفاع.
            </p>

            {/* Primary & Secondary CTAs (Strictly NO Quote/Price Language) */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStartAssembly}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-[#E63946] hover:bg-[#cf2c39] rounded transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
              >
                <span>مشاهده مراحل نصب سه‌بعدی</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <a
                href={COMPANY_PHONE_HREF}
                data-testid="hero-phone-cta"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-100 bg-[#0B1220] hover:bg-[#131F36] border border-slate-600/65 hover:border-[#00E5FF]/70 rounded transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
              >
                <PhoneCall className="w-4 h-4 text-[#00E5FF]" />
                <span>تماس و مشاوره مهندسی</span>
                <span className="font-telemetry text-[#00E5FF]">{COMPANY_PHONE}</span>
              </a>
            </div>

            {/* Unboxed Engineering Proof Metrics */}
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 mt-4 border-t border-slate-800/90">
              <div>
                <dt className="text-xs text-slate-400">حداکثر ارتفاع اجرایی</dt>
                <dd className="mt-1 font-telemetry text-xl sm:text-2xl font-bold text-white">90.0m</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">مقاومت طراحی باد</dt>
                <dd className="mt-1 font-telemetry text-xl sm:text-2xl font-bold text-[#00E5FF]">200 km/h</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">ضخامت گالوانیزه گرم</dt>
                <dd className="mt-1 font-telemetry text-xl sm:text-2xl font-bold text-white">85 μm</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">مقاومت سیستم ارت</dt>
                <dd className="mt-1 font-telemetry text-xl sm:text-2xl font-bold text-[#FFB703]">&lt; 2.0 Ω</dd>
              </div>
            </dl>
          </div>

          {/* Left Column (RTL): Real Uploaded ICAO Loaded Tower Photo with Interactive Lightbox */}
          <div className="lg:col-span-5 flex">
            <button
              type="button"
              onClick={() => onOpenLightbox(HERO_FEATURE_PHOTO.id)}
              data-testid="hero-photo-trigger"
              className="group relative w-full min-h-[360px] lg:min-h-[540px] rounded-md overflow-hidden border border-slate-700/55 hover:border-[#00E5FF]/70 bg-[#0B1220] text-right cursor-pointer transition-colors"
            >
              {/* Corner registration crosshairs */}
              <span aria-hidden="true" className="absolute top-2.5 right-3 z-20 font-telemetry text-xs text-[#00E5FF]/80">+</span>
              <span aria-hidden="true" className="absolute top-2.5 left-3 z-20 font-telemetry text-xs text-[#00E5FF]/80">+</span>

              <img
                src={HERO_FEATURE_PHOTO.src}
                alt={HERO_FEATURE_PHOTO.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center brightness-92 contrast-105 group-hover:scale-105 transition-transform duration-500"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#050911] via-[#050911]/40 to-transparent"
              />

              {/* Top expand hint */}
              <span className="absolute top-4 left-8 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-200 bg-[#050911]/80 border border-slate-600/60 rounded">
                <Maximize2 className="w-3 h-3 text-[#00E5FF]" />
                <span>بزرگ‌نمایی فنی</span>
              </span>

              {/* Strictly technical engineering overlay (zero project names or locations) */}
              <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 border-b border-slate-600/40 pb-3 mb-3">
                  <span className="text-sm font-bold text-white">{HERO_FEATURE_PHOTO.componentTag}</span>
                  <span className="font-telemetry text-xs text-[#00E5FF]">{HERO_FEATURE_PHOTO.specCode}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-6 line-clamp-2">
                  {HERO_FEATURE_PHOTO.caption}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
