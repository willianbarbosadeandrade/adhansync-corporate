import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, Volume2, VolumeX, Timer, Bell, Settings } from "lucide-react";
import { GlassCard } from "../GlassCard";
import { IslamicPattern } from "../IslamicPattern";
import { useAsyncData } from "../../hooks/useAsyncData";
import { appApi } from "../../services/api";
import { ErrorBlock, LoadingBlock, EmptyBlock } from "../common/StateBlocks";
import type { DashboardData, PrayerConfigMap } from "../../types/domain";

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function nowToSeconds(now: Date): number {
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}

function formatCountdown(totalSeconds: number) {
  const value = Math.max(0, Math.floor(totalSeconds));
  return {
    h: String(Math.floor(value / 3600)).padStart(2, "0"),
    m: String(Math.floor((value % 3600) / 60)).padStart(2, "0"),
    s: String(value % 60).padStart(2, "0"),
  };
}

type Phase = "playing" | "pre_pause" | "prayer_pause" | "all_done";

interface PhaseInfo {
  phase: Phase;
  prayerName: string;
  secondsLeft: number;
  nextPrayerName: string;
  pauseBeforeMin: number;
  pauseDurationMin: number;
  freePlayMin: number;
}

function buildPhaseInfo(now: Date, data: DashboardData): PhaseInfo {
  const nowSec = nowToSeconds(now);
  const enabled = data.prayers
    .filter((prayer) => prayer.name !== "Sunrise")
    .map((prayer) => {
      const config = data.configs[prayer.name] || { pauseBefore: 0, pauseDuration: 0, enabled: false };
      if (!config.enabled) return null;

      const prayerSec = timeToMinutes(prayer.time) * 60;
      const preStart = prayerSec - config.pauseBefore * 60;
      const pauseEnd = prayerSec + config.pauseDuration * 60;

      return {
        prayer,
        preStart,
        prayerSec,
        pauseEnd,
        config,
      };
    })
    .filter(Boolean) as Array<{
    prayer: DashboardData["prayers"][number];
    preStart: number;
    prayerSec: number;
    pauseEnd: number;
    config: PrayerConfigMap[string];
  }>;

  for (let index = 0; index < enabled.length; index += 1) {
    const item = enabled[index];

    if (nowSec >= item.preStart && nowSec < item.prayerSec) {
      return {
        phase: "pre_pause",
        prayerName: item.prayer.name,
        secondsLeft: item.prayerSec - nowSec,
        nextPrayerName: item.prayer.name,
        pauseBeforeMin: item.config.pauseBefore,
        pauseDurationMin: item.config.pauseDuration,
        freePlayMin: 0,
      };
    }

    if (nowSec >= item.prayerSec && nowSec < item.pauseEnd) {
      return {
        phase: "prayer_pause",
        prayerName: item.prayer.name,
        secondsLeft: item.pauseEnd - nowSec,
        nextPrayerName: enabled[index + 1]?.prayer.name || "—",
        pauseBeforeMin: item.config.pauseBefore,
        pauseDurationMin: item.config.pauseDuration,
        freePlayMin: 0,
      };
    }
  }

  for (const item of enabled) {
    if (nowSec < item.preStart) {
      const freePlaySec = item.preStart - nowSec;
      return {
        phase: "playing",
        prayerName: item.prayer.name,
        secondsLeft: freePlaySec,
        nextPrayerName: item.prayer.name,
        pauseBeforeMin: item.config.pauseBefore,
        pauseDurationMin: item.config.pauseDuration,
        freePlayMin: Math.ceil(freePlaySec / 60),
      };
    }
  }

  return {
    phase: "all_done",
    prayerName: "—",
    secondsLeft: 0,
    nextPrayerName: "—",
    pauseBeforeMin: 0,
    pauseDurationMin: 0,
    freePlayMin: 0,
  };
}

export function AppDashboard() {
  const [now, setNow] = useState(new Date());
  const { data, loading, error, reload } = useAsyncData(() => appApi.getDashboard(), []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const phaseInfo = useMemo(() => {
    if (!data) return null;
    return buildPhaseInfo(now, data);
  }, [now, data]);

  if (loading) return <div className="p-6 lg:p-8 max-w-[1200px] mx-auto"><LoadingBlock label="Loading dashboard..." /></div>;
  if (error) return <div className="p-6 lg:p-8 max-w-[1200px] mx-auto"><ErrorBlock message={error} onRetry={() => void reload()} /></div>;
  if (!data || !phaseInfo) return <div className="p-6 lg:p-8 max-w-[1200px] mx-auto"><EmptyBlock title="No dashboard data" description="Dashboard API returned empty data." /></div>;

  const countdown = formatCountdown(phaseInfo.secondsLeft);
  const ringMaxSec =
    phaseInfo.phase === "pre_pause"
      ? phaseInfo.pauseBeforeMin * 60
      : phaseInfo.phase === "prayer_pause"
        ? phaseInfo.pauseDurationMin * 60
        : phaseInfo.phase === "playing"
          ? phaseInfo.freePlayMin * 60
          : 1;

  const ringProgress = ringMaxSec > 0 ? Math.max(0, Math.min(1, 1 - phaseInfo.secondsLeft / ringMaxSec)) : 1;

  const display = {
    playing: {
      label: "AUDIO PLAYING",
      sublabel: `Until ${phaseInfo.prayerName} pre-pause`,
      color: "#10b981",
      icon: <Volume2 size={14} />,
    },
    pre_pause: {
      label: "PRE-PRAYER PAUSE",
      sublabel: `Preparing for ${phaseInfo.prayerName}`,
      color: "#c9a84c",
      icon: <Timer size={14} />,
    },
    prayer_pause: {
      label: "PRAYER IN PROGRESS",
      sublabel: `${phaseInfo.prayerName} — Audio paused`,
      color: "#f87171",
      icon: <VolumeX size={14} />,
    },
    all_done: {
      label: "ALL PRAYERS COMPLETE",
      sublabel: "Audio playing freely",
      color: "#10b981",
      icon: <Volume2 size={14} />,
    },
  }[phaseInfo.phase];

  const currentDate = new Date(data.dateIso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <IslamicPattern />

      <div className="relative flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <span className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px" }}>A</span>
          </div>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] text-[1.1rem]">AdhanSync</h1>
            <p className="text-[#8ba4a8] text-[0.72rem]">Prayer Time Manager</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-xl bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] flex items-center justify-center text-[#8ba4a8]">
            <Bell size={18} />
          </button>
          <button className="w-10 h-10 rounded-xl bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] flex items-center justify-center text-[#8ba4a8]">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-[240px_1fr_280px] gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-[#8ba4a8]" />
              <div>
                <p className="text-[0.65rem] text-[#8ba4a8] tracking-widest uppercase">Today's Schedule</p>
                <p className="text-[#10b981] text-[0.82rem]" style={{ fontFamily: "'Playfair Display', serif" }}>Prayer Times</p>
              </div>
            </div>

            <div className="space-y-1">
              {data.prayers.filter((prayer) => prayer.name !== "Sunrise").map((prayer) => {
                const [hours, minutes] = prayer.time.split(":").map(Number);
                const prayerMinutes = hours * 60 + minutes;
                const isNext = phaseInfo.nextPrayerName === prayer.name || phaseInfo.prayerName === prayer.name;
                const isPassed = prayerMinutes <= currentMinutes && !isNext;

                const displayTime = `${((hours % 12) || 12).toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;

                return (
                  <div
                    key={prayer.name}
                    className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all ${
                      isNext
                        ? "bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]"
                        : "border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isNext && <div className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />}
                      <span className={`text-[0.88rem] ${isNext ? "text-[#10b981]" : isPassed ? "text-[#5a7a7e]" : "text-[#e8ece9]"}`}>
                        {prayer.name}
                      </span>
                    </div>
                    <span className={`font-mono text-[0.85rem] ${isNext ? "text-[#10b981]" : isPassed ? "text-[#5a7a7e]" : "text-[#e8ece9]"}`}>
                      {displayTime}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[rgba(16,185,129,0.06)] flex items-center justify-between">
              <p className="text-[0.68rem] text-[#5a7a7e]">Location: {data.locationLabel}</p>
              <p className="text-[0.68rem] text-[#5a7a7e]">{currentDate}</p>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
          <p className="text-[0.72rem] text-[#8ba4a8] tracking-[0.2em] uppercase mb-1">{currentDate}</p>
          <p className="text-[#e8ece9] text-[1.1rem] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>{data.locationLabel}</p>

          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
            style={{ backgroundColor: `${display.color}10`, borderColor: `${display.color}30` }}
          >
            <span style={{ color: display.color }}>{display.icon}</span>
            <span className="text-[0.72rem] tracking-[0.15em] uppercase" style={{ color: display.color }}>{display.label}</span>
          </div>

          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mb-6">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(16,185,129,0.08)" strokeWidth="2" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={display.color}
                strokeWidth="2.5"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - ringProgress)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-[0.72rem] tracking-[0.18em] text-[#8ba4a8] uppercase mb-2">{display.sublabel}</p>
              <div className="flex items-center gap-1.5 text-[#e8ece9]" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-[2.6rem] sm:text-[3rem] leading-none">{countdown.h}</span>
                <span className="text-[#5a7a7e] text-[1.4rem]">:</span>
                <span className="text-[2.6rem] sm:text-[3rem] leading-none">{countdown.m}</span>
                <span className="text-[#5a7a7e] text-[1.4rem]">:</span>
                <span className="text-[2.6rem] sm:text-[3rem] leading-none">{countdown.s}</span>
              </div>
              <p className="text-[0.68rem] tracking-[0.16em] text-[#5a7a7e] uppercase mt-2">Hours / Minutes / Seconds</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <GlassCard className="p-5">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-4">System Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-[#8ba4a8]">
                <span>Audio Engine</span>
                <span className={data.audioEngineStatus === "active" ? "text-[#10b981]" : "text-[#f87171]"}>{data.audioEngineStatus}</span>
              </div>
              <div className="flex items-center justify-between text-[#8ba4a8]">
                <span>Master Volume</span>
                <span className="text-[#10b981]">{data.masterVolume}%</span>
              </div>
              <div className="flex items-center justify-between text-[#8ba4a8]">
                <span>Next Prayer</span>
                <span className="text-[#e8ece9]">{phaseInfo.nextPrayerName}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
