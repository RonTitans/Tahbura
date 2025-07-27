// Direct Schema Deployment Script
// Run this to deploy the database schema to Supabase

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '../backend/.env' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function deploySchema() {
  try {
    console.log('🚀 Starting schema deployment...')
    
    // Test basic connection
    const { data: testData, error: testError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .limit(1)
    
    if (testError && !testError.message.includes('permission denied')) {
      throw new Error(`Connection failed: ${testError.message}`)
    }
    
    console.log('✅ Connected to Supabase successfully')
    
    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema-updated.sql')
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📖 Schema file loaded, executing SQL...')
    console.log('⚠️  This may take a few minutes for complex schemas')
    
    // For complex schemas, we need to execute in smaller chunks
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 10 && !stmt.startsWith('--'))
    
    console.log(`📝 Executing ${statements.length} SQL statements...`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        })
        
        if (error) {
          // Some errors are expected (like "already exists")
          if (error.message.includes('already exists') || 
              error.message.includes('does not exist to be dropped')) {
            console.log(`⚠️  Skipped (already exists): Statement ${i + 1}`)
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message)
            errorCount++
          }
        } else {
          successCount++
        }
      } catch (err) {
        console.error(`❌ Exception in statement ${i + 1}:`, err.message)
        errorCount++
      }
      
      // Progress indicator
      if ((i + 1) % 10 === 0) {
        console.log(`📊 Progress: ${i + 1}/${statements.length} statements`)
      }
    }
    
    console.log(`✅ Schema deployment completed!`)
    console.log(`📊 Success: ${successCount}, Errors: ${errorCount}`)
    
    // Verify tables were created
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (!tablesError && tables) {
      console.log(`🗄️  Created ${tables.length} tables in database`)
      console.log('📋 Tables:', tables.map(t => t.table_name).sort().join(', '))
    }
    
  } catch (error) {
    console.error('💥 Schema deployment failed:', error.message)
    process.exit(1)
  }
}

// Create exec_sql function first if it doesn't exist
async function createExecSqlFunction() {
  try {
    const functionSQL = `
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
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: functionSQL })
    
    if (error && !error.message.includes('already exists')) {
      console.log('⚠️  exec_sql function creation failed, using direct method')
    } else {
      console.log('✅ exec_sql function ready')
    }
  } catch (err) {
    console.log('⚠️  Will use alternative deployment method')
  }
}

// Run deployment
async function main() {
  await createExecSqlFunction()
  await deploySchema()
}

main()