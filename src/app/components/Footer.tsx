import { Link } from "react-router";
import { IslamicPattern } from "./IslamicPattern";

export function Footer() {
  return (
    <footer className="relative bg-[#060f13] border-t border-[rgba(16,185,129,0.1)]">
      <IslamicPattern />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center">
                <span className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px" }}>A</span>
              </div>
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">
                Adhan<span className="text-[#10b981]">Sync</span>
              </span>
            </div>
            <p className="text-[#8ba4a8] text-[0.85rem] leading-relaxed">
              The silent guardian of prayer time inside modern workplaces.
            </p>
          </div>

          <div>
            <h4 className="text-[#c9a84c] mb-4 text-[0.85rem] tracking-wider uppercase">Product</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-[#8ba4a8] hover:text-[#10b981] transition-colors text-[0.85rem]">Features</Link></li>
              <li><Link to="/pricing" className="text-[#8ba4a8] hover:text-[#10b981] transition-colors text-[0.85rem]">Pricing</Link></li>
              <li><Link to="/account" className="text-[#8ba4a8] hover:text-[#10b981] transition-colors text-[0.85rem]">Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#c9a84c] mb-4 text-[0.85rem] tracking-wider uppercase">Enterprise</h4>
            <ul className="space-y-2.5">
              <li><span className="text-[#8ba4a8] text-[0.85rem]">Corporate Deployment</span></li>
              <li><span className="text-[#8ba4a8] text-[0.85rem]">Volume Licensing</span></li>
              <li><span className="text-[#8ba4a8] text-[0.85rem]">Priority Support</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#c9a84c] mb-4 text-[0.85rem] tracking-wider uppercase">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/legal" className="text-[#8ba4a8] hover:text-[#10b981] transition-colors text-[0.85rem]">Terms of Service</Link></li>
              <li><Link to="/legal" className="text-[#8ba4a8] hover:text-[#10b981] transition-colors text-[0.85rem]">Privacy Policy</Link></li>
              <li><Link to="/legal" className="text-[#8ba4a8] hover:text-[#10b981] transition-colors text-[0.85rem]">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[rgba(16,185,129,0.08)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8ba4a8] text-[0.8rem]">&copy; 2026 AdhanSync. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[0.75rem] text-[#8ba4a8] bg-[rgba(16,38,44,0.5)] px-3 py-1 rounded-full border border-[rgba(16,185,129,0.1)]">PCI DSS Compliant</span>
            <span className="text-[0.75rem] text-[#8ba4a8] bg-[rgba(16,38,44,0.5)] px-3 py-1 rounded-full border border-[rgba(16,185,129,0.1)]">256-bit Encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
