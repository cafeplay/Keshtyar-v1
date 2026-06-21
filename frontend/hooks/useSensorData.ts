'use client'

import { useState, useEffect } from 'react'
import { get } from '@/lib/api-client'
import { apiConfig } from '@/config/api'

interface SensorData {
  temperature: number
  soil_moisture: number
  tank_level: number
  humidity: number
  temperatureHistory: number[]
  soilHistory: number[]
  tankHistory: number[]
  history: Array<{ timestamp: string; value: number }>
  relays: Array<{
    id: string
    name: string
    gpio: number
    state: boolean
    mode: 'auto' | 'manual'
  }>
  forecast: any
}

export function useSensorData() {
  const [data, setData] = useState<SensorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await get<SensorData>('/dashboard')
      setData(response)
      setError(null)
    } catch (err) {
      setError('خطا در دریافت داده‌ها')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
    
    // به‌روزرسانی هر ۳۰ ثانیه
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])
  
  return { data, loading, error, refetch: fetchData }
}
