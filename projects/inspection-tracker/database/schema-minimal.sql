-- מערכת מעקב בדיקות הנדסיות - סכמה מינימלית
-- Hebrew Construction Site Inspection Tracking System - Minimal Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone to Israel
SET timezone = 'Asia/Jerusalem';

-- =============================================================================
-- ENUM TYPES - טיפוסי ENUM
-- =============================================================================

-- Building types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'building_type') THEN
        CREATE TYPE building_type AS ENUM ('datacenter', 'office', 'warehouse', 'laboratory', 'production', 'utilities', 'technical');
    END IF;
END $$;

-- User roles
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('technician', 'manager', 'admin');
    END IF;
END $$;

-- Inspection categories
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inspection_category') THEN
        CREATE TYPE inspection_category AS ENUM ('engineering', 'characterization', 'operational', 'supporting', 'network', 'infrastructure', 'security', 'multimedia', 'end_stations', 'telephony', 'announcement', 'management', 'special', 'cyber', 'inventory', 'training');
    END IF;
END $$;

-- Priority levels
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_level') THEN
        CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
    END IF;
END $$;

-- Inspection statuses
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inspection_status') THEN
        CREATE TYPE inspection_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'failed', 'cancelled', 'needs_review');
    END IF;
END $$;

-- =============================================================================
-- CORE TABLES - טבלאות ליבה
-- =============================================================================

-- System settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description_hebrew TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buildings table
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

-- Users table
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

-- Inspection types table
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

-- Inspections table
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
-- BASIC INDEXES - אינדקסים בסיסיים
-- =============================================================================

-- Only create essential indexes
CREATE INDEX IF NOT EXISTS idx_buildings_code ON public.buildings(building_code);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_inspection_types_code ON public.inspection_types(code);
CREATE INDEX IF NOT EXISTS idx_inspections_number ON public.inspections(inspection_number);
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);

-- Hebrew text search indexes (using 'simple' for Supabase compatibility)
CREATE INDEX IF NOT EXISTS idx_buildings_name_search ON public.buildings 
    USING gin(to_tsvector('simple', name_hebrew));

CREATE INDEX IF NOT EXISTS idx_inspection_types_name_search ON public.inspection_types 
    USING gin(to_tsvector('simple', name_hebrew));

-- =============================================================================
-- SEQUENCES - רצפים
-- =============================================================================

-- Create inspection number sequence
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE sequencename = 'inspection_number_seq') THEN
        CREATE SEQUENCE inspection_number_seq START 1000;
    END IF;
END $$;

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

SELECT 'מבנה נתונים מינימלי נוצר בהצלחה! Minimal schema created successfully!' as status;