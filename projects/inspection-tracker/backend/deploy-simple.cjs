const fs = require('fs');

// Read environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function deploySchema() {
  try {
    console.log('📖 Reading schema-minimal.sql...');
    const schemaSQL = fs.readFileSync('../database/schema-minimal.sql', 'utf8');
    console.log('Schema size:', schemaSQL.length, 'characters');

    console.log('🚀 Deploying schema to Supabase using SQL editor API...');
    
    // Use Supabase SQL editor API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceRoleKey}`,
        'apikey': supabaseServiceRoleKey,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ 
        query: schemaSQL
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Deployment failed:', response.status, response.statusText);
      console.error('Error details:', errorText);
      
      // Try alternative approach - split into smaller chunks
      console.log('🔄 Trying alternative approach with smaller chunks...');
      await deployInChunks(schemaSQL);
      
    } else {
      const result = await response.text();
      console.log('✅ Schema deployed successfully!');
      console.log('Result:', result);
    }
    
  } catch (error) {
    console.error('💥 Deployment failed:', error.message);
    
    // Try final fallback - manual execution
    console.log('🔄 Trying manual chunk execution...');
    const schemaSQL = fs.readFileSync('../database/schema-minimal.sql', 'utf8');
    await deployInChunks(schemaSQL);
  }
}

async function deployInChunks(schemaSQL) {
  console.log('📋 Splitting SQL into executable chunks...');
  
  // Split by DDL statements more intelligently
  const chunks = [];
  let currentChunk = '';
  const lines = schemaSQL.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip comments and empty lines
    if (trimmed.startsWith('--') || trimmed === '') {
      continue;
    }
    
    currentChunk += line + '\n';
    
    // End chunk on certain keywords
    if (trimmed.endsWith(';') && (
      trimmed.includes('CREATE TYPE') ||
      trimmed.includes('CREATE TABLE') ||
      trimmed.includes('CREATE INDEX') ||
      trimmed.includes('CREATE SEQUENCE') ||
      trimmed.includes('CREATE TRIGGER') ||
      trimmed.includes('CREATE FUNCTION') ||
      trimmed.includes('END $$')
    )) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
    }
  }
  
  // Add remaining chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  console.log(`Executing ${chunks.length} SQL chunks...`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    
    try {
      console.log(`\n${i + 1}/${chunks.length}: ${chunk.substring(0, 80)}...`);
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceRoleKey}`,
          'apikey': supabaseServiceRoleKey
        },
        body: JSON.stringify({ query: chunk })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Chunk ${i + 1} failed: ${response.status}`);
        console.error('Error:', errorText);
        errorCount++;
        
        // Continue with next chunk unless it's a critical error
        if (response.status === 401 || response.status === 403) {
          console.error('Authentication error - stopping deployment');
          break;
        }
      } else {
        console.log(`✅ Chunk ${i + 1} executed successfully`);
        successCount++;
      }
      
      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Chunk ${i + 1} error:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Final Summary:');
  console.log(`✅ Successful chunks: ${successCount}`);
  console.log(`❌ Failed chunks: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log('🎉 Schema deployment completed successfully!');
  } else {
    console.log('⚠️  Schema deployment completed with some errors.');
  }
}

deploySchema();