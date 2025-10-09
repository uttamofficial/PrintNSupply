// Mock Supabase client for demo purposes
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://qlchpejqhdjzbfikvlzw.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2hwZWpxaGRqemJmaWt2bHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1MTgsImV4cCI6MjA3NTQ3NjUxOH0.e6M4R5P0o6xanOOmiyBL_2REzasx2nVQoI1DtAVGAGA';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Log initialization (for debugging)
console.log('✅ Supabase client initialized');
console.log('📍 URL:', supabaseUrl);

// Export as object for destructuring
module.exports = { supabase };
