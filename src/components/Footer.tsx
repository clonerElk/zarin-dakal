import { PhoneCall } from 'lucide-react';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_HREF } from '../utils/engineeringCalc';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

const CERTIFICATIONS = [
  { code: 'TIA-222-G', label: 'طراحی سازه مخابراتی' },
  { code: 'ASTM A123', label: 'گالوانیزه گرم غوطه‌وری' },
  { code: 'ICAO Annex 14', label: 'ایمنی و چراغ هوانوردی' },
  { code: 'IEC 62305', label: 'حفاظت صاعقه و ارتینگ' },
];

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[#04070E] border-t border-slate-800/90 text-slate-300">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Engineering Authority */}
          <div className="md:col-span-5 space-y-4">
            <div className="text-xl font-black text-white">{COMPANY_NAME}</div>
            <p className="text-sm text-slate-400 leading-7 max-w-md">
              واحد تخصصی طراحی، تولید، گالوانیزه گرم و اجرای دکل‌های مهاری (G35، G45، G65) و دکل‌های
              خودایستا ۳ پایه و ۴ پایه، سیستم‌های ارتینگ، صاعقه‌گیر و سرویس نگهداری دوره‌ای سایت‌های
              مخابراتی.
            </p>
            <div className="pt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-400">
              {CERTIFICATIONS.map((c) => (
                <div key={c.code} className="flex items-center gap-1.5">
                  <span className="font-telemetry text-[#00E5FF] font-semibold">{c.code}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-sm font-bold text-white">دسترسی سریع</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'assembly', label: 'شبیه‌ساز سه‌بعدی نصب دکل' },
                { id: 'comparison', label: 'دکل‌های مهاری و خودایستا' },
                { id: 'services', label: 'توانمندی‌ها، ساخت و اجرا' },
                { id: 'contact', label: 'تماس مستقیم و مشاوره مهندسی' },
              ].map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(link.id);
                    }}
                    className="text-slate-400 hover:text-[#00E5FF] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact Details */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-white">ارتباط مستقیم با واحد مهندسی</h3>
            <p className="text-sm text-slate-400 leading-7">
              جهت دریافت مشاوره فنی در انتخاب نوع دکل، بررسی شرایط سایت، اجرای فونداسیون و هماهنگی
              تولید و نصب با ما تماس بگیرید.
            </p>
            <a
              href={COMPANY_PHONE_HREF}
              data-testid="footer-phone-link"
              className="inline-flex items-center gap-3 px-4 py-2.5 rounded bg-[#0B1220] border border-slate-700/70 hover:border-[#00E5FF] text-white transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-[#E63946] shrink-0" />
              <span className="font-telemetry text-lg font-bold tracking-wider">{COMPANY_PHONE}</span>
            </a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© ۱۴۰۵ {COMPANY_NAME}. تمامی حقوق فنی و اجرایی محفوظ است.</p>
          <p className="font-telemetry text-slate-500">GUYED &amp; SELF-SUPPORTING TELECOM STRUCTURES</p>
        </div>
      </div>
    </footer>
  );
}
