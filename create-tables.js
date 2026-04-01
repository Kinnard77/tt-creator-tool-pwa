const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://czkddpcluizlcftunfcw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6a2RkcGNsdWl6bGNmdHVuZmN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzQzNjA3NywiZXhwIjoyMDc5MDEyMDc3fQ.vWUCQtMc-5OlwQqlS6JFe3NmMgqLbkQqjwa8BSAj1do'
);

// SQL to create tables
const createTablesSQL = `

-- 1. DATA COLLECTION ENTRIES (los 15 tipos de datos)
CREATE TABLE IF NOT EXISTS data_collection_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cathedral_id UUID REFERENCES cathedrals(id) ON DELETE CASCADE,
  umbral_id UUID REFERENCES umbrales(id) ON DELETE SET NULL,
  
  -- Tipo de dato (los 15)
  type TEXT NOT NULL CHECK (type IN (
    'physical', 'historical', 'characters', 'esoteric',
    'sacred_geometry', 'numerology', 'symbolism', 'astronomy',
    'acoustics', 'materials', 'inscriptions', 'art',
    'architecture', 'legends', 'fiction'
  )),
  
  title TEXT NOT NULL,
  content TEXT,
  
  -- JSONB para campos específicos por tipo
  type_specific JSONB DEFAULT '{}',
  
  -- Tags para búsqueda
  tags TEXT[] DEFAULT '{}',
  
  -- Fuentes (referencias)
  sources JSONB DEFAULT '[]',
  
  -- Uso (en qué narrativas/puzzles se usa)
  usage JSONB DEFAULT '{"used_in_narratives": [], "used_in_puzzles": [], "importance": "medium"}',
  
  -- Estado
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'validated', 'used')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. DATA CONNECTIONS (conexiones entre entradas)
CREATE TABLE IF NOT EXISTS data_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entry_id UUID REFERENCES data_collection_entries(id) ON DELETE CASCADE,
  to_entry_id UUID REFERENCES data_collection_entries(id) ON DELETE CASCADE,
  connection_type TEXT NOT NULL CHECK (connection_type IN (
    'based_on', 'explains', 'inspired_by', 'contradicts', 'complements', 'references'
  )),
  label TEXT,
  bidirectional BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DATA MEDIA (fotos, audios, videos)
CREATE TABLE IF NOT EXISTS data_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES data_collection_entries(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL CHECK (type IN ('photo', 'audio', 'video', 'document')),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  
  -- Metadata de la captura
  taken_date TIMESTAMPTZ,
  gps_lat DECIMAL(10,8),
  gps_lng DECIMAL(11,8),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE data_collection_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_media ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso (abierto para todos por ahora)
DROP POLICY IF EXISTS "Anyone can read data_collection_entries" ON data_collection_entries;
CREATE POLICY "Anyone can read data_collection_entries" ON data_collection_entries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can insert data_collection_entries" ON data_collection_entries;
CREATE POLICY "Anyone can insert data_collection_entries" ON data_collection_entries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can update data_collection_entries" ON data_collection_entries;
CREATE POLICY "Anyone can update data_collection_entries" ON data_collection_entries FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Anyone can delete data_collection_entries" ON data_collection_entries;
CREATE POLICY "Anyone can delete data_collection_entries" ON data_collection_entries FOR DELETE USING (true);

DROP POLICY IF EXISTS "Anyone can read data_connections" ON data_connections;
CREATE POLICY "Anyone can read data_connections" ON data_connections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can insert data_connections" ON data_connections;
CREATE POLICY "Anyone can insert data_connections" ON data_connections FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can update data_connections" ON data_connections;
CREATE POLICY "Anyone can update data_connections" ON data_connections FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Anyone can delete data_connections" ON data_connections;
CREATE POLICY "Anyone can delete data_connections" ON data_connections FOR DELETE USING (true);

DROP POLICY IF EXISTS "Anyone can read data_media" ON data_media;
CREATE POLICY "Anyone can read data_media" ON data_media FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can insert data_media" ON data_media;
CREATE POLICY "Anyone can insert data_media" ON data_media FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can update data_media" ON data_media;
CREATE POLICY "Anyone can update data_media" ON data_media FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Anyone can delete data_media" ON data_media;
CREATE POLICY "Anyone can delete data_media" ON data_media FOR DELETE USING (true);

`;

async function createTables() {
  // Using supabase's postgres function to execute raw SQL
  const { data, error } = await supabase.rpc('pg_catalog', { 
    statement: createTablesSQL 
  });
  
  console.log('Error:', error ? error.message : 'Tablas creadas exitosamente');
  console.log('Data:', data);
}

createTables();