import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Clock,
  Crown,
  GripVertical,
  Lock,
  Music,
  Star,
} from "lucide-react";
import { GlassCard } from "../GlassCard";
import { IslamicPattern } from "../IslamicPattern";
import { useAuth } from "../AuthContext";
import { appApi } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { EmptyBlock, ErrorBlock, LoadingBlock } from "../common/StateBlocks";
import { formatDuration } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import type { AdhanTrack } from "../../types/domain";

export function AppAdhan() {
  const { user } = useAuth();
  const isPro = user && (user.plan === "professional" || user.plan === "enterprise");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [savingDefault, setSavingDefault] = useState(false);

  const { data, loading, error, reload, setData } = useAsyncData(() => appApi.getAdhanLibrary(), []);

  useEffect(() => {
    if (!data) return;
    setSelectedId(data.activeTrackId || data.tracks[0]?.id || null);
  }, [data]);

  const selectedTrack = useMemo(() => {
    if (!data || !selectedId) return null;
    return data.tracks.find((track) => track.id === selectedId) || null;
  }, [data, selectedId]);

  const handleSelectTrack = (track: AdhanTrack) => {
    if (track.premium && !isPro) {
      toast.error("Premium recitation. Upgrade required.");
      return;
    }
    setSelectedId(track.id);
  };

  const handleSetDefault = async () => {
    if (!selectedTrack || !data) return;
    if (selectedTrack.premium && !isPro) {
      toast.error("Your current plan does not include this recitation.");
      return;
    }

    setSavingDefault(true);
    try {
      const response = await appApi.setDefaultAdhan(selectedTrack.id);
      toast.success(response.message || "Default Adhan updated.");
      setData({
        ...data,
        activeTrackId: selectedTrack.id,
        tracks: data.tracks.map((track) => ({ ...track, isDefault: track.id === selectedTrack.id })),
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Unable to update default Adhan."));
    } finally {
      setSavingDefault(false);
    }
  };

  if (loading) return <div className="p-6 lg:p-8 max-w-[1100px] mx-auto"><LoadingBlock label="Loading Adhan library..." /></div>;
  if (error) return <div className="p-6 lg:p-8 max-w-[1100px] mx-auto"><ErrorBlock message={error} onRetry={() => void reload()} /></div>;
  if (!data) return <div className="p-6 lg:p-8 max-w-[1100px] mx-auto"><EmptyBlock title="No Adhan tracks" description="Adhan API returned empty data." /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto">
      <IslamicPattern />

      <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <p className="text-[0.78rem] text-[#c9a84c] tracking-widest uppercase mb-1">Adhan Library</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.4rem, 3vw, 1.8rem)" }} className="text-[#e8ece9]">
            Adhan Recitations
          </h1>
          <p className="text-[#8ba4a8] text-[0.85rem] mt-1">{data.tracks.length} tracks synced from your account library</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-3">
          {data.tracks.map((track, index) => {
            const isSelected = selectedId === track.id;
            const isLocked = track.premium && !isPro;

            return (
              <motion.div key={track.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <div
                  onClick={() => setSelectedId(track.id)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer ${
                    isSelected
                      ? "bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.25)]"
                      : "bg-[rgba(16,38,44,0.4)] border border-[rgba(16,185,129,0.06)]"
                  } ${isLocked ? "opacity-70" : ""}`}
                >
                  <GripVertical size={16} className="text-[#3a5558] shrink-0" />

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSelectTrack(track);
                    }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isLocked ? "bg-[rgba(90,122,126,0.1)] text-[#5a7a7e]" : "bg-[rgba(16,38,44,0.8)] text-[#8ba4a8]"
                    }`}
                  >
                    {isLocked ? <Lock size={16} /> : <Music size={16} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-[0.92rem] truncate ${isSelected ? "text-[#10b981]" : "text-[#e8ece9]"}`}>{track.name}</p>
                      {track.premium && (
                        <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border border-[rgba(201,168,76,0.2)] tracking-wider uppercase flex items-center gap-0.5 shrink-0">
                          <Crown size={9} /> PRO
                        </span>
                      )}
                      {track.isDefault && (
                        <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full bg-[rgba(16,185,129,0.15)] text-[#10b981] border border-[rgba(16,185,129,0.2)] tracking-wider uppercase shrink-0">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p className="text-[#8ba4a8] text-[0.75rem] mt-0.5">{track.reciter} • {track.region}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock size={12} className="text-[#5a7a7e]" />
                    <span className="text-[#8ba4a8] text-[0.78rem] font-mono">{formatDuration(track.durationSeconds)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-4">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center text-white">
                <Music size={20} />
              </div>
              <div>
                <p className="text-[0.65rem] text-[#8ba4a8] tracking-widest uppercase">Selected</p>
                <p className="text-[#10b981] text-[0.88rem]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedTrack?.name || "No track selected"}
                </p>
              </div>
            </div>

            {selectedTrack ? (
              <>
                <div className="space-y-3 mb-5">
                  <InfoRow label="Reciter" value={selectedTrack.reciter} />
                  <InfoRow label="Region" value={selectedTrack.region} />
                  <InfoRow label="Duration" value={formatDuration(selectedTrack.durationSeconds)} />
                  <InfoRow label="Tier" value={selectedTrack.premium ? "Premium" : "Standard"} />
                </div>

                <button
                  onClick={() => void handleSetDefault()}
                  disabled={savingDefault}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white disabled:opacity-60"
                >
                  <Star size={14} />
                  {savingDefault ? "Saving..." : "Set as Default"}
                </button>
              </>
            ) : (
              <EmptyBlock title="Select a track" description="Choose a recitation from the list to view details." />
            )}
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[#e8ece9] text-[0.88rem]" style={{ fontFamily: "'Playfair Display', serif" }}>Active Adhan</h4>
              <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse" />
            </div>
            <p className="text-[#10b981] text-[0.85rem] mb-1">{data.tracks.find((track) => track.id === data.activeTrackId)?.name || "Not configured"}</p>
            <p className="text-[#8ba4a8] text-[0.72rem]">Playback and enforcement are handled by backend + desktop engine.</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#8ba4a8] text-[0.78rem]">{label}</span>
      <span className="text-[#e8ece9] text-[0.78rem]">{value}</span>
    </div>
  );
}
