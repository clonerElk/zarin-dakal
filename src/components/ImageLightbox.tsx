import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { TechnicalPhotoItem } from '../data/siteData';

interface ImageLightboxProps {
  photos: TechnicalPhotoItem[];
  activePhotoId: string | null;
  onSelectPhoto: (id: string) => void;
  onClose: () => void;
}

export function ImageLightbox({
  photos,
  activePhotoId,
  onSelectPhoto,
  onClose,
}: ImageLightboxProps) {
  const activeIndex = activePhotoId
    ? photos.findIndex((item) => item.id === activePhotoId)
    : -1;
  const activePhoto = activeIndex >= 0 ? photos[activeIndex] : null;

  useEffect(() => {
    if (!activePhoto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        const nextIdx = (activeIndex + 1) % photos.length;
        onSelectPhoto(photos[nextIdx].id);
      } else if (e.key === 'ArrowRight') {
        const prevIdx = (activeIndex - 1 + photos.length) % photos.length;
        onSelectPhoto(photos[prevIdx].id);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activePhoto, activeIndex, photos, onSelectPhoto, onClose]);

  if (!activePhoto) return null;

  const goPrev = () => {
    const prevIdx = (activeIndex - 1 + photos.length) % photos.length;
    onSelectPhoto(photos[prevIdx].id);
  };

  const goNext = () => {
    const nextIdx = (activeIndex + 1) % photos.length;
    onSelectPhoto(photos[nextIdx].id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activePhoto.title}
      data-testid="image-lightbox"
      className="fixed inset-0 z-50 bg-[#050911]/95 flex items-center justify-center p-4 sm:p-6 lg:p-10"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0B1220] border border-slate-700/70 rounded-md overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Engineering Header Bar */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-slate-800 bg-[#080E1A]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="font-telemetry text-[#00E5FF] font-semibold">
              {activePhoto.specCode}
            </span>
            <span aria-hidden="true" className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">{activePhoto.componentTag}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="font-telemetry text-slate-400">
              {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره نمایش تصویر"
            data-testid="lightbox-close"
            className="inline-flex items-center justify-center w-9 h-9 text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/70 rounded transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Split Content: Real Engineering Photograph + Authoritative Technical Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          <div className="lg:col-span-7 relative bg-[#050911] flex items-center justify-center min-h-[280px] sm:min-h-[420px] max-h-[65vh] border-b lg:border-b-0 lg:border-l border-slate-800">
            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              referrerPolicy="no-referrer"
              className="w-full h-full max-h-[65vh] object-contain"
            />

            {/* Prev / Next Controls */}
            <button
              type="button"
              onClick={goPrev}
              aria-label="تصویر قبلی"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded bg-[#050911]/85 border border-slate-700/80 text-slate-200 hover:text-white hover:border-[#00E5FF] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="تصویر بعدی"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded bg-[#050911]/85 border border-slate-700/80 text-slate-200 hover:text-white hover:border-[#00E5FF] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="text-xs font-medium text-[#FFB703]">
                شرح فنی و جزئیات مهندسی سازه
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {activePhoto.title}
              </h3>
              <p className="text-sm text-slate-300 leading-7">
                {activePhoto.caption}
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-2.5">
                <div className="text-xs font-semibold text-slate-400">
                  ویژگی‌های ساختاری و اجرایی
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {activePhoto.technicalPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="font-telemetry text-[#00E5FF] mt-0.5">+</span>
                      <span className="leading-6">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>کلیدهای جهت‌نما برای پیمایش</span>
              <span className="font-telemetry text-slate-500">ESC TO CLOSE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
