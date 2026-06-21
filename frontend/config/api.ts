export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      me: '/auth/me',
    },
    dashboard: {
      data: '/dashboard',
    },
    relays: {
      list: '/relays',
      toggle: (id: string) => `/relays/${id}/toggle`,
      delete: (id: string) => `/relays/${id}`,
    },
    rules: {
      list: '/rules',
      create: '/rules',
      toggle: (id: string) => `/rules/${id}/toggle`,
      delete: (id: string) => `/rules/${id}`,
    },
    alerts: {
      list: '/alerts',
      create: '/alerts',
      toggle: (id: string) => `/alerts/${id}/toggle`,
      delete: (id: string) => `/alerts/${id}`,
    },
    history: {
      list: '/history',
      range: '/history/range',
    },
    settings: {
      get: '/settings',
      update: '/settings',
      password: '/settings/password',
    },
    ai: {
      recommend: '/ai/recommend',
      feedback: '/ai/feedback',
    },
    device: {
      config: '/device/config',
      status: '/device/status',
    }
  }
}
