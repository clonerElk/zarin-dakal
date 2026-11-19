import { useState } from 'react';
import { ALL_LIGHTBOX_PHOTOS } from './data/siteData';
import { DirectContactBanner } from './components/DirectContactBanner';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ImageLightbox } from './components/ImageLightbox';
import { ScrollytellingAssembly } from './components/ScrollytellingAssembly';
import { ServicesBento } from './components/ServicesBento';
import { TowerComparison } from './components/TowerComparison';

export default function App() {
  const [activePhotoId, setActivePhotoId] = useState<string | null>(null);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#050911] text-[#E2E8F0]">
      <Header onNavigate={scrollToSection} />

      <main>
        <HeroSection
          onStartAssembly={() => scrollToSection('assembly')}
          onOpenLightbox={setActivePhotoId}
        />

        <ScrollytellingAssembly />

        <TowerComparison onOpenLightbox={setActivePhotoId} />

        <ServicesBento onOpenLightbox={setActivePhotoId} />

        <DirectContactBanner />
      </main>

      <Footer onNavigate={scrollToSection} />

      <ImageLightbox
        photos={ALL_LIGHTBOX_PHOTOS}
        activePhotoId={activePhotoId}
        onSelectPhoto={setActivePhotoId}
        onClose={() => setActivePhotoId(null)}
      />
    </div>
  );
}
