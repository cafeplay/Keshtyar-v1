import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// تابع‌های کمکی برای Realtime
export const subscribeToSensorData = (
  userId: number,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('sensor-data')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'sensor_data',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}

export const subscribeToRelayChanges = (
  userId: number,
  callback: (payload: any) => void
) => {
  return supabase
    .channel('relay-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'relays',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe()
}
