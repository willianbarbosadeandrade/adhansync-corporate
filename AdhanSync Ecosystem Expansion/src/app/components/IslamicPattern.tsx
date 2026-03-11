import { useId } from "react";

export function IslamicPattern() {
  const id = useId();
  const patternId = `islamic-geo-${id}`;

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={patternId} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="#10b981" strokeWidth="0.5" />
          <circle cx="40" cy="40" r="16" fill="none" stroke="#10b981" strokeWidth="0.5" />
          <path d="M20 0 L40 20 L60 0" fill="none" stroke="#c9a84c" strokeWidth="0.3" />
          <path d="M80 20 L60 40 L80 60" fill="none" stroke="#c9a84c" strokeWidth="0.3" />
          <path d="M60 80 L40 60 L20 80" fill="none" stroke="#c9a84c" strokeWidth="0.3" />
          <path d="M0 60 L20 40 L0 20" fill="none" stroke="#c9a84c" strokeWidth="0.3" />
          <circle cx="40" cy="40" r="6" fill="none" stroke="#10b981" strokeWidth="0.3" />
          <path d="M40 24 L40 56" fill="none" stroke="#10b981" strokeWidth="0.2" />
          <path d="M24 40 L56 40" fill="none" stroke="#10b981" strokeWidth="0.2" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
