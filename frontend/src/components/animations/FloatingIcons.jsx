import { Package, Tags, FileText, BarChart3, TrendingUp, Zap } from 'lucide-react'

const FloatingIcons = () => {
  const icons = [
    { Icon: Package, delay: 0, duration: 20, x: 10, y: 15 },
    { Icon: Tags, delay: 3, duration: 22, x: 85, y: 20 },
    { Icon: FileText, delay: 6, duration: 24, x: 15, y: 75 },
    { Icon: BarChart3, delay: 2, duration: 21, x: 80, y: 70 }
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay, duration, x, y }, index) => (
        <div
          key={index}
          className="absolute opacity-5 dark:opacity-10"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            animation: `float ${duration}s ease-in-out infinite`,
            animationDelay: `${delay}s`
          }}
        >
          <Icon 
            className="w-20 h-20 text-slate-600 dark:text-slate-400" 
            strokeWidth={0.5}
          />
        </div>
      ))}
    </div>
  )
}

export default FloatingIcons
