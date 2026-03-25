-- Tabla de Narrativas
CREATE TABLE IF NOT EXISTS narrativas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'audio', 'puzzle', 'mixed')),
  cathedral_id UUID REFERENCES cathedrals(id),
  content JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Personajes
CREATE TABLE IF NOT EXISTS personajes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  narrativa_id UUID REFERENCES narrativas(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Puzzles (enigmas sueltos)
CREATE TABLE IF NOT EXISTS puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  narrativa_id UUID REFERENCES narrativas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  tipo TEXT CHECK (tipo IN ('codigo', 'texto', 'audio', 'ubicacion', 'simbolo')),
  respuesta_correcta TEXT,
  pista TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE narrativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE personajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read narrativas" ON narrativas FOR SELECT USING (true);
CREATE POLICY "Anyone can insert narrativas" ON narrativas FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update narrativas" ON narrativas FOR UPDATE USING (true);

CREATE POLICY "Anyone can read personajes" ON personajes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert personajes" ON personajes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read puzzles" ON puzzles FOR SELECT USING (true);
CREATE POLICY "Anyone can insert puzzles" ON puzzles FOR INSERT WITH CHECK (true);