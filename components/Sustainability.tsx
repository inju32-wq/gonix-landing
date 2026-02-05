import React from 'react';
import { Leaf, ShieldCheck, Infinity } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Sustainability: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    ko: {
      section: '기업의 책임',
      title: '지속 가능한 가치와 신뢰',
      desc: 'Geonix에게 지속 가능성이란 단순한 구호를 넘어선 비즈니스의 핵심 원칙입니다.\n우리는 책임 있는 소싱과 투명한 거래를 통해 파트너와 함께 성장하는 장기적인 미래를 약속합니다.',
      items: [
        {
          title: "책임 있는 자원 조달",
          description: "환경 규제와 노동 안전 기준을 준수하는 검증된 광산과 협력하여, 공급망 전반의 윤리적 리스크를 철저히 관리하고 배제합니다."
        },
        {
          title: "투명한 거래 프로세스",
          description: "모든 거래 단계에서 정보를 투명하게 공유하고 공정한 비즈니스 관행을 준수하여, 모든 이해관계자가 신뢰할 수 있는 건전한 생태계를 조성합니다."
        },
        {
          title: "장기적 파트너십",
          description: "단기적인 이익보다는 공급의 안정성과 파트너사와의 동반 성장을 최우선 가치로 삼으며, 시장 변동성 속에서도 변치 않는 견고한 협력 관계를 유지합니다."
        }
      ]
    },
    en: {
      section: 'Corporate Responsibility',
      title: 'Sustainable Value & Trust',
      desc: 'For Geonix, sustainability is a core business principle beyond a slogan.\nWe promise a long-term future growing with partners through responsible sourcing and transparent transactions.',
      items: [
        {
          title: "Responsible Sourcing",
          description: "Cooperating with verified mines adhering to environmental and safety standards, thoroughly managing and eliminating ethical risks."
        },
        {
          title: "Transparent Process",
          description: "Sharing information transparently at every stage and adhering to fair business practices to create a trusted ecosystem."
        },
        {
          title: "Long-term Partnerships",
          description: "Prioritizing supply stability and mutual growth over short-term profits, maintaining solid relationships despite market volatility."
        }
      ]
    }
  };

  const t = content[language];
  const icons = [Leaf, ShieldCheck, Infinity];
  const iconColors = ["text-green-500", "text-blue-500", "text-purple-500"];

  return (
    <section id="sustainability" className="py-24 bg-zinc-950 border-t border-zinc-800">
       <div className="container mx-auto px-6 text-center">
          <h2 className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">{t.section}</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">{t.title}</h3>
          
          <p className="text-zinc-400 text-lg max-w-3xl mx-auto mb-16 whitespace-pre-line">
            {t.desc}
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {t.items.map((item, idx) => {
               const Icon = icons[idx];
               return (
                 <div key={idx} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all flex flex-col items-center group">
                    <div className={`w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-6 border border-zinc-800 group-hover:bg-zinc-800 transition-colors ${iconColors[idx]}`}>
                       <Icon size={32} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                    <p className="text-zinc-500 leading-relaxed">
                       {item.description}
                    </p>
                 </div>
               );
             })}
          </div>
       </div>
    </section>
  );
};