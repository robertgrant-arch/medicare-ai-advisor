import { MessageCircle, ClipboardList, ShieldCheck, FileCheck } from 'lucide-react';

const STEPS = [
  {
    icon: MessageCircle,
    step: '01',
    title: 'Tell Us About Yourself',
    desc: 'Chat with our AI advisor about your health needs, preferred doctors, current medications, and budget. No forms to fill out.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: ClipboardList,
    step: '02',
    title: 'Get Personalized Matches',
    desc: 'Our AI analyzes every Medicare Advantage plan in your ZIP code and ranks them by how well they fit your specific needs.',
    color: 'text-crimson-500',
    bg: 'bg-red-50',
  },
  {
    icon: ShieldCheck,
    step: '03',
    title: 'Compare Side-by-Side',
    desc: 'Review detailed plan comparisons including premiums, copays, drug coverage, star ratings, and provider networks.',
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
  },
  {
    icon: FileCheck,
    step: '04',
    title: 'Enroll Digitally',
    desc: 'Complete your enrollment 100% online with guided assistance. Our AI walks you through every step of the application.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-navy-50/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest text-navy-400">SIMPLE PROCESS</span>
          <h2 className="text-3xl font-bold text-navy-800 mt-2">How It Works</h2>
          <p className="text-navy-500 mt-2 max-w-xl mx-auto">From first question to enrolled in a plan, our AI guides every step.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="relative">
              <div className={`${s.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <span className="text-xs font-bold text-navy-300">STEP {s.step}</span>
              <h3 className="font-semibold text-navy-800 mt-1 mb-2">{s.title}</h3>
              <p className="text-sm text-navy-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
