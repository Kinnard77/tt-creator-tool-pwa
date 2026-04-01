const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://czkddpcluizlcftunfcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2RkcGNsdWl6bGNmdHVuZmN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQzNjA3NywiZXhwIjoyMDc5MDEyMDc3fQ.vWUCQtMc-5OlwQqlS6JFe3NmMgqLbkQqjwa8BSAj1do'
);

async function checkTables() {
  // Try to query each known table
  const tables = ['cathedrals', 'umbrales', 'desafios'];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    console.log(`${table}: ${error ? 'ERROR - ' + error.message : 'EXISTS'}`);
  }
}

checkTables();