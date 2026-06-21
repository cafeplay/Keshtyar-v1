'use client'

import { useState, useEffect } from 'react'
import { post } from '@/lib/api-client'
import { apiConfig } from '@/config/api'

interface User {
  id: number
  device_code: string
  farm_name: string
  phone_number: string
  latitude: number
  longitude: number
}

interface LoginResponse {
  access_token: string
  token_type: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // دریافت اطلاعات کاربر
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])
  
  const fetchUser = async () => {
    try {
      const data = await get<User>('/auth/me')
      setUser(data)
    } catch (error) {
      localStorage.removeItem('access_token')
    } finally {
      setLoading(false)
    }
  }
  
  const login = async (device_code: string, password: string) => {
    const formData = new FormData()
    formData.append('username', device_code)
    formData.append('password', password)
    
    const response = await post<LoginResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    localStorage.setItem('access_token', response.access_token)
    await fetchUser()
    return response
  }
  
  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }
  
  const register = async (data: any) => {
    const response = await post('/auth/register', data)
    return response
  }
  
  return {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  }
}
