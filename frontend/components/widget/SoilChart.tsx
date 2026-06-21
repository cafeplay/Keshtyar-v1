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
    
    // Draw area
    ctx.beginPath()
    const firstX = padding.left
    const firstY = padding.top + chartHeight - ((values[0] - minVal) / range) * chartHeight
    ctx.moveTo(firstX, firstY)
    
    values.forEach
