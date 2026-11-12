import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function LogoMark({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden {...props}>
      <circle cx="16" cy="16" r="14.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3.1" fill="currentColor" />
      <path d="M16 7.2a8.8 8.8 0 0 1 8.8 8.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3.7a12.3 12.3 0 0 1 12.3 12.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      <path d="M16 24.8A8.8 8.8 0 0 1 7.2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 28.3A12.3 12.3 0 0 1 3.7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

export function ArrowUpRight({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M7 17 17 7M8.5 7H17v8.5" />
    </svg>
  );
}

export function ArrowRight({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 12h16m0 0-6-6m6 6-6 6" />
    </svg>
  );
}

export function ArrowUp({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 20V4m0 0-6 6m6-6 6 6" />
    </svg>
  );
}

export function ArrowLeft({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M20 12H4m0 0 6-6m-6 6 6 6" />
    </svg>
  );
}

export function Headphones({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 14v-2a8 8 0 1 1 16 0v2" />
      <path d="M4 14h2.4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2v-4Zm16 0h-2.4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1H18a2 2 0 0 0 2-2v-4Z" />
    </svg>
  );
}

export function Volume({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 9.5v5h3l5 4v-13l-5 4H4Z" />
      <path d="M16 8.5a5 5 0 0 1 0 7M18.7 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  );
}

export function VolumeOff({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 9.5v5h3l5 4v-13l-5 4H4Z" />
      <path d="m16 9.5 5 5m0-5-5 5" />
    </svg>
  );
}

export function Voice({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <rect x="9" y="2.5" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5M8.5 21.5h7" />
    </svg>
  );
}

export function Vibrate({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <rect x="8" y="4" width="8" height="16" rx="1.6" />
      <path d="M4 9v6M2 11v2M20 9v6M22 11v2" />
    </svg>
  );
}

export function Users({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.3a3 3 0 0 1 0 5.4M17.5 14a5.5 5.5 0 0 1 3 5" />
    </svg>
  );
}

export function Scan({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M3.5 8V4.5H7M17 4.5h3.5V8M20.5 16v3.5H17M7 19.5H3.5V16" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <path d="M12 12a4 4 0 0 1 4-4M12 12a6.5 6.5 0 0 0-6.5-6.5" opacity="0.6" />
    </svg>
  );
}

export function Route({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M8 18h5.5a4 4 0 0 0 0-8H10a4 4 0 0 1 0-8" opacity="0" />
      <path d="M8 18h4.5a3.5 3.5 0 0 0 0-7H10a3.5 3.5 0 0 1 0-7h6" />
    </svg>
  );
}

export function EyeOff({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M3 3l18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.4 5.4A9.7 9.7 0 0 1 12 5c5.5 0 9 7 9 7a16 16 0 0 1-2.6 3.5M6.2 6.9A16.5 16.5 0 0 0 3 12s3.5 7 9 7a9.6 9.6 0 0 0 4.2-.95" />
    </svg>
  );
}

export function Check({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function Play({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden {...props}>
      <path d="M8 5.3c0-.9 1-1.4 1.7-.9l9.2 6.7c.6.4.6 1.4 0 1.8l-9.2 6.7c-.7.5-1.7 0-1.7-.9V5.3Z" />
    </svg>
  );
}

export function Menu({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function Close({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

export function Info({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.5v.01" />
    </svg>
  );
}

export function Compass({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.8 8.2-2 5.6-5.6 2 2-5.6 5.6-2Z" />
    </svg>
  );
}

export function Spark({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden {...props}>
      <path d="M12 1.5c.5 4.8 2.8 8.1 8.5 9.5-5.7 1.4-8 4.7-8.5 9.5-.5-4.8-2.8-8.1-8.5-9.5 5.7-1.4 8-4.7 8.5-9.5Z" />
    </svg>
  );
}

export function Quote({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden {...props}>
      <path d="M9.6 5C6 6.5 3.6 9.6 3.6 13.6c0 3 1.8 5.4 4.4 5.4 2.2 0 3.8-1.6 3.8-3.8 0-2-1.4-3.5-3.3-3.5-.3 0-.7 0-1 .2.4-1.9 1.8-3.4 3.8-4.3L9.6 5Zm10.4 0c-3.6 1.5-6 4.6-6 8.6 0 3 1.8 5.4 4.4 5.4 2.2 0 3.8-1.6 3.8-3.8 0-2-1.4-3.5-3.3-3.5-.3 0-.7 0-1 .2.4-1.9 1.8-3.4 3.8-4.3L20 5Z" />
    </svg>
  );
}

export function Alert({ className, ...props }: IconProps) {
  return (
    <svg {...base} className={className} {...props}>
      <path d="M12 3.5 21 20H3L12 3.5Z" />
      <path d="M12 9.5v4.5M12 17v.01" />
    </svg>
  );
}
