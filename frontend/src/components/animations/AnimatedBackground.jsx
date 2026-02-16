const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Elegant Gradient Mesh */}
      <svg className="absolute w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="elegantGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.1">
              <animate attributeName="stop-color" values="#1e293b; #334155; #475569; #1e293b" dur="20s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#334155" stopOpacity="0.1">
              <animate attributeName="stop-color" values="#334155; #475569; #1e293b; #334155" dur="20s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          <radialGradient id="elegantGradient2">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
          </radialGradient>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="40" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Subtle Floating Orb */}
        <circle cx="15%" cy="25%" r="300" fill="url(#elegantGradient2)" filter="url(#softGlow)">
          <animate attributeName="cx" values="15%; 18%; 12%; 15%" dur="30s" repeatCount="indefinite" />
          <animate attributeName="cy" values="25%; 28%; 22%; 25%" dur="25s" repeatCount="indefinite" />
        </circle>

        <circle cx="85%" cy="70%" r="350" fill="url(#elegantGradient2)" filter="url(#softGlow)">
          <animate attributeName="cx" values="85%; 82%; 88%; 85%" dur="35s" repeatCount="indefinite" />
          <animate attributeName="cy" values="70%; 73%; 67%; 70%" dur="28s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Minimal Geometric Lines */}
      <svg className="absolute w-full h-full opacity-5 dark:opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="elegantGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-700" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#elegantGrid)" />
      </svg>

      {/* Subtle Floating Particles */}
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {[...Array(8)].map((_, i) => (
          <circle
            key={i}
            cx={`${15 + i * 12}%`}
            cy={`${20 + (i % 3) * 25}%`}
            r="1.5"
            fill="currentColor"
            className="text-slate-400 dark:text-slate-600"
            opacity="0.3"
          >
            <animate
              attributeName="cy"
              values={`${20 + (i % 3) * 25}%; ${25 + (i % 3) * 25}%; ${20 + (i % 3) * 25}%`}
              dur={`${15 + i * 2}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.1; 0.4; 0.1"
              dur={`${8 + i}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

export default AnimatedBackground
