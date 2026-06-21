'use client'

import { useState, useEffect } from 'react'
import { get, post, del } from '@/lib/api-client'
import { Plug, Plus, Power, Zap, Circle, Trash2, ArrowLeft } from 'lucide-react'

interface Relay {
  id: string
  name: string
  gpio: number
  state: boolean
  mode: 'auto' | 'manual'
}

export default function RelaysPage() {
  const [relays, setRelays] = useState<Relay[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newRelay, setNewRelay] = useState({ name: '', gpio: 12, mode: 'manual' as 'auto' | 'manual' })
  
  const fetchRelays = async () => {
    try {
      const data = await get<Relay[]>('/relays')
      setRelays(data)
    } catch (error) {
      console.error('Error fetching relays:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchRelays()
  }, [])
  
  const toggleRelay = async (id: string) => {
    try {
      await post(`/relays/${id}/toggle`)
      await fetchRelays()
    } catch (error) {
      console.error('Error toggling relay:', error)
    }
  }
  
  const deleteRelay = async (id: string) => {
    if (!confirm('آیا از حذف این رله اطمینان دارید؟')) return
    try {
      await del(`/relays/${id}`)
      await fetchRelays()
    } catch (error) {
      console.error('Error deleting relay:', error)
    }
  }
  
  const addRelay = async () => {
    try {
      await post('/relays', newRelay)
      setShowAdd(false)
      setNewRelay({ name: '', gpio: 12, mode: 'manual' })
      await fetchRelays()
    } catch (error) {
      console.error('Error adding relay:', error)
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
          <Plug className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">مدیریت رله‌ها</h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          <Plus className="w-4 h-4" />
          افزودن رله
        </button>
      </div>
      
      {showAdd && (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">افزودن رله جدید</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="نام رله"
              value={newRelay.name}
              onChange={(e) => setNewRelay({ ...newRelay, name: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
            <select
              value={newRelay.gpio}
              onChange={(e) => setNewRelay({ ...newRelay, gpio: Number(e.target.value) })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            >
              <option value={12}>GPIO 12</option>
              <option value={13}>GPIO 13</option>
              <option value={14}>GPIO 14</option>
              <option value={15}>GPIO 15</option>
            </select>
            <select
              value={newRelay.mode}
              onChange={(e) => setNewRelay({ ...newRelay, mode: e.target.value as 'auto' | 'manual' })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            >
              <option value="manual">دستی</option>
              <option value="auto">خودکار</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addRelay}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {relays.map((relay) => (
          <div
            key={relay.id}
            className={`bg-white/80 dark:bg-gray-800/80 rounded-card p-5 shadow-sm border transition-all ${
              relay.state 
                ? 'border-emerald-200 dark:border-emerald-800/30' 
                : 'border-white/40 dark:border-gray-700/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{relay.name}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">GPIO: {relay.gpio}</p>
              </div>
              <button
                onClick={() => deleteRelay(relay.id)}
                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
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
                <span className={`text-sm font-medium ${relay.state ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {relay.state ? 'روشن' : 'خاموش'}
                </span>
              </div>
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
      
      {relays.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <Plug className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>هیچ رله‌ای تعریف نشده است</p>
        </div>
      )}
    </div>
  )
}
