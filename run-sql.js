const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://czkddpcluizlcftunfcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2RkcGNsdWl6bGNmdHVuZmN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQzNjA3NywiZXhwIjoyMDc5MDEyMDc3fQ.vWUCQtMc-5OlwQqlS6JFe3NmMgqLbkQqjwa8BSAj1do'
);

// Using postgrest to execute SQL - but we need to use the API differently
// Let's try using the console API or just test if column exists

async function checkAndAddColumn() {
  // First check if column exists by trying to update
  const { data, error } = await supabase
    .from('cathedrals')
    .select('location_locked')
    .limit(1);

  if (error && error.message.includes('location_locked')) {
    console.log('Column does not exist, need to add it');
    console.log('Please run this SQL in Supabase dashboard:');
    console.log('ALTER TABLE cathedrals ADD COLUMN location_locked BOOLEAN DEFAULT false;');
  } else {
    console.log('Column exists or query succeeded');
    console.log('Result:', data);
  }
}

checkAndAddColumn();