'use client'

import { useState, useEffect } from 'react'
import { get, post, del } from '@/lib/api-client'
import { Bell, Plus, Power, Play, Pause, Trash2 } from 'lucide-react'

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
      await fetchAlerts()
    } catch (error) {
      console.error('Error adding alert:', error)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">قوانین هشدار</h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          <Plus className="w-4 h-4" />
          افزودن هشدار
        </button>
      </div>
      
      {showAdd && (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">قانون هشدار جدید</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="نام هشدار"
              value={newAlert.name}
              onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
            <select
              value={newAlert.sensor_type}
              onChange={(e) => setNewAlert({ ...newAlert, sensor_type: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            >
              <option value="soil_moisture">رطوبت خاک</option>
              <option value="temperature">دما</option>
              <option value="tank_level">سطح تانک</option>
            </select>
            <select
              value={newAlert.operator}
              onChange={(e) => setNewAlert({ ...newAlert, operator: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            >
              <option value="below">کمتر از</option>
              <option value="above">بیشتر از</option>
            </select>
            <input
              type="number"
              placeholder="مقدار آستانه"
              value={newAlert.threshold}
              onChange={(e) => setNewAlert({ ...newAlert, threshold: Number(e.target.value) })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
            <div className="md:col-span-2">
              <textarea
                placeholder="متن پیامک (از {value} برای مقدار استفاده کنید)"
                value={newAlert.sms_template}
                onChange={(e) => setNewAlert({ ...newAlert, sms_template: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addAlert}
              className="px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
            >
              ذخیره
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="px-6 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              انصراف
            </button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-white/80 dark:bg-gray-800/80 rounded-card p-5 shadow-sm border transition-all ${
              alert.enabled 
                ? 'border-emerald-200 dark:border-emerald-800/30' 
                : 'border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{alert.name}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {alert.sensor_type === 'soil_moisture' ? 'رطوبت خاک' :
                   alert.sensor_type === 'temperature' ? 'دما' : 'سطح تانک'}
                  {' '}
                  {alert.operator === 'below' ? 'کمتر از' : 'بیشتر از'} {alert.threshold}
                  {alert.sensor_type === 'temperature' ? '°C' : '%'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-xs">
                  {alert.sms_template}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={`p-2 rounded-lg transition ${
                    alert.enabled 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {alert.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                alert.enabled 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                {alert.enabled ? 'فعال' : 'غیرفعال'}
              </span>
              {alert.last_sent_at && (
                <span className="text-xs text-gray-400">
                  آخرین ارسال: {new Date(alert.last_sent_at).toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {alerts.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>هیچ قانون هشداری تعریف نشده است</p>
        </div>
      )}
    </div>
  )
}
