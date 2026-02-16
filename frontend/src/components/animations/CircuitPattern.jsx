const CircuitPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>

        {/* Animated Circuit Lines */}
        <g stroke="url(#circuitGradient)" strokeWidth="2" fill="none">
          {/* Horizontal Lines */}
          <line x1="0" y1="20%" x2="100%" y2="20%">
            <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="3s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="40%" x2="100%" y2="40%">
            <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="4s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="60%" x2="100%" y2="60%">
            <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="3.5s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="80%" x2="100%" y2="80%">
            <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="4.5s" repeatCount="indefinite" />
          </line>

          {/* Vertical Lines */}
          <line x1="20%" y1="0" x2="20%" y2="100%">
            <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="3.2s" repeatCount="indefinite" />
          </line>
          <line x1="40%" y1="0" x2="40%" y2="100%">
            <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="4.2s" repeatCount="indefinite" />
          </line>
          <line x1="60%" y1="0" x2="60%" y2="100%">
            <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="3.8s" repeatCount="indefinite" />
          </line>
          <line x1="80%" y1="0" x2="80%" y2="100%">
            <animate attributeName="stroke-dasharray" values="0,1000; 1000,0" dur="4.8s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Animated Nodes */}
        <g fill="url(#circuitGradient)">
          {[
            { cx: '20%', cy: '20%' },
            { cx: '40%', cy: '40%' },
            { cx: '60%', cy: '60%' },
            { cx: '80%', cy: '80%' },
            { cx: '20%', cy: '80%' },
            { cx: '80%', cy: '20%' }
          ].map((pos, i) => (
            <circle key={i} cx={pos.cx} cy={pos.cy} r="4">
              <animate
                attributeName="r"
                values="4; 8; 4"
                dur="2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.5; 1; 0.5"
                dur="2s"
                begin={`${i * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>

        {/* Traveling Dots */}
        {[...Array(6)].map((_, i) => (
          <circle
            key={`dot-${i}`}
            r="3"
            fill="#3b82f6"
            opacity="0.8"
          >
            <animateMotion
              dur={`${4 + i}s`}
              repeatCount="indefinite"
              path={`M ${10 + i * 15},0 L ${10 + i * 15},100`}
            />
            <animate
              attributeName="opacity"
              values="0; 0.8; 0"
              dur={`${4 + i}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>
    </div>
  )
}

export default CircuitPattern
