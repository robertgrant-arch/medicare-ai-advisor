'use client';

import { Shield, Phone } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-navy-100">
      <div className="bg-navy-800 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Licensed in all 50 states</span>
            <span>2026 Medicare Advantage Plans Available</span>
          </div>
          <a href="tel:18005550100" className="flex items-center gap-1 hover:text-navy-200 transition">
            <Phone className="w-3 h-3" /> 1-800-555-0100 (TTY 711)
          </a>
        </div>
      </div>
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-navy-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <span className="font-bold text-navy-800 text-lg">MedicareAI</span>
            <span className="text-navy-400 text-xs block -mt-1">ADVISOR</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-sm text-navy-600 hover:text-navy-800 transition font-medium">How It Works</button>
          <button className="text-sm text-navy-600 hover:text-navy-800 transition font-medium">Plan Resources</button>
          <button className="bg-crimson-500 hover:bg-crimson-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm">
            Talk to an Agent
          </button>
        </div>
      </nav>
    </header>
  );
}
