const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://czkddpcluizlcftunfcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2RkcGNsdWl6bGNmdHVuZmN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQzNjA3NywiZXhwIjoyMDc5MDEyMDc3fQ.vWUCQtMc-5OlwQqlS6JFe3NmMgqLbkQqjwa8BSAj1do'
);

async function check() {
  const cathedralId = 'ddad81f4-8b7d-46b0-8932-21d63d4f3f09';
  const { data } = await supabase
    .from('umbrales')
    .select('id, position, created_at')
    .eq('cathedral_id', cathedralId)
    .order('created_at', { ascending: false });
  
  console.log('Nodos (mas reciente primero):');
  data.forEach((u, i) => {
    console.log('Umbral ' + (i+1) + ': ' + u.id.substring(0,8) + ' -> ' + u.position.lat.toFixed(4) + ', ' + u.position.lng.toFixed(4));
  });
}

check();