import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const get = async <T>(url: string, params?: any): Promise<T> => {
  const response = await api.get<T>(url, { params })
  return response.data
}

export const post = async <T>(url: string, data?: any, config?: any): Promise<T> => {
  const response = await api.post<T>(url, data, config)
  return response.data
}

export const put = async <T>(url: string, data?: any): Promise<T> => {
  const response = await api.put<T>(url, data)
  return response.data
}

export const del = async <T>(url: string): Promise<T> => {
  const response = await api.delete<T>(url)
  return response.data
}
