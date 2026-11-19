import { useState } from 'react';
import { Check, Copy, PhoneCall, ShieldCheck } from 'lucide-react';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_HREF } from '../utils/engineeringCalc';

const ENGINEERING_STANDARDS = [
  { code: 'TIA-222-G', desc: 'آیین‌نامه طراحی سازه‌های مخابراتی و بار باد' },
  { code: 'ASTM A123', desc: 'پوشش گالوانیزه گرم غوطه‌وری استاندارد' },
  { code: 'ICAO Annex 14', desc: 'رنگ‌آمیزی و چراغ چشمک‌زن ایمنی هوانوردی' },
  { code: 'IEC 62305', desc: 'سیستم صاعقه‌گیر و چاه ارت زیر ۲ اهم' },
  { code: 'ISO 9001', desc: 'کنترل کیفیت جوشکاری و تلرانس کارگاهی' },
];

export function DirectContactBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(COMPANY_PHONE);
      } else {
        const helper = document.createElement('textarea');
        helper.value = COMPANY_PHONE;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        document.execCommand('copy');
        document.body.removeChild(helper);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <section
      id="contact"
      className="scroll-mt-16 py-20 sm:py-28 bg-[#050911] border-t border-slate-800/80 blueprint-grid"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-md border border-slate-700/60 bg-[#0B1220] p-7 sm:p-10 lg:p-12">
          {/* Corner registration crosshairs */}
          <span aria-hidden="true" className="absolute top-3 right-4 font-telemetry text-xs text-[#00E5FF]/65">+</span>
          <span aria-hidden="true" className="absolute top-3 left-4 font-telemetry text-xs text-[#00E5FF]/65">+</span>
          <span aria-hidden="true" className="absolute bottom-3 right-4 font-telemetry text-xs text-[#00E5FF]/65">+</span>
          <span aria-hidden="true" className="absolute bottom-3 left-4 font-telemetry text-xs text-[#00E5FF]/65">+</span>

          {/* Subtle ambient radial corner highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#00E5FF]/8 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#E63946]/10 blur-3xl"
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Right column (RTL): Direct Engineering Consultation Headline & Copy */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm font-medium text-[#00E5FF]">
                <span>تماس مستقیم و مشاوره تخصصی مهندسی</span>
                <span aria-hidden="true" className="text-slate-600">/</span>
                <span className="text-slate-300">{COMPANY_NAME}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                نیاز به مشاوره فنی، طراحی یا اجرای دکل مخابراتی دارید؟
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-8 max-w-2xl">
                کارشناسان سازه و اجرای «{COMPANY_NAME}» جهت بررسی شرایط سایت، انتخاب بهینه بین دکل مهاری
                (G35، G45، G65) و دکل خودایستا (۳ پایه و ۴ پایه)، طراحی فونداسیون، سیستم ارتینگ و برنامه‌ریزی
                نصب و سرویس دوره‌ای آماده پاسخگویی مستقیم به شما هستند.
              </p>
            </div>

            {/* Left column (RTL): High-Impact Direct Phone Box + Copy Action */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-[#060B15] border border-slate-700/60 rounded-md p-6">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                <span>خط مستقیم واحد مهندسی و اجرا</span>
                <span className="font-telemetry text-[#FFB703]">DIRECT LINE</span>
              </div>

              <a
                href={COMPANY_PHONE_HREF}
                data-testid="contact-phone-link"
                className="group flex items-center justify-between gap-4 py-2"
              >
                <span className="font-telemetry text-3xl sm:text-4xl font-extrabold tracking-wider text-white group-hover:text-[#00E5FF] transition-colors">
                  {COMPANY_PHONE}
                </span>
                <span className="inline-flex items-center justify-center w-12 h-12 rounded bg-[#E63946] group-hover:bg-[#cf2c39] text-white transition-colors shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={COMPANY_PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#E63946] hover:bg-[#cf2c39] rounded transition-colors whitespace-nowrap"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>تماس مستقیم</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyPhone}
                  data-testid="copy-phone-btn"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-slate-100 bg-[#0F192D] hover:bg-[#16233E] border border-slate-600/70 hover:border-[#00E5FF]/70 rounded transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#00E5FF]" />
                      <span className="text-[#00E5FF]">شماره کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-300" />
                      <span>کپی شماره تماس</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Engineering Standards Strip */}
          <div className="relative z-10 mt-10 pt-7 border-t border-slate-800/90">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              <span>تطابق کامل طراحی، ساخت و اجرا با استانداردهای بین‌المللی سازه‌های مخابراتی</span>
            </div>
            <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {ENGINEERING_STANDARDS.map((std) => (
                <div key={std.code} className="space-y-1">
                  <dt className="font-telemetry text-sm font-bold text-white">{std.code}</dt>
                  <dd className="text-xs text-slate-400 leading-5">{std.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
