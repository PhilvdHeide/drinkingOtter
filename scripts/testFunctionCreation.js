import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import process from 'node:process'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_KEY
)

async function testFunctionCreation() {
  try {
    // Use SQL editor endpoint to execute raw SQL
    const { data, error } = await supabase
      .from('sql')
      .insert({
        sql: `
          CREATE OR REPLACE FUNCTION execute_sql(query text) 
          RETURNS void AS $$
          BEGIN
            EXECUTE query;
          END;
          $$ LANGUAGE plpgsql;
        `
      })
    
    if (error) throw error
    console.log('Function creation successful:', data)
    
    // Verify function exists using SQL editor
    const { data: verifyData, error: verifyError } = await supabase
      .from('sql')
      .insert({
        sql: `
          SELECT proname 
          FROM pg_proc 
          WHERE proname = 'execute_sql'
        `
      })
    
    if (verifyError) throw verifyError
    console.log('Function verification:', verifyData)
  } catch (error) {
    console.error('Function creation failed:', {
      message: error.message,
      code: error.code,
      details: error.details,
      status: error.status,
      statusText: error.statusText
    })
  }
}

testFunctionCreation()
