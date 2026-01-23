// Cute minimalist house illustrations and decorative elements

export function HouseIcon({ size = 120, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Roof */}
      <path
        d="M60 15L15 50H105L60 15Z"
        fill="url(#roofGradient)"
        stroke="#38bdf8"
        strokeWidth="2"
      />
      {/* House Body */}
      <rect
        x="25"
        y="50"
        width="70"
        height="55"
        rx="4"
        fill="white"
        stroke="#e4e4e7"
        strokeWidth="2"
      />
      {/* Door */}
      <rect
        x="50"
        y="70"
        width="20"
        height="35"
        rx="2"
        fill="url(#doorGradient)"
      />
      <circle cx="66" cy="88" r="2" fill="white" />
      {/* Windows */}
      <rect
        x="32"
        y="60"
        width="15"
        height="15"
        rx="2"
        fill="#bae6fd"
        stroke="#7dd3fc"
        strokeWidth="1.5"
      />
      <rect
        x="73"
        y="60"
        width="15"
        height="15"
        rx="2"
        fill="#bae6fd"
        stroke="#7dd3fc"
        strokeWidth="1.5"
      />
      {/* Window crosses */}
      <line x1="39.5" y1="60" x2="39.5" y2="75" stroke="#7dd3fc" strokeWidth="1" />
      <line x1="32" y1="67.5" x2="47" y2="67.5" stroke="#7dd3fc" strokeWidth="1" />
      <line x1="80.5" y1="60" x2="80.5" y2="75" stroke="#7dd3fc" strokeWidth="1" />
      <line x1="73" y1="67.5" x2="88" y2="67.5" stroke="#7dd3fc" strokeWidth="1" />
      {/* Chimney */}
      <rect
        x="80"
        y="25"
        width="12"
        height="20"
        rx="2"
        fill="#f4f4f5"
        stroke="#d4d4d8"
        strokeWidth="1.5"
      />
      {/* Smoke */}
      <circle cx="86" cy="18" r="4" fill="#e4e4e7" opacity="0.6" />
      <circle cx="90" cy="12" r="3" fill="#e4e4e7" opacity="0.4" />
      {/* Sun */}
      <circle cx="20" cy="25" r="8" fill="#fbbf24" />
      <g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
        <line x1="20" y1="10" x2="20" y2="14" />
        <line x1="20" y1="36" x2="20" y2="40" />
        <line x1="5" y1="25" x2="9" y2="25" />
        <line x1="31" y1="25" x2="35" y2="25" />
        <line x1="9" y1="14" x2="12" y2="17" />
        <line x1="28" y1="33" x2="31" y2="36" />
        <line x1="9" y1="36" x2="12" y2="33" />
        <line x1="28" y1="17" x2="31" y2="14" />
      </g>
      {/* Grass */}
      <path
        d="M0 105C10 103 20 107 30 105C40 103 50 107 60 105C70 103 80 107 90 105C100 103 110 107 120 105V120H0V105Z"
        fill="url(#grassGradient)"
      />
      {/* Flowers */}
      <g>
        <circle cx="15" cy="100" r="3" fill="#f472b6" />
        <circle cx="12" cy="97" r="2" fill="#f472b6" />
        <circle cx="18" cy="97" r="2" fill="#f472b6" />
        <circle cx="15" cy="94" r="2" fill="#f472b6" />
        <circle cx="15" cy="97" r="2" fill="#fbbf24" />
      </g>
      <g>
        <circle cx="105" cy="100" r="3" fill="#a78bfa" />
        <circle cx="102" cy="97" r="2" fill="#a78bfa" />
        <circle cx="108" cy="97" r="2" fill="#a78bfa" />
        <circle cx="105" cy="94" r="2" fill="#a78bfa" />
        <circle cx="105" cy="97" r="2" fill="#fbbf24" />
      </g>
      {/* Tree */}
      <rect x="100" y="85" width="4" height="15" fill="#a1a1aa" rx="1" />
      <circle cx="102" cy="75" r="12" fill="#86efac" />
      <circle cx="96" cy="80" r="8" fill="#4ade80" />
      <circle cx="108" cy="80" r="8" fill="#4ade80" />
      <defs>
        <linearGradient id="roofGradient" x1="15" y1="15" x2="105" y2="50">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="doorGradient" x1="50" y1="70" x2="70" y2="105">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
        <linearGradient id="grassGradient" x1="0" y1="100" x2="0" y2="120">
          <stop stopColor="#86efac" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RoomIcon({ type, size = 48, className = '' }) {
  const icons = {
    backyard: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect width="48" height="48" rx="12" fill="url(#backyardBg)" />
        <path d="M12 35H36" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 35V20" stroke="#a1a1aa" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="15" r="8" fill="#86efac" />
        <circle cx="20" cy="17" r="5" fill="#4ade80" />
        <circle cx="28" cy="17" r="5" fill="#4ade80" />
        <circle cx="14" cy="30" r="3" fill="#fbbf24" />
        <circle cx="34" cy="28" r="3" fill="#f472b6" />
        <defs>
          <linearGradient id="backyardBg" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#dcfce7" />
            <stop offset="1" stopColor="#bbf7d0" />
          </linearGradient>
        </defs>
      </svg>
    ),
    frontyard: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect width="48" height="48" rx="12" fill="url(#frontyardBg)" />
        <rect x="14" y="18" width="20" height="18" rx="2" fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
        <path d="M10 18L24 8L38 18" stroke="#38bdf8" strokeWidth="2" fill="none" />
        <rect x="21" y="26" width="6" height="10" rx="1" fill="#7dd3fc" />
        <rect x="16" y="22" width="5" height="5" rx="1" fill="#bae6fd" />
        <rect x="27" y="22" width="5" height="5" rx="1" fill="#bae6fd" />
        <defs>
          <linearGradient id="frontyardBg" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#e0f2fe" />
            <stop offset="1" stopColor="#bae6fd" />
          </linearGradient>
        </defs>
      </svg>
    ),
    basement: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect width="48" height="48" rx="12" fill="url(#basementBg)" />
        <rect x="12" y="12" width="24" height="24" rx="2" fill="#f4f4f5" stroke="#d4d4d8" strokeWidth="1.5" />
        <path d="M12 24H36" stroke="#d4d4d8" strokeWidth="1.5" />
        <circle cx="24" cy="30" r="4" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" />
        <path d="M24 27V33M21 30H27" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="16" y="14" width="4" height="6" rx="1" fill="#a1a1aa" />
        <rect x="28" y="14" width="4" height="6" rx="1" fill="#a1a1aa" />
        <defs>
          <linearGradient id="basementBg" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#fafafa" />
            <stop offset="1" stopColor="#e4e4e7" />
          </linearGradient>
        </defs>
      </svg>
    ),
    mainfloor: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect width="48" height="48" rx="12" fill="url(#mainfloorBg)" />
        <rect x="10" y="20" width="28" height="18" rx="2" fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
        <rect x="14" y="24" width="8" height="6" rx="1" fill="#fef3c7" />
        <rect x="26" y="24" width="8" height="6" rx="1" fill="#dcfce7" />
        <rect x="20" y="32" width="8" height="6" rx="1" fill="#e0f2fe" />
        <circle cx="24" cy="14" r="4" fill="#fbbf24" />
        <path d="M20 14H28" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="mainfloorBg" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#fef3c7" />
            <stop offset="1" stopColor="#fde68a" />
          </linearGradient>
        </defs>
      </svg>
    ),
    upperfloor: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect width="48" height="48" rx="12" fill="url(#upperfloorBg)" />
        <path d="M10 28L24 14L38 28" fill="#7dd3fc" />
        <rect x="14" y="28" width="20" height="12" rx="1" fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
        <rect x="17" y="31" width="5" height="5" rx="1" fill="#bae6fd" />
        <rect x="26" y="31" width="5" height="5" rx="1" fill="#bae6fd" />
        <circle cx="37" cy="12" r="5" fill="#fbbf24" opacity="0.8" />
        <defs>
          <linearGradient id="upperfloorBg" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#e0f2fe" />
            <stop offset="1" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
      </svg>
    ),
    attic: (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
        <rect width="48" height="48" rx="12" fill="url(#atticBg)" />
        <path d="M8 32L24 14L40 32H8Z" fill="#d4d4d8" stroke="#a1a1aa" strokeWidth="1.5" />
        <circle cx="24" cy="24" r="5" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5" />
        <rect x="18" y="32" width="12" height="8" rx="1" fill="white" stroke="#e4e4e7" strokeWidth="1" />
        <defs>
          <linearGradient id="atticBg" x1="0" y1="0" x2="48" y2="48">
            <stop stopColor="#f4f4f5" />
            <stop offset="1" stopColor="#d4d4d8" />
          </linearGradient>
        </defs>
      </svg>
    )
  };

  return icons[type] || icons.mainfloor;
}

export function MaintenanceIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <rect width="48" height="48" rx="12" fill="url(#maintBg)" />
      <path
        d="M32 16L26 22L30 26L36 20C37.5 22.5 37 26 34.5 28.5C32 31 28.5 31.5 26 30L18 38L14 34L22 26C20.5 23.5 21 20 23.5 17.5C26 15 29.5 14.5 32 16Z"
        fill="white"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="22" r="2" fill="#38bdf8" />
      <defs>
        <linearGradient id="maintBg" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#e0f2fe" />
          <stop offset="1" stopColor="#bae6fd" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CostIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <rect width="48" height="48" rx="12" fill="url(#costBg)" />
      <circle cx="24" cy="24" r="12" fill="white" stroke="#22c55e" strokeWidth="2" />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fill="#22c55e"
        fontWeight="bold"
        fontSize="16"
        fontFamily="sans-serif"
      >
        $
      </text>
      <circle cx="16" cy="14" r="4" fill="#fbbf24" opacity="0.6" />
      <circle cx="32" cy="34" r="3" fill="#86efac" opacity="0.6" />
      <defs>
        <linearGradient id="costBg" x1="0" y1="0" x2="48" y2="48">
          <stop stopColor="#dcfce7" />
          <stop offset="1" stopColor="#bbf7d0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function EmptyStateIllustration({ type, size = 120, className = '' }) {
  const illustrations = {
    tasks: (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
        <circle cx="60" cy="60" r="50" fill="#f0fdf4" />
        <circle cx="60" cy="60" r="35" fill="#dcfce7" />
        <path
          d="M45 60L55 70L75 50"
          stroke="#22c55e"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="85" cy="30" r="8" fill="#fbbf24" opacity="0.5" />
        <circle cx="30" cy="80" r="6" fill="#38bdf8" opacity="0.5" />
      </svg>
    ),
    costs: (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
        <circle cx="60" cy="60" r="50" fill="#e0f2fe" />
        <rect x="35" y="40" width="50" height="40" rx="4" fill="white" stroke="#38bdf8" strokeWidth="2" />
        <path d="M35 55H85" stroke="#bae6fd" strokeWidth="2" />
        <circle cx="50" cy="70" r="8" fill="#fbbf24" />
        <rect x="62" y="65" width="15" height="3" rx="1.5" fill="#d4d4d8" />
        <rect x="62" y="72" width="10" height="3" rx="1.5" fill="#d4d4d8" />
      </svg>
    ),
    notifications: (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
        <circle cx="60" cy="60" r="50" fill="#fef3c7" />
        <path
          d="M60 25C45 25 35 35 35 50V70L30 80H90L85 70V50C85 35 75 25 60 25Z"
          fill="white"
          stroke="#fbbf24"
          strokeWidth="2"
        />
        <circle cx="60" cy="90" r="8" fill="#fbbf24" />
        <circle cx="75" cy="35" r="6" fill="#ef4444" />
      </svg>
    )
  };

  return illustrations[type] || illustrations.tasks;
}

export function DecorationDots({ className = '' }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className={className}>
      <circle cx="10" cy="10" r="4" fill="#86efac" opacity="0.6" />
      <circle cx="30" cy="10" r="4" fill="#38bdf8" opacity="0.6" />
      <circle cx="50" cy="10" r="4" fill="#fbbf24" opacity="0.6" />
      <circle cx="10" cy="30" r="4" fill="#38bdf8" opacity="0.4" />
      <circle cx="30" cy="30" r="4" fill="#86efac" opacity="0.4" />
      <circle cx="50" cy="30" r="4" fill="#f472b6" opacity="0.4" />
      <circle cx="10" cy="50" r="4" fill="#fbbf24" opacity="0.3" />
      <circle cx="30" cy="50" r="4" fill="#a78bfa" opacity="0.3" />
      <circle cx="50" cy="50" r="4" fill="#86efac" opacity="0.3" />
    </svg>
  );
}
