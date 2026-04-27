-- Script para crear la tabla 'users' vinculada a la autenticación de Supabase

CREATE TABLE public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'CLIENT',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Habilitar Row Level Security (RLS) para mayor seguridad
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas (Puedes ajustarlas según tus necesidades)
-- Permite a cualquier usuario autenticado leer los perfiles
CREATE POLICY "Permitir lectura a usuarios autenticados" 
ON public.users FOR SELECT 
TO authenticated 
USING (true);

-- Permite a un usuario actualizar su propio perfil
CREATE POLICY "Permitir actualizar perfil propio" 
ON public.users FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Permite a un usuario insertar su propio perfil (Necesario para el registro que hicimos)
CREATE POLICY "Permitir insertar perfil propio" 
ON public.users FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- ==========================================
-- POLÍTICAS PARA SERVICES Y PRODUCTS
-- (Para desarrollo, permite inserciones públicas o autenticadas libremente)
-- ==========================================

-- Servicios: Permitir insertar a todos (o usar TO authenticated)
CREATE POLICY "Permitir insertar servicios" 
ON public.services FOR INSERT 
TO public 
WITH CHECK (true);

-- Productos: Permitir insertar a todos (o usar TO authenticated)
CREATE POLICY "Permitir insertar productos" 
ON public.products FOR INSERT 
TO public 
WITH CHECK (true);
