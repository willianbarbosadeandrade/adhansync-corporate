import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Volume2, VolumeX, Clock, MapPin, Shield, WifiOff,
  Upload, Building2, Server, Users, ChevronRight, Monitor, Play, Wifi
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { IslamicPattern } from "./IslamicPattern";

function DashboardMockup() {
  const prayers = [
    { name: "Fajr", time: "04:32", active: false },
    { name: "Dhuhr", time: "11:45", active: true },
    { name: "Asr", time: "15:12", active: false },
    { name: "Maghrib", time: "18:23", active: false },
    { name: "Isha", time: "19:45", active: false },
  ];

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="absolute -inset-8 bg-gradient-to-r from-[rgba(16,185,129,0.15)] to-[rgba(201,168,76,0.1)] rounded-3xl blur-2xl" />
      <div className="relative rounded-2xl bg-[rgba(10,26,31,0.95)] border border-[rgba(16,185,129,0.2)] p-5 shadow-2xl backdrop-blur-xl">
        {/* Title bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-[0.7rem] text-[#8ba4a8]">AdhanSync v2.0</span>
        </div>

        {/* Countdown */}
        <div className="text-center mb-5">
          <p className="text-[0.7rem] text-[#c9a84c] tracking-wider uppercase mb-1">Next Prayer</p>
          <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[2rem] text-[#10b981] leading-none">02:17:34</p>
          <p className="text-[0.8rem] text-[#8ba4a8] mt-1">Dhuhr - 11:45 AM</p>
        </div>

        {/* Prayer list */}
        <div className="space-y-1.5">
          {prayers.map((p) => (
            <div
              key={p.name}
              className={`flex items-center justify-between px-3 py-2 rounded-lg ${
                p.active ? "bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.2)]" : "bg-[rgba(16,38,44,0.3)]"
              }`}
            >
              <span className={`text-[0.8rem] ${p.active ? "text-[#10b981]" : "text-[#8ba4a8]"}`}>{p.name}</span>
              <span className={`text-[0.8rem] ${p.active ? "text-[#10b981]" : "text-[#e8ece9]"}`}>{p.time}</span>
            </div>
          ))}
        </div>

        {/* Audio status */}
        <div className="mt-4 flex items-center justify-between px-3 py-2.5 rounded-lg bg-[rgba(16,38,44,0.4)] border border-[rgba(16,185,129,0.08)]">
          <div className="flex items-center gap-2">
            <Volume2 size={14} className="text-[#10b981]" />
            <span className="text-[0.75rem] text-[#8ba4a8]">System Audio</span>
          </div>
          <span className="text-[0.7rem] text-[#10b981] bg-[rgba(16,185,129,0.1)] px-2 py-0.5 rounded-full">Active</span>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const howItWorks = [
    {
      icon: <Clock size={28} />,
      title: "Detect Prayer Times",
      desc: "Automatically calculates accurate prayer times based on your location and chosen calculation method.",
    },
    {
      icon: <VolumeX size={28} />,
      title: "Pause Audio Automatically",
      desc: "Silently intercepts system audio output during Adhan, ensuring respect without manual intervention.",
    },
    {
      icon: <Play size={28} />,
      title: "Resume Seamlessly",
      desc: "After the Adhan completes, your audio resumes exactly where it left off. Zero disruption.",
    },
  ];

  const features = [
    { icon: <Monitor size={22} />, title: "Local System Integration", desc: "Deep OS-level audio control with no cloud dependency." },
    { icon: <Upload size={22} />, title: "Custom Adhan Upload", desc: "Upload your preferred Adhan recitation for a personal touch." },
    { icon: <MapPin size={22} />, title: "Multi-Location Support", desc: "Configure multiple locations for travelers and global teams." },
    { icon: <WifiOff size={22} />, title: "Works Offline", desc: "After initial activation, operates fully without internet." },
    { icon: <Shield size={22} />, title: "Privacy-First Architecture", desc: "No data collection. No telemetry. Fully local operation." },
    { icon: <Wifi size={22} />, title: "Silent Background Mode", desc: "Runs in the system tray with zero interruption to workflow." },
  ];

  return (
    <div className="min-h-screen bg-[#0a1a1f]">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <IslamicPattern />
        {/* Radial glow */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(201,168,76,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.15)] mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span className="text-[0.75rem] text-[#10b981]">Desktop Application for Windows & macOS</span>
              </div>

              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.1 }} className="text-[#e8ece9] mb-5">
                Silence with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#14d699]">
                  Respect.
                </span>
              </h1>

              <p className="text-[#8ba4a8] text-[1.1rem] leading-relaxed mb-8 max-w-lg">
                AdhanSync automatically pauses your audio during prayer time.
                Discreet. Corporate. Spiritually respectful.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300"
                >
                  Download Now
                  <ChevronRight size={18} />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl border border-[rgba(16,185,129,0.2)] text-[#10b981] hover:bg-[rgba(16,185,129,0.05)] transition-all duration-300"
                >
                  View Plans
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block"
            >
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-24 bg-[#081418]">
        <IslamicPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[0.75rem] text-[#c9a84c] tracking-widest uppercase">How It Works</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }} className="text-[#e8ece9] mt-3">
              Three Steps to Spiritual Harmony
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <GlassCard className="p-8 h-full text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-[rgba(16,185,129,0.15)] to-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.15)] flex items-center justify-center text-[#10b981] mb-5">
                    {item.icon}
                  </div>
                  <div className="text-[0.65rem] text-[#c9a84c] tracking-widest uppercase mb-2">Step {i + 1}</div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-3">{item.title}</h3>
                  <p className="text-[#8ba4a8] text-[0.85rem] leading-relaxed">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="relative py-24">
        <IslamicPattern />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[0.75rem] text-[#c9a84c] tracking-widest uppercase">Key Features</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }} className="text-[#e8ece9] mt-3">
              Engineered for Discretion
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <GlassCard className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.12)] flex items-center justify-center text-[#10b981]">
                      {f.icon}
                    </div>
                    <div>
                      <h4 className="text-[#e8ece9] mb-1">{f.title}</h4>
                      <p className="text-[#8ba4a8] text-[0.82rem] leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR COMPANIES */}
      <section className="relative py-24 bg-[#081418]">
        <IslamicPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[0.75rem] text-[#c9a84c] tracking-widest uppercase">For Companies</span>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }} className="text-[#e8ece9] mt-3 mb-5">
                Enterprise-Grade Respect
              </h2>
              <p className="text-[#8ba4a8] text-[0.95rem] leading-relaxed mb-8">
                Deploy AdhanSync across your organization. Not a cost — a compliance and respect tool
                that reinforces your company's cultural values.
              </p>

              <div className="space-y-4">
                {[
                  { icon: <Server size={18} />, text: "Multi-device installation & management" },
                  { icon: <Building2 size={18} />, text: "Corporate deployment packages" },
                  { icon: <Users size={18} />, text: "Scalable licensing for any team size" },
                  { icon: <Shield size={18} />, text: "Roadmap: centralized configuration panel" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[rgba(16,185,129,0.1)] flex items-center justify-center text-[#10b981]">
                      {item.icon}
                    </div>
                    <span className="text-[#e8ece9] text-[0.9rem]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <GlassCard className="p-8">
                <div className="text-center mb-6">
                  <Building2 size={40} className="text-[#c9a84c] mx-auto mb-3" />
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">Enterprise Plan</h3>
                  <p className="text-[#8ba4a8] text-[0.85rem] mt-1">Custom pricing for your organization</p>
                </div>
                <div className="space-y-3">
                  {["Unlimited devices", "Priority support", "Central license management", "Custom deployment", "Dedicated account manager"].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-[0.85rem]">
                      <div className="w-5 h-5 rounded-full bg-[rgba(201,168,76,0.15)] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#c9a84c]" />
                      </div>
                      <span className="text-[#e8ece9]">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/pricing"
                  className="mt-6 block text-center px-6 py-3 rounded-xl border border-[rgba(201,168,76,0.3)] text-[#c9a84c] hover:bg-[rgba(201,168,76,0.05)] transition-all"
                >
                  Contact Sales
                </Link>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="relative py-24">
        <IslamicPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[0.75rem] text-[#c9a84c] tracking-widest uppercase">Pricing</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }} className="text-[#e8ece9] mt-3 mb-3">
            Premium Spiritual Productivity
          </h2>
          <p className="text-[#8ba4a8] text-[0.95rem] mb-10 max-w-lg mx-auto">
            Plans starting from QAR 18/month. Enterprise custom quotes available.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all duration-300"
          >
            View All Plans
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 bg-[#081418]">
        <IslamicPattern />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.2 }} className="text-[#e8ece9] mb-5">
              Install <span className="text-[#10b981]">Respect</span> Into Your System.
            </h2>
            <p className="text-[#8ba4a8] text-[1rem] mb-8 leading-relaxed">
              Join professionals worldwide who honor prayer time without compromising productivity.
            </p>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white shadow-[0_0_35px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300"
            >
              Get AdhanSync
              <ChevronRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}