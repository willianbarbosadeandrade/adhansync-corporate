import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Activity,
  Calendar,
  Copy,
  CreditCard,
  Download,
  Laptop,
  LogIn,
  Monitor,
  Shield,
  User,
  Zap,
  Crown,
  Building2,
} from "lucide-react";
import { GlassCard } from "./GlassCard";
import { IslamicPattern } from "./IslamicPattern";
import { useAuth } from "./AuthContext";
import { useAsyncData } from "../hooks/useAsyncData";
import { accountApi, billingApi } from "../services/api";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "./common/StateBlocks";
import { formatCurrency } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import type { PlanTier } from "../types/domain";

const menuItems = [
  { id: "profile", label: "Profile", icon: <User size={18} /> },
  { id: "subscription", label: "Subscription", icon: <Crown size={18} /> },
  { id: "devices", label: "Devices", icon: <Monitor size={18} /> },
  { id: "billing", label: "Billing", icon: <CreditCard size={18} /> },
] as const;

const planIcons: Record<PlanTier, React.ReactNode> = {
  personal: <Zap size={18} />,
  professional: <Crown size={18} />,
  enterprise: <Building2 size={18} />,
};

const planAccentColors: Record<PlanTier, { accent: string; bg: string; border: string }> = {
  personal: { accent: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.15)" },
  professional: { accent: "#c9a84c", bg: "rgba(201,168,76,0.1)", border: "rgba(201,168,76,0.2)" },
  enterprise: { accent: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.15)" },
};

interface ProfileForm {
  name: string;
  email: string;
  company: string;
  location: string;
}

export function AccountPage() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<(typeof menuItems)[number]["id"]>("subscription");
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: "",
    email: "",
    company: "",
    location: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const { data, loading, error, reload, setData } = useAsyncData(() => accountApi.getAccount(), []);

  useEffect(() => {
    if (!data) return;
    setProfileForm({
      name: data.profile.name,
      email: data.profile.email,
      company: data.profile.company,
      location: data.profile.location,
    });
  }, [data]);

  const colors = useMemo(() => {
    if (!data) return planAccentColors.personal;
    return planAccentColors[data.subscription.plan];
  }, [data]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a1a1f] pt-24">
        <section className="relative py-20">
          <IslamicPattern />
          <div className="relative max-w-lg mx-auto px-4 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.15)] flex items-center justify-center text-[#10b981] mb-6">
              <LogIn size={32} />
            </div>
            <h1
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
              className="text-[#e8ece9] mb-3"
            >
              Sign In Required
            </h1>
            <p className="text-[#8ba4a8] text-[0.9rem] mb-8">
              Please sign in to access your account dashboard and billing settings.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white"
            >
              <LogIn size={18} />
              Go to Login
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const handleProfileSave = async () => {
    if (!data) return;
    setSavingProfile(true);
    try {
      const updated = await accountApi.updateProfile(profileForm);
      setData(updated);
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to save profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const handleOpenBillingPortal = async () => {
    try {
      const session = await billingApi.openCustomerPortal();
      window.location.assign(session.checkoutUrl);
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to open billing portal."));
    }
  };

  const handleDownload = async (platform: "windows" | "macos" | "msi") => {
    try {
      const response = await accountApi.downloadInstaller(platform);
      window.open(response.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to start download."));
    }
  };

  const handleCopyLicense = async () => {
    if (!data?.subscription.licenseKey) return;
    await navigator.clipboard.writeText(data.subscription.licenseKey);
    toast.success("License key copied.");
  };

  const handleComplianceReport = async () => {
    try {
      const response = await accountApi.generateComplianceReport();
      toast.success(response.message || "Report generated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to generate report."));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1a1f] pt-24">
      <section className="relative py-8">
        <IslamicPattern />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1
                  style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 2rem)" }}
                  className="text-[#e8ece9]"
                >
                  Account
                </h1>
                {data && (
                  <div
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                    style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    <span style={{ color: colors.accent }}>{planIcons[data.subscription.plan]}</span>
                    <span className="text-[0.72rem] tracking-wider uppercase" style={{ color: colors.accent }}>
                      {data.subscription.planLabel}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-[#8ba4a8] text-[0.85rem]">Manage subscription, devices, and billing securely.</p>
            </div>
          </div>

          {loading && <LoadingBlock label="Loading account data..." />}
          {error && !loading && <ErrorBlock message={error} onRetry={() => void reload()} />}

          {!loading && !error && !data && (
            <EmptyBlock title="No account data" description="Your backend returned an empty account response." />
          )}

          {!loading && !error && data && (
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <GlassCard className="p-2">
                  <div className="space-y-0.5">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-left text-[0.85rem] ${
                          activeTab === item.id
                            ? "bg-[rgba(16,185,129,0.1)] text-[#10b981] border border-[rgba(16,185,129,0.15)]"
                            : "text-[#8ba4a8] hover:text-[#e8ece9] hover:bg-[rgba(16,38,44,0.4)]"
                        }`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </div>

              <div className="space-y-6 pb-16">
                {activeTab === "profile" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <GlassCard className="p-7">
                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-6">
                        Profile Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <ProfileField label="Full Name" value={profileForm.name} onChange={(name) => setProfileForm((p) => ({ ...p, name }))} />
                        <ProfileField label="Email" value={profileForm.email} onChange={(email) => setProfileForm((p) => ({ ...p, email }))} />
                        <ProfileField label="Company" value={profileForm.company} onChange={(company) => setProfileForm((p) => ({ ...p, company }))} />
                        <ProfileField label="Location" value={profileForm.location} onChange={(location) => setProfileForm((p) => ({ ...p, location }))} />
                      </div>
                      <button
                        onClick={() => void handleProfileSave()}
                        disabled={savingProfile}
                        className="mt-6 px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white disabled:opacity-60"
                      >
                        {savingProfile ? "Saving..." : "Save Changes"}
                      </button>
                    </GlassCard>
                  </motion.div>
                )}

                {activeTab === "subscription" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <GlassCard className="p-7">
                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-4">
                        Current Plan
                      </h3>
                      <p className="text-[#8ba4a8] text-sm mb-1">Status: {data.subscription.status}</p>
                      <p className="text-[#e8ece9] text-lg mb-2">{data.subscription.planLabel}</p>
                      <p className="text-[#10b981] text-sm mb-3">Renews on {data.subscription.renewDate}</p>
                      <p className="text-[#8ba4a8] text-sm">
                        {data.subscription.monthlyPriceCents === null
                          ? "Custom contract"
                          : `${formatCurrency(data.subscription.monthlyPriceCents, data.subscription.currency)} / month`}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                        <StatCard label="Devices" value={`${data.subscription.activeDevices}${data.subscription.maxDevices > 0 ? ` / ${data.subscription.maxDevices}` : ""}`} />
                        <StatCard label="Auto-Stops" value={String(data.subscription.autoStops)} />
                        <StatCard label="Days Active" value={String(data.subscription.daysActive)} />
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          onClick={() => void handleOpenBillingPortal()}
                          className="px-5 py-2 rounded-lg border border-[rgba(16,185,129,0.2)] text-[#8ba4a8] hover:text-[#e8ece9]"
                        >
                          Manage Billing
                        </button>
                        <button
                          onClick={handleCopyLicense}
                          className="px-5 py-2 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.15)] text-[#10b981]"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Copy size={14} /> Copy License Key
                          </span>
                        </button>
                      </div>
                    </GlassCard>

                    <GlassCard className="p-7">
                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-4">
                        Deployments
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <ActionButton icon={<Download size={14} />} label="Windows" onClick={() => void handleDownload("windows")} />
                        <ActionButton icon={<Laptop size={14} />} label="macOS" onClick={() => void handleDownload("macos")} />
                        <ActionButton icon={<Shield size={14} />} label="MSI Package" onClick={() => void handleDownload("msi")} />
                      </div>
                      <button
                        onClick={() => void handleComplianceReport()}
                        className="mt-4 px-5 py-2 rounded-lg border border-[rgba(16,185,129,0.2)] text-[#8ba4a8] hover:text-[#e8ece9]"
                      >
                        Generate Compliance Report
                      </button>
                    </GlassCard>
                  </motion.div>
                )}

                {activeTab === "devices" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <GlassCard className="p-7">
                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-4">
                        Registered Devices
                      </h3>
                      {data.devices.length === 0 ? (
                        <EmptyBlock title="No devices registered" description="Devices will appear once they activate with your license key." />
                      ) : (
                        <div className="space-y-3">
                          {data.devices.map((device) => (
                            <div
                              key={device.id}
                              className="rounded-xl border border-[rgba(16,185,129,0.08)] bg-[rgba(16,38,44,0.3)] p-4 flex items-center justify-between gap-4"
                            >
                              <div>
                                <p className="text-[#e8ece9] text-sm">{device.name}</p>
                                <p className="text-[#8ba4a8] text-xs">{device.type} • {device.lastActive}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${device.status === "active" ? "bg-[rgba(16,185,129,0.15)] text-[#10b981]" : "bg-[rgba(239,68,68,0.15)] text-[#f87171]"}`}>
                                {device.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                )}

                {activeTab === "billing" && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <GlassCard className="p-7">
                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-4">
                        Billing History
                      </h3>
                      {data.billingHistory.length === 0 ? (
                        <EmptyBlock title="No invoices yet" description="Billing history will appear after your first charge." />
                      ) : (
                        <div className="space-y-3">
                          {data.billingHistory.map((invoice) => (
                            <div
                              key={invoice.id}
                              className="rounded-xl border border-[rgba(16,185,129,0.08)] bg-[rgba(16,38,44,0.3)] p-4 flex items-center justify-between gap-4"
                            >
                              <div>
                                <p className="text-[#e8ece9] text-sm">{invoice.description}</p>
                                <p className="text-[#8ba4a8] text-xs inline-flex items-center gap-1">
                                  <Calendar size={12} /> {invoice.date}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-[#10b981] text-sm">{formatCurrency(invoice.amountCents, invoice.currency)}</p>
                                <p className="text-[#8ba4a8] text-xs uppercase">{invoice.status}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => void handleOpenBillingPortal()}
                        className="mt-4 px-5 py-2 rounded-lg border border-[rgba(16,185,129,0.2)] text-[#8ba4a8] hover:text-[#e8ece9]"
                      >
                        Open Billing Portal
                      </button>
                    </GlassCard>

                    <GlassCard className="p-7">
                      <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-4">
                        Payment Method
                      </h3>
                      {data.paymentMethod ? (
                        <div className="flex items-center justify-between rounded-xl border border-[rgba(16,185,129,0.08)] bg-[rgba(16,38,44,0.3)] p-4">
                          <div>
                            <p className="text-[#e8ece9] text-sm">{data.paymentMethod.brand} •••• {data.paymentMethod.last4}</p>
                            <p className="text-[#8ba4a8] text-xs">Expires {String(data.paymentMethod.expiryMonth).padStart(2, "0")}/{data.paymentMethod.expiryYear}</p>
                          </div>
                          <Activity size={16} className="text-[#10b981]" />
                        </div>
                      ) : (
                        <EmptyBlock
                          title="No payment method"
                          description="Add a payment method in billing portal to avoid service interruption."
                        />
                      )}
                    </GlassCard>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ProfileField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-[0.78rem] text-[#8ba4a8] block mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-2.5 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] text-[#e8ece9]"
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[rgba(10,26,31,0.5)] p-4">
      <p className="text-[#8ba4a8] text-[0.75rem] mb-1">{label}</p>
      <p className="text-[#e8ece9]" style={{ fontFamily: "'Playfair Display', serif" }}>
        {value}
      </p>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg border border-[rgba(16,185,129,0.18)] px-4 py-3 text-[#8ba4a8] hover:text-[#e8ece9]"
    >
      {icon}
      {label}
    </button>
  );
}
