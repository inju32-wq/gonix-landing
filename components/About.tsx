import React from 'react';
import { Globe, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const About: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    ko: {
      section: '회사 소개',
      title: '글로벌 자원,',
      subtitle: '정직과 신뢰로 전달합니다.',
      vision: {
        title: '우리의 비전',
        desc: 'Geonix는 단순히 자원을 거래하는 것을 넘어, 산업을 일으키고 국가를 건설하며 진보를 이끄는 원동력을 제공합니다. 우리의 광범위한 네트워크는 환경 영향을 최소화하면서도 장기적인 공급망을 확보할 수 있게 합니다.'
      },
      mission: {
        title: '우리의 미션',
        desc: '공급망의 모든 단계에서 정직, 투명성, 효율성을 바탕으로 운영합니다. 우리는 물류와 소싱의 혁신을 통해 고객 가치를 높이고 책임 있는 채굴 관행을 장려합니다.'
      },
      stats: {
        shipment: { value: '6-7k', label: '시간당 선적량 (Tons)' },
        vessel: { value: '400k', label: '최대 선박 규모 (DWT)' }
      },
      features: [
        { title: "글로벌 네트워크", description: "러시아, 모잠비크, 인도네시아, 탄자니아 등 전 세계 주요 자원 보유국에서 소싱합니다." },
        { title: "타협하지 않는 품질", description: "글로벌 산업 표준에 부합하는 일관된 품질의 제철 및 발전용 석탄을 공급합니다." },
        { title: "시장 인텔리전스", description: "철강사의 엄격한 요구사항을 충족시키는 제품을 제안하는 깊이 있는 산업 전문성을 보유하고 있습니다." },
        { title: "장기적 파트너십", description: "전 세계 광산 및 산업 소비자와 강력한 동맹 관계를 구축하고 있습니다." }
      ]
    },
    en: {
      section: 'About Us',
      title: 'Global Resources,',
      subtitle: 'Delivered with Integrity.',
      vision: {
        title: 'Our Vision',
        desc: 'Geonix goes beyond trading resources; we power industries, build nations, and drive progress. Our extensive network secures long-term supply chains while minimizing environmental impact.'
      },
      mission: {
        title: 'Our Mission',
        desc: 'We operate with honesty, transparency, and efficiency at every stage of the supply chain. Through innovation in logistics and sourcing, we enhance customer value and promote responsible mining practices.'
      },
      stats: {
        shipment: { value: '6-7k', label: 'Loading Rate (Tons/Hr)' },
        vessel: { value: '400k', label: 'Max Vessel Size (DWT)' }
      },
      features: [
        { title: "Global Network", description: "Sourcing from major resource-rich regions including Russia, Mozambique, Indonesia, and Tanzania." },
        { title: "Uncompromising Quality", description: "Supplying consistent quality metallurgical and thermal coal meeting global industrial standards." },
        { title: "Market Intelligence", description: "Deep industry expertise to propose products that meet strict steelmaker requirements." },
        { title: "Long-term Partnership", description: "Building strong alliances with global mines and industrial consumers." }
      ]
    }
  };

  const t = content[language];
  const icons = [Globe, ShieldCheck, TrendingUp, Users];

  return (
    <section id="about" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">{t.section}</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {t.title} <br />
              <span className="font-serif italic text-zinc-500">{t.subtitle}</span>
            </h3>
            
            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>
                <strong className="text-white block mb-2">{t.vision.title}</strong>
                {t.vision.desc}
              </p>
              
              <p>
                <strong className="text-white block mb-2">{t.mission.title}</strong>
                {t.mission.desc}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 border-t border-zinc-800 pt-8 mt-8">
              <div>
                <div className="text-4xl font-bold text-white mb-1">{t.stats.shipment.value}</div>
                <div className="text-sm text-zinc-500 uppercase tracking-wide">{t.stats.shipment.label}</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-1">{t.stats.vessel.value}</div>
                <div className="text-sm text-zinc-500 uppercase tracking-wide">{t.stats.vessel.label}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {t.features.map((feature, idx) => {
              const Icon = icons[idx];
              return (
                <div key={idx} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-white mb-4 group-hover:bg-white group-hover:text-zinc-950 transition-colors">
                    <Icon size={24} />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-zinc-400 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};