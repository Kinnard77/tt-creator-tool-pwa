import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czkddpcluizlcftunfcw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2RkcGNsdWl6bGNmdHVuZmN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzYwNzcsImV4cCI6MjA3OTAxMjA3N30.DfFfJX1T7qiWgei8m0_bKVlA9dYOL-3rQP5XXBML1rE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);