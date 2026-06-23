'use client'

import { useState, useEffect } from 'react'
import { get, post, del } from '@/lib/api-client'
import { Bell, Plus, Power, Play, Pause, Trash2, X, AlertCircle } from 'lucide-react'

interface Alert {
  id: number
  name: string
  enabled: boolean
  sensor_type: string
  operator: string
  threshold: number
  sms_template: string
  last_sent_at?: string
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [error, setError] = useState('')
  const [newAlert, setNewAlert] = useState({
    name: '',
    sensor_type: 'soil_moisture',
    operator: 'below',
    threshold: 25,
    sms_template: 'هشدار! {value}%',
  })
  
  const fetchAlerts = async () => {
    try {
      const data = await get<Alert[]>('/alerts')
      setAlerts(data)
    } catch (error) {
      console.error('Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchAlerts()
  }, [])
  
  const toggleAlert = async (id: number) => {
    try {
      await post(`/alerts/${id}/toggle`)
      await fetchAlerts()
    } catch (error) {
      console.error('Error toggling alert:', error)
    }
  }
  
  const deleteAlert = async (id: number) => {
    if (!confirm('آیا از حذف این قانون هشدار اطمینان دارید؟')) return
    try {
      await del(`/alerts/${id}`)
      await fetchAlerts()
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }
  
  const addAlert = async () => {
    if (!newAlert.name.trim()) {
      setError('لطفاً نام هشدار را وارد کنید')
      setTimeout(() => setError(''), 4000)
      return
    }
    
    try {
      await post('/alerts', newAlert)
      setShowAdd(false)
      setNewAlert({
        name: '',
        sensor_type: 'soil_moisture',
        operator: 'below',
        threshold: 25,
        sms_template: 'هشدار! {value}%',
      })
      setError('')
      await fetchAlerts()
    } catch (error) {
      console.error('Error adding alert:', error)
      setError('خطا در ایجاد هشدار')
      setTimeout(() => setError(''), 4000)
    }
  }
  
  const sensorLabels = {
    soil_moisture: 'رطوبت خاک',
    temperature: 'دما',
    tank_level: 'سطح تانک'
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin-slow rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm font-medium">در حال بارگذاری...</p>
      </div>
    )
  }
  
  return (
    <div className="container-responsive py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 dark:text-white">قوانین هشدار</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">مدیریت هشدارهای هوشمند</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-button bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30"
        >
          <Plus className="w-4 h-4" />
          افزودن هشدار
        </button>
      </div>
      
      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium animate-shake flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {/* Add Alert Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeInUp">
          <div className="bg-white dark:bg-gray-900 rounded-card w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                هشدار جدید
              </h3>
              <button
                onClick={() => setShowAdd(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  نام هشدار
                </label>
                <input
                  type="text"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  placeholder="مثال: هشدار کمبود آب"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  نوع سنسور
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(sensorLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setNewAlert({ ...newAlert, sensor_type: key })}
                      className={`p-3 rounded-xl border-2 transition-all text-center font-medium ${
                        newAlert.sensor_type === key
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  عملگر
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewAlert({ ...newAlert, operator: 'below' })}
                    className={`p-3 rounded-xl border-2 transition-all text-center font-bold ${
                      newAlert.operator === 'below'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    کمتر از
                  </button>
                  <button
                    onClick={() => setNewAlert({ ...newAlert, operator: 'above' })}
                    className={`p-3 rounded-xl border-2 transition-all text-center font-bold ${
                      newAlert.operator === 'above'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    بیشتر از
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  مقدار آستانه
                </label>
                <input
                  type="number"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({ ...newAlert, threshold: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  placeholder="مثال: 25"
                  step="0.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  متن پیامک
                </label>
                <textarea
                  value={newAlert.sms_template}
                  onChange={(e) => setNewAlert({ ...newAlert, sms_template: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  placeholder='مثال: هشدار! رطوبت خاک به {value}% رسیده است.'
                />
                <p className="text-xs text-gray-400 mt-1">از {"{value}"} برای نمایش مقدار استفاده کنید</p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={addAlert}
                className="flex-1 py-3 rounded-button bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                ذخیره هشدار
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-6 py-3 rounded-button border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Alerts List - Graphic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white/80 dark:bg-gray-800/80 rounded-card p-5 shadow-sm border transition-all animate-fadeInUp ${
              alert.enabled 
                ? 'border-emerald-200 dark:border-emerald-800/30' 
                : 'border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 dark:text-white text-base truncate">{alert.name}</h3>
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                  {sensorLabels[alert.sensor_type as keyof typeof sensorLabels] || alert.sensor_type}
                  {' '}
                  {alert.operator === 'below' ? 'کمتر از' : 'بیشتر از'} {alert.threshold}
                  {alert.sensor_type === 'temperature' ? '°C' : '%'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-xs font-medium">
                  {alert.sms_template}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={`p-2 rounded-xl transition ${
                    alert.enabled 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {alert.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                alert.enabled 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                {alert.enabled ? 'فعال' : 'غیرفعال'}
              </span>
              {alert.last_sent_at && (
                <span className="text-xs text-gray-400 font-medium">
                  آخرین ارسال: {new Date(alert.last_sent_at).toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {alerts.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 animate-fadeInUp">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">هیچ قانون هشداری تعریف نشده است</p>
          <p className="text-sm mt-1 font-medium">برای شروع، اولین هشدار خود را اضافه کنید</p>
        </div>
      )}
    </div>
  )
}
