import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  gold?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = "", gold = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl backdrop-blur-md
        ${gold
          ? "bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.3)] shadow-[0_0_30px_rgba(201,168,76,0.1)]"
          : "bg-[rgba(16,38,44,0.6)] border border-[rgba(16,185,129,0.12)] shadow-[0_0_30px_rgba(16,185,129,0.05)]"
        }
        ${onClick ? "cursor-pointer hover:border-[rgba(16,185,129,0.3)] transition-all duration-300" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
