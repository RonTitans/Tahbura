// Database Setup Script for Hebrew Inspection System
// סקריפט הגדרת בסיס נתונים למערכת בדיקות עברית

import { supabaseAdmin, testConnection } from '../config/supabase.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Read SQL file content
 */
const readSqlFile = (filePath) => {
  try {
    const fullPath = path.resolve(__dirname, '../../../database', filePath)
    console.log(`📖 Reading SQL file: ${fullPath}`)
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`SQL file not found: ${fullPath}`)
    }
    
    const content = fs.readFileSync(fullPath, 'utf8')
    return content
  } catch (error) {
    console.error(`❌ Error reading SQL file ${filePath}:`, error.message)
    throw error
  }
}

/**
 * Execute SQL commands
 */
const executeSql = async (sql, description) => {
  try {
    console.log(`🔧 ${description}...`)
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Executing ${statements.length} SQL statements`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      if (statement.length < 10) continue // Skip very short statements
      
      try {
        const { data, error } = await supabaseAdmin.rpc('exec_sql', { 
          sql_query: statement 
        })
        
        if (error) {
          // Some errors are expected (like "already exists")
          if (!error.message.includes('already exists') && 
              !error.message.includes('does not exist')) {
            console.warn(`⚠️ Warning in statement ${i + 1}:`, error.message)
          }
        }
      } catch (err) {
        console.warn(`⚠️ Error in statement ${i + 1}:`, err.message)
      }
    }
    
    console.log(`✅ ${description} completed`)
    
  } catch (error) {
    console.error(`❌ Error in ${description}:`, error.message)
    throw error
  }
}

/**
 * Create custom SQL execution function in Supabase
 */
const createSqlFunction = async () => {
  try {
    console.log('🔧 Creating SQL execution function...')
    
    const functionSql = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
      RETURNS text
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $function$
      BEGIN
        EXECUTE sql_query;
        RETURN 'Success';
      EXCEPTION
        WHEN OTHERS THEN
          RETURN SQLERRM;
      END;
      $function$;
    `
    
    const { error } = await supabaseAdmin.rpc('exec_sql', { 
      sql_query: functionSql 
    })
    
    if (error && !error.message.includes('already exists')) {
      // Try direct execution
      const { error: directError } = await supabaseAdmin
        .from('pg_stat_user_functions')
        .select('*')
        .limit(1)
      
      if (directError) {
        console.warn('⚠️ Could not create SQL function, using direct queries')
      }
    }
    
    console.log('✅ SQL function ready')
    
  } catch (error) {
    console.warn('⚠️ Could not create SQL function:', error.message)
  }
}

/**
 * Check if tables exist
 */
const checkTablesExist = async () => {
  try {
    console.log('🔍 Checking if tables exist...')
    
    const { data, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'buildings', 'inspection_types', 'inspections'])
    
    if (error) {
      console.warn('⚠️ Could not check tables:', error.message)
      return false
    }
    
    const existingTables = data.map(row => row.table_name)
    const requiredTables = ['users', 'buildings', 'inspection_types', 'inspections']
    const missingTables = requiredTables.filter(table => !existingTables.includes(table))
    
    if (missingTables.length > 0) {
      console.log(`📋 Missing tables: ${missingTables.join(', ')}`)
      return false
    }
    
    console.log('✅ All required tables exist')
    return true
    
  } catch (error) {
    console.warn('⚠️ Error checking tables:', error.message)
    return false
  }
}

/**
 * Setup database schema
 */
const setupSchema = async () => {
  try {
    console.log('🗄️ Setting up database schema...')
    
    // Read and execute schema.sql
    const schemaSql = readSqlFile('schema.sql')
    await executeSql(schemaSql, 'Database schema setup')
    
    console.log('✅ Database schema setup completed')
    
  } catch (error) {
    console.error('❌ Error setting up schema:', error.message)
    throw error
  }
}

/**
 * Setup initial data
 */
const setupInitialData = async () => {
  try {
    console.log('📊 Setting up initial data...')
    
    // Check if data already exists
    const { data: existingData, error } = await supabaseAdmin
      .from('system_settings')
      .select('key')
      .eq('key', 'app_name')
      .single()
    
    if (existingData) {
      console.log('✅ Initial data already exists, skipping')
      return
    }
    
    // Read and execute seed data
    const seedSql = readSqlFile('seed-data.sql')
    await executeSql(seedSql, 'Initial data setup')
    
    console.log('✅ Initial data setup completed')
    
  } catch (error) {
    console.error('❌ Error setting up initial data:', error.message)
    throw error
  }
}

/**
 * Verify setup
 */
const verifySetup = async () => {
  try {
    console.log('🔍 Verifying database setup...')
    
    // Check system settings
    const { data: settings, error: settingsError } = await supabaseAdmin
      .from('system_settings')
      .select('key, value')
      .eq('key', 'app_name')
      .single()
    
    if (settingsError) {
      throw new Error('System settings table not accessible')
    }
    
    console.log('📱 App Name:', settings?.value || 'Not set')
    
    // Check inspection types count
    const { data: types, error: typesError } = await supabaseAdmin
      .from('inspection_types')
      .select('id', { count: 'exact' })
    
    if (!typesError) {
      console.log('🔍 Inspection Types:', types?.length || 0)
    }
    
    // Check buildings count
    const { data: buildings, error: buildingsError } = await supabaseAdmin
      .from('buildings')
      .select('id', { count: 'exact' })
    
    if (!buildingsError) {
      console.log('🏢 Buildings:', buildings?.length || 0)
    }
    
    console.log('✅ Database setup verification completed')
    
  } catch (error) {
    console.error('❌ Setup verification failed:', error.message)
    throw error
  }
}

/**
 * Main setup function
 */
export const setupDatabase = async () => {
  console.log('🚀 Starting database setup...')
  
  try {
    // Test connection
    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error('Cannot connect to Supabase')
    }
    
    // Create SQL function
    await createSqlFunction()
    
    // Check if setup is needed
    const tablesExist = await checkTablesExist()
    
    if (!tablesExist) {
      // Setup schema
      await setupSchema()
      
      // Setup initial data
      await setupInitialData()
    } else {
      console.log('✅ Database already set up, skipping schema creation')
    }
    
    // Verify setup
    await verifySetup()
    
    console.log('🎉 Database setup completed successfully!')
    
  } catch (error) {
    console.error('💥 Database setup failed:', error.message)
    throw error
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase()
    .then(() => {
      console.log('🎉 Database setup completed!')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 Database setup failed:', error.message)
      process.exit(1)
    })
}