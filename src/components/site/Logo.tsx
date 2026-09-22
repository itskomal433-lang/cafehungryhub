import { cn } from "@/lib/utils";

/** Hungry Hub Luxury Golden Botanical Monogram Crest */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "h-9 w-9 shrink-0 transition-all duration-300 hover:scale-108 drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)]",
        className,
      )}
    >
      <defs>
        {/* Luxury Champagne Gold Metallic Gradient */}
        <linearGradient
          id="hh-gold-linear"
          x1="15"
          y1="10"
          x2="85"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFF4D0" />
          <stop offset="25%" stopColor="#E6C26D" />
          <stop offset="50%" stopColor="#DFAC42" />
          <stop offset="75%" stopColor="#BF8823" />
          <stop offset="100%" stopColor="#8C5B0D" />
        </linearGradient>

        {/* Deep Emerald-Velvet Shield Gradient */}
        <radialGradient id="hh-shield-bg" cx="45%" cy="35%" r="65%" fx="40%" fy="25%">
          <stop offset="0%" stopColor="#1C402E" />
          <stop offset="60%" stopColor="#11291E" />
          <stop offset="100%" stopColor="#08140E" />
        </radialGradient>

        {/* Soft Golden Bloom Filter */}
        <filter id="hh-gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#D4AF37" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Luxury Squircle Base Shield */}
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="26"
        fill="url(#hh-shield-bg)"
        stroke="url(#hh-gold-linear)"
        strokeWidth="2.5"
      />

      {/* Inner Golden Hairline Ring */}
      <rect
        x="9.5"
        y="9.5"
        width="81"
        height="81"
        rx="21"
        fill="none"
        stroke="url(#hh-gold-linear)"
        strokeWidth="0.8"
        strokeOpacity="0.5"
        strokeDasharray="4 2"
      />

      {/* Top Specular Arc Highlight */}
      <path
        d="M 18 18 C 30 11, 70 11, 82 18"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.25"
      />

      {/* Central Prestigious Golden 'H' Monogram */}
      <g filter="url(#hh-gold-glow)">
        {/* Left Column with Serifs */}
        <path
          d="M 23 27 H 37 V 33 H 32 V 67 H 37 V 73 H 23 V 67 H 28 V 33 H 23 Z"
          fill="url(#hh-gold-linear)"
        />

        {/* Right Column with Serifs */}
        <path
          d="M 63 27 H 77 V 33 H 72 V 67 H 77 V 73 H 63 V 67 H 68 V 33 H 63 Z"
          fill="url(#hh-gold-linear)"
        />

        {/* Sculpted Crossbar with Center Gem */}
        <path d="M 32 46 H 68 V 54 H 32 Z" fill="url(#hh-gold-linear)" />
        {/* Center Diamond Jewel */}
        <polygon points="50,44 55,50 50,56 45,50" fill="#FFF4D0" />
      </g>

      {/* Symmetrical Botanical Laurel Leaves */}
      {/* Left Laurel Branch */}
      <path d="M 15 50 C 13 42, 17 34, 21 30 C 20 37, 18 45, 15 50 Z" fill="url(#hh-gold-linear)" />
      <path d="M 14 55 C 11 62, 14 70, 19 73 C 18 66, 16 59, 14 55 Z" fill="url(#hh-gold-linear)" />
      {/* Right Laurel Branch */}
      <path d="M 85 50 C 87 42, 83 34, 79 30 C 80 37, 82 45, 85 50 Z" fill="url(#hh-gold-linear)" />
      <path d="M 86 55 C 89 62, 86 70, 81 73 C 82 66, 84 59, 86 55 Z" fill="url(#hh-gold-linear)" />

      {/* Top Artisan 4-Point Crown Sparkle */}
      <path
        d="M 50 12 Q 50 18, 54 18 Q 50 18, 50 24 Q 50 18, 46 18 Q 50 18, 50 12 Z"
        fill="#FFF4D0"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 select-none", className)}>
      <LogoMark />
      <span className="leading-tight">
        <span className="block font-display text-xl font-extrabold tracking-wide uppercase drop-shadow-xs">
          HUNGRY HUB
        </span>
        <span className="block text-[0.62rem] font-bold tracking-[0.24em] text-gold uppercase">
          Café & Artisan Lounge · 24H
        </span>
      </span>
    </span>
  );
}
