import React, { useState, useEffect } from 'react';
import { Menu, X, Anchor, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLabels = {
    ko: {
      about: '회사 소개',
      services: '서비스',
      products: '취급 품목',
      infrastructure: '인프라',
      sustainability: '지속 가능성',
      contact: '문의하기'
    },
    en: {
      about: 'About',
      services: 'Services',
      products: 'Products',
      infrastructure: 'Infrastructure',
      sustainability: 'Sustainability',
      contact: 'Contact'
    }
  };

  const t = navLabels[language];

  const navItems = [
    { label: t.about, href: '#about' },
    { label: t.services, href: '#services' },
    { label: t.products, href: '#products' },
    { label: t.infrastructure, href: '#infrastructure' },
    { label: t.sustainability, href: '#sustainability' },
    { label: t.contact, href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white text-zinc-950 p-1.5 rounded">
            <Anchor size={20} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">GEONIX</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors uppercase tracking-wider"
            >
              {item.label}
            </a>
          ))}
          
          {/* Language Toggle */}
          <div className="flex items-center gap-2 border-l border-zinc-700 pl-6 ml-2">
             <button 
               onClick={() => setLanguage('ko')}
               className={`text-xs font-bold transition-colors ${language === 'ko' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               KOR
             </button>
             <span className="text-zinc-700">|</span>
             <button 
               onClick={() => setLanguage('en')}
               className={`text-xs font-bold transition-colors ${language === 'en' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               ENG
             </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <div className="flex items-center gap-2">
             <button 
               onClick={() => setLanguage('ko')}
               className={`text-xs font-bold ${language === 'ko' ? 'text-white' : 'text-zinc-500'}`}
             >
               KO
             </button>
             <span className="text-zinc-700">/</span>
             <button 
               onClick={() => setLanguage('en')}
               className={`text-xs font-bold ${language === 'en' ? 'text-white' : 'text-zinc-500'}`}
             >
               EN
             </button>
          </div>
          <button
            className="text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-zinc-300 hover:text-white text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};