import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingHeader } from './landing/LandingHeader';
import { LandingFooter } from './landing/LandingFooter';
import { HomePage } from './landing/HomePage';
import { ProductPage } from './landing/ProductPage';
import { PricingPage } from './landing/PricingPage';
import { AboutPage } from './landing/AboutPage';
import { CaseStudyPage } from './landing/CaseStudyPage';
import { DevelopersPage } from './landing/DevelopersPage';
import { WhatsNewModal } from './landing/WhatsNewModal';
import { ScrollToTop } from './ui/ScrollToTop';

export const LandingPage = ({ onStart }: { onStart: () => void }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isWhatsNewOpen, setIsWhatsNewOpen] = useState(false);

  useEffect(() => {
     document.title = `Timeframe | ${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}`;
     const meta = document.querySelector('meta[name="description"]');
     if (meta) meta.setAttribute('content', `Timeframe ${currentPage} page.`);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
        case 'product':
        case 'ai features':
            return <ProductPage onNavigate={setCurrentPage} />;
        case 'pricing':
            return <PricingPage />;
        case 'solutions':
        case 'resources':
        case 'about':
            return <AboutPage />;
        case 'developers':
            return <DevelopersPage />;
        case 'case-study-1':
        case 'case-study-2':
            return <CaseStudyPage id={currentPage} />;
        default:
            return <HomePage onStart={onStart} />;
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden">
        <WhatsNewModal isOpen={isWhatsNewOpen} onClose={() => setIsWhatsNewOpen(false)} />
        <LandingHeader onStart={onStart} onNavigate={setCurrentPage} onOpenWhatsNew={() => setIsWhatsNewOpen(true)} />
        
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
        
        <LandingFooter />
        <ScrollToTop />
    </div>
  );
};
