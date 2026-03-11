import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Monitor,
  RefreshCw,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { GlassCard } from "../GlassCard";
import { IslamicPattern } from "../IslamicPattern";
import { appApi } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../common/StateBlocks";
import { getErrorMessage } from "@/lib/errors";

export function AppAdmin() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, loading, error, reload } = useAsyncData(() => appApi.getAdminData(), []);

  const filteredDepartments = useMemo(() => {
    if (!data) return [];
    return data.departments.filter((department) => department.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  const stats = useMemo(() => {
    if (!data) return { totalSeats: 0, totalActive: 0, compliance: "0.0" };
    const totalSeats = data.departments.reduce((sum, department) => sum + department.seats, 0);
    const totalActive = data.departments.reduce((sum, department) => sum + department.active, 0);
    const compliance =
      data.departments.length > 0
        ? (data.departments.reduce((sum, department) => sum + department.compliance, 0) / data.departments.length).toFixed(1)
        : "0.0";
    return { totalSeats, totalActive, compliance };
  }, [data]);

  const handleSync = async () => {
    try {
      const response = await appApi.syncAdminData();
      toast.success(response.message || "Sync complete.");
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to sync admin data."));
    }
  };

  const handleExport = async () => {
    try {
      const response = await appApi.exportAdminReport();
      window.open(response.url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to export report."));
    }
  };

  if (loading) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><LoadingBlock label="Loading admin panel..." /></div>;
  if (error) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><ErrorBlock message={error} onRetry={() => void reload()} /></div>;
  if (!data) return <div className="p-6 lg:p-8 max-w-6xl mx-auto"><EmptyBlock title="No admin data" description="Admin API returned empty data." /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <IslamicPattern />

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-[0.78rem] text-[#c9a84c] tracking-widest uppercase mb-1">Enterprise Admin</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }} className="text-[#e8ece9]">
            Deployment Management
          </h1>
          <p className="text-[#8ba4a8] text-[0.85rem] mt-1">{data.companyName}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => void handleSync()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[rgba(16,185,129,0.15)] text-[#8ba4a8] hover:text-[#e8ece9] text-[0.82rem]"
          >
            <RefreshCw size={14} /> Sync
          </button>
          <button
            onClick={() => void handleExport()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white text-[0.82rem]"
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Seats", value: stats.totalSeats, icon: <Users size={18} />, color: "#10b981" },
          { label: "Active Devices", value: stats.totalActive, icon: <Monitor size={18} />, color: "#10b981" },
          { label: "Compliance", value: `${stats.compliance}%`, icon: <Shield size={18} />, color: "#c9a84c" },
          { label: "Departments", value: data.departments.length, icon: <Building2 size={18} />, color: "#c9a84c" },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">Department Overview</h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7a7e]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.1)] text-[#e8ece9] text-[0.82rem] w-[180px]"
                />
              </div>
            </div>

            <div className="space-y-2">
              {filteredDepartments.length === 0 && (
                <EmptyBlock title="No departments found" description="Try another search term." />
              )}

              {filteredDepartments.map((department) => {
                const utilization = department.seats > 0 ? Math.round((department.active / department.seats) * 100) : 0;
                return (
                  <div key={department.id} className="px-5 py-4 rounded-xl bg-[rgba(16,38,44,0.3)] border border-[rgba(16,185,129,0.06)]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Building2 size={16} className="text-[#10b981]" />
                        <span className="text-[#e8ece9] text-[0.88rem]">{department.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#8ba4a8] text-[0.78rem]">{department.active}/{department.seats} seats</span>
                        <span className="text-[0.75rem] px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.1)] text-[#10b981]">{department.compliance}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(16,38,44,0.6)] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-[#10b981] to-[#0d7a56]" style={{ width: `${utilization}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6 h-fit lg:sticky lg:top-6">
          <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] mb-5">Activity Feed</h3>
          <div className="space-y-3">
            {data.recentEvents.map((event) => (
              <div key={event.id} className="flex items-start gap-3 pb-3 border-b border-[rgba(16,185,129,0.04)] last:border-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    event.status === "success"
                      ? "bg-[rgba(16,185,129,0.1)] text-[#10b981]"
                      : event.status === "error"
                        ? "bg-[rgba(239,68,68,0.1)] text-[#f87171]"
                        : "bg-[rgba(201,168,76,0.1)] text-[#c9a84c]"
                  }`}
                >
                  {event.status === "success" ? <CheckCircle2 size={12} /> : event.status === "error" ? <AlertCircle size={12} /> : <Clock size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#e8ece9] text-[0.78rem]">{event.event}</p>
                  <p className="text-[#5a7a7e] text-[0.68rem]">{event.department} • {event.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-[rgba(16,185,129,0.08)]">
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.companyName);
                toast.success("Company identifier copied.");
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[rgba(16,38,44,0.5)] text-[#8ba4a8] hover:text-[#10b981]"
            >
              <Copy size={14} /> Copy Company Identifier
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
