import { TrendingUp, DollarSign, Heart, Star } from 'lucide-react';

const STATS = [
  { icon: TrendingUp, value: '24+', label: 'Plans Available', sub: 'in most counties' },
  { icon: DollarSign, value: '$0', label: 'Lowest Premium', sub: 'many plans available' },
  { icon: Heart, value: '8+', label: 'Top Carriers', sub: 'UHC, Humana, Aetna & more' },
  { icon: Star, value: '4.5', label: 'Top Rated Plans', sub: 'CMS quality ratings', star: true },
];

const CARRIERS = ['UnitedHealthcare', 'Humana', 'Aetna', 'Cigna', 'WellCare', 'Blue Cross', 'Devoted Health', 'Clover Health'];

export function TrustBar() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs font-semibold tracking-widest text-navy-400 mb-6">COMPARE PLANS FROM THESE TOP CARRIERS</p>
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CARRIERS.map((c) => (
            <span key={c} className="px-4 py-2 rounded-full border border-navy-100 text-sm text-navy-600 hover:bg-navy-50 transition cursor-default">{c}</span>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center p-6 rounded-2xl border border-navy-100 hover:shadow-md transition">
              <s.icon className="w-8 h-8 mx-auto mb-3 text-navy-400" />
              <div className="text-3xl font-bold text-navy-800">
                {s.value}{s.star && <Star className="w-5 h-5 inline text-yellow-400 fill-yellow-400 ml-1" />}
              </div>
              <div className="text-sm font-semibold text-navy-700 mt-1">{s.label}</div>
              <div className="text-xs text-navy-400">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
