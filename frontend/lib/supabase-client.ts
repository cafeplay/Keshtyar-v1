import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
