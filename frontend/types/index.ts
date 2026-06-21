// User
export interface User {
  id: number
  device_code: string
  farm_name: string
  phone_number: string
  latitude: number
  longitude: number
  tank_height_mm: number
  tank_capacity_liters: number
  soil_dry_raw: number
  soil_wet_raw: number
  alert_cooldown_soil: number
  alert_cooldown_temp: number
  alert_cooldown_tank: number
  ai_autonomous_mode: boolean
  created_at: string
}

// Sensor
export interface SensorData {
  id: number
  user_id: number
  timestamp: string
  temperature: number | null
  humidity: number | null
  soil_moisture_raw: number | null
  soil_moisture: number | null
  tank_distance_mm: number | null
  tank_level_percent: number | null
  tank_liters: number | null
}

// Relay
export interface Relay {
  id: string
  user_id: number
  name: string
  gpio: number
  state: boolean
  mode: 'auto' | 'manual'
  created_at: string
}

// Automation Rule
export interface AutomationRule {
  id: number
  user_id: number
  relay_id: number
  name: string
  active: boolean
  rule_type: string
  threshold: number
  action_state: boolean
  condition_type: 'single' | 'and'
  second_sensor_type?: string
  second_operator?: string
  second_threshold?: number
  last_triggered?: string
  created_at: string
}

// Alert Rule
export interface AlertRule {
  id: number
  user_id: number
  name: string
  enabled: boolean
  sensor_type: 'soil_moisture' | 'temperature' | 'tank_level'
  operator: 'below' | 'above'
  threshold: number
  sms_template: string
  last_sent_at?: string
  created_at: string
}

// AI Feedback
export interface AIFeedback {
  id: number
  user_id: number
  action: string
  reason: string
  confidence: number
  suggested_time: string
  generated_text: string
  user_applied: boolean
  applied_automatically: boolean
  created_at: string
}

// API Responses
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface DashboardData {
  temperature: number
  soil_moisture: number
  tank_level: number
  humidity: number
  temperatureHistory: number[]
  soilHistory: number[]
  tankHistory: number[]
  history: Array<{ timestamp: string; value: number }>
  relays: Relay[]
  forecast: WeatherForecast
}

export interface WeatherForecast {
  today: {
    temp_max: number
    temp_min: number
    rain: number
  }
  tomorrow: {
    temp_max: number
    temp_min: number
    rain: number
  }
}
