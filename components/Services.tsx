import React from 'react';
import { Globe, ShieldCheck, Ship, Handshake } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Services: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    ko: {
      section: '우리의 서비스',
      title: '글로벌 원자재 중개 솔루션',
      desc: 'Geonix는 단순 중개를 넘어, 신뢰할 수 있는 공급망 구축과 리스크 없는 안전한 거래를 위한 전략적 파트너십을 제공합니다.',
      items: [
        {
          title: "글로벌 소싱 네트워크",
          description: "러시아, 인도네시아, 아프리카 등 자원 부국에 구축된 광범위한 네트워크를 활용하여 귀사의 요구 사항에 부합하는 최적의 광산을 매칭해 드립니다."
        },
        {
          title: "품질 검증 및 리스크 관리",
          description: "현장 실사와 제3자 검정 기관(SGS 등)을 통한 엄격한 품질 관리를 수행하여, 품질 불량 및 거래 리스크를 사전에 원천 차단합니다."
        },
        {
          title: "통합 물류 및 운송 솔루션",
          description: "광산에서 도착항까지 복잡한 내륙 및 해상 운송 프로세스를 최적화하여 정시 납기를 준수하고 물류비 절감을 실현합니다."
        },
        {
          title: "투명한 중개 파트너십",
          description: "합리적인 수수료를 기반으로 한 투명한 계약 구조를 지향하며, 공급자와 구매자 모두가 만족하는 지속 가능한 비즈니스 관계를 구축합니다."
        }
      ]
    },
    en: {
      section: 'Our Services',
      title: 'Global Raw Material Brokerage',
      desc: 'Beyond simple brokerage, Geonix provides strategic partnerships for building reliable supply chains and ensuring risk-free, secure transactions.',
      items: [
        {
          title: "Global Sourcing Network",
          description: "Leveraging our vast network in Russia, Indonesia, and Africa to match you with optimal mines meeting your exact specifications."
        },
        {
          title: "Quality Verification & Risk Management",
          description: "Strict quality control via on-site inspections and third-party agencies (e.g., SGS) to preemptively eliminate quality and transaction risks."
        },
        {
          title: "Integrated Logistics Solutions",
          description: "Optimizing complex inland and sea freight processes from mine to destination port, ensuring on-time delivery and cost reduction."
        },
        {
          title: "Transparent Brokerage Partnership",
          description: "Aiming for transparent contract structures based on reasonable fees, building sustainable relationships that satisfy both suppliers and buyers."
        }
      ]
    }
  };

  const t = content[language];
  const icons = [Globe, ShieldCheck, Ship, Handshake];

  return (
    <section id="services" className="py-24 bg-zinc-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">{t.section}</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.title}</h3>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            {t.desc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {t.items.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <div key={idx} className="bg-zinc-950 p-10 rounded-2xl border border-zinc-800 hover:border-zinc-600 transition-all group flex flex-col items-start text-left">
                <div className="w-14 h-14 bg-zinc-900 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-white group-hover:text-zinc-950 transition-colors shadow-lg shadow-black/50">
                  <Icon size={28} />
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                <p className="text-zinc-400 leading-relaxed text-lg">
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