import React, { useRef, useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export const Contact: React.FC = () => {
  const { language } = useLanguage();
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'fail'>(null);

  const content = {
    ko: {
      section: 'Get in Touch',
      title: '비즈니스 파트너십 문의',
      desc: '원자재 수급 계획부터 물류 최적화까지, 귀사의 비즈니스 성공을 위한\n맞춤형 솔루션을 제안해 드립니다. 지금 바로 문의해 보세요.',
      bullets: [
        { title: '철저한 비밀 유지 (Confidentiality)', desc: '모든 상담 내용과 기업 정보는 엄격한 보안 하에 관리됩니다.', color: 'text-green-500' },
        { title: '전문가 1:1 매칭 (Expert Consultation)', desc: '문의 분야에 최적화된 전담 매니저가 배정되어 상세 상담을 지원합니다.', color: 'text-blue-500' },
        { title: '24시간 내 신속 응답 (Fast Response)', desc: '영업일 기준 24시간 이내에 담당자가 직접 연락드립니다.', color: 'text-purple-500' },
      ],
      contact: { email: '이메일', phone: '연락처', address: '주소' },
      form: {
        title: '상담 신청서 작성',
        name: '담당자 성명',
        company: '회사명',
        email: '이메일 주소',
        phone: '연락처',
        details: '문의 내용',
        submit: '문의하기 (Send Inquiry)',
        sending: '전송 중...',
        success: '문의가 성공적으로 접수되었습니다.',
        fail: '전송에 실패했습니다. 다시 시도해주세요.',
        disclaimer: '본 양식을 통해 수집된 정보는 상담 목적으로만 사용됩니다.',
        ph_name: '홍길동',
        ph_company: '지오니스',
        ph_details: '관심 품목, 예상 물량, 도착항 등 구체적인 내용을 적어주시면 더 정확한 상담이 가능합니다.',
      },
    },
    en: {
      section: 'Get in Touch',
      title: 'Business Partnership Inquiry',
      desc: 'From raw material sourcing to logistics optimization, we propose customized solutions for your business success.\nContact us today.',
      bullets: [
        { title: 'Strict Confidentiality', desc: 'All consultations and corporate information are managed under strict security.', color: 'text-green-500' },
        { title: '1:1 Expert Matching', desc: 'A dedicated manager optimized for your inquiry area is assigned to support detailed consultations.', color: 'text-blue-500' },
        { title: 'Fast Response Within 24 Hours', desc: 'Our representative will contact you directly within 24 business hours.', color: 'text-purple-500' },
      ],
      contact: { email: 'Email', phone: 'Phone', address: 'Address' },
      form: {
        title: 'Fill out Inquiry Form',
        name: 'Contact Name',
        company: 'Company Name',
        email: 'Email Address',
        phone: 'Phone Number',
        details: 'Inquiry Details',
        submit: 'Send Inquiry',
        sending: 'Sending...',
        success: 'Inquiry sent successfully!',
        fail: 'Failed to send. Please try again.',
        disclaimer: 'Information collected via this form is used for consultation purposes only.',
        ph_name: 'HONG GILDONG',
        ph_company: 'Geonix Co.',
        ph_details:
          'Please provide details like interested items, expected volume, and destination port for a more accurate consultation.',
      },
    },
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);

    const name = String(formData.get('name') || '').trim();
    const company = String(formData.get('company') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const details = String(formData.get('details') || '').trim();
    const hp = String(formData.get('hp') || '');

    if (!name || !company || !email || !details) {
      setStatus('fail');
      return;
    }

    // ✅ phone을 포함해서 message에 합치기 (TS6133 방지 + 운영상 유용)
    const composedMessage = [
      company ? `Company: ${company}` : '',
      email ? `Email: ${email}` : '',
      phone ? `Phone: ${phone}` : '',
      '',
      'Message:',
      details,
    ]
      .filter(Boolean)
      .join('\n');

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: details, // 서버는 message만 메일 본문에 넣어줌
          company,
          website: '',
          phone,
          hp,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setStatus('success');
        formRef.current.reset();
      } else {
        setStatus('fail');
      }
    } catch {
      setStatus('fail');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="bg-zinc-900 rounded-3xl p-8 md:p-16 border border-zinc-800 flex flex-col lg:flex-row gap-16">
          {/* LEFT */}
          <div className="lg:w-1/2">
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-2">{t.section}</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">{t.title}</h3>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed whitespace-pre-line">{t.desc}</p>

            <div className="space-y-6 mb-12">
              {t.bullets.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className={`mt-1 bg-zinc-800 p-1 rounded ${item.color} shrink-0 h-fit`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                    <p className="text-sm text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-zinc-800 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-semibold">{t.contact.email}</div>
                  <div className="flex flex-col gap-1">
                    <a href="mailto:roman@geonix.co.kr" className="text-zinc-300 hover:text-white hover:underline transition-colors">
                      roman@geonix.co.kr
                    </a>
                    <a
                      href="mailto:geonix_official@geonix.co.kr"
                      className="text-zinc-300 hover:text-white hover:underline transition-colors"
                    >
                      geonix_official@geonix.co.kr
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-semibold">{t.contact.phone}</div>
                  <div className="text-zinc-300">-</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-white shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 uppercase font-semibold">{t.contact.address}</div>
                  <div className="text-zinc-300">-</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:w-1/2 bg-zinc-950 rounded-2xl p-8 border border-zinc-800">
            <h4 className="text-xl font-bold text-white mb-6">{t.form.title}</h4>

            <form ref={formRef} className="space-y-6" onSubmit={handleSubmit}>
              {/* honeypot */}
              <input type="text" name="hp" className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-sm font-medium text-zinc-400">
                    {t.form.name}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-zinc-500 focus:outline-none transition-colors"
                    placeholder={t.form.ph_name}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-company" className="text-sm font-medium text-zinc-400">
                    {t.form.company}
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    required
                    className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-zinc-500 focus:outline-none transition-colors"
                    placeholder={t.form.ph_company}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="text-sm font-medium text-zinc-400">
                  {t.form.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-zinc-500 focus:outline-none transition-colors"
                  placeholder="email@company.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-phone" className="text-sm font-medium text-zinc-400">
                  {t.form.phone}
                </label>
                <input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-zinc-500 focus:outline-none transition-colors"
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-details" className="text-sm font-medium text-zinc-400">
                  {t.form.details}
                </label>
                <textarea
                  id="contact-details"
                  name="details"
                  required
                  rows={4}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-zinc-500 focus:outline-none transition-colors"
                  placeholder={t.form.ph_details}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors bg-white text-zinc-950 hover:bg-zinc-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? t.form.sending : t.form.submit}
                {!sending && <ArrowRight size={18} />}
              </button>

              {status === 'success' && <p className="text-sm text-green-400 text-center mt-3">{t.form.success}</p>}
              {status === 'fail' && <p className="text-sm text-red-400 text-center mt-3">{t.form.fail}</p>}

              <p className="text-xs text-zinc-600 text-center mt-4">{t.form.disclaimer}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
