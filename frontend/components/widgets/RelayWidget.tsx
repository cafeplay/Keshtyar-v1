'use client'

import { useState } from 'react'
import { Power, Circle, Zap, ArrowLeft } from 'lucide-react'

interface Relay {
  id: string
  name: string
  gpio: number
  state: boolean
  mode: 'auto' | 'manual'
}

interface RelayWidgetProps {
  relays: Relay[]
}

export function RelayWidget({ relays: initialRelays }: RelayWidgetProps) {
  const [relays, setRelays] = useState(initialRelays.length > 0 ? initialRelays : [
    { id: '1', name: 'پمپ آبیاری', gpio: 12, state: true, mode: 'auto' },
    { id: '2', name: 'فن گلخانه', gpio: 13, state: false, mode: 'manual' },
    { id: '3', name: 'چراغ باغچه', gpio: 14, state: false, mode: 'manual' },
    { id: '4', name: 'شیر برقی', gpio: 15, state: true, mode: 'auto' },
  ])
  
  const toggleRelay = (id: string) => {
    const relay = relays.find(r => r.id === id)
    if (relay?.mode === 'auto') {
      alert('⚠️ این رله توسط هوش مصنوعی مدیریت می‌شود. تغییر دستی ممکن است با تصمیمات سیستم تداخل داشته باشد.')
    }
    setRelays(prev =>
      prev.map(r => r.id === id ? { ...r, state: !r.state } : r)
    )
  }
  
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-card p-5 shadow-sm border border-white/40 dark:border-gray-700/40">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          کنترل سریع رله‌ها
        </h3>
        <a href="/relays" className="text-sm text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition flex items-center gap-1">
          مشاهده همه
          <ArrowLeft className="w-3 h-3" />
        </a>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {relays.map((relay) => (
          <div
            key={relay.id}
            className={`p-4 rounded-xl border transition-all ${
              relay.state 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30' 
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{relay.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                relay.state 
                  ? 'bg-emerald-200 dark:bg-emerald-800/50 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {relay.state ? 'روشن' : 'خاموش'}
              </span>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => toggleRelay(relay.id)}
                className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center ${
                  relay.state
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              >
                <Power className={`w-5 h-5 ${relay.state ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
              </button>
              <span className={`text-xs flex items-center gap-1 ${
                relay.mode === 'auto' 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {relay.mode === 'auto' ? (
                  <>
                    <Zap className="w-3 h-3" />
                    خودکار
                  </>
                ) : (
                  <>
                    <Circle className="w-2 h-2" />
                    دستی
                  </>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
