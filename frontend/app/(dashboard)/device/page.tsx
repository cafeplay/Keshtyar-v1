'use client'

import { useState, useEffect } from 'react'
import { get } from '@/lib/api-client'
import { Microchip, Copy, Check, Wifi, WifiOff, Clock } from 'lucide-react'

interface DeviceConfig {
  device_code: string
  api_url: string
  last_update?: string
}

export default function DevicePage() {
  const [config, setConfig] = useState<DeviceConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [status, setStatus] = useState<'online' | 'offline' | 'waiting'>('waiting')
  
  const fetchConfig = async () => {
    try {
      const data = await get<DeviceConfig>('/device/config')
      setConfig(data)
    } catch (error) {
      console.error('Error fetching device config:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const checkStatus = async () => {
    try {
      const data = await get<{ last_update: string }>('/device/status')
      if (data.last_update) {
        const diff = (Date.now() - new Date(data.last_update).getTime()) / 60000
        setStatus(diff < 5 ? 'online' : 'offline')
      } else {
        setStatus('waiting')
      }
    } catch {
      setStatus('offline')
    }
  }
  
  useEffect(() => {
    fetchConfig()
    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Microchip className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تنظیمات دستگاه</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">اطلاعات اتصال</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">آدرس سرور</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white text-sm font-mono overflow-x-auto">
                  {config.api_url}
                </code>
                <button
                  onClick={() => copyToClipboard(config.api_url)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">کد یکتا دستگاه</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white text-sm font-mono text-center tracking-widest">
                  {config.device_code}
                </code>
                <button
                  onClick={() => copyToClipboard(config.device_code)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">این کد را در فایل config.py دستگاه قرار دهید</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
            <p className="text-sm text-amber-700 dark:text-amber-300">
              ⚠️ این کد یکتا منحصر به فرد است. آن را با کسی به اشتراک نگذارید.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">وضعیت اتصال</h3>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
              {status === 'online' && (
                <>
                  <Wifi className="w-8 h-8 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-emerald-600">آنلاین</p>
                    <p className="text-sm text-gray-400">دستگاه متصل است</p>
                  </div>
                </>
              )}
              {status === 'offline' && (
                <>
                  <WifiOff className="w-8 h-8 text-red-500" />
                  <div>
                    <p className="font-semibold text-red-500">آفلاین</p>
                    <p className="text-sm text-gray-400">دستگاه قطع است</p>
                  </div>
                </>
              )}
              {status === 'waiting' && (
                <>
                  <Clock className="w-8 h-8 text-amber-500" />
                  <div>
                    <p className="font-semibold text-amber-500">در انتظار</p>
                    <p className="text-sm text-gray-400">هنوز داده‌ای دریافت نشده</p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">تنظیمات GPRS (SIM800C)</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">APN</span>
                <code className="text-gray-800 dark:text-white font-mono">mtnirancell</code>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-gray-500">Username</span>
                <code className="text-gray-800 dark:text-white font-mono">-</code>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Password</span>
                <code className="text-gray-800 dark:text-white font-mono">-</code>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              برای ایرانسل: APN=mtnirancell • همراه اول: mcinet • رایتل: raytel
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
