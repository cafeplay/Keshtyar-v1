'use client'

import { useState } from 'react'
import { get, post } from '@/lib/api-client'
import { apiConfig } from '@/config/api'

interface Recommendation {
  text: string
  action: 'irrigate' | 'ventilate' | 'monitor' | 'alert'
  confidence: number
  reason: string
  suggested_time: string
  success: boolean
}

export function useAI() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchAI = async () => {
    try {
      setLoading(true)
      const response = await get<Recommendation>('/ai/recommend')
      setRecommendation(response)
      setError(null)
    } catch (err) {
      setError('خطا در دریافت توصیه')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  const submitFeedback = async (feedbackId: number, applied: boolean) => {
    try {
      await post(`/ai/feedback`, { feedback_id: feedbackId, applied })
    } catch (err) {
      console.error('خطا در ثبت بازخورد', err)
    }
  }
  
  return {
    recommendation,
    loading,
    error,
    fetchAI,
    submitFeedback,
  }
}
