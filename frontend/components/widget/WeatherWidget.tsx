'use client'

import { useState } from 'react'
import { 
  Sun, Cloud, CloudRain, Wind, Droplets, Eye, 
  Thermometer, Calendar, ChevronLeft, ChevronRight 
} from 'lucide-react'

interface WeatherWidgetProps {
  forecast: any
}

const hourlyData = {
  0: [
    { time: '۰۶:۰۰', temp: 22, icon: 'sun', humidity: 50 },
    { time: '۰۹:۰۰', temp: 25, icon: 'sun', humidity: 45 },
    { time: '۱۲:۰۰', temp: 28, icon: 'cloud-sun', humidity: 40 },
    { time: '۱۵:۰۰', temp: 27, icon: 'cloud-sun', humidity: 42 },
    { time: '۱۸:۰۰', temp: 24, icon: 'cloud', humidity: 50 },
    { time: '۲۱:۰۰', temp: 21, icon: 'cloud', humidity: 58 },
    { time: '۰۰:۰۰', temp: 18, icon: 'moon', humidity: 65 },
    { time: '۰۳:۰۰', temp: 16, icon: 'moon', humidity: 70 },
  ],
  1: [
    { time: '۰۶:۰۰', temp: 23, icon: 'cloud-sun', humidity: 52 },
    { time: '۰۹:۰۰', temp: 26, icon: 'cloud-sun', humidity: 47 },
    { time: '۱۲:۰۰', temp: 31, icon: 'cloud-sun', humidity: 38 },
    { time: '۱۵:۰۰', temp: 30, icon: 'cloud', humidity: 40 },
    { time: '۱۸:۰۰', temp: 27, icon: 'cloud', humidity: 48 },
    { time: '۲۱:۰۰', temp: 24, icon: 'cloud', humidity: 56 },
    { time: '۰۰:۰۰', temp: 20, icon: 'moon', humidity: 62 },
    { time: '۰۳:۰۰', temp: 18, icon: 'moon', humidity: 68 },
  ],
  2: [
    { time: '۰۶:۰۰', temp: 20, icon: 'rain', humidity: 65 },
    { time: '۰۹:۰۰', temp: 22, icon: 'rain', humidity: 62 },
    { time: '۱۲:۰۰', temp: 26, icon: 'rain', humidity: 55 },
    { time: '۱۵:۰۰', temp: 25, icon: 'rain', humidity: 58 },
    { time: '۱۸:۰۰', temp: 22, icon: 'rain', humidity: 65 },
    { time: '۲۱:۰۰', temp: 19, icon: 'cloud', humidity: 72 },
    { time: '۰۰:۰۰', temp: 16, icon: 'cloud', humidity: 78 },
    { time: '۰۳:۰۰', temp: 14, icon: 'cloud', humidity: 82 },
  ]
}

const iconMap = {
  sun: Sun,
  'cloud-sun': Cloud,
  cloud: Cloud,
  rain: CloudRain,
  moon: Cloud,
}

export function WeatherWidget({ forecast }: WeatherWidgetProps) {
  const [selectedDay, setSelectedDay] = useState(0)
  
  const days = [
    { label: 'امروز', icon: Sun, temp: 28, desc: 'آفتابی' },
    { label: 'فردا', icon: Cloud, temp: 31, desc: 'نیمه‌ابری' },
    { label: 'پس‌فردا', icon: CloudRain, temp: 26, desc: 'بارانی' },
  ]
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-card p-5 shadow-sm border border-white/40 dark:border-gray-700/40">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <Cloud className="w-5 h-5 text-orange-400" />
        پیش‌بینی ۳ روز آینده
      </h3>
      
      {/* Day Chips */}
      <div className="flex gap-3 flex-wrap mb-4">
        {days.map((day, index) => {
          const Icon = day.icon
          return (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all ${
                selectedDay === index
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500'
                  : 'bg-gray-100 dark:bg-gray-800 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${
                selectedDay === index ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
              }`} />
              <div className="text-right">
                <div className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-1">
                  {day.temp}°C
                  <Thermometer className="w-3 h-3 text-gray-400" />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {day.label} • {day.desc}
                </div>
              </div>
            </button>
          )
        })}
      </div>
      
      {/* Hourly */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {hourlyData[selectedDay as keyof typeof hourlyData]?.map((item, i) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || Sun
            return (
              <div key={i} className="text-center flex-shrink-0 w-16">
                <div className="text-xs text-gray-400 dark:text-gray-500">{item.time}</div>
                <Icon className="w-6 h-6 mx-auto my-1 text-orange-400 dark:text-orange-500" />
                <div className="font-bold text-sm text-gray-800 dark:text-white">{item.temp}°</div>
                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center justify-center gap-0.5">
                  <Droplets className="w-3 h-3" />
                  {item.humidity}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          بارش: ۱.۲ میلی‌متر
        </span>
        <span className="flex items-center gap-1">
          <Wind className="w-3 h-3" />
          باد: ۱۲ km/h
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-3 h-3" />
          UV: ۷ (بالا)
        </span>
        <span className="flex items-center gap-1">
          <Droplets className="w-3 h-3" />
          رطوبت: ۴۸%
        </span>
      </div>
    </div>
  )
}
