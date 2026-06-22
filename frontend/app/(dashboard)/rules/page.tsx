'use client'

import { useState, useEffect } from 'react'
import { get, post, del } from '@/lib/api-client'
import { 
  Settings, Plus, Power, Play, Pause, Trash2, 
  X, Check, AlertCircle, Thermometer, Droplets, 
  Database, Zap, ToggleLeft, ToggleRight 
} from 'lucide-react'

interface Rule {
  id: number
  name: string
  relay_id: number
  active: boolean
  rule_type: string
  threshold: number
  action_state: boolean
  condition_type: string
  second_sensor_type?: string
  second_operator?: string
  second_threshold?: number
  last_triggered?: string
}

interface Relay {
  id: string
  name: string
  gpio: number
  mode: string
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [relays, setRelays] = useState<Relay[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newRule, setNewRule] = useState({
    name: '',
    relay_id: 0,
    sensor: 'soil_moisture',
    operator: 'below',
    threshold: 30,
    action_state: true,
  })
  const [error, setError] = useState('')
  
  const fetchData = async () => {
    try {
      const [rulesData, relaysData] = await Promise.all([
        get<Rule[]>('/rules'),
        get<Relay[]>('/relays')
      ])
      setRules(rulesData)
      setRelays(relaysData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const toggleRule = async (id: number) => {
    try {
      await post(`/rules/${id}/toggle`)
      await fetchData()
    } catch (error) {
      console.error('Error toggling rule:', error)
    }
  }
  
  const deleteRule = async (id: number) => {
    if (!confirm('آیا از حذف این قانون اطمینان دارید؟')) return
    try {
      await del(`/rules/${id}`)
      await fetchData()
    } catch (error) {
      console.error('Error deleting rule:', error)
    }
  }
  
  const addRule = async () => {
    if (!newRule.name.trim()) {
      setError('لطفاً نام قانون را وارد کنید')
      setTimeout(() => setError(''), 4000)
      return
    }
    if (!newRule.relay_id) {
      setError('لطفاً یک رله انتخاب کنید')
      setTimeout(() => setError(''), 4000)
      return
    }
    
    try {
      await post('/rules', {
        name: newRule.name,
        relay_id: newRule.relay_id,
        rule_type: `${newRule.sensor}_${newRule.operator}`,
        threshold: newRule.threshold,
        action_state: newRule.action_state,
        condition_type: 'single'
      })
      setShowAdd(false)
      setNewRule({
        name: '',
        relay_id: 0,
        sensor: 'soil_moisture',
        operator: 'below',
        threshold: 30,
        action_state: true,
      })
      setError('')
      await fetchData()
    } catch (error) {
      console.error('Error adding rule:', error)
      setError('خطا در ایجاد قانون')
      setTimeout(() => setError(''), 4000)
    }
  }
  
  const sensorIcons = {
    soil_moisture: { icon: Droplets, label: 'رطوبت خاک', color: 'text-emerald-600' },
    temperature: { icon: Thermometer, label: 'دما', color: 'text-orange-500' },
    tank_level: { icon: Database, label: 'سطح تانک', color: 'text-blue-500' },
  }
  
  const operators = [
    { value: 'below', label: 'کمتر از', symbol: '<' },
    { value: 'above', label: 'بیشتر از', symbol: '>' },
    { value: 'equal', label: 'مساوی', symbol: '=' },
    { value: 'not_equal', label: 'نامساوی', symbol: '≠' },
  ]
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin-slow rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container-responsive py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 animate-fadeInUp">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 dark:text-white">قوانین اتوماسیون</h1>
            <p className="text-xs text-gray-400 dark:text-gray-500">مدیریت قوانین هوشمند مزرعه</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-button bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30"
        >
          <Plus className="w-4 h-4" />
          افزودن قانون
        </button>
      </div>
      
      {/* Error */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm animate-shake flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
      
      {/* Add Rule Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeInUp">
          <div className="bg-white dark:bg-gray-900 rounded-card w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-white/20 dark:border-gray-700/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                قانون جدید
              </h3>
              <button
                onClick={() => setShowAdd(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  نام قانون
                </label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  placeholder="مثال: روشن شدن پمپ در رطوبت کم"
                />
              </div>
              
              {/* Relay Selection - Graphic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  انتخاب رله
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {relays.map((relay) => (
                    <button
                      key={relay.id}
                      onClick={() => setNewRule({ ...newRule, relay_id: Number(relay.id) })}
                      className={`p-3 rounded-xl border-2 transition-all text-right ${
                        newRule.relay_id === Number(relay.id)
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Zap className={`w-4 h-4 ${newRule.relay_id === Number(relay.id) ? 'text-emerald-600' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{relay.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">GPIO {relay.gpio}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sensor Selection - Graphic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  نوع سنسور
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(sensorIcons).map(([key, { icon: Icon, label, color }]) => (
                    <button
                      key={key}
                      onClick={() => setNewRule({ ...newRule, sensor: key })}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        newRule.sensor === key
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto ${color}`} />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-1 block">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Operator - Graphic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عملگر
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {operators.map((op) => (
                    <button
                      key={op.value}
                      onClick={() => setNewRule({ ...newRule, operator: op.value })}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        newRule.operator === op.value
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-xl font-bold text-gray-700 dark:text-gray-300 block">{op.symbol}</span>
                      <span className="text-xs text-gray-400">{op.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  مقدار آستانه
                </label>
                <input
                  type="number"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({ ...newRule, threshold: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
                  placeholder="مثال: 30"
                  step="0.5"
                />
              </div>
              
              {/* Action - Graphic */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  عملیات
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setNewRule({ ...newRule, action_state: true })}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      newRule.action_state === true
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Power className="w-5 h-5 text-emerald-600 mx-auto" />
                    <span className="text-xs font-medium text-emerald-600 block mt-1">روشن</span>
                  </button>
                  <button
                    onClick={() => setNewRule({ ...newRule, action_state: false })}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      newRule.action_state === false
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Power className="w-5 h-5 text-red-500 mx-auto rotate-180" />
                    <span className="text-xs font-medium text-red-500 block mt-1">خاموش</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={addRule}
                className="flex-1 py-3 rounded-button bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition hover:scale-[1.02] active:scale-[0.98]"
              >
                ذخیره قانون
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-6 py-3 rounded-button border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Rules List */}
      <div className="grid-responsive grid-responsive-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white/80 dark:bg-gray-800/80 rounded-card p-5 shadow-sm border transition-all animate-fadeInUp ${
              rule.active 
                ? 'border-emerald-200 dark:border-emerald-800/30' 
                : 'border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 dark:text-white text-base truncate">{rule.name}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  رله: {relays.find(r => Number(r.id) === rule.relay_id)?.name || 'نامشخص'}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  شرط: {rule.rule_type.replace('_', ' ')} {rule.threshold}
                  {rule.rule_type.includes('temperature') ? '°C' : '%'}
                </p>
                {rule.condition_type === 'and' && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    + {rule.second_sensor_type} {rule.second_operator} {rule.second_threshold}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`p-2 rounded-xl transition ${
                    rule.active 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {rule.active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={`text-xs px-3 py-1 rounded-full ${
                rule.active 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
              }`}>
                {rule.active ? 'فعال' : 'غیرفعال'}
              </span>
              {rule.last_triggered && (
                <span className="text-xs text-gray-400">
                  آخرین اجرا: {new Date(rule.last_triggered).toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {rules.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500 animate-fadeInUp">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>هیچ قانونی تعریف نشده است</p>
          <p className="text-sm mt-1">برای شروع، اولین قانون خود را اضافه کنید</p>
        </div>
      )}
    </div>
  )
}
