require('dotenv').config();
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const JWT_SECRET = process.env.JWT_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log('Environment vars loaded:');
console.log('JWT_SECRET:', !!JWT_SECRET);
console.log('SUPABASE_URL:', !!SUPABASE_URL, SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY:', !!SUPABASE_KEY);

async function test() {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('\n=== Fetching all users ===');
    const { data, error } = await supabase.from('users').select('*');
    console.log('Error:', error);
    console.log('Data:', data);
  } catch (e) {
    console.error('FATAL:', e.message);
  }
}

test();
