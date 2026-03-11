import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Check, ChevronRight, Crown, Building2, Zap } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { IslamicPattern } from "./IslamicPattern";
import { useAuth } from "./AuthContext";
import { billingApi } from "../services/api";
import type { PlanTier, PricingPlan } from "../types/domain";
import { useAsyncData } from "../hooks/useAsyncData";
import { ErrorBlock, LoadingBlock } from "./common/StateBlocks";
import { getErrorMessage } from "@/lib/errors";

function planIcon(plan: PlanTier) {
  if (plan === "professional") return <Crown size={24} />;
  if (plan === "enterprise") return <Building2 size={24} />;
  return <Zap size={24} />;
}

function formatMonthlyLabel(plan: PricingPlan, yearly: boolean): string {
  const cents = yearly ? plan.yearlyPriceCents : plan.monthlyPriceCents;
  if (cents === null) return "Custom";
  const divisor = yearly ? 12 : 1;
  const amount = cents / 100 / divisor;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: plan.currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: plans, loading, error, reload } = useAsyncData(() => billingApi.getPlans(), []);

  const orderedPlans = useMemo(() => {
    if (!plans) return [];
    const rank: Record<PlanTier, number> = { personal: 0, professional: 1, enterprise: 2 };
    return [...plans].sort((a, b) => rank[a.id] - rank[b.id]);
  }, [plans]);

  const handlePlanAction = async (plan: PricingPlan) => {
    if (plan.id === "enterprise") {
      toast.info("Contact sales to start enterprise onboarding.");
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/pricing" } });
      return;
    }

    if (user?.plan === plan.id) {
      navigate("/account");
      return;
    }

    setActivePlanId(plan.id);
    try {
      const session = await billingApi.createCheckoutSession({
        planId: plan.id,
        billingCycle: yearly ? "yearly" : "monthly",
      });
      window.location.assign(session.checkoutUrl);
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to start checkout."));
    } finally {
      setActivePlanId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a1f] pt-24">
      <section className="relative py-16 overflow-hidden">
        <IslamicPattern />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse,rgba(16,185,129,0.1)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-[0.75rem] text-[#c9a84c] tracking-widest uppercase">Pricing</span>
          <h1
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.2 }}
            className="text-[#e8ece9] mt-3 mb-4"
          >
            Invest in <span className="text-[#10b981]">Respect</span>
          </h1>
          <p className="text-[#8ba4a8] text-[1rem] max-w-xl mx-auto mb-10">
            Secure billing is handled by our payment provider through server-generated checkout sessions.
          </p>

          <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.12)]">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full transition-all text-[0.85rem] ${
                !yearly
                  ? "bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "text-[#8ba4a8] hover:text-[#e8ece9]"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full transition-all text-[0.85rem] ${
                yearly
                  ? "bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  : "text-[#8ba4a8] hover:text-[#e8ece9]"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>
      </section>

      <section className="relative pb-20">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <LoadingBlock label="Loading pricing plans..." />}

          {error && !loading && <ErrorBlock message={error} onRetry={() => void reload()} />}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {orderedPlans.map((plan, index) => {
                const isCurrent = user?.plan === plan.id;
                const ctaLabel =
                  plan.id === "enterprise"
                    ? "Contact Sales"
                    : isCurrent
                      ? "Current Plan"
                      : "Start Checkout";

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <GlassCard
                      gold={plan.highlighted}
                      className={`p-7 h-full flex flex-col ${plan.highlighted ? "scale-[1.03] relative z-10" : ""}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                          plan.highlighted
                            ? "bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border border-[rgba(201,168,76,0.2)]"
                            : "bg-[rgba(16,185,129,0.1)] text-[#10b981] border border-[rgba(16,185,129,0.12)]"
                        }`}
                      >
                        {planIcon(plan.id)}
                      </div>

                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-[#8ba4a8] text-[0.82rem] mb-5">{plan.description}</p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[2rem] text-[#e8ece9]" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {formatMonthlyLabel(plan, yearly)}
                          </span>
                          {plan.monthlyPriceCents !== null && <span className="text-[#8ba4a8] text-[0.82rem]">/month</span>}
                        </div>
                        {plan.monthlyPriceCents !== null && yearly && (
                          <p className="text-[0.75rem] text-[#8ba4a8] mt-1">
                            Billed yearly in {plan.currency}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2.5 mb-7 flex-1">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2.5">
                            <Check size={15} className={plan.highlighted ? "text-[#c9a84c]" : "text-[#10b981]"} />
                            <span className="text-[#e8ece9] text-[0.83rem]">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => void handlePlanAction(plan)}
                        disabled={isCurrent || activePlanId === plan.id}
                        className={`w-full py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                          plan.highlighted
                            ? "bg-gradient-to-r from-[#c9a84c] to-[#dfc06a] text-[#1a1400]"
                            : "bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white"
                        }`}
                      >
                        {activePlanId === plan.id ? "Starting checkout..." : ctaLabel}
                        <ChevronRight size={16} />
                      </button>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
