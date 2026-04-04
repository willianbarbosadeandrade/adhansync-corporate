import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Check, Globe, MonitorSpeaker, Play, Save, Timer, Volume2, VolumeX, Zap } from "lucide-react";
import { GlassCard } from "../GlassCard";
import { IslamicPattern } from "../IslamicPattern";
import { appApi } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../common/StateBlocks";
import type { AudioSettingsData } from "../../types/domain";
import { getErrorMessage } from "@/lib/errors";

export function AppAudio() {
  const [draft, setDraft] = useState<AudioSettingsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const { data, loading, error, reload } = useAsyncData(() => appApi.getAudioSettings(), []);

  useEffect(() => {
    if (!data) return;
    setDraft(data);
  }, [data]);

  const stats = useMemo(() => {
    if (!draft) return { activeSources: 0, autoMuted: 0, avgVolume: 0 };
    const autoMuted = [draft.browserMuteDuringPrayer, draft.systemMuteDuringPrayer].filter(Boolean).length;
    const avgVolume = Math.round((draft.browserVolume + draft.systemVolume) / 2);
    return {
      activeSources: 2,
      autoMuted,
      avgVolume,
    };
  }, [draft]);

  const updateDraft = <K extends keyof AudioSettingsData>(key: K, value: AudioSettingsData[K]) => {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  };

  const saveChanges = async () => {
    if (!draft) return;
    setSaving(true);
    try {
      const response = await appApi.updateAudioSettings(draft);
      toast.success(response.message || "Audio settings saved.");
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to save audio settings."));
    } finally {
      setSaving(false);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    try {
      const response = await appApi.runAdhanSimulation();
      toast.success(response.message || "Adhan simulation started.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to run simulation."));
    } finally {
      setSimulating(false);
    }
  };

  if (loading) return <div className="p-6 lg:p-8 max-w-[1100px] mx-auto"><LoadingBlock label="Loading audio settings..." /></div>;
  if (error) return <div className="p-6 lg:p-8 max-w-[1100px] mx-auto"><ErrorBlock message={error} onRetry={() => void reload()} /></div>;
  if (!draft) return <div className="p-6 lg:p-8 max-w-[1100px] mx-auto"><EmptyBlock title="No audio data" description="Audio API returned empty data." /></div>;

  const currentBrowser = draft.browserOptions.find((option) => option.id === draft.selectedBrowserId);

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto">
      <IslamicPattern />

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <p className="text-[0.78rem] text-[#c9a84c] tracking-widest uppercase mb-1">Audio Controls</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }} className="text-[#e8ece9]">
            Audio Source Manager
          </h1>
          <p className="text-[#8ba4a8] text-[0.85rem] mt-1">
            Manage browser/system sources and secure pause behavior during prayer.
          </p>
        </div>

        <button
          onClick={() => void saveChanges()}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white disabled:opacity-60"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="space-y-4">
          {[
            { label: "ACTIVE SOURCES", value: String(stats.activeSources).padStart(2, "0") },
            { label: "AUTO-MUTED", value: String(stats.autoMuted).padStart(2, "0") },
            { label: "AVG VOLUME", value: `${stats.avgVolume}%` },
          ].map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}>
              <GlassCard className="p-5">
                <p className="text-[0.65rem] text-[#8ba4a8] tracking-[0.15em] uppercase mb-1">{stat.label}</p>
                <p className="text-[#e8ece9] text-[1.8rem]" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.value}</p>
              </GlassCard>
            </motion.div>
          ))}

          <GlassCard className="p-5">
            <p className="text-[0.65rem] text-[#8ba4a8] tracking-[0.15em] uppercase mb-4">Master Volume</p>
            <div className="flex items-center gap-2 mb-4">
              <Volume2 size={16} className="text-[#8ba4a8]" />
              <input
                type="range"
                min={0}
                max={100}
                value={draft.masterVolume}
                onChange={(event) => updateDraft("masterVolume", Number(event.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#10b981]"
              />
              <span className="text-[0.78rem] text-[#10b981] font-mono w-10 text-right">{draft.masterVolume}%</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Timer size={13} className="text-[#c9a84c]" />
                  <span className="text-[0.72rem] text-[#8ba4a8]">Fade Duration</span>
                </div>
                <span className="text-[#c9a84c] text-[0.78rem] font-mono">{draft.fadeDurationSeconds}s</span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={draft.fadeDurationSeconds}
                onChange={(event) => updateDraft("fadeDurationSeconds", Number(event.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c9a84c]"
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-[#c9a84c]" />
              <h4 className="text-[#e8ece9] text-[0.88rem]" style={{ fontFamily: "'Playfair Display', serif" }}>Adhan Simulation</h4>
            </div>
            <p className="text-[#5a7a7e] text-[0.72rem] mb-4">
              Validate backend-driven pause orchestration against your configured audio policy.
            </p>
            <button
              onClick={() => void runSimulation()}
              disabled={simulating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#c9a84c] to-[#b8943f] text-[#0a1a1f] disabled:opacity-60"
            >
              <Play size={16} />
              {simulating ? "Running..." : "Run Simulation"}
            </button>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.15)] flex items-center justify-center text-[#10b981]">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[#e8ece9] text-[1rem]">Browser Source</p>
                  <p className="text-[#10b981] text-[0.75rem]">{currentBrowser?.name || "Not selected"}</p>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${draft.systemPaused ? "bg-[#f87171]" : "bg-[#10b981]"}`} />
            </div>

            <div className="space-y-4">
              <select
                value={draft.selectedBrowserId}
                onChange={(event) => updateDraft("selectedBrowserId", event.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[rgba(10,26,31,0.6)] border border-[rgba(16,185,129,0.15)] text-[#e8ece9]"
              >
                {draft.browserOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>

              <ToggleRow
                label="Mute Browser During Prayer"
                value={draft.browserMuteDuringPrayer}
                onToggle={() => updateDraft("browserMuteDuringPrayer", !draft.browserMuteDuringPrayer)}
              />

              <SliderRow
                label="Browser Volume"
                value={draft.browserVolume}
                onChange={(value) => updateDraft("browserVolume", value)}
              />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.15)] flex items-center justify-center text-[#10b981]">
                  <MonitorSpeaker size={20} />
                </div>
                <div>
                  <p className="text-[#e8ece9] text-[1rem]">System Sounds</p>
                  <p className="text-[#10b981] text-[0.75rem]">Desktop and local apps</p>
                </div>
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${draft.systemPaused ? "bg-[#f87171]" : "bg-[#10b981]"}`} />
            </div>

            <div className="space-y-4">
              <ToggleRow
                label="Mute System During Prayer"
                value={draft.systemMuteDuringPrayer}
                onToggle={() => updateDraft("systemMuteDuringPrayer", !draft.systemMuteDuringPrayer)}
              />

              <SliderRow
                label="System Volume"
                value={draft.systemVolume}
                onChange={(value) => updateDraft("systemVolume", value)}
              />

              <ToggleRow
                label="Pause Engine Globally"
                value={draft.systemPaused}
                onToggle={() => updateDraft("systemPaused", !draft.systemPaused)}
              />
            </div>
          </GlassCard>
        </div>
      </div>
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
    <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-[rgba(10,26,31,0.5)] border border-[rgba(16,185,129,0.06)]">
      <div className="flex items-center gap-2">
        {value ? <Check size={14} className="text-[#10b981]" /> : <VolumeX size={14} className="text-[#8ba4a8]" />}
        <span className="text-[#e8ece9] text-[0.82rem]">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`w-10 h-5 rounded-full transition-all relative ${value ? "bg-[#10b981]" : "bg-[#1a3a42]"}`}
      >
        <span className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${value ? "left-5.5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#8ba4a8] text-[0.78rem]">{label}</span>
        <span className="text-[#10b981] text-[0.78rem] font-mono">{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#10b981]"
      />
    </div>
  );
}
