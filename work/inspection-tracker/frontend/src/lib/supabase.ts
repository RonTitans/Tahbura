// Supabase Client Configuration for Hebrew Inspection System
// תצורת לקוח Supabase למערכת בדיקות עברית

import { createClient } from '@supabase/supabase-js'

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

// Database Types for TypeScript support
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          role: 'technician' | 'manager' | 'admin'
          employee_id: string | null
          department: string | null
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          role?: 'technician' | 'manager' | 'admin'
          employee_id?: string | null
          department?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          role?: 'technician' | 'manager' | 'admin'
          employee_id?: string | null
          department?: string | null
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      buildings: {
        Row: {
          id: string
          name_hebrew: string
          name_english: string | null
          building_code: string
          building_type: 'datacenter' | 'office' | 'warehouse' | 'laboratory' | 'production' | 'utilities'
          address_hebrew: string | null
          floor_count: number | null
          total_area_sqm: number | null
          construction_year: number | null
          description_hebrew: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_hebrew: string
          name_english?: string | null
          building_code: string
          building_type: 'datacenter' | 'office' | 'warehouse' | 'laboratory' | 'production' | 'utilities'
          address_hebrew?: string | null
          floor_count?: number | null
          total_area_sqm?: number | null
          construction_year?: number | null
          description_hebrew?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_hebrew?: string
          name_english?: string | null
          building_code?: string
          building_type?: 'datacenter' | 'office' | 'warehouse' | 'laboratory' | 'production' | 'utilities'
          address_hebrew?: string | null
          floor_count?: number | null
          total_area_sqm?: number | null
          construction_year?: number | null
          description_hebrew?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      inspection_types: {
        Row: {
          id: string
          name_hebrew: string
          name_english: string
          code: string
          description_hebrew: string | null
          category: 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'safety' | 'fire' | 'security' | 'network' | 'environmental'
          subcategory: string | null
          estimated_duration_minutes: number | null
          requires_photo: boolean | null
          requires_signature: boolean | null
          requires_certification: boolean | null
          required_tools: string[] | null
          safety_requirements: string[] | null
          frequency_days: number | null
          priority: 'low' | 'medium' | 'high' | 'urgent' | null
          compliance_standard: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name_hebrew: string
          name_english: string
          code: string
          description_hebrew?: string | null
          category: 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'safety' | 'fire' | 'security' | 'network' | 'environmental'
          subcategory?: string | null
          estimated_duration_minutes?: number | null
          requires_photo?: boolean | null
          requires_signature?: boolean | null
          requires_certification?: boolean | null
          required_tools?: string[] | null
          safety_requirements?: string[] | null
          frequency_days?: number | null
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null
          compliance_standard?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name_hebrew?: string
          name_english?: string
          code?: string
          description_hebrew?: string | null
          category?: 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'safety' | 'fire' | 'security' | 'network' | 'environmental'
          subcategory?: string | null
          estimated_duration_minutes?: number | null
          requires_photo?: boolean | null
          requires_signature?: boolean | null
          requires_certification?: boolean | null
          required_tools?: string[] | null
          safety_requirements?: string[] | null
          frequency_days?: number | null
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null
          compliance_standard?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      inspections: {
        Row: {
          id: string
          inspection_number: string
          type_id: string
          building_id: string
          inspector_id: string | null
          reviewer_id: string | null
          scheduled_date: string
          scheduled_time_start: string | null
          scheduled_time_end: string | null
          started_at: string | null
          completed_at: string | null
          actual_duration_minutes: number | null
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'needs_review'
          priority: 'low' | 'medium' | 'high' | 'urgent' | null
          floor_number: number | null
          room_number: string | null
          location_description_hebrew: string | null
          notes_hebrew: string | null
          findings_hebrew: string | null
          recommendations_hebrew: string | null
          photos: string[] | null
          documents: string[] | null
          signature_inspector: string | null
          signature_reviewer: string | null
          passed: boolean | null
          compliance_score: number | null
          next_inspection_due: string | null
          weather_conditions: string | null
          temperature_celsius: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inspection_number: string
          type_id: string
          building_id: string
          inspector_id?: string | null
          reviewer_id?: string | null
          scheduled_date: string
          scheduled_time_start?: string | null
          scheduled_time_end?: string | null
          started_at?: string | null
          completed_at?: string | null
          actual_duration_minutes?: number | null
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'needs_review'
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null
          floor_number?: number | null
          room_number?: string | null
          location_description_hebrew?: string | null
          notes_hebrew?: string | null
          findings_hebrew?: string | null
          recommendations_hebrew?: string | null
          photos?: string[] | null
          documents?: string[] | null
          signature_inspector?: string | null
          signature_reviewer?: string | null
          passed?: boolean | null
          compliance_score?: number | null
          next_inspection_due?: string | null
          weather_conditions?: string | null
          temperature_celsius?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inspection_number?: string
          type_id?: string
          building_id?: string
          inspector_id?: string | null
          reviewer_id?: string | null
          scheduled_date?: string
          scheduled_time_start?: string | null
          scheduled_time_end?: string | null
          started_at?: string | null
          completed_at?: string | null
          actual_duration_minutes?: number | null
          status?: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'needs_review'
          priority?: 'low' | 'medium' | 'high' | 'urgent' | null
          floor_number?: number | null
          room_number?: string | null
          location_description_hebrew?: string | null
          notes_hebrew?: string | null
          findings_hebrew?: string | null
          recommendations_hebrew?: string | null
          photos?: string[] | null
          documents?: string[] | null
          signature_inspector?: string | null
          signature_reviewer?: string | null
          passed?: boolean | null
          compliance_score?: number | null
          next_inspection_due?: string | null
          weather_conditions?: string | null
          temperature_celsius?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          name_hebrew: string
          description_hebrew: string | null
          report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom'
          format: 'pdf' | 'excel' | 'word' | 'html'
          building_ids: string[] | null
          inspection_type_ids: string[] | null
          date_from: string | null
          date_to: string | null
          status_filter: ('pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'needs_review')[] | null
          generated_by: string
          generated_at: string
          file_path: string | null
          file_size: number | null
          is_scheduled: boolean | null
          schedule_cron: string | null
          next_run_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name_hebrew: string
          description_hebrew?: string | null
          report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom'
          format: 'pdf' | 'excel' | 'word' | 'html'
          building_ids?: string[] | null
          inspection_type_ids?: string[] | null
          date_from?: string | null
          date_to?: string | null
          status_filter?: ('pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'needs_review')[] | null
          generated_by: string
          generated_at?: string
          file_path?: string | null
          file_size?: number | null
          is_scheduled?: boolean | null
          schedule_cron?: string | null
          next_run_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name_hebrew?: string
          description_hebrew?: string | null
          report_type?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom'
          format?: 'pdf' | 'excel' | 'word' | 'html'
          building_ids?: string[] | null
          inspection_type_ids?: string[] | null
          date_from?: string | null
          date_to?: string | null
          status_filter?: ('pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'needs_review')[] | null
          generated_by?: string
          generated_at?: string
          file_path?: string | null
          file_size?: number | null
          is_scheduled?: boolean | null
          schedule_cron?: string | null
          next_run_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      inspection_details: {
        Row: {
          id: string | null
          inspection_number: string | null
          status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'needs_review' | null
          priority: 'low' | 'medium' | 'high' | 'urgent' | null
          scheduled_date: string | null
          completed_at: string | null
          notes_hebrew: string | null
          passed: boolean | null
          type_name_hebrew: string | null
          type_category: 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'safety' | 'fire' | 'security' | 'network' | 'environmental' | null
          estimated_duration_minutes: number | null
          building_name_hebrew: string | null
          building_code: string | null
          building_type: 'datacenter' | 'office' | 'warehouse' | 'laboratory' | 'production' | 'utilities' | null
          inspector_name: string | null
          inspector_phone: string | null
          reviewer_name: string | null
          actual_duration_minutes: number | null
          compliance_score: number | null
          created_at: string | null
          updated_at: string | null
        }
      }
      inspection_statistics: {
        Row: {
          total_inspections: number | null
          completed_inspections: number | null
          pending_inspections: number | null
          in_progress_inspections: number | null
          failed_inspections: number | null
          passed_inspections: number | null
          today_inspections: number | null
          avg_duration_minutes: number | null
          avg_compliance_score: number | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'technician' | 'manager' | 'admin'
      building_type: 'datacenter' | 'office' | 'warehouse' | 'laboratory' | 'production' | 'utilities'
      inspection_category: 'electrical' | 'plumbing' | 'hvac' | 'structural' | 'safety' | 'fire' | 'security' | 'network' | 'environmental'
      priority_level: 'low' | 'medium' | 'high' | 'urgent'
      inspection_status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'needs_review'
      report_type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'custom'
      report_format: 'pdf' | 'excel' | 'word' | 'html'
      audit_action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'start_inspection' | 'complete_inspection' | 'approve_inspection' | 'generate_report' | 'export_data' | 'upload_photo'
      notification_type: 'inspection_due' | 'inspection_overdue' | 'inspection_completed' | 'inspection_failed' | 'report_generated' | 'system_maintenance'
      notification_channel: 'email' | 'sms' | 'push' | 'in_app'
    }
  }
}

// Create Supabase client with Hebrew-specific configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // More secure for web apps
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10 // Limit for free tier
    }
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'he-IL,he;q=0.9,en;q=0.8' // Hebrew preference
    }
  }
})

// Helper types for the application
export type User = Database['public']['Tables']['users']['Row']
export type Building = Database['public']['Tables']['buildings']['Row']
export type InspectionType = Database['public']['Tables']['inspection_types']['Row']
export type Inspection = Database['public']['Tables']['inspections']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type InspectionDetails = Database['public']['Views']['inspection_details']['Row']
export type InspectionStatistics = Database['public']['Views']['inspection_statistics']['Row']

// Utility function to handle Supabase errors with Hebrew messages
export const handleSupabaseError = (error: any): string => {
  if (!error) return ''
  
  // Map common Supabase errors to Hebrew messages
  const errorMessages: { [key: string]: string } = {
    'Invalid login credentials': 'פרטי הגישה שגויים',
    'Email not confirmed': 'האימייל טרם אומת',
    'Password should be at least 6 characters': 'הסיסמה חייבת להכיל לפחות 6 תווים',
    'User already registered': 'המשתמש כבר רשום במערכת',
    'Network error': 'שגיאת רשת - בדוק את החיבור לאינטרנט',
    'Database error': 'שגיאת בסיס נתונים',
    'Permission denied': 'אין הרשאה לביצוע פעולה זו',
    'Record not found': 'הרשומה לא נמצאה',
    'Validation error': 'שגיאה בנתונים שהוזנו'
  }
  
  // Try to match error message
  const errorMessage = error.message || error.error_description || 'שגיאה לא ידועה'
  
  // Return Hebrew message if found, otherwise return original
  return errorMessages[errorMessage] || errorMessage
}

// Utility function for real-time subscriptions with Hebrew error handling
export const createRealtimeSubscription = (
  table: string,
  callback: (payload: any) => void,
  filter?: string
) => {
  const channel = supabase
    .channel(`realtime-${table}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter
      },
      callback
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ מחובר לעדכונים בזמן אמת עבור ${table}`)
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`❌ שגיאה בחיבור לעדכונים בזמן אמת עבור ${table}`)
      }
    })
    
  return channel
}

// Utility function for file uploads to Storage
export const uploadFile = async (
  bucket: string,
  filePath: string,
  file: File,
  options?: { cacheControl?: string; contentType?: string; upsert?: boolean }
) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: options?.cacheControl || '3600',
        contentType: options?.contentType || file.type,
        upsert: options?.upsert || false
      })
    
    if (error) {
      throw new Error(handleSupabaseError(error))
    }
    
    return data
  } catch (error) {
    console.error('Error uploading file:', error)
    throw new Error('שגיאה בהעלאת הקובץ')
  }
}

// Utility function to get public file URL
export const getPublicUrl = (bucket: string, filePath: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)
    
  return data.publicUrl
}

// Auth helper functions with Hebrew error handling
export const authHelpers = {
  // Sign up new user
  signUp: async (email: string, password: string, userData: Partial<User>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },
  
  // Sign in existing user
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return data
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },
  
  // Sign out current user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      throw new Error(handleSupabaseError(error))
    }
  },
  
  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data.session
    } catch (error) {
      console.error('Session error:', error)
      return null
    }
  }
}

// Export the client as default
export default supabase