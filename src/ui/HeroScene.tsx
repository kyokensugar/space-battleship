import './HeroScene.css'

/** Human fleet (left, blue) facing the alien fleet (right, green) — inline SVG so it needs no image files. */
export function HeroScene() {
  return (
    <svg className="hero-scene" viewBox="0 0 900 260" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fb3d1" />
          <stop offset="1" stopColor="#3b4a66" />
        </linearGradient>
        <linearGradient id="alien" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ef5b0" />
          <stop offset="1" stopColor="#1f5b46" />
        </linearGradient>
        <radialGradient id="planet" cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#5d7fd8" />
          <stop offset="1" stopColor="#0b1233" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="300" cy="80" rx="220" ry="70" fill="#7c3aed" opacity="0.04" />
      <ellipse cx="640" cy="200" rx="260" ry="80" fill="#22c55e" opacity="0.03" />
      <circle cx="450" cy="300" r="170" fill="url(#planet)" opacity="0.9" />
      <path d="M280 300 a170 170 0 0 1 340 0" fill="none" stroke="#93c5fd" strokeOpacity="0.5" strokeWidth="1.5" />
      <ellipse cx="450" cy="300" rx="185" ry="175" fill="none" stroke="#38bdf8" strokeOpacity="0.25" strokeWidth="2" />

      {/* Human fleet */}
      <g className="fleet human">
        <g transform="translate(60 120)">
          <polygon points="0,20 120,0 200,20 120,40" fill="url(#hull)" />
          <polygon points="40,20 90,-18 110,-18 90,20" fill="#64748b" />
          <rect x="70" y="8" width="60" height="24" rx="4" fill="#1e293b" />
          <g fill="#7dd3fc">
            <rect x="82" y="16" width="6" height="8" rx="1" />
            <rect x="96" y="16" width="6" height="8" rx="1" />
            <rect x="110" y="16" width="6" height="8" rx="1" />
          </g>
          <circle cx="150" cy="20" r="4" fill="#38bdf8" filter="url(#glow)" />
          <rect x="-16" y="14" width="18" height="12" rx="2" fill="#38bdf8" className="thruster" />
        </g>
        <g transform="translate(40 60) scale(0.6)">
          <polygon points="0,20 120,0 200,20 120,40" fill="url(#hull)" />
          <circle cx="150" cy="20" r="5" fill="#38bdf8" filter="url(#glow)" />
          <rect x="-16" y="14" width="18" height="12" rx="2" fill="#38bdf8" className="thruster" />
        </g>
        <g transform="translate(30 190) scale(0.6)">
          <polygon points="0,20 120,0 200,20 120,40" fill="url(#hull)" />
          <circle cx="150" cy="20" r="5" fill="#38bdf8" filter="url(#glow)" />
          <rect x="-16" y="14" width="18" height="12" rx="2" fill="#38bdf8" className="thruster" />
        </g>
        <line x1="270" y1="140" x2="420" y2="128" stroke="#38bdf8" strokeWidth="3" className="beam" filter="url(#glow)" />
      </g>

      {/* Alien fleet */}
      <g className="fleet alien">
        <g transform="translate(640 120)">
          <ellipse cx="100" cy="20" rx="110" ry="26" fill="url(#alien)" />
          <ellipse cx="100" cy="14" rx="46" ry="16" fill="#0f3a2c" />
          <circle cx="100" cy="14" r="8" fill="#c084fc" filter="url(#glow)" className="eye" />
          <path d="M20 40 q-10 30 10 50 M60 44 q0 30 -14 46 M140 44 q0 30 14 46 M180 40 q10 30 -10 50" stroke="#7ef5b0" strokeWidth="3" fill="none" strokeOpacity="0.8" className="tentacle" />
        </g>
        <g transform="translate(700 50) scale(0.55)">
          <ellipse cx="100" cy="20" rx="110" ry="26" fill="url(#alien)" />
          <circle cx="100" cy="14" r="10" fill="#c084fc" filter="url(#glow)" className="eye" />
        </g>
        <g transform="translate(720 200) scale(0.5)">
          <ellipse cx="100" cy="20" rx="110" ry="26" fill="url(#alien)" />
          <circle cx="100" cy="14" r="10" fill="#c084fc" filter="url(#glow)" className="eye" />
        </g>
        <line x1="630" y1="140" x2="480" y2="132" stroke="#a3ff7a" strokeWidth="3" className="beam alien-beam" filter="url(#glow)" />
      </g>
    </svg>
  )
}
