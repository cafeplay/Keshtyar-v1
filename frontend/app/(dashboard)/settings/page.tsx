'use client'

import { useState, useEffect } from 'react'
import { get, put } from '@/lib/api-client'
import { UserCog, Save, Lock, User, Phone, MapPin, Droplets, Database } from 'lucide-react'

interface Settings {
  farm_name: string
  phone_number: string
  latitude: number
  longitude: number
  tank_height_mm: number
  tank_capacity_liters: number
  soil_dry_raw: number
  soil_wet_raw: number
  alert_cooldown_soil: number
  alert_cooldown_temp: number
  alert_cooldown_tank: number
  ai_autonomous_mode: boolean
  device_code: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' })
  
  const fetchSettings = async () => {
    try {
      const data = await get<Settings>('/settings')
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchSettings()
  }, [])
  
  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    setMessage('')
    try {
      await put('/settings', settings)
      setMessage('تنظیمات با موفقیت ذخیره شد')
    } catch (error) {
      setMessage('خطا در ذخیره تنظیمات')
    } finally {
      setSaving(false)
    }
  }
  
  const handlePasswordChange = async () => {
    setSaving(true)
    setMessage('')
    try {
      await put('/settings/password', passwordData)
      setMessage('رمز عبور با موفقیت تغییر کرد')
      setPasswordData({ old_password: '', new_password: '' })
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'خطا در تغییر رمز عبور')
    } finally {
      setSaving(false)
    }
  }
  
  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCog className="w-6 h-6 text-emerald-600" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">تنظیمات</h1>
      </div>
      
      {message && (
        <div className={`p-4 rounded-xl text-sm ${
          message.includes('موفق') 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
            : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        }`}>
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* اطلاعات مزرعه */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4" />
            اطلاعات مزرعه
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">نام مزرعه</label>
              <input
                type="text"
                value={settings.farm_name}
                onChange={(e) => setSettings({ ...settings, farm_name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">شماره موبایل</label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  value={settings.phone_number || ''}
                  onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
                  className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">عرض جغرافیایی</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={settings.latitude}
                    onChange={(e) => setSettings({ ...settings, latitude: Number(e.target.value) })}
                    className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">طول جغرافیایی</label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={settings.longitude}
                    onChange={(e) => setSettings({ ...settings, longitude: Number(e.target.value) })}
                    className="w-full pr-10 pl-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* تانک و کالیبراسیون */}
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Database className="w-4 h-4" />
              تنظیمات تانک
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">ارتفاع (میلی‌متر)</label>
                <input
                  type="number"
                  value={settings.tank_height_mm}
                  onChange={(e) => setSettings({ ...settings, tank_height_mm: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">ظرفیت (لیتر)</label>
                <input
                  type="number"
                  value={settings.tank_capacity_liters}
                  onChange={(e) => setSettings({ ...settings, tank_capacity_liters: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Droplets className="w-4 h-4" />
              کالیبراسیون رطوبت خاک
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">مقدار خشک</label>
                <input
                  type="number"
                  value={settings.soil_dry_raw}
                  onChange={(e) => setSettings({ ...settings, soil_dry_raw: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">مقدار مرطوب</label>
                <input
                  type="number"
                  value={settings.soil_wet_raw}
                  onChange={(e) => setSettings({ ...settings, soil_wet_raw: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* زمان خنک‌کنندگی */}
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4">زمان خنک‌کنندگی هشدارها (دقیقه)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">رطوبت خاک</label>
            <input
              type="number"
              value={settings.alert_cooldown_soil}
              onChange={(e) => setSettings({ ...settings, alert_cooldown_soil: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">دما</label>
            <input
              type="number"
              value={settings.alert_cooldown_temp}
              onChange={(e) => setSettings({ ...settings, alert_cooldown_temp: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">سطح تانک</label>
            <input
              type="number"
              value={settings.alert_cooldown_tank}
              onChange={(e) => setSettings({ ...settings, alert_cooldown_tank: Number(e.target.value) })}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
          </div>
        </div>
      </div>
      
      {/* تغییر رمز عبور */}
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
        <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          تغییر رمز عبور
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="password"
            placeholder="رمز عبور فعلی"
            value={passwordData.old_password}
            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
          />
          <input
            type="password"
            placeholder="رمز عبور جدید"
            value={passwordData.new_password}
            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
          />
        </div>
        <button
          onClick={handlePasswordChange}
          disabled={saving || !passwordData.old_password || !passwordData.new_password}
          className="mt-4 px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
        >
          تغییر رمز عبور
        </button>
      </div>
      
      {/* دکمه ذخیره */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
      </button>
    </div>
  )
}
