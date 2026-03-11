import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  AlertTriangle,
  Bell,
  Compass,
  MapPin,
  Monitor,
  RotateCcw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import { GlassCard } from "../GlassCard";
import { IslamicPattern } from "../IslamicPattern";
import { appApi } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../common/StateBlocks";
import type { AppSettingsData } from "../../types/domain";
import { getErrorMessage } from "@/lib/errors";

export function AppSettings() {
  const [view, setView] = useState<"location" | "system" | "notifications">("location");
  const [draft, setDraft] = useState<AppSettingsData | null>(null);
  const [unlockConfirmText, setUnlockConfirmText] = useState("");
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload, setData } = useAsyncData(() => appApi.getSettings(), []);

  useEffect(() => {
    if (!data) return;
    setDraft(data);
  }, [data]);

  const updateDraft = <K extends keyof AppSettingsData>(key: K, value: AppSettingsData[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const response = await appApi.updateSettings(draft);
      toast.success(response.message || "Settings saved.");
      setData(draft);
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to save settings."));
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!data) return;
    setDraft(data);
    toast.info("Local changes reset.");
  };

  const handleUnlock = async () => {
    if (!draft) return;
    if (unlockConfirmText.trim().toUpperCase() !== "CONFIRM") {
      toast.error("Please type CONFIRM to unlock.");
      return;
    }

    try {
      const response = await appApi.unlockLocation(unlockConfirmText.trim());
      toast.success(response.message || "Location unlocked.");
      const updated = { ...draft, locationLocked: false };
      setDraft(updated);
      setData(updated);
      setShowUnlockModal(false);
      setUnlockConfirmText("");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to unlock location."));
    }
  };

  if (loading) return <div className="p-6 lg:p-8 max-w-[1000px] mx-auto"><LoadingBlock label="Loading settings..." /></div>;
  if (error) return <div className="p-6 lg:p-8 max-w-[1000px] mx-auto"><ErrorBlock message={error} onRetry={() => void reload()} /></div>;
  if (!draft) return <div className="p-6 lg:p-8 max-w-[1000px] mx-auto"><EmptyBlock title="No settings data" description="Settings API returned empty data." /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-[1000px] mx-auto">
      <IslamicPattern />

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }} className="text-[#e8ece9]">
            {view === "location" ? "Location Settings" : view === "system" ? "System Settings" : "Notifications"}
          </h1>
          <p className="text-[#8ba4a8] text-[0.85rem] mt-1">All changes are persisted through authenticated API endpoints.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(16,185,129,0.15)] text-[#8ba4a8]">
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white disabled:opacity-60"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-xl bg-[rgba(16,38,44,0.5)] border border-[rgba(16,185,129,0.08)] w-fit mb-8">
        {([
          { key: "location" as const, label: "Location", icon: <MapPin size={15} /> },
          { key: "system" as const, label: "System", icon: <Monitor size={15} /> },
          { key: "notifications" as const, label: "Notifications", icon: <Bell size={15} /> },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[0.82rem] ${
              view === tab.key
                ? "bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[rgba(16,185,129,0.2)]"
                : "text-[#8ba4a8]"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {view === "location" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <GlassCard className={`p-6 ${draft.locationLocked ? "border-[rgba(16,185,129,0.25)]" : "border-[rgba(201,168,76,0.3)]"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${draft.locationLocked ? "bg-[rgba(16,185,129,0.1)]" : "bg-[rgba(201,168,76,0.1)]"}`}>
                  {draft.locationLocked ? <ShieldCheck size={22} className="text-[#10b981]" /> : <ShieldAlert size={22} className="text-[#c9a84c]" />}
                </div>
                <div>
                  <p className="text-[#e8ece9] text-[1.1rem]" style={{ fontFamily: "'Playfair Display', serif" }}>{draft.currentLocation}</p>
                  <p className="text-[#8ba4a8] text-[0.78rem]">{draft.latitude}°, {draft.longitude}° • {draft.lockedAt}</p>
                  {!draft.locationLocked && (
                    <p className="text-[#c9a84c] text-[0.68rem] mt-1 flex items-center gap-1">
                      <AlertTriangle size={10} /> Location unlocked — save settings to keep latest values.
                    </p>
                  )}
                </div>
              </div>

              {draft.locationLocked ? (
                <button
                  onClick={() => setShowUnlockModal(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[rgba(201,168,76,0.25)] text-[#c9a84c]"
                >
                  <Unlock size={14} /> Unlock to Edit
                </button>
              ) : (
                <span className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.15)] text-[#c9a84c] text-[0.78rem]">
                  <Unlock size={14} /> Editing mode
                </span>
              )}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-5">Change Location</h3>
              <div className="space-y-4">
                <InputRow label="Location Label" value={draft.currentLocation} onChange={(value) => updateDraft("currentLocation", value)} disabled={draft.locationLocked} />
                <InputRow label="Latitude" value={draft.latitude} onChange={(value) => updateDraft("latitude", value)} disabled={draft.locationLocked} />
                <InputRow label="Longitude" value={draft.longitude} onChange={(value) => updateDraft("longitude", value)} disabled={draft.locationLocked} />

                <div>
                  <label className="text-[0.78rem] text-[#8ba4a8] block mb-1.5">Calculation Method</label>
                  <select
                    value={draft.calculationMethodId}
                    onChange={(event) => updateDraft("calculationMethodId", event.target.value)}
                    disabled={draft.locationLocked}
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] text-[#e8ece9] disabled:opacity-50"
                  >
                    {draft.calculationMethods.map((method) => (
                      <option key={method.id} value={method.id}>{method.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <Compass size={18} className="text-[#10b981]" />
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">Quick Locations</h3>
              </div>

              <div className="space-y-2">
                {draft.quickLocations.map((location) => (
                  <button
                    key={location.label}
                    onClick={() => {
                      if (draft.locationLocked) {
                        toast.error("Unlock location first.");
                        return;
                      }
                      updateDraft("currentLocation", location.label);
                      updateDraft("latitude", location.lat);
                      updateDraft("longitude", location.lng);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg bg-[rgba(16,38,44,0.35)] border border-[rgba(16,185,129,0.06)] text-[#e8ece9]"
                  >
                    <p className="text-sm">{location.label}</p>
                    <p className="text-[#8ba4a8] text-xs">{location.lat}, {location.lng}</p>
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </motion.div>
      )}

      {view === "system" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GlassCard className="p-6">
            <ToggleRow label="Start with OS" value={draft.startWithOS} onToggle={() => updateDraft("startWithOS", !draft.startWithOS)} />
            <ToggleRow label="Minimize to tray" value={draft.minimizeToTray} onToggle={() => updateDraft("minimizeToTray", !draft.minimizeToTray)} />
            <ToggleRow label="Show countdown" value={draft.showCountdown} onToggle={() => updateDraft("showCountdown", !draft.showCountdown)} />
            <ToggleRow label="Dark mode" value={draft.darkMode} onToggle={() => updateDraft("darkMode", !draft.darkMode)} />
          </GlassCard>
        </motion.div>
      )}

      {view === "notifications" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GlassCard className="p-6 space-y-4">
            <div>
              <label className="text-[0.78rem] text-[#8ba4a8] block mb-1.5">Notify before prayer (minutes)</label>
              <input
                type="number"
                min={0}
                max={60}
                value={draft.notifyBeforeMinutes}
                onChange={(event) => updateDraft("notifyBeforeMinutes", Number(event.target.value))}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] text-[#e8ece9]"
              />
            </div>

            <ToggleRow label="Desktop notifications" value={draft.desktopNotifications} onToggle={() => updateDraft("desktopNotifications", !draft.desktopNotifications)} />
            <ToggleRow label="Sound notifications" value={draft.soundNotifications} onToggle={() => updateDraft("soundNotifications", !draft.soundNotifications)} />
          </GlassCard>
        </motion.div>
      )}

      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-[rgba(201,168,76,0.25)] bg-[#0f2328] p-6">
            <h3 className="text-[#e8ece9] text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Confirm Unlock</h3>
            <p className="text-[#8ba4a8] text-sm mt-2">Type <strong>CONFIRM</strong> to unlock location editing.</p>

            <input
              value={unlockConfirmText}
              onChange={(event) => setUnlockConfirmText(event.target.value)}
              className="mt-4 w-full px-4 py-3 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] text-[#e8ece9]"
              placeholder="CONFIRM"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowUnlockModal(false)} className="px-4 py-2 rounded-lg border border-[rgba(16,185,129,0.15)] text-[#8ba4a8]">
                Cancel
              </button>
              <button onClick={() => void handleUnlock()} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#dfc06a] text-[#1a1400]">
                Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-[0.78rem] text-[#8ba4a8] block mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full px-4 py-3 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] text-[#e8ece9] disabled:opacity-50"
      />
    </div>
  );
}

function ToggleRow({
  label,
  value,
  onToggle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex items-center justify-between py-3.5 cursor-pointer">
      <span className="text-[#e8ece9] text-[0.88rem]">{label}</span>
      <button
        onClick={onToggle}
        type="button"
        className={`w-10 h-5 rounded-full transition-all relative ${value ? "bg-[#10b981]" : "bg-[#1a3a42]"}`}
      >
        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${value ? "left-5.5" : "left-0.5"}`} />
      </button>
    </label>
  );
}
