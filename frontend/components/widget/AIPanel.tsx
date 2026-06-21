'use client'

import { useState } from 'react'
import { Brain, Sparkles, Clock, Check, ChevronLeft, Zap } from 'lucide-react'

interface Recommendation {
  text: string
  action: 'irrigate' | 'ventilate' | 'monitor' | 'alert'
  confidence: number
  reason: string
  suggested_time: string
}

interface AIPanelProps {
  recommendation: Recommendation | null
  loading: boolean
  onApply: () => void
}

export function AIPanel({ recommendation, loading, onApply }: AIPanelProps) {
  const [autoMode, setAutoMode] = useState(false)
  
  if (loading || !recommendation) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-card p-5 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">در حال دریافت توصیه...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-emerald-50/80 dark:bg-emerald-900/20 rounded-card p-5 border border-emerald-200/50 dark:border-emerald-800/30 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          توصیه هوشمند
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">خودکار</span>
          <button
            onClick={() => setAutoMode(!autoMode)}
            className={`relative w-12 h-6 rounded-full transition-all ${
              autoMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
              autoMode ? 'right-7' : 'right-1'
            }`} />
          </button>
        </div>
      </div>
      
      {/* Status */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          بروزرسانی: ۲ دقیقه پیش
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          دقت: {recommendation.confidence}%
        </span>
      </div>
      
      {/* Message */}
      <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 flex-1 border-r-4 border-emerald-500">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          {recommendation.text}
        </p>
        {autoMode && (
          <div className="mt-3 p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Zap className="w-3 h-3" />
            حالت خودکار فعال است. سیستم به‌صورت خودکار مدیریت می‌کند.
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={onApply}
          disabled={autoMode}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
            autoMode
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          <Check className="w-4 h-4" />
          {autoMode ? 'خودکار' : 'اعمال خودکار'}
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-medium border border-orange-400 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          جزئیات
        </button>
      </div>
    </div>
  )
}
