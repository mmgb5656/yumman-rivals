-- ============================================
-- YUMMAN RIVALS - Database Schema
-- ============================================
-- Base de datos: Supabase (PostgreSQL)
-- Propósito: Analytics y logs de usuarios
-- ============================================

-- ============================================
-- Tabla: users
-- Almacena información básica de usuarios
-- ============================================
CREATE TABLE users (
  id TEXT PRIMARY KEY,                    -- ID único (hash de hardware)
  first_seen TIMESTAMP DEFAULT NOW(),     -- Primera vez que usó la app
  last_seen TIMESTAMP DEFAULT NOW(),      -- Última vez que usó la app
  total_sessions INT DEFAULT 0,           -- Total de veces que abrió la app
  app_version TEXT,                       -- Última versión usada
  os_version TEXT,                        -- Sistema operativo
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_users_last_seen ON users(last_seen);
CREATE INDEX idx_users_app_version ON users(app_version);

-- ============================================
-- Tabla: app_logs
-- Registra todos los eventos de la app
-- ============================================
CREATE TABLE app_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,                  -- Referencia al usuario
  event_type TEXT NOT NULL,               -- Tipo de evento
  event_data JSONB,                       -- Datos adicionales del evento
  app_version TEXT,                       -- Versión de la app
  os_version TEXT,                        -- Sistema operativo
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Foreign key
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_logs_user_id ON app_logs(user_id);
CREATE INDEX idx_logs_event_type ON app_logs(event_type);
CREATE INDEX idx_logs_created_at ON app_logs(created_at DESC);
CREATE INDEX idx_logs_event_data ON app_logs USING GIN (event_data);

-- ============================================
-- Tipos de eventos soportados:
-- ============================================
-- 'app_opened'         - Usuario abrió la app
-- 'app_closed'         - Usuario cerró la app
-- 'skybox_applied'     - Usuario aplicó un skybox
-- 'textures_applied'   - Usuario aplicó texturas negras
-- 'error'              - Ocurrió un error
-- 'update_available'   - Nueva versión disponible
-- 'update_downloaded'  - Update descargado
-- 'update_installed'   - Update instalado
-- ============================================

-- ============================================
-- Función: Incrementar contador de sesiones
-- ============================================
CREATE OR REPLACE FUNCTION increment_sessions(user_id_param TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET total_sessions = total_sessions + 1,
      last_seen = NOW()
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Vista: Estadísticas diarias
-- ============================================
CREATE OR REPLACE VIEW daily_stats AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) FILTER (WHERE event_type = 'app_opened') as app_opens,
  COUNT(*) FILTER (WHERE event_type = 'skybox_applied') as skyboxes_applied,
  COUNT(*) FILTER (WHERE event_type = 'error') as errors
FROM app_logs
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- ============================================
-- Vista: Skyboxes más populares
-- ============================================
CREATE OR REPLACE VIEW popular_skyboxes AS
SELECT 
  event_data->>'skybox_name' as skybox_name,
  COUNT(*) as total_uses,
  COUNT(DISTINCT user_id) as unique_users,
  MAX(created_at) as last_used
FROM app_logs
WHERE event_type = 'skybox_applied'
  AND event_data->>'skybox_name' IS NOT NULL
GROUP BY event_data->>'skybox_name'
ORDER BY total_uses DESC;

-- ============================================
-- Vista: Versiones de la app en uso
-- ============================================
CREATE OR REPLACE VIEW app_versions_usage AS
SELECT 
  app_version,
  COUNT(*) as user_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage,
  MAX(last_seen) as last_seen
FROM users
WHERE app_version IS NOT NULL
GROUP BY app_version
ORDER BY user_count DESC;

-- ============================================
-- Vista: Errores recientes
-- ============================================
CREATE OR REPLACE VIEW recent_errors AS
SELECT 
  event_data->>'message' as error_message,
  event_data->>'stack' as error_stack,
  COUNT(*) as occurrences,
  COUNT(DISTINCT user_id) as affected_users,
  MAX(created_at) as last_occurrence,
  app_version
FROM app_logs
WHERE event_type = 'error'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY 
  event_data->>'message',
  event_data->>'stack',
  app_version
ORDER BY occurrences DESC;

-- ============================================
-- Política de seguridad (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_logs ENABLE ROW LEVEL SECURITY;

-- Política: Permitir INSERT desde la app (anon key)
CREATE POLICY "Allow insert for anon users" ON users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow insert for anon users" ON app_logs
  FOR INSERT
  WITH CHECK (true);

-- Política: Permitir UPDATE de last_seen
CREATE POLICY "Allow update last_seen" ON users
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Política: Solo lectura para usuarios autenticados (dashboard)
CREATE POLICY "Allow read for authenticated users" ON users
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow read for authenticated users" ON app_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- Función: Limpiar logs antiguos (opcional)
-- Ejecutar mensualmente para mantener DB pequeña
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS VOID AS $$
BEGIN
  -- Borrar logs de más de 90 días
  DELETE FROM app_logs
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Borrar usuarios inactivos por más de 180 días
  DELETE FROM users
  WHERE last_seen < NOW() - INTERVAL '180 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Queries útiles para el dashboard
-- ============================================

-- Usuarios activos hoy
-- SELECT COUNT(DISTINCT user_id) FROM app_logs WHERE created_at >= CURRENT_DATE;

-- Usuarios activos esta semana
-- SELECT COUNT(DISTINCT user_id) FROM app_logs WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';

-- Total de instalaciones
-- SELECT COUNT(*) FROM users;

-- Skybox más popular
-- SELECT * FROM popular_skyboxes LIMIT 1;

-- Distribución de sistemas operativos
-- SELECT os_version, COUNT(*) as count FROM users GROUP BY os_version ORDER BY count DESC;

-- Tasa de retención (usuarios que volvieron después de 7 días)
-- SELECT 
--   COUNT(DISTINCT CASE WHEN last_seen > first_seen + INTERVAL '7 days' THEN id END) * 100.0 / COUNT(*) as retention_rate
-- FROM users;
