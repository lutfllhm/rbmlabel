const CircuitPattern = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5 dark:opacity-10">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="luxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* Minimal Elegant Lines */}
        <g stroke="url(#luxuryGradient)" strokeWidth="1" fill="none" opacity="0.3">
          {/* Horizontal Lines */}
          <line x1="0" y1="25%" x2="100%" y2="25%">
            <animate attributeName="stroke-dasharray" values="0,2000; 2000,0" dur="8s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="50%" x2="100%" y2="50%">
            <animate attributeName="stroke-dasharray" values="0,2000; 2000,0" dur="10s" repeatCount="indefinite" />
          </line>
          <line x1="0" y1="75%" x2="100%" y2="75%">
            <animate attributeName="stroke-dasharray" values="0,2000; 2000,0" dur="9s" repeatCount="indefinite" />
          </line>

          {/* Vertical Lines */}
          <line x1="25%" y1="0" x2="25%" y2="100%">
            <animate attributeName="stroke-dasharray" values="0,2000; 2000,0" dur="9s" repeatCount="indefinite" />
          </line>
          <line x1="50%" y1="0" x2="50%" y2="100%">
            <animate attributeName="stroke-dasharray" values="0,2000; 2000,0" dur="11s" repeatCount="indefinite" />
          </line>
          <line x1="75%" y1="0" x2="75%" y2="100%">
            <animate attributeName="stroke-dasharray" values="0,2000; 2000,0" dur="10s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Subtle Nodes */}
        <g fill="url(#luxuryGradient)" opacity="0.4">
          {[
            { cx: '25%', cy: '25%' },
            { cx: '50%', cy: '50%' },
            { cx: '75%', cy: '75%' }
          ].map((pos, i) => (
            <circle key={i} cx={pos.cx} cy={pos.cy} r="2">
              <animate
                attributeName="r"
                values="2; 4; 2"
                dur="4s"
                begin={`${i * 1.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2; 0.6; 0.2"
                dur="4s"
                begin={`${i * 1.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </g>
      </svg>
    </div>
  )
}

export default CircuitPattern
