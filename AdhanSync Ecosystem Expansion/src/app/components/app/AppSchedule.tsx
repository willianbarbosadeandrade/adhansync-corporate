import { useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Globe,
  MapPin,
  Minus,
  Plus,
  Save,
  Timer,
} from "lucide-react";
import { GlassCard } from "../GlassCard";
import { IslamicPattern } from "../IslamicPattern";
import { useAuth } from "../AuthContext";
import { appApi } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../common/StateBlocks";
import type { PrayerConfigMap } from "../../types/domain";
import { getErrorMessage } from "@/lib/errors";

export function AppSchedule() {
  const { user } = useAuth();
  const isPro = user && (user.plan === "professional" || user.plan === "enterprise");

  const [view, setView] = useState<"prayers" | "week" | "month">("prayers");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [expandedPrayer, setExpandedPrayer] = useState<string | null>(null);
  const [configDraft, setConfigDraft] = useState<PrayerConfigMap>({});
  const [saving, setSaving] = useState(false);

  const { data, loading, error, reload } = useAsyncData(() => appApi.getSchedule(), []);

  useEffect(() => {
    if (!data) return;
    setConfigDraft(data.config);
    setSelectedDay(data.selectedDay);
  }, [data]);

  const editablePrayers = useMemo(() => data?.prayers.filter((prayer) => prayer.name !== "Sunrise") || [], [data]);

  const totalPauseToday = useMemo(() => {
    return Object.values(configDraft).reduce((sum, config) => {
      if (!config?.enabled) return sum;
      return sum + config.pauseBefore + config.pauseDuration;
    }, 0);
  }, [configDraft]);

  const enabledCount = useMemo(() => {
    return Object.values(configDraft).filter((config) => config?.enabled).length;
  }, [configDraft]);

  const adjustValue = (name: string, field: "pauseBefore" | "pauseDuration", delta: number) => {
    const current = configDraft[name];
    if (!current) return;
    const max = field === "pauseBefore" ? 30 : 60;
    const next = Math.max(0, Math.min(max, current[field] + delta));
    setConfigDraft((previous) => ({
      ...previous,
      [name]: {
        ...previous[name],
        [field]: next,
      },
    }));
  };

  const updateConfigField = (name: string, patch: Partial<PrayerConfigMap[string]>) => {
    setConfigDraft((previous) => ({
      ...previous,
      [name]: {
        ...previous[name],
        ...patch,
      },
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const response = await appApi.updateScheduleConfig(configDraft);
      toast.success(response.message || "Prayer audio settings saved.");
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to save schedule settings."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><LoadingBlock label="Loading schedule..." /></div>;
  if (error) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><ErrorBlock message={error} onRetry={() => void reload()} /></div>;
  if (!data) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><EmptyBlock title="No schedule data" description="Schedule API returned empty data." /></div>;

  const selectedMonthDay = data.monthDays.find((item) => item.day === selectedDay) || data.monthDays.find((item) => item.isToday);

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <IslamicPattern />

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-[0.78rem] text-[#c9a84c] tracking-widest uppercase mb-1">Prayer Schedule</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }} className="text-[#e8ece9]">
            Prayer Times
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#10b981]" />
            <span className="text-[#8ba4a8] text-[0.82rem]">
              {data.locationLabel} ({data.latitude.toFixed(4)}°, {data.longitude.toFixed(4)}°)
            </span>
          </div>
          {view === "prayers" && (
            <button
              onClick={() => void handleSaveAll()}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white text-[0.82rem] disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? "Saving..." : "Save All"}
            </button>
          )}
        </div>
      </div>

      <div className="relative flex items-center gap-1 p-1 rounded-xl bg-[rgba(16,38,44,0.5)] border border-[rgba(16,185,129,0.08)] w-fit mb-6">
        {([
          { key: "prayers" as const, label: "Prayer Settings" },
          { key: "week" as const, label: "Week" },
          { key: "month" as const, label: "Month" },
        ]).map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            className={`px-5 py-2 rounded-lg text-[0.82rem] transition-all ${
              view === item.key
                ? "bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[rgba(16,185,129,0.2)]"
                : "text-[#8ba4a8] hover:text-[#e8ece9]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {view === "prayers" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ScheduleStat label="ACTIVE PRAYERS" value={`${enabledCount}/5`} color="#10b981" />
            <ScheduleStat label="TOTAL PAUSE TODAY" value={`${totalPauseToday} min`} color="#c9a84c" />
            <ScheduleStat label="LOCATION" value={data.locationLabel} color="#10b981" />
          </div>

          <div className="space-y-4">
            {editablePrayers.map((prayer, index) => {
              const config = configDraft[prayer.name];
              if (!config) return null;
              const isExpanded = expandedPrayer === prayer.name;

              return (
                <motion.div key={prayer.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <GlassCard className={`overflow-hidden ${!config.enabled ? "opacity-60" : ""}`}>
                    <div
                      onClick={() => setExpandedPrayer(isExpanded ? null : prayer.name)}
                      className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-[rgba(16,185,129,0.02)]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.15)] flex items-center justify-center text-[1.4rem]">
                          {prayer.icon || "🕌"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <p className="text-[#e8ece9] text-[1.1rem]" style={{ fontFamily: "'Playfair Display', serif" }}>{prayer.name}</p>
                            <span className="text-[#8ba4a8] text-[0.78rem]">{prayer.nameAr}</span>
                          </div>
                          <p className="text-[#10b981] font-mono text-[0.92rem] mt-0.5">{prayer.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div
                          onClick={(event) => {
                            event.stopPropagation();
                            updateConfigField(prayer.name, { enabled: !config.enabled });
                          }}
                          className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${config.enabled ? "bg-[#10b981]" : "bg-[#1a3a42]"}`}
                        >
                          <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${config.enabled ? "left-5.5" : "left-0.5"}`} />
                        </div>
                        <div className="text-[#8ba4a8]">{isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-[rgba(16,185,129,0.08)] px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ConfigEditor
                          icon={<Timer size={16} className="text-[#c9a84c]" />}
                          title="Pause Before Prayer"
                          value={config.pauseBefore}
                          color="#c9a84c"
                          min={0}
                          max={30}
                          onDecrease={() => adjustValue(prayer.name, "pauseBefore", -1)}
                          onIncrease={() => adjustValue(prayer.name, "pauseBefore", 1)}
                          onSlider={(value) => updateConfigField(prayer.name, { pauseBefore: value })}
                        />

                        <ConfigEditor
                          icon={<Clock size={16} className="text-[#10b981]" />}
                          title="Pause Duration"
                          value={config.pauseDuration}
                          color="#10b981"
                          min={0}
                          max={60}
                          onDecrease={() => adjustValue(prayer.name, "pauseDuration", -1)}
                          onIncrease={() => adjustValue(prayer.name, "pauseDuration", 1)}
                          onSlider={(value) => updateConfigField(prayer.name, { pauseDuration: value })}
                        />
                      </div>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {view === "week" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <GlassCard className="p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-[#10b981]" />
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">Weekly Prayer Table</h3>
            </div>

            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="text-[#8ba4a8] text-[0.72rem] uppercase tracking-wider border-b border-[rgba(16,185,129,0.08)]">
                  <th className="py-3 pr-4">Day</th>
                  {editablePrayers.map((prayer) => (
                    <th key={prayer.name} className="py-3 pr-4">{prayer.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.week.map((day) => (
                  <tr key={day.dateLabel} className="border-b border-[rgba(16,185,129,0.04)]">
                    <td className="py-3 pr-4 text-[#e8ece9] text-sm">{day.day} <span className="text-[#8ba4a8]">{day.dateLabel}</span></td>
                    {editablePrayers.map((prayer) => (
                      <td key={`${day.dateLabel}-${prayer.name}`} className="py-3 pr-4 text-[#10b981] font-mono text-sm">
                        {day.prayers[prayer.name] || "--:--"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </motion.div>
      )}

      {view === "month" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <button className="p-1.5 rounded-lg bg-[rgba(16,38,44,0.5)] text-[#8ba4a8]">
                  <ChevronLeft size={16} />
                </button>
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">{data.monthLabel}</h3>
                <button className="p-1.5 rounded-lg bg-[rgba(16,38,44,0.5)] text-[#8ba4a8]">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {data.monthDays.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-[0.85rem] ${
                    selectedDay === day.day
                      ? "bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.4)] text-[#10b981]"
                      : day.isToday
                        ? "bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] text-[#c9a84c]"
                        : "text-[#e8ece9] hover:bg-[rgba(16,38,44,0.4)]"
                  }`}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-4">
              {data.monthLabel} {selectedMonthDay?.day || data.selectedDay}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {data.prayers.map((prayer) => (
                <div key={prayer.name} className="bg-[rgba(10,26,31,0.4)] border border-[rgba(16,185,129,0.06)] rounded-lg p-3 text-center">
                  <span className="text-[1.2rem] block mb-1">{prayer.icon || "🕌"}</span>
                  <p className="text-[#e8ece9] text-[0.78rem]">{prayer.name}</p>
                  <p className="text-[#10b981] font-mono text-[0.85rem]">{prayer.time}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {isPro && data.multiLocations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-[#c9a84c]" />
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">Multi-Location Sync</h3>
              <span className="text-[0.6rem] px-2 py-0.5 rounded-full bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border border-[rgba(201,168,76,0.2)] tracking-wider uppercase ml-1">Pro</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {data.multiLocations.map((location) => (
                <div
                  key={location.id}
                  className={`px-4 py-3 rounded-xl border ${
                    location.active
                      ? "bg-[rgba(16,185,129,0.06)] border-[rgba(16,185,129,0.15)]"
                      : "bg-[rgba(16,38,44,0.3)] border-[rgba(16,185,129,0.06)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[#e8ece9] text-[0.88rem]">{location.city}</p>
                    <div className={`w-2 h-2 rounded-full ${location.active ? "bg-[#10b981] animate-pulse" : "bg-[#3a5558]"}`} />
                  </div>
                  <p className="text-[#8ba4a8] text-[0.72rem]">{location.country} • {location.timezone}</p>
                  <p className="text-[#10b981] font-mono text-[0.82rem] mt-1">Fajr: {location.fajrTime}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}

function ScheduleStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <GlassCard className="p-5">
      <p className="text-[0.65rem] text-[#8ba4a8] tracking-[0.15em] uppercase mb-1">{label}</p>
      <p className="text-[1.2rem]" style={{ fontFamily: "'Playfair Display', serif", color }}>{value}</p>
    </GlassCard>
  );
}

function ConfigEditor({
  icon,
  title,
  value,
  min,
  max,
  color,
  onDecrease,
  onIncrease,
  onSlider,
}: {
  icon: ReactNode;
  title: string;
  value: number;
  min: number;
  max: number;
  color: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onSlider: (value: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-[#e8ece9] text-[0.92rem]">{title}</h4>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onDecrease}
          disabled={value <= min}
          className="w-10 h-10 rounded-xl bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] flex items-center justify-center text-[#8ba4a8] disabled:opacity-30"
        >
          <Minus size={16} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-[2rem] font-mono" style={{ fontFamily: "'Playfair Display', serif", color }}>{value}</p>
          <p className="text-[#5a7a7e] text-[0.68rem] tracking-[0.1em] uppercase">minutes</p>
        </div>
        <button
          onClick={onIncrease}
          disabled={value >= max}
          className="w-10 h-10 rounded-xl bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] flex items-center justify-center text-[#8ba4a8] disabled:opacity-30"
        >
          <Plus size={16} />
        </button>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onSlider(Number(event.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#10b981]"
      />
    </div>
  );
}
