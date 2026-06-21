'use client'

import { useState, useEffect } from 'react'
import { get, post, del } from '@/lib/api-client'
import { Settings, Plus, Power, Play, Pause, Trash2 } from 'lucide-react'

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
}

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [relays, setRelays] = useState<Relay[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newRule, setNewRule] = useState({
    name: '',
    relay_id: 0,
    rule_type: 'moisture_below',
    threshold: 30,
    action_state: true,
    condition_type: 'single',
    second_sensor_type: 'temperature',
    second_operator: 'above',
    second_threshold: 35,
  })
  
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
    try {
      await post('/rules', newRule)
      setShowAdd(false)
      setNewRule({
        name: '',
        relay_id: 0,
        rule_type: 'moisture_below',
        threshold: 30,
        action_state: true,
        condition_type: 'single',
        second_sensor_type: 'temperature',
        second_operator: 'above',
        second_threshold: 35,
      })
      await fetchData()
    } catch (error) {
      console.error('Error adding rule:', error)
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
          <Settings className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">قوانین اتوماسیون</h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >
          <Plus className="w-4 h-4" />
          افزودن قانون
        </button>
      </div>
      
      {showAdd && (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-card p-6 shadow-sm border border-white/40 dark:border-gray-700/40">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4">قانون جدید</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="نام قانون"
              value={newRule.name}
              onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
            <select
              value={newRule.relay_id}
              onChange={(e) => setNewRule({ ...newRule, relay_id: Number(e.target.value) })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            >
              <option value={0}>انتخاب رله</option>
              {relays.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select
              value={newRule.rule_type}
              onChange={(e) => setNewRule({ ...newRule, rule_type: e.target.value })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            >
              <option value="moisture_below">رطوبت خاک کمتر از</option>
              <option value="moisture_above">رطوبت خاک بیشتر از</option>
              <option value="temperature_below">دما کمتر از</option>
              <option value="temperature_above">دما بیشتر از</option>
              <option value="tank_level_below">سطح تانک کمتر از</option>
              <option value="tank_level_above">سطح تانک بیشتر از</option>
            </select>
            <input
              type="number"
              placeholder="مقدار آستانه"
              value={newRule.threshold}
              onChange={(e) => setNewRule({ ...newRule, threshold: Number(e.target.value) })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            />
            <select
              value={newRule.action_state ? 'on' : 'off'}
              onChange={(e) => setNewRule({ ...newRule, action_state: e.target.value === 'on' })}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition"
            >
              <option value="on">روشن کردن</option>
              <option value="off">خاموش کردن</option>
            </select>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={addRule}
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
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`bg-white/80 dark:bg-gray-800/80 rounded-card p-5 shadow-sm border transition-all ${
              rule.active 
                ? 'border-emerald-200 dark:border-emerald-800/30' 
                : 'border-gray-200 dark:border-gray-700 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">{rule.name}</h3>
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
                    {rule.second_sensor_type === 'temperature' ? '°C' : '%'}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`p-2 rounded-lg transition ${
                    rule.active 
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 hover:bg-emerald-200' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {rule.active ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
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
      
      {rules.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>هیچ قانونی تعریف نشده است</p>
        </div>
      )}
    </div>
  )
}
