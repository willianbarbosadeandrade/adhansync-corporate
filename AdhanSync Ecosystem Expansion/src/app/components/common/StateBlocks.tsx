import { AlertCircle, Loader2 } from "lucide-react";

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="w-full rounded-xl border border-[rgba(16,185,129,0.12)] bg-[rgba(16,38,44,0.4)] p-6 text-center text-[#8ba4a8]">
      <div className="inline-flex items-center gap-2">
        <Loader2 size={16} className="animate-spin" />
        <span>{label}</span>
      </div>
    </div>
  );
}

export function ErrorBlock({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="w-full rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.08)] p-6 text-center">
      <div className="inline-flex items-center gap-2 text-[#f87171] mb-2">
        <AlertCircle size={16} />
        <span>Unable to load data</span>
      </div>
      <p className="text-[#fecaca] text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg border border-[rgba(239,68,68,0.3)] px-4 py-2 text-sm text-[#fecaca] hover:bg-[rgba(239,68,68,0.12)]"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyBlock({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full rounded-xl border border-[rgba(16,185,129,0.12)] bg-[rgba(16,38,44,0.2)] p-6 text-center">
      <p className="text-[#e8ece9]">{title}</p>
      <p className="text-[#8ba4a8] text-sm mt-2">{description}</p>
    </div>
  );
}
