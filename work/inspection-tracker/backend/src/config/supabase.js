// Supabase Admin Configuration for Backend Services
// תצורת Supabase לשירותי Backend

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// Create admin client with service role key (for backend operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

// Create regular client for user operations
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey)

// Helper function to handle database errors with Hebrew messages
export const handleDbError = (error) => {
  if (!error) return null
  
  const hebrewErrorMessages = {
    'duplicate key value': 'רשומה כפולה כבר קיימת במערכת',
    'foreign key constraint': 'התייחסות לנתון שאינו קיים',
    'not null violation': 'שדה חובה חסר',
    'unique constraint': 'ערך זה כבר קיים במערכת',
    'permission denied': 'אין הרשאה לביצוע פעולה זו',
    'row level security': 'הגבלת אבטחה - אין גישה לנתון זה'
  }
  
  const errorMessage = error.message || error.error_description || 'שגיאה לא ידועה'
  
  // Check if it's a known error type
  for (const [key, value] of Object.entries(hebrewErrorMessages)) {
    if (errorMessage.toLowerCase().includes(key)) {
      return {
        error: value,
        originalError: errorMessage,
        code: error.code
      }
    }
  }
  
  return {
    error: 'שגיאה בבסיס הנתונים',
    originalError: errorMessage,
    code: error.code
  }
}

// Helper function for batch operations
export const batchInsert = async (table, data, batchSize = 100) => {
  const results = []
  const errors = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    
    try {
      const { data: result, error } = await supabaseAdmin
        .from(table)
        .insert(batch)
        .select()
      
      if (error) {
        errors.push({
          batch: i / batchSize + 1,
          error: handleDbError(error)
        })
      } else {
        results.push(...result)
      }
    } catch (err) {
      errors.push({
        batch: i / batchSize + 1,
        error: handleDbError(err)
      })
    }
  }
  
  return { results, errors }
}

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .eq('key', 'app_name')
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }
    
    console.log('✅ Connected to Supabase successfully')
    console.log('📱 App Name:', data?.value || 'Not set')
    return true
  } catch (error) {
    console.error('❌ Failed to connect to Supabase:', error.message)
    return false
  }
}

export default supabaseAdmin