import React from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Hero: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    ko: {
      badge: '글로벌 공급망 가동 중',
      title1: '프리미엄 석탄을 위한',
      title2: '신뢰할 수 있는 파트너.',
      desc: '세계적 수준의 제철용 점결탄, 발전용 연료탄, 코크스를 최고의 정밀도와 신뢰성으로 일관되게 공급합니다.',
      cta1: '제품 보기',
      cta2: '파트너십 문의'
    },
    en: {
      badge: 'Global Supply Chain Active',
      title1: 'Your Trusted Partner for',
      title2: 'Premium Coal Solutions.',
      desc: 'Consistently delivering world-class metallurgical coal, thermal coal, and coke with maximum precision and reliability.',
      cta1: 'View Products',
      cta2: 'Inquire Now'
    }
  };

  const t = content[language];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-900">
      {/* Spline Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <iframe 
          src='https://my.spline.design/planetearth-lNfmVWGoOoZkMhSk1InKXY2C/' 
          frameBorder='0' 
          width='100%' 
          height='100%'
          title="Geonix Global Network 3D"
          className="w-full h-full pointer-events-auto"
        ></iframe>
      </div>

      {/* Overlay Gradient for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center">
        <div className="max-w-3xl pt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wider">{t.badge}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t.title1}<br />
            <span className="font-serif italic text-zinc-400">{t.title2}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-300 mb-8 max-w-xl leading-relaxed">
            {t.desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#products" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-zinc-950 font-semibold rounded hover:bg-zinc-200 transition-all transform hover:-translate-y-1"
            >
              {t.cta1}
              <ArrowRight size={18} />
            </a>
            <a 
              href="#contact" 
              className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-zinc-600 text-white font-semibold rounded hover:bg-zinc-800 transition-all"
            >
              {t.cta2}
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-zinc-500">
          <ChevronDown size={32} />
        </div>
      </div>
    </div>
  );
};