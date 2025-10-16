require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log('SUPABASE_URL:', SUPABASE_URL);
console.log('SUPABASE_KEY loaded:', !!SUPABASE_KEY);

async function test() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    console.log('\n=== Testing Supabase Auth ===');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'henrique@hsilveira.com',
      password: 'hsilveira2025'
    });

    console.log('Error:', error);
    console.log('Data:', data);
    
  } catch (e) {
    console.error('FATAL:', e.message);
    console.error('Stack:', e.stack);
  }
}

test();
