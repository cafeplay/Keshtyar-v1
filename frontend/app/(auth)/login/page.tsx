'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Leaf, Lock, QrCode } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [deviceCode, setDeviceCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(deviceCode, password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'خطا در ورود')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6] dark:bg-[#121212] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-card p-8 shadow-sm border border-white/40 dark:border-gray-700/40">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">ورود به Agrova</h1>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">دستیار هوشمند کشاورزی</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                کد یکتا دستگاه
              </label>
              <div className="relative">
                <QrCode className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={deviceCode}
                  onChange={(e) => setDeviceCode(e.target.value.toUpperCase())}
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  placeholder="مثال: A7B3F9G2"
                  dir="ltr"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  placeholder="********"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              حساب کاربری ندارید؟{' '}
              <a href="/register" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                ثبت‌نام
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
