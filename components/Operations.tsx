import React from 'react';
import { FileCheck, Users, Globe2, Activity } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Operations: React.FC = () => {
  const { language } = useLanguage();

  const content = {
    ko: {
      section: '운영 인프라',
      title: '체계적인 운영 시스템',
      desc: 'Geonix는 비즈니스 성공을 위한 검증된 프로세스와 체계적인 운영 시스템을 보유하고 있습니다.\n복잡한 국제 무역 환경 속에서도 안정성과 신뢰를 보장합니다.',
      items: [
        {
          title: "파트너 검증 시스템",
          description: "거래 전 공급자의 실제 생산 능력과 구매자의 신용도를 정밀 분석합니다. 잠재적 리스크를 조기에 파악하여 안전한 거래 환경을 조성합니다."
        },
        {
          title: "무역 규제 준수 및 문서 관리",
          description: "국가별 통관 규제, 신용장(L/C) 조건, 선적 서류를 전문적으로 관리합니다. 행정 절차로 인한 지연을 방지하고 정확한 이행을 보장합니다."
        },
        {
          title: "글로벌 커뮤니케이션 및 조율",
          description: "시차와 언어 장벽을 넘어 공급자와 구매자 간 실시간 조율을 수행합니다. 오해로 인한 분쟁을 예방하고 원만한 협상을 주도합니다."
        },
        {
          title: "전 과정 모니터링 (End-to-End)",
          description: "계약 체결부터 선적, 운송, 하역에 이르는 전 과정을 모니터링합니다. 이슈 발생 시 즉각적인 대안을 제시하여 비즈니스 연속성을 유지합니다."
        }
      ]
    },
    en: {
      section: 'Operational Infrastructure',
      title: 'Systematic Operations',
      desc: 'Geonix possesses proven processes and systematic operational systems for business success.\nWe guarantee stability and trust amidst complex international trade environments.',
      items: [
        {
          title: "Partner Verification System",
          description: "We precisely analyze supplier capacity and buyer credit before trading, identifying potential risks early to create a safe trading environment."
        },
        {
          title: "Trade Compliance & Documentation",
          description: "Expertly managing country-specific regulations, L/C conditions, and shipping documents to prevent delays and ensure accurate execution."
        },
        {
          title: "Global Communication & Coordination",
          description: "Coordinating real-time between suppliers and buyers across time zones to prevent disputes and lead smooth negotiations."
        },
        {
          title: "End-to-End Monitoring",
          description: "Monitoring the entire process from contract to discharge. We provide immediate alternatives when issues arise to maintain continuity."
        }
      ]
    }
  };

  const t = content[language];
  const icons = [Users, FileCheck, Globe2, Activity];
  const colors = ["text-blue-400", "text-green-400", "text-purple-400", "text-orange-400"];

  return (
    <section id="infrastructure" className="py-24 bg-zinc-900">
       <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">{t.section}</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">
             {t.title}
          </h3>
          <p className="text-zinc-400 text-lg max-w-3xl mx-auto whitespace-pre-line">
             {t.desc}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {t.items.map((item, idx) => {
            const Icon = icons[idx];
            return (
              <div key={idx} className="bg-zinc-950 p-8 rounded-2xl border border-zinc-800 flex gap-6 hover:border-zinc-600 transition-colors">
                <div className={`shrink-0 w-16 h-16 bg-zinc-900 rounded-xl flex items-center justify-center ${colors[idx]}`}>
                  <Icon size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
       </div>
    </section>
  );
};