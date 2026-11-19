import { useState } from 'react';
import { Menu, PhoneCall, X } from 'lucide-react';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_PHONE_HREF } from '../utils/engineeringCalc';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
}

const NAV_LINKS = [
  { id: 'assembly', label: 'فرآیند نصب' },
  { id: 'comparison', label: 'دکل‌های مهاری و خودایستا' },
  { id: 'services', label: 'توانمندی‌ها و اجرا' },
  { id: 'contact', label: 'تماس و مشاوره' },
] as const;

export function Header({ onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLinkClick = (sectionId: string) => {
    setMobileOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 bg-[#050911]/92 border-b border-slate-700/35">
      <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Zone 1: Company Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick('hero');
          }}
          className="text-base sm:text-lg font-extrabold tracking-tight text-slate-100 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          {COMPANY_NAME}
        </a>

        {/* Zone 2: 4 Concise Single-Line Navigation Links */}
        <nav
          aria-label="ناوبری اصلی"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
              className="py-1 border-b border-transparent hover:border-[#00E5FF] hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Click-to-Call CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={COMPANY_PHONE_HREF}
            data-testid="header-phone-cta"
            className="hidden sm:inline-flex items-center gap-2.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#E63946] hover:bg-[#cf2c39] rounded transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF]"
          >
            <PhoneCall className="w-4 h-4 shrink-0" />
            <span className="font-telemetry tracking-wide">{COMPANY_PHONE}</span>
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 text-slate-200 hover:text-white border border-slate-700/60 rounded cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#080E1A] border-b border-slate-700/50 px-5 py-4 space-y-2">
          <nav aria-label="ناوبری موبایل" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id);
                }}
                className="py-2.5 px-3 text-sm font-medium text-slate-200 hover:bg-slate-800/70 hover:text-white rounded transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href={COMPANY_PHONE_HREF}
            className="w-full mt-2 py-2.5 px-4 text-sm font-bold text-white bg-[#E63946] hover:bg-[#cf2c39] rounded transition-colors flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>تماس مستقیم</span>
            <span className="font-telemetry">{COMPANY_PHONE}</span>
          </a>
        </div>
      )}
    </header>
  );
}
