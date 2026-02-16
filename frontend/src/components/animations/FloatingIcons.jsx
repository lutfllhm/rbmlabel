import { Package, Tags, FileText, BarChart3, TrendingUp, Zap } from 'lucide-react'

const FloatingIcons = () => {
  const icons = [
    { Icon: Package, delay: 0, duration: 15 },
    { Icon: Tags, delay: 2, duration: 18 },
    { Icon: FileText, delay: 4, duration: 20 },
    { Icon: BarChart3, delay: 1, duration: 16 },
    { Icon: TrendingUp, delay: 3, duration: 19 },
    { Icon: Zap, delay: 5, duration: 17 }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay, duration }, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${10 + index * 15}%`,
            top: `${20 + (index % 3) * 25}%`,
            animation: `float ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            opacity: 0.1
          }}
        >
          <Icon 
            className="w-16 h-16 text-blue-500 dark:text-blue-400" 
            strokeWidth={1}
          />
        </div>
      ))}
    </div>
  )
}

export default FloatingIcons
