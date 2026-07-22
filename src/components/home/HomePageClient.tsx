'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Profile from '@/components/home/Profile';
import About from '@/components/home/About';
import SelectedPublications from '@/components/home/SelectedPublications';
import News, { NewsItem } from '@/components/home/News';
import ProjectShowcase from '@/components/home/ProjectShowcase';
import PublicationsList from '@/components/publications/PublicationsList';
import TextPage from '@/components/pages/TextPage';
import CardPage from '@/components/pages/CardPage';
import ExperiencePage from '@/components/pages/ExperiencePage';
import type { SiteConfig } from '@/lib/config';
import { Publication } from '@/types/publication';
import { CardItem, CardPageConfig, ExperiencePageConfig, PageSectionLink, ProjectItem, PublicationPageConfig, TextPageConfig } from '@/types/page';
import { useLocaleStore } from '@/lib/stores/localeStore';

interface SectionConfig {
  id: string;
  type: 'markdown' | 'publications' | 'list' | 'projects';
  title?: string;
  source?: string;
  filter?: string;
  limit?: number;
  content?: string;
  publications?: Publication[];
  items?: NewsItem[];
  projects?: ProjectItem[];
}

type PageData =
  | { type: 'about'; id: string; sections: SectionConfig[] }
  | { type: 'publication'; id: string; config: PublicationPageConfig; publications: Publication[] }
  | { type: 'text'; id: string; config: TextPageConfig; content: string }
  | { type: 'card'; id: string; config: CardPageConfig }
  | { type: 'experience'; id: string; config: ExperiencePageConfig };

export interface HomePageLocaleData {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  enableOnePageMode?: boolean;
  researchInterests?: string[];
  currentRoles: CardItem[];
  sectionLinks: PageSectionLink[];
  pagesToShow: PageData[];
}

interface HomePageClientProps {
  dataByLocale: Record<string, HomePageLocaleData>;
  defaultLocale: string;
}

export default function HomePageClient({ dataByLocale, defaultLocale }: HomePageClientProps) {
  const locale = useLocaleStore((state) => state.locale);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const fallback = dataByLocale[defaultLocale] || Object.values(dataByLocale)[0];
  const data = dataByLocale[locale] || fallback;

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 700);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  if (!data) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <Profile
            author={data.author}
            social={data.social}
            features={data.features}
            researchInterests={data.researchInterests}
            currentRoles={data.currentRoles}
            sectionLinks={data.sectionLinks}
          />
        </div>

        <div className="lg:col-span-2 space-y-8">
          {data.pagesToShow.map((page) => (
            <section
              key={page.id}
              id={page.type === 'about' && page.sections.some((section) => section.id === page.id) ? undefined : page.id}
              className="scroll-mt-24 space-y-8"
            >
              {page.type === 'about' && page.sections.map((section: SectionConfig, index: number) => {
                const delay = 0.2 + 0.1 * index;
                switch (section.type) {
                  case 'markdown':
                    return (
                      <div key={section.id} id={section.id} className="scroll-mt-24">
                        <About
                          content={section.content || ''}
                          title={section.title}
                          delay={delay}
                        />
                      </div>
                    );
                  case 'publications':
                    return (
                      <div key={section.id} id={section.id} className="scroll-mt-24">
                        <SelectedPublications
                          publications={section.publications || []}
                          title={section.title}
                          enableOnePageMode={data.enableOnePageMode}
                          delay={delay}
                        />
                      </div>
                    );
                  case 'list':
                    return (
                      <div key={section.id} id={section.id} className="scroll-mt-24">
                        <News
                          items={section.items || []}
                          title={section.title}
                          delay={delay}
                        />
                      </div>
                    );
                  case 'projects':
                    return (
                      <div key={section.id} id={section.id} className="scroll-mt-24">
                        <ProjectShowcase
                          projects={section.projects || []}
                          title={section.title}
                          delay={delay}
                        />
                      </div>
                    );
                  default:
                    return null;
                }
              })}
              {page.type === 'publication' && (
                <PublicationsList
                  config={page.config}
                  publications={page.publications}
                  embedded={true}
                />
              )}
              {page.type === 'text' && (
                <TextPage
                  config={page.config}
                  content={page.content}
                  embedded={true}
                />
              )}
              {page.type === 'card' && (
                <CardPage
                  config={page.config}
                  embedded={true}
                />
              )}
              {page.type === 'experience' && (
                <ExperiencePage
                  config={page.config}
                  embedded={true}
                />
              )}
            </section>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-5 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200/80 bg-background/90 text-neutral-600 shadow-lg backdrop-blur-xl transition-colors hover:border-accent/40 hover:text-accent lg:hidden dark:border-white/10 dark:text-neutral-400"
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
