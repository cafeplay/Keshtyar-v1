'use client'

import { useState, useEffect } from 'react'
import { get } from '@/lib/api-client'
import { HistoryCalendar } from '@/components/widgets/HistoryCalendar'
import { Calendar, TrendingUp, Droplets, Database, Thermometer } from 'lucide-react'

interface HistoryData {
  timestamp: string
  temperature: number | null
  humidity: number | null
  soil_moisture: number | null
  tank_level: number | null
  tank_liters: number | null
}

export default function HistoryPage() {
  const [data, setData] = useState<HistoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)
  
  const fetchData = async (from?: Date, to?: Date) => {
    setLoading(true)
    try {
      let url = '/history'
      if (from && to) {
        url = `/history/range?from_date=${from.toISOString().split('T')[0]}&to_date=${to.toISOString().split('T')[0]}`
      } else {
        url = `/history?days=${days}`
      }
      const result = await get<HistoryData[]>(url)
      setData(result)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [days])
  
  const handleDateChange = (from: Date, to: Date) => {
    fetchData(from, to)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تاریخچه داده‌ها</h1>
      </div>
      
      <HistoryCalendar onDateChange={handleDateChange} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-4 shadow-sm border border-white/40 dark:border-gray-700/40 text-center">
          <Thermometer className="w-5 h-5 text-orange-500 mx-auto mb-1" />
          <div className="text-sm text-gray-500 dark:text-gray-400">میانگین دما</div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            {data.length > 0 ? (data.reduce((acc, d) => acc + (d.temperature || 0), 0) / data.length).toFixed(1) : '---'}°C
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-4 shadow-sm border border-white/40 dark:border-gray-700/40 text-center">
          <Droplets className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <div className="text-sm text-gray-500 dark:text-gray-400">میانگین رطوبت خاک</div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            {data.length > 0 ? (data.reduce((acc, d) => acc + (d.soil_moisture || 0), 0) / data.length).toFixed(1) : '---'}%
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-4 shadow-sm border border-white/40 dark:border-gray-700/40 text-center">
          <Database className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <div className="text-sm text-gray-500 dark:text-gray-400">میانگین سطح تانک</div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            {data.length > 0 ? (data.reduce((acc, d) => acc + (d.tank_level || 0), 0) / data.length).toFixed(1) : '---'}%
          </div>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-4 shadow-sm border border-white/40 dark:border-gray-700/40 text-center">
          <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
          <div className="text-sm text-gray-500 dark:text-gray-400">تعداد رکوردها</div>
          <div className="text-xl font-bold text-gray-800 dark:text-white">{data.length}</div>
        </div>
      </div>
      
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-card shadow-sm border border-white/40 dark:border-gray-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">تاریخ و ساعت</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">دما</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">رطوبت خاک</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">سطح تانک</th>
                <th className="text-right p-4 text-sm font-medium text-gray-500 dark:text-gray-400">آب تانک</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-gray-400 dark:text-gray-500">
                    هیچ داده‌ای در این بازه وجود ندارد
                  </td>
                </tr>
              ) : (
                data.slice().reverse().map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition">
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {new Date(item.timestamp).toLocaleString('fa-IR')}
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {item.temperature !== null ? `${item.temperature}°C` : '---'}
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {item.soil_moisture !== null ? `${item.soil_moisture}%` : '---'}
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {item.tank_level !== null ? `${item.tank_level}%` : '---'}
                    </td>
                    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                      {item.tank_liters !== null ? `${Math.round(item.tank_liters).toLocaleString()} لیتر` : '---'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
