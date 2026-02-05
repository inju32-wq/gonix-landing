import React from 'react';
import { Flame, Factory, Mountain, Pickaxe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Products: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    ko: {
      section: '핵심 역량',
      title: '취급 품목 포트폴리오',
      desc: '글로벌 주요 생산지와의 파트너십을 통해 고객사의 요구 조건에 부합하는\n최적의 원자재를 안정적으로 공급합니다.',
      items: [
        {
          title: "제철용 원자재",
          description: "강점결탄(Hard Coking Coal), PCI, 다양한 등급의 코크스(Met Coke) 등 철강 산업의 핵심 원료를 글로벌 주요 광산으로부터 소싱합니다."
        },
        {
          title: "발전 및 에너지용 원자재",
          description: "고열량탄(High GCV)부터 발전소 및 산업용 보일러에 최적화된 경제적인 저열량탄까지 폭넓은 스펙트럼의 연료탄을 취급합니다."
        },
        {
          title: "산업용 무연탄",
          description: "높은 고정탄소와 낮은 휘발분을 요구하는 정밀 화학, 필터, 제련 산업을 위한 고품위 무연탄 및 탄소 소재를 공급합니다."
        },
        {
          title: "기타 광물 자원",
          description: "철광석(Iron Ore), 망간(Manganese) 등 고객의 요청에 따라 신뢰할 수 있는 공급처를 발굴하여 맞춤형 소싱 서비스를 제공합니다."
        }
      ],
      disclaimer: {
        label: '면책 조항 (Disclaimer)',
        text: 'Geonix는 전문 무역 중개 법인으로 제조사가 아닙니다. 상기 품목은 대표적인 취급 카테고리이며, 실제 공급 물량 및 세부 성분(열량, 회분, 황분 등)은 구체적인 주문 내역과 광산 상황에 따라 맞춤 제안됩니다.'
      }
    },
    en: {
      section: 'Capabilities',
      title: 'Our Product Portfolio',
      desc: 'Through partnerships with major global producers, we stably supply\noptimal raw materials meeting customer requirements.',
      items: [
        {
          title: "Metallurgical Raw Materials",
          description: "Sourcing core steel industry materials including Hard Coking Coal, PCI, and various grades of Met Coke from major global mines."
        },
        {
          title: "Thermal Energy Materials",
          description: "Handling a broad spectrum from High GCV to economic low-calorific thermal coal optimized for power plants and industrial boilers."
        },
        {
          title: "Industrial Anthracite",
          description: "Supplying high-grade anthracite and carbon materials for precision chemical, filter, and smelting industries requiring high fixed carbon."
        },
        {
          title: "Other Mineral Resources",
          description: "Providing customized sourcing for Iron Ore, Manganese, and other minerals, identifying reliable sources tailored to customer requests."
        }
      ],
      disclaimer: {
        label: 'Disclaimer',
        text: 'Geonix is a specialized trading brokerage, not a manufacturer. The above items are representative categories; actual supply volumes and detailed specifications are proposed based on specific orders and mine conditions.'
      }
    }
  };

  const t = content[language];
  const icons = [Factory, Flame, Mountain, Pickaxe];

  return (
    <section id="products" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">{t.section}</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.title}</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg whitespace-pre-line">
            {t.desc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {t.items.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <div key={idx} className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900 transition-all group">
                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                  <Icon size={24} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center max-w-3xl mx-auto">
          <p className="text-zinc-500 text-sm leading-relaxed">
            <span className="text-zinc-300 font-semibold block mb-1">{t.disclaimer.label}</span> 
            {t.disclaimer.text}
          </p>
        </div>
      </div>
    </section>
  );
};