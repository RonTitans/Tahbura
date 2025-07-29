const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Read environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('Expected:');
  console.log('- SUPABASE_URL (or VITE_SUPABASE_URL)');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  console.log('');
  console.log('Current values:');
  console.log('- SUPABASE_URL:', process.env.SUPABASE_URL ? 'Found' : 'Missing');
  console.log('- VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Found' : 'Missing');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Found' : 'Missing');
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
    const schemaSQL = fs.readFileSync('../database/schema-minimal.sql', 'utf8');
    console.log('Schema size:', schemaSQL.length, 'characters');

    // Test connection first
    console.log('🔍 Testing Supabase connection...');
    
    // Try a simple query to test the connection
    try {
      const { data: testData, error: testError } = await supabase.rpc('version');
      
      if (testError) {
        console.log('⚠️  Version RPC failed, trying alternative connection test...');
        
        // Try alternative connection test
        const { data: altData, error: altError } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .limit(1);
        
        if (altError) {
          console.error('❌ Connection test failed:', altError.message);
          console.log('Will attempt deployment anyway...');
        } else {
          console.log('✅ Connection successful (alternative test)');
        }
      } else {
        console.log('✅ Connection successful');
      }
    } catch (err) {
      console.log('⚠️  Connection test error, will attempt deployment anyway:', err.message);
    }
    
    // Execute the schema using raw SQL
    console.log('🚀 Deploying minimal schema to Supabase...');
    
    // Split the SQL into smaller, logical chunks
    const sqlStatements = schemaSQL
      .split(/;\s*\n/)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'SELECT');
    
    console.log(`Executing ${sqlStatements.length} SQL statements...`);
    
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i].trim();
      if (statement) {
        try {
          console.log(`Executing statement ${i + 1}: ${statement.substring(0, 50)}...`);
          
          // Try direct SQL execution via REST API
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceRoleKey}`,
              'apikey': supabaseServiceRoleKey
            },
            body: JSON.stringify({ 
              query: statement + (statement.endsWith(';') ? '' : ';')
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Statement ${i + 1} failed: HTTP ${response.status}`);
            console.error('Error:', errorText);
            console.error('Statement preview:', statement.substring(0, 100) + '...');
            errorCount++;
            errors.push({ statement: i + 1, error: `HTTP ${response.status}: ${errorText}`, sql: statement.substring(0, 200) });
          } else {
            const result = await response.text();
            successCount++;
            if (i % 5 === 0 && i > 0) {
              console.log(`✅ Progress: ${i + 1}/${sqlStatements.length} statements`);
            }
          }
        } catch (err) {
          console.error(`❌ Statement ${i + 1} threw error:`, err.message);
          errorCount++;
          errors.push({ statement: i + 1, error: err.message, sql: statement.substring(0, 200) });
        }
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('\n📊 Deployment Summary:');
    console.log(`✅ Successful statements: ${successCount}`);
    console.log(`❌ Failed statements: ${errorCount}`);
    
    if (errors.length > 0) {
      console.log('\n❌ Error Details:');
      errors.forEach(err => {
        console.log(`Statement ${err.statement}: ${err.error}`);
      });
    }
    
    if (errorCount === 0) {
      console.log('\n🎉 Schema deployed successfully!');
    } else {
      console.log('\n⚠️  Schema deployed with some errors. Check the logs above.');
    }
    
  } catch (error) {
    console.error('💥 Deployment failed:', error.message);
    console.error(error.stack);
  }
}

deploySchema();