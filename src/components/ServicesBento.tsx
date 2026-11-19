import { Maximize2 } from 'lucide-react';
import { ENGINEERING_SERVICES } from '../data/siteData';

function ServiceTechnicalSvg({ id }: { id: string }) {
  switch (id) {
    case 'design-foundation-base':
      return (
        <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 text-[#00E5FF]" aria-hidden="true">
          <path d="M10 54H54M16 54L32 10L48 54" stroke="currentColor" strokeWidth="1.5" />
          <path d="M21 40H43M25 28H39M21 40L39 28M43 40L25 28" stroke="#CBD5E1" strokeWidth="1.2" />
          <circle cx="32" cy="10" r="2.5" fill="#E63946" />
        </svg>
      );
    case 'fabrication-galvanizing':
      return (
        <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 text-[#00E5FF]" aria-hidden="true">
          <rect x="14" y="10" width="36" height="44" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 22H50M14 34H50M14 46H50" stroke="#CBD5E1" strokeWidth="1.2" />
          <path d="M14 10L50 22M50 22L14 34M14 34L50 46" stroke="#FFB703" strokeWidth="1.3" />
        </svg>
      );
    case 'heavy-erection-crane':
      return (
        <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 text-[#00E5FF]" aria-hidden="true">
          <path d="M12 54H52M18 54L30 14L42 54" stroke="#CBD5E1" strokeWidth="1.5" />
          <path d="M48 54V16L22 24" stroke="#FFB703" strokeWidth="1.6" />
          <circle cx="48" cy="16" r="2.5" fill="#E63946" />
        </svg>
      );
    case 'rigging-turnbuckles':
      return (
        <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 text-[#00E5FF]" aria-hidden="true">
          <path d="M32 8V56" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M32 16L10 54M32 16L54 54M32 32L18 54M32 32L46 54" stroke="currentColor" strokeWidth="1.3" />
          <rect x="7" y="51" width="6" height="5" stroke="#FFB703" strokeWidth="1.4" />
          <rect x="51" y="51" width="6" height="5" stroke="#FFB703" strokeWidth="1.4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10 text-[#00E5FF]" aria-hidden="true">
          <path d="M32 8V38" stroke="#FFB703" strokeWidth="1.8" />
          <path d="M27 14L32 8L37 14" stroke="#E63946" strokeWidth="1.6" />
          <path d="M16 42H48M22 48H42M27 54H37" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
  }
}

interface ServicesBentoProps {
  onOpenLightbox: (photoId: string) => void;
}

export function ServicesBento({ onOpenLightbox }: ServicesBentoProps) {
  return (
    <section
      id="services"
      className="scroll-mt-16 py-20 sm:py-28 bg-[#070C17] border-t border-slate-800/80 blueprint-grid"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-3 mb-12">
          <div className="text-xs sm:text-sm font-medium text-[#00E5FF]">
            توانمندی‌ها، ساخت و اجرای تخصصی
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
            چرخه کامل طراحی سازه، تولید گالوانیزه گرم و نصب ارتفاعی
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-7">
            تمامی مراحل مهندسی از طراحی فونداسیون و ساخت بیس‌پلیت تا تولید کارگاهی، نصب با جرثقیل،
            تامین متعلقات کششی و سرویس دوره‌ای با کنترل کیفیت دقیق انجام می‌شود.
          </p>
        </div>

        {/* Asymmetric 12-Column Bento Grid with Integrated Real Engineering Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {ENGINEERING_SERVICES.map((service) => (
            <article
              key={service.id}
              className={`${service.span} relative group bg-[#0B1220] border border-slate-700/55 hover:border-[#00E5FF]/60 rounded-md overflow-hidden flex flex-col justify-between transition-colors`}
            >
              {/* Matched Real Engineering Photograph with Hover Zoom & Lightbox Trigger */}
              <button
                type="button"
                onClick={() => onOpenLightbox(service.photo.id)}
                data-testid={`service-photo-${service.photo.id}`}
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#050911] border-b border-slate-800 cursor-pointer text-right"
              >
                <img
                  src={service.photo.src}
                  alt={service.photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#050911]/92 via-[#050911]/25 to-transparent"
                />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-200 bg-[#050911]/82 border border-slate-600/60 rounded">
                  <Maximize2 className="w-3 h-3 text-[#00E5FF]" />
                  <span>نمای فنی</span>
                </span>
                <div className="absolute bottom-3 inset-x-4 flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-white truncate">{service.photo.componentTag}</span>
                  <span className="font-telemetry text-[#00E5FF] shrink-0">{service.photo.specCode}</span>
                </div>
              </button>

              {/* Engineering Description & Deliverables */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-xs text-[#FFB703] font-medium">
                        {service.standard}
                      </div>
                      <h3 className="text-lg font-bold text-white leading-snug">
                        {service.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ServiceTechnicalSvg id={service.id} />
                      <span className="font-telemetry text-xs text-slate-500">{service.index}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 leading-7">
                    {service.description}
                  </p>

                  <p className="text-xs text-slate-400 leading-6 pt-2 border-t border-slate-800/80">
                    <span className="text-slate-200 font-semibold ml-1.5">جزئیات تصویر:</span>
                    {service.photo.caption}
                  </p>
                </div>

                {/* Clean unboxed deliverables footer */}
                <div className="pt-4 border-t border-slate-800/90 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
                  {service.deliverables.map((item, idx) => (
                    <span key={item} className="inline-flex items-center gap-2">
                      {idx > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
                      <span className="text-slate-200">{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
