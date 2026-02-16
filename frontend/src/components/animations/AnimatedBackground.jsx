const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orbs */}
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#3b82f6; #8b5cf6; #ec4899; #3b82f6" dur="10s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#8b5cf6; #ec4899; #3b82f6; #8b5cf6" dur="10s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
          
          <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#ec4899; #3b82f6; #8b5cf6; #ec4899" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#3b82f6; #8b5cf6; #ec4899; #3b82f6" dur="8s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <filter id="glow">
            <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Floating Orb 1 */}
        <circle cx="20%" cy="30%" r="200" fill="url(#gradient1)" filter="url(#glow)">
          <animate attributeName="cx" values="20%; 25%; 15%; 20%" dur="20s" repeatCount="indefinite" />
          <animate attributeName="cy" values="30%; 35%; 25%; 30%" dur="15s" repeatCount="indefinite" />
          <animate attributeName="r" values="200; 250; 180; 200" dur="12s" repeatCount="indefinite" />
        </circle>

        {/* Floating Orb 2 */}
        <circle cx="80%" cy="60%" r="250" fill="url(#gradient2)" filter="url(#glow)">
          <animate attributeName="cx" values="80%; 75%; 85%; 80%" dur="18s" repeatCount="indefinite" />
          <animate attributeName="cy" values="60%; 55%; 65%; 60%" dur="16s" repeatCount="indefinite" />
          <animate attributeName="r" values="250; 200; 280; 250" dur="14s" repeatCount="indefinite" />
        </circle>

        {/* Floating Orb 3 */}
        <circle cx="50%" cy="80%" r="180" fill="url(#gradient1)" filter="url(#glow)" opacity="0.5">
          <animate attributeName="cx" values="50%; 55%; 45%; 50%" dur="22s" repeatCount="indefinite" />
          <animate attributeName="cy" values="80%; 75%; 85%; 80%" dur="19s" repeatCount="indefinite" />
          <animate attributeName="r" values="180; 220; 160; 180" dur="13s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Animated Grid Pattern */}
      <svg className="absolute w-full h-full opacity-10 dark:opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-400 dark:text-slate-600">
              <animate attributeName="stroke-opacity" values="0.3; 0.6; 0.3" dur="4s" repeatCount="indefinite" />
            </path>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Floating Particles */}
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {[...Array(20)].map((_, i) => (
          <circle
            key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={Math.random() * 3 + 1}
            fill="currentColor"
            className="text-blue-400 dark:text-blue-300"
            opacity="0.3"
          >
            <animate
              attributeName="cy"
              values={`${Math.random() * 100}%; ${Math.random() * 100}%; ${Math.random() * 100}%`}
              dur={`${Math.random() * 10 + 10}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.1; 0.5; 0.1"
              dur={`${Math.random() * 3 + 2}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

export default AnimatedBackground
