import { Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Medicare AI Advisor</h3>
            <p className="text-navy-300 text-sm leading-relaxed">
              Your trusted AI-powered guide for finding and enrolling in the right Medicare Advantage plan.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-2 text-navy-300 text-sm">
              <li><a href="#" className="hover:text-white transition">Medicare 101</a></li>
              <li><a href="#" className="hover:text-white transition">Plan Types Explained</a></li>
              <li><a href="#" className="hover:text-white transition">Enrollment Periods</a></li>
              <li><a href="#" className="hover:text-white transition">Drug Coverage Guide</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-navy-300 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm">Need Help?</h4>
            <a href="tel:1-800-555-0199" className="flex items-center gap-2 text-white font-semibold mb-2">
              <Phone className="w-4 h-4" /> 1-800-555-0199
            </a>
            <p className="text-navy-300 text-sm">Licensed agents available<br/>Mon-Fri 8am-8pm EST</p>
          </div>
        </div>
        <div className="border-t border-navy-700 mt-12 pt-8">
          <p className="text-navy-400 text-xs leading-relaxed">
            Medicare AI Advisor is not affiliated with or endorsed by any government agency. We are a licensed insurance agency. 
            Medicare has neither reviewed nor endorsed this information. Not connected with or endorsed by the United States government 
            or the federal Medicare program. A licensed agent may contact you regarding this insurance-related information.
          </p>
          <p className="text-navy-500 text-xs mt-4">&copy; {new Date().getFullYear()} Medicare AI Advisor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
