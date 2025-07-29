-- מערכת מעקב בדיקות הנדסיות - קריית התקשוב (גרסה בטוחה)
-- Hebrew Construction Site Inspection Tracking System - Safe Database Schema
-- 
-- This version handles existing types and tables gracefully

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone to Israel
SET timezone = 'Asia/Jerusalem';

-- =============================================================================
-- ENUM TYPES - טיפוסי ENUM (with safe creation)
-- =============================================================================

-- Building types (safe creation)
DO $$ BEGIN
    CREATE TYPE building_type AS ENUM ('datacenter', 'office', 'warehouse', 'laboratory', 'production', 'utilities', 'technical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- User roles (safe creation)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('technician', 'manager', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Inspection categories (safe creation)
DO $$ BEGIN
    CREATE TYPE inspection_category AS ENUM ('engineering', 'characterization', 'operational', 'supporting', 'network', 'infrastructure', 'security', 'multimedia', 'end_stations', 'telephony', 'announcement', 'management', 'special', 'cyber', 'inventory', 'training');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Priority levels (safe creation)
DO $$ BEGIN
    CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Inspection statuses (safe creation)
DO $$ BEGIN
    CREATE TYPE inspection_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled', 'needs_review');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- BUILDINGS TABLE - מבנים
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.buildings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    building_code TEXT UNIQUE NOT NULL,
    name_hebrew TEXT NOT NULL,
    name_english TEXT,
    building_type building_type NOT NULL DEFAULT 'datacenter',
    address_hebrew TEXT,
    floor_count INTEGER DEFAULT 1,
    total_area_sqm DECIMAL(10,2),
    construction_year INTEGER,
    description_hebrew TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- USERS TABLE - משתמשים
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role DEFAULT 'technician',
    employee_id TEXT,
    department TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INSPECTION TYPES TABLE - סוגי בדיקות
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.inspection_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_hebrew TEXT NOT NULL,
    name_english TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    description_hebrew TEXT,
    category inspection_category NOT NULL,
    subcategory TEXT,
    estimated_duration_minutes INTEGER DEFAULT 60,
    requires_photo BOOLEAN DEFAULT false,
    requires_signature BOOLEAN DEFAULT false,
    requires_certification BOOLEAN DEFAULT false,
    required_tools TEXT[],
    safety_requirements TEXT[],
    frequency_days INTEGER,
    priority priority_level DEFAULT 'medium',
    compliance_standard TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INSPECTIONS TABLE - בדיקות
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inspection_number TEXT UNIQUE NOT NULL,
    type_id UUID REFERENCES inspection_types(id) NOT NULL,
    building_id UUID REFERENCES buildings(id) NOT NULL,
    inspector_id UUID REFERENCES users(id),
    reviewer_id UUID REFERENCES users(id),
    scheduled_date DATE NOT NULL,
    scheduled_time_start TIME,
    scheduled_time_end TIME,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    actual_duration_minutes INTEGER,
    status inspection_status DEFAULT 'pending',
    priority priority_level DEFAULT 'medium',
    floor_number INTEGER,
    room_number TEXT,
    location_description_hebrew TEXT,
    notes_hebrew TEXT,
    findings_hebrew TEXT,
    recommendations_hebrew TEXT,
    photos TEXT[],
    documents TEXT[],
    signature_inspector TEXT,
    signature_reviewer TEXT,
    passed BOOLEAN,
    compliance_score DECIMAL(5,2),
    next_inspection_due DATE,
    weather_conditions TEXT,
    temperature_celsius DECIMAL(4,1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- SUPPORT TABLES - טבלאות תמיכה
-- =============================================================================

-- Inspection rounds
CREATE TABLE IF NOT EXISTS public.inspection_rounds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    round_number INTEGER UNIQUE NOT NULL,
    name_hebrew TEXT NOT NULL,
    description_hebrew TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Regulators
CREATE TABLE IF NOT EXISTS public.regulators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_hebrew TEXT UNIQUE NOT NULL,
    name_english TEXT,
    description_hebrew TEXT,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Red teams
CREATE TABLE IF NOT EXISTS public.red_teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_hebrew TEXT UNIQUE NOT NULL,
    description_hebrew TEXT,
    leader_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description_hebrew TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dropdown options
CREATE TABLE IF NOT EXISTS public.dropdown_options (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category TEXT NOT NULL,
    value_hebrew TEXT NOT NULL,
    value_english TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, value_hebrew)
);

-- =============================================================================
-- INDEXES - אינדקסים
-- =============================================================================

-- Buildings indexes
CREATE INDEX IF NOT EXISTS idx_buildings_code ON public.buildings(building_code);
CREATE INDEX IF NOT EXISTS idx_buildings_type ON public.buildings(building_type);
CREATE INDEX IF NOT EXISTS idx_buildings_active ON public.buildings(is_active);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);

-- Inspection types indexes
CREATE INDEX IF NOT EXISTS idx_inspection_types_code ON public.inspection_types(code);
CREATE INDEX IF NOT EXISTS idx_inspection_types_category ON public.inspection_types(category);
CREATE INDEX IF NOT EXISTS idx_inspection_types_active ON public.inspection_types(is_active);

-- Inspections indexes
CREATE INDEX IF NOT EXISTS idx_inspections_number ON public.inspections(inspection_number);
CREATE INDEX IF NOT EXISTS idx_inspections_type_id ON public.inspections(type_id);
CREATE INDEX IF NOT EXISTS idx_inspections_building_id ON public.inspections(building_id);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector_id ON public.inspections(inspector_id);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON public.inspections(status);
CREATE INDEX IF NOT EXISTS idx_inspections_scheduled_date ON public.inspections(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_inspections_priority ON public.inspections(priority);

-- Full-text search indexes (using 'simple' configuration for Supabase compatibility)
CREATE INDEX IF NOT EXISTS idx_inspections_notes_fts ON public.inspections 
    USING gin(to_tsvector('simple', coalesce(notes_hebrew, '')));

CREATE INDEX IF NOT EXISTS idx_inspections_findings_fts ON public.inspections 
    USING gin(to_tsvector('simple', coalesce(findings_hebrew, '')));

-- System settings indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_public ON public.system_settings(is_public);

-- Dropdown options indexes
CREATE INDEX IF NOT EXISTS idx_dropdown_options_category ON public.dropdown_options(category);
CREATE INDEX IF NOT EXISTS idx_dropdown_options_active ON public.dropdown_options(is_active);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) - אבטחה ברמת השורה
-- =============================================================================

-- Note: RLS policies will be added later after authentication is set up
-- For now, tables are accessible without restrictions

-- =============================================================================
-- SEQUENCES - רצפים
-- =============================================================================

-- Inspection number sequence
CREATE SEQUENCE IF NOT EXISTS inspection_number_seq START 1000;

-- =============================================================================
-- TRIGGERS - טריגרים
-- =============================================================================

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
DO $$ 
BEGIN
    -- Buildings trigger
    IF NOT EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'update_buildings_updated_at') THEN
        CREATE TRIGGER update_buildings_updated_at 
        BEFORE UPDATE ON public.buildings 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Users trigger  
    IF NOT EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
        BEFORE UPDATE ON public.users 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Inspection types trigger
    IF NOT EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'update_inspection_types_updated_at') THEN
        CREATE TRIGGER update_inspection_types_updated_at 
        BEFORE UPDATE ON public.inspection_types 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- Inspections trigger
    IF NOT EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'update_inspections_updated_at') THEN
        CREATE TRIGGER update_inspections_updated_at 
        BEFORE UPDATE ON public.inspections 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    -- System settings trigger
    IF NOT EXISTS(SELECT 1 FROM pg_trigger WHERE tgname = 'update_system_settings_updated_at') THEN
        CREATE TRIGGER update_system_settings_updated_at 
        BEFORE UPDATE ON public.system_settings 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =============================================================================
-- COMMENTS - הערות
-- =============================================================================

COMMENT ON TABLE public.buildings IS 'מבנים באתר קריית התקשוב';
COMMENT ON TABLE public.users IS 'משתמשי המערכת - בודקים ומנהלים';
COMMENT ON TABLE public.inspection_types IS 'סוגי בדיקות הנדסיות';
COMMENT ON TABLE public.inspections IS 'בדיקות שבוצעו או מתוכננות';
COMMENT ON TABLE public.inspection_rounds IS 'סבבי בדיקות';
COMMENT ON TABLE public.regulators IS 'רגולטורים וגורמי פיקוח';
COMMENT ON TABLE public.red_teams IS 'צוותים אדומים לביצוע בדיקות';
COMMENT ON TABLE public.system_settings IS 'הגדרות מערכת כלליות';
COMMENT ON TABLE public.dropdown_options IS 'אפשרויות לרשימות נפתחות';

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

SELECT 'מבנה הנתונים הבטוח נוצר בהצלחה! Safe schema created successfully!' as status;