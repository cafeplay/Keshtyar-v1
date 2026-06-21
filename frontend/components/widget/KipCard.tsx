'use client'

import { Thermometer, Droplets, Database, CheckCircle2 } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: number | string
  unit?: string
  change: number | string
  icon: 'temp' | 'soil' | 'tank' | 'status'
  chartData?: number[]
}

const iconMap = {
  temp: { 
    Icon: Thermometer, 
    bg: 'bg-orange-50 dark:bg-orange-900/20', 
    color: 'text-orange-500 dark:text-orange-400' 
  },
  soil: { 
    Icon: Droplets, 
    bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
    color: 'text-emerald-600 dark:text-emerald-400' 
  },
  tank: { 
    Icon: Database, 
    bg: 'bg-blue-50 dark:bg-blue-900/20', 
    color: 'text-blue-500 dark:text-blue-400' 
  },
  status: { 
    Icon: CheckCircle2, 
    bg: 'bg-emerald-50 dark:bg-emerald-900/20', 
    color: 'text-emerald-600 dark:text-emerald-400' 
  },
}

export function KpiCard({ label, value, unit, change, icon, chartData }: KpiCardProps) {
  const { Icon, bg, color } = iconMap[icon]
  const isPositive = typeof change === 'number' ? change > 0 : change === 'پایدار'
  const isGood = typeof change === 'number' ? change > 0 : change === 'پایدار'
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-card p-5 shadow-sm border border-white/40 dark:border-gray-700/40 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold text-gray-800 dark:text-white">{value}</span>
            {unit && <span className="text-sm text-gray-400 dark:text-gray-500"> {unit}</span>}
          </div>
          <span className={`text-xs font-medium ${
            isGood 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-orange-500 dark:text-orange-400'
          }`}>
            {typeof change === 'number' ? (isPositive ? '↑' : '↓') : '✓'} {change}
          </span>
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
      
      {chartData && chartData.length > 0 && (
        <div className="mt-3 h-10 flex items-end gap-0.5">
          {chartData.slice(-20).map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-emerald-200 dark:bg-emerald-800/50 rounded-t transition-all"
              style={{ height: `${Math.max(10, (val / 100) * 100)}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
