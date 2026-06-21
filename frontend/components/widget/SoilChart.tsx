'use client'

import { useEffect, useRef } from 'react'
import { TrendingUp } from 'lucide-react'

interface SoilChartProps {
  data: Array<{ timestamp: string; value: number }>
}

export function SoilChart({ data }: SoilChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const chartData = data.length > 0 ? data : [
    { timestamp: '۰۶:۰۰', value: 42 },
    { timestamp: '۰۹:۰۰', value: 55 },
    { timestamp: '۱۲:۰۰', value: 68 },
    { timestamp: '۱۵:۰۰', value: 58 },
    { timestamp: '۱۸:۰۰', value: 45 },
    { timestamp: '۲۱:۰۰', value: 38 },
    { timestamp: '۰۰:۰۰', value: 32 },
    { timestamp: '۰۳:۰۰', value: 28 },
  ]
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.parentElement?.getBoundingClientRect()
    const width = rect?.width || 600
    const height = 180
    canvas.width = width
    canvas.height = height
    
    const padding = { top: 10, bottom: 20, left: 10, right: 10 }
    const chartWidth = width - padding.left - padding.right
    const chartHeight = height - padding.top - padding.bottom
    
    ctx.clearRect(0, 0, width, height)
    
    const values = chartData.map(d => d.value)
    const maxVal = Math.max(...values, 100)
    const minVal = Math.min(...values, 0)
    const range = maxVal - minVal || 1
    
    // Area
    ctx.beginPath()
    const firstX = padding.left
    const firstY = padding.top + chartHeight - ((values[0] - minVal) / range) * chartHeight
    ctx.moveTo(firstX, firstY)
    
    values.forEach((val, i) => {
      const x = padding.left + (i / (values.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight
      ctx.lineTo(x, y)
    })
    
    const lastX = padding.left + chartWidth
    const lastY = padding.top + chartHeight
    ctx.lineTo(lastX, lastY)
    ctx.lineTo(padding.left, lastY)
    ctx.closePath()
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(45, 106, 79, 0.3)')
    gradient.addColorStop(0.5, 'rgba(45, 106, 79, 0.1)')
    gradient.addColorStop(1, 'rgba(45, 106, 79, 0.02)')
    ctx.fillStyle = gradient
    ctx.fill()
    
    // Line
    ctx.beginPath()
    ctx.strokeStyle = '#2D6A4F'
    ctx.lineWidth = 2.5
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    
    values.forEach((val, i) => {
      const x = padding.left + (i / (values.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
    
    // Dots
    values.forEach((val, i) => {
      const x = padding.left + (i / (values.length - 1)) * chartWidth
      const y = padding.top + chartHeight - ((val - minVal) / range) * chartHeight
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = '#2D6A4F'
      ctx.fill()
    })
    
    // Labels
    ctx.fillStyle = '#6B7A77'
    ctx.font = '10px Vazirmatn, sans-serif'
    ctx.textAlign = 'center'
    const labels = chartData.map(d => d.timestamp)
    labels.forEach((label, i) => {
      if (i % 2 === 0 || i === labels.length - 1) {
        const x = padding.left + (i / (labels.length - 1)) * chartWidth
        ctx.fillText(label, x, height - 4)
      }
    })
    
  }, [chartData])
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-card p-5 shadow-sm border border-white/40 dark:border-gray-700/40">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          تغییرات رطوبت خاک (۲۴ ساعت گذشته)
        </h3>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span>حداقل: ۲۸%</span>
          <span>حداکثر: ۷۸%</span>
          <span>میانگین: ۶۱%</span>
        </div>
      </div>
      <div className="w-full">
        <canvas ref={canvasRef} className="w-full" style={{ height: '180px' }} />
      </div>
    </div>
  )
}
