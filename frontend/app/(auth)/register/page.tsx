'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Leaf, QrCode, Lock, User, Phone, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    device_code: '',
    password: '',
    password_confirm: '',
    farm_name: 'مزرعه من',
    phone_number: '',
    latitude: 35.6892,
    longitude: 51.3890,
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const nextStep = () => {
    if (step === 1) {
      if (formData.device_code.length !== 8) {
        setError('کد یکتا باید ۸ کاراکتر باشد')
        setTimeout(() => setError(''), 5000)
        return
      }
      if (formData.password.length < 4) {
        setError('رمز عبور باید حداقل ۴ کاراکتر باشد')
        setTimeout(() => setError(''), 5000)
        return
      }
      if (formData.password !== formData.password_confirm) {
        setError('رمز عبور و تکرار آن مطابقت ندارند')
        setTimeout(() => setError(''), 5000)
        return
      }
    }
    setError('')
    setStep(prev => prev + 1)
  }
  
  const prevStep = () => {
    setError('')
    setStep(prev => prev - 1)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await register({
        device_code: formData.device_code,
        password: formData.password,
        farm_name: formData.farm_name,
        phone_number: formData.phone_number,
        latitude: formData.latitude,
        longitude: formData.longitude,
      })
      router.push('/login?registered=true')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'خطا در ثبت‌نام')
      setTimeout(() => setError(''), 5000)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6] dark:bg-[#121212] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-card p-8 shadow-sm border border-white/40 dark:border-gray-700/40 animate-fadeInUp">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3 animate-bounceIn">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">ثبت‌نام در کشت‌یار</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">مرحله {step} از ۳</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-4 animate-slideIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    کد یکتا دستگاه
                  </label>
                  <div className="relative">
                    <QrCode className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="device_code"
                      value={formData.device_code}
                      onChange={handleChange}
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition font-mono text-center text-lg tracking-widest"
                      placeholder="A7B3F9G2"
                      dir="ltr"
                      maxLength={8}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                      placeholder="حداقل ۴ کاراکتر"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    تکرار رمز عبور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      name="password_confirm"
                      value={formData.password_confirm}
                      onChange={handleChange}
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                      placeholder="تکرار رمز عبور"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4 animate-slideIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    نام مزرعه
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="farm_name"
                      value={formData.farm_name}
                      onChange={handleChange}
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                      placeholder="مثال: مزرعه آقای احمدی"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    شماره موبایل (برای هشدارها)
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                      placeholder="مثال: 09123456789"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4 animate-slideIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    موقعیت مکانی مزرعه
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setFormData(prev => ({
                              ...prev,
                              latitude: pos.coords.latitude,
                              longitude: pos.coords.longitude,
                            }))
                          },
                          () => alert('خطا در دریافت موقعیت')
                        )
                      }
                    }}
                    className="w-full py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-4 h-4" />
                    دریافت موقعیت خودکار
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      عرض جغرافیایی
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      step="0.000001"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      طول جغرافیایی
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      step="0.000001"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm animate-shake">
                ⚠️ {error}
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center justify-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  قبلی
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-1 hover:scale-[1.02] active:scale-[0.98]"
                >
                  بعدی
                  <ChevronLeft className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام نهایی'}
                </button>
              )}
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              قبلاً ثبت‌نام کرده‌اید؟{' '}
              <a href="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                وارد شوید
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
