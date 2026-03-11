import { useState } from "react";
import { motion } from "motion/react";
import { FileText, Shield, RefreshCw, Scale, Globe, Building2, ChevronDown, ChevronRight } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { IslamicPattern } from "./IslamicPattern";

const sections = [
  {
    id: "tos",
    title: "Terms of Service",
    icon: <FileText size={20} />,
    lastUpdated: "February 1, 2026",
    content: [
      {
        heading: "1. Acceptance of Terms",
        text: "By downloading, installing, or using AdhanSync ('the Software'), you agree to be bound by these Terms of Service. If you do not agree, do not use the Software."
      },
      {
        heading: "2. License Grant",
        text: "AdhanSync grants you a limited, non-exclusive, non-transferable license to use the Software on the number of devices specified by your subscription plan. This is a Software as a Service License Agreement."
      },
      {
        heading: "3. Permitted Use",
        text: "The Software is designed to automatically pause system audio during Islamic prayer times. It operates locally on your device after initial activation. You may not reverse-engineer, decompile, or distribute the Software."
      },
      {
        heading: "4. Subscription & Payment",
        text: "Subscriptions are billed monthly or annually via Stripe or Paddle. Prices are in USD with QAR equivalents displayed. Automatic renewal applies unless cancelled before the billing date."
      },
      {
        heading: "5. Intellectual Property",
        text: "All rights, title, and interest in AdhanSync, including source code, design, and documentation, remain the exclusive property of AdhanSync and its licensors."
      },
    ]
  },
  {
    id: "privacy",
    title: "Privacy Policy",
    icon: <Shield size={20} />,
    lastUpdated: "February 1, 2026",
    content: [
      {
        heading: "1. Data Collection",
        text: "AdhanSync follows a privacy-first architecture. After initial license activation, the Software operates entirely offline. We do not collect, store, or transmit user activity data, audio data, or personal behavior patterns."
      },
      {
        heading: "2. Account Information",
        text: "We collect only the information necessary for account management: email address, name, and payment information (processed securely via Stripe/Paddle). We do not store payment card details on our servers."
      },
      {
        heading: "3. Device Information",
        text: "For license validation, we store a unique device identifier. No hardware specifications, usage patterns, or personal files are accessed or transmitted."
      },
      {
        heading: "4. Third-Party Services",
        text: "Payment processing is handled by Stripe (primary) or Paddle (alternative). These services have their own privacy policies. We use no analytics, tracking, or advertising services."
      },
      {
        heading: "5. Data Retention",
        text: "Account data is retained for the duration of your subscription. Upon account deletion, all personal data is permanently removed within 30 days."
      },
    ]
  },
  {
    id: "refund",
    title: "Refund Policy",
    icon: <RefreshCw size={20} />,
    lastUpdated: "February 1, 2026",
    content: [
      {
        heading: "1. Trial Period",
        text: "Personal plans include a 7-day free trial. No charge is applied during the trial period. Cancel anytime before the trial ends to avoid billing."
      },
      {
        heading: "2. Refund Eligibility",
        text: "Full refunds are available within 14 days of initial purchase for annual plans, and within 7 days for monthly plans. Refund requests must be submitted via email to support@adhansync.com."
      },
      {
        heading: "3. Enterprise Plans",
        text: "Enterprise refund terms are specified in individual service agreements. Contact your account manager for details."
      },
    ]
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    icon: <Scale size={20} />,
    lastUpdated: "February 1, 2026",
    content: [
      {
        heading: "1. Software Accuracy",
        text: "While AdhanSync strives for accurate prayer time calculations, the Software is provided 'as is' without warranties of any kind. Prayer time accuracy depends on location data and calculation methods selected by the user."
      },
      {
        heading: "2. No Religious Liability",
        text: "AdhanSync is a technology tool and does not provide religious guidance or fatwas. The Software's prayer time calculations are based on astronomical algorithms and user-selected calculation methods. AdhanSync bears no religious liability for the accuracy of prayer times or the user's religious observance. Users are encouraged to verify prayer times with their local mosque or religious authority."
      },
      {
        heading: "3. System Compatibility",
        text: "Audio control functionality depends on operating system compatibility. AdhanSync is not liable for audio interruptions caused by third-party software conflicts or operating system updates."
      },
      {
        heading: "4. Maximum Liability",
        text: "In no event shall AdhanSync's total liability exceed the amount paid by the user in the twelve (12) months preceding the claim."
      },
    ]
  },
  {
    id: "compliance",
    title: "Regional Compliance",
    icon: <Globe size={20} />,
    lastUpdated: "February 1, 2026",
    content: [
      {
        heading: "1. Qatar Compliance",
        text: "AdhanSync complies with Qatar's data protection requirements and the Qatar Financial Centre Regulatory Authority guidelines. The Software does not process, store, or transmit personal data beyond account management necessities."
      },
      {
        heading: "2. International Taxation",
        text: "VAT and sales tax are automatically calculated and applied via Stripe Tax or Paddle's tax compliance system based on the user's jurisdiction."
      },
      {
        heading: "3. GDPR Compliance",
        text: "For users within the European Economic Area, AdhanSync complies with the General Data Protection Regulation. Users have the right to access, modify, or delete their personal data at any time."
      },
    ]
  },
  {
    id: "entity",
    title: "Business Entity",
    icon: <Building2 size={20} />,
    lastUpdated: "February 1, 2026",
    content: [
      {
        heading: "1. Entity Structure",
        text: "AdhanSync operates as a Software as a Service company. The recommended entity structure considers Qatar-based LLC for regional trust and market alignment, with optional international SaaS structure via UAE Freezone or similar jurisdiction for global operations."
      },
      {
        heading: "2. Registered Address",
        text: "AdhanSync headquarters are registered in Qatar. For international operations, secondary registration may be maintained via UAE Freezone, Estonia e-Residency, or UK LTD structure as determined by operational requirements."
      },
      {
        heading: "3. Contact",
        text: "Legal inquiries: legal@adhansync.com. General support: support@adhansync.com."
      },
    ]
  },
];

export function LegalPage() {
  const [activeSection, setActiveSection] = useState("tos");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const currentSection = sections.find(s => s.id === activeSection)!;

  const toggleItem = (key: string) => {
    setExpandedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#0a1a1f] pt-24">
      <section className="relative py-8 pb-24">
        <IslamicPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="text-[0.75rem] text-[#c9a84c] tracking-widest uppercase">Legal</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)" }} className="text-[#e8ece9] mt-2">
              Legal & SaaS Structure
            </h1>
            <p className="text-[#8ba4a8] text-[0.85rem] mt-1">Transparency, compliance, and trust.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <GlassCard className="p-2">
                <div className="space-y-0.5">
                  {sections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-left text-[0.83rem] ${
                        activeSection === s.id
                          ? "bg-[rgba(16,185,129,0.1)] text-[#10b981] border border-[rgba(16,185,129,0.15)]"
                          : "text-[#8ba4a8] hover:text-[#e8ece9] hover:bg-[rgba(16,38,44,0.4)]"
                      }`}
                    >
                      {s.icon}
                      <span className="truncate">{s.title}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Content */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard className="p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.12)] flex items-center justify-center text-[#10b981]">
                      {currentSection.icon}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">{currentSection.title}</h3>
                      <p className="text-[0.72rem] text-[#8ba4a8]">Last updated: {currentSection.lastUpdated}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentSection.content.map((item, i) => {
                    const key = `${activeSection}-${i}`;
                    const isExpanded = expandedItems[key] !== false; // default expanded
                    return (
                      <div key={i} className="border border-[rgba(16,185,129,0.08)] rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[rgba(16,38,44,0.3)] transition-all"
                        >
                          <span className="text-[#e8ece9] text-[0.88rem]">{item.heading}</span>
                          {isExpanded ? <ChevronDown size={16} className="text-[#8ba4a8]" /> : <ChevronRight size={16} className="text-[#8ba4a8]" />}
                        </button>
                        {isExpanded && (
                          <div className="px-5 pb-4">
                            <p className="text-[#8ba4a8] text-[0.84rem] leading-relaxed">{item.text}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
