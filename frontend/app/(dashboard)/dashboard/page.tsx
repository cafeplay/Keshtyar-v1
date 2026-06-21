'use client'

import { useState, useEffect } from 'react'
import { KpiCard } from '@/components/widgets/KpiCard'
import { AIPanel } from '@/components/widgets/AIPanel'
import { RelayWidget } from '@/components/widgets/RelayWidget'
import { WeatherWidget } from '@/components/widgets/WeatherWidget'
import { SoilChart } from '@/components/widgets/SoilChart'
import { useSensorData } from '@/hooks/useSensorData'
import { useAI } from '@/hooks/useAI'
import { Leaf, Plus } from 'lucide-react'

export default function DashboardPage() {
  const { data, loading } = useSensorData()
  const { recommendation, fetchAI, loading: aiLoading } = useAI()
  
  useEffect(() => {
    fetchAI()
    const interval = setInterval(fetchAI, 60000)
    return () => clearInterval(interval)
  }, [])
  
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
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Leaf className="w-7 h-7 text-emerald-600" />
            سلام، احمد 👋
          </h1>
          <p className="text-gray-400 text-sm">۲۱ خرداد ۱۴۰۴ • ۱۴:۳۰</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center justify-center">
            <Plus className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            ا
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <KpiCard 
          label="دما" 
          value={data?.temperature || 28} 
          unit="°C" 
          change={+2} 
          icon="temp"
          chartData={data?.temperatureHistory || []}
        />
        <KpiCard 
          label="رطوبت خاک" 
          value={data?.soil_moisture || 62} 
          unit="%" 
          change={-4} 
          icon="soil"
          chartData={data?.soilHistory || []}
        />
        <KpiCard 
          label="سطح تانک" 
          value={data?.tank_level || 45} 
          unit="%" 
          change={-3} 
          icon="tank"
          chartData={data?.tankHistory || []}
        />
        <KpiCard 
          label="وضعیت مزرعه" 
          value="خوب" 
          unit="" 
          change="پایدار" 
          icon="status"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SoilChart data={data?.history || []} />
        </div>
        <div className="lg:col-span-1">
          <AIPanel 
            recommendation={recommendation} 
            loading={aiLoading} 
            onApply={fetchAI}
          />
        </div>
      </div>
      
      <RelayWidget relays={data?.relays || []} />
      <WeatherWidget forecast={data?.forecast || {}} />
    </div>
  )
}
