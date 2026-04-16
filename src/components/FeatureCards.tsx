import { Search, ShieldCheck, Star, Stethoscope } from 'lucide-react';

const FEATURES = [
  { icon: Search, title: 'Compare All Plans Side-by-Side', desc: 'See every Medicare Advantage plan available in your ZIP code with detailed benefits, copays, and drug coverage.', color: 'text-blue-500' },
  { icon: ShieldCheck, title: 'No Cost, No Obligation', desc: 'Our service is 100% free. We are paid by insurance carriers, never by you. Compare plans without any pressure.', color: 'text-crimson-500' },
  { icon: Star, title: 'CMS Star Ratings Included', desc: 'Every plan shows its official CMS quality star rating so you can choose a plan with proven performance.', color: 'text-yellow-500' },
  { icon: Stethoscope, title: 'Check Your Doctors & Drugs', desc: 'Add your doctors and prescriptions to see which plans cover them and estimate your total annual costs.', color: 'text-green-500' },
];

export function FeatureCards() {
  return (
    <section className="py-20 bg-navy-50/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold tracking-widest text-navy-400">WHY CHOOSE US</span>
          <h2 className="text-3xl font-bold text-navy-900 mt-2">Why Compare Plans With Us?</h2>
          <p className="text-navy-500 mt-2 max-w-xl mx-auto">We make it easy to find the right Medicare Advantage plan for your health needs and budget.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white p-6 rounded-2xl border border-navy-100 hover:shadow-lg transition group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-navy-50 group-hover:scale-110 transition`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-navy-800 mb-2">{f.title}</h3>
              <p className="text-sm text-navy-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
