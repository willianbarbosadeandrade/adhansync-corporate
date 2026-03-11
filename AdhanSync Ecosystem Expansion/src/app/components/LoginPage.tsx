import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { IslamicPattern } from "./IslamicPattern";
import { useAuth } from "./AuthContext";

interface LoginLocationState {
  from?: string;
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginLocationState | null;
  const target = state?.from || "/app";
  const redirectTo = target.startsWith("/") ? target : "/app";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const loginError = await login(email.trim(), password);
    setIsLoading(false);

    if (loginError) {
      setError(loginError);
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0a1a1f] pt-24">
      <section className="relative py-16 overflow-hidden">
        <IslamicPattern />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[0.75rem] text-[#c9a84c] tracking-widest uppercase">Authentication</span>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                lineHeight: 1.2,
              }}
              className="text-[#e8ece9] mt-3 mb-3"
            >
              Sign In to <span className="text-[#10b981]">AdhanSync</span>
            </h1>
            <p className="text-[#8ba4a8] text-[0.9rem] max-w-md mx-auto">
              Use your organization account to access secure settings, subscription, and device controls.
            </p>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <GlassCard className="p-8">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-6">
                Account Login
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[0.78rem] text-[#8ba4a8] block mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8ba4a8]" />
                    <input
                      autoComplete="email"
                      required
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] text-[#e8ece9] placeholder-[#5a7a7e] focus:border-[rgba(16,185,129,0.4)] focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[0.78rem] text-[#8ba4a8] block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8ba4a8]" />
                    <input
                      autoComplete="current-password"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] text-[#e8ece9] placeholder-[#5a7a7e] focus:border-[rgba(16,185,129,0.4)] focus:shadow-[0_0_15px_rgba(16,185,129,0.1)] focus:outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8ba4a8] hover:text-[#e8ece9] transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#f87171] text-[0.82rem]"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:shadow-[0_0_35px_rgba(16,185,129,0.35)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn size={18} />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center text-[0.78rem] text-[#8ba4a8]">
                Need an account? Contact your administrator or choose a plan on the {" "}
                <Link to="/pricing" className="text-[#10b981] hover:underline">
                  pricing page
                </Link>
                .
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
