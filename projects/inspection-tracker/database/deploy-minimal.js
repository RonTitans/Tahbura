const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Read environment variables from backend .env
require('dotenv').config({ path: '../backend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Expected:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🔧 Connecting to Supabase...');
console.log('URL:', supabaseUrl);

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function deploySchema() {
  try {
    // Read the minimal schema file
    console.log('📖 Reading schema-minimal.sql...');
    const schemaSQL = fs.readFileSync('./schema-minimal.sql', 'utf8');
    console.log('Schema size:', schemaSQL.length, 'characters');

    // Test connection first
    console.log('🔍 Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase.from('information_schema.tables').select('table_name').limit(1);
    
    if (testError) {
      console.error('❌ Connection test failed:', testError.message);
      return;
    }
    
    console.log('✅ Connection successful');
    
    // Execute the schema using the SQL API directly
    console.log('🚀 Deploying minimal schema to Supabase...');
    
    // Split the SQL into smaller chunks to avoid issues
    const sqlStatements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Executing ${sqlStatements.length} SQL statements...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      if (statement.trim()) {
        try {
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql: statement + ';' 
          });
          
          if (error) {
            console.error(`❌ Statement ${i + 1} failed:`, error.message);
            console.error('Statement:', statement.substring(0, 100) + '...');
            errorCount++;
          } else {
            successCount++;
            if (i % 10 === 0) {
              console.log(`✅ Executed ${i + 1}/${sqlStatements.length} statements`);
            }
          }
        } catch (err) {
          console.error(`❌ Statement ${i + 1} threw error:`, err.message);
          errorCount++;
        }
      }
    }
    
    console.log('\n📊 Deployment Summary:');
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('🎉 Schema deployed successfully!');
    } else {
      console.log('⚠️  Schema deployed with some errors. Check the logs above.');
    }
    
  } catch (error) {
    console.error('💥 Deployment failed:', error.message);
    console.error(error.stack);
  }
}

deploySchema();