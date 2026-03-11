import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, Clock, Shield, TrendingUp } from "lucide-react";
import { GlassCard } from "../GlassCard";
import { IslamicPattern } from "../IslamicPattern";
import { appApi } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../common/StateBlocks";
import { formatCompactNumber } from "@/lib/format";

const tooltipStyle = {
  contentStyle: {
    background: "rgba(16, 38, 44, 0.95)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    borderRadius: "8px",
    color: "#e8ece9",
    fontSize: "0.78rem",
  },
  itemStyle: { color: "#10b981" },
};

export function AppAnalytics() {
  const { data, loading, error, reload } = useAsyncData(() => appApi.getAnalytics(), []);

  if (loading) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><LoadingBlock label="Loading analytics..." /></div>;
  if (error) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><ErrorBlock message={error} onRetry={() => void reload()} /></div>;
  if (!data) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><EmptyBlock title="No analytics data" description="Analytics API returned empty data." /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <IslamicPattern />

      <div className="relative mb-8">
        <p className="text-[0.78rem] text-[#c9a84c] tracking-widest uppercase mb-1">Analytics</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }} className="text-[#e8ece9]">
          Prayer & Audio Analytics
        </h1>
        <p className="text-[#8ba4a8] text-[0.85rem] mt-1">Operational metrics sourced from backend telemetry.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Stops", value: formatCompactNumber(data.totalStops), icon: <Activity size={18} />, color: "#10b981" },
          { label: "Compliance", value: `${data.compliancePercentage.toFixed(1)}%`, icon: <Shield size={18} />, color: "#c9a84c" },
          { label: "Avg Duration", value: `${data.averagePauseMinutes.toFixed(1)} min`, icon: <Clock size={18} />, color: "#10b981" },
          { label: "Streak", value: `${data.activeStreakDays} days`, icon: <TrendingUp size={18} />, color: "#c9a84c" },
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.72rem] text-[#8ba4a8] tracking-wider uppercase">{stat.label}</span>
                <span style={{ color: stat.color }}>{stat.icon}</span>
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", color: stat.color }} className="text-[1.5rem]">{stat.value}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <GlassCard className="p-6">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-5">Weekly Auto-Stops</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyStops}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.06)" />
                  <XAxis dataKey="day" stroke="#8ba4a8" fontSize={12} />
                  <YAxis stroke="#8ba4a8" fontSize={12} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="stops" fill="#10b981" radius={[4, 4, 0, 0]} name="Auto-stops" />
                  <Bar dataKey="prayers" fill="rgba(201,168,76,0.3)" radius={[4, 4, 0, 0]} name="Expected" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="p-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-5">Monthly Compliance</h3>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthlyCompliance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.06)" />
                    <XAxis dataKey="week" stroke="#8ba4a8" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="#8ba4a8" fontSize={12} />
                    <Tooltip {...tooltipStyle} />
                    <defs>
                      <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="compliance" stroke="#10b981" fill="url(#compGrad)" strokeWidth={2} name="Compliance %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <GlassCard className="p-6">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-5">Prayer Breakdown</h3>
              <div className="h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.prayerBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {data.prayerBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {data.prayerBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-[#8ba4a8] text-[0.72rem]">{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <GlassCard className="p-6">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-5">24-Hour Activity Map</h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.hourlyStops}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.06)" />
                  <XAxis dataKey="hour" stroke="#8ba4a8" fontSize={11} />
                  <YAxis stroke="#8ba4a8" fontSize={11} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="stepAfter" dataKey="stops" stroke="#c9a84c" strokeWidth={2} dot={{ fill: "#c9a84c", r: 3 }} name="Stops" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
