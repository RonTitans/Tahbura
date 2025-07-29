-- מערכת מעקב בדיקות הנדסיות - קריית התקשוב
-- Hebrew Construction Site Inspection Tracking System - Database Schema
-- 
-- This schema supports Hebrew content with full UTF-8 encoding
-- All user-facing strings are in Hebrew with English field names for development

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone to Israel
SET timezone = 'Asia/Jerusalem';

-- =============================================================================
-- USERS TABLE - משתמשים
-- =============================================================================

-- Create custom user roles enum
CREATE TYPE user_role AS ENUM ('technician', 'manager', 'admin');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'technician',
    employee_id TEXT UNIQUE,
    department TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for performance
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_active ON public.users(is_active);
CREATE INDEX idx_users_employee_id ON public.users(employee_id);

-- =============================================================================
-- BUILDINGS TABLE - מבנים
-- =============================================================================

-- Building types enum
CREATE TYPE building_type AS ENUM ('datacenter', 'office', 'warehouse', 'laboratory', 'production', 'utilities');

-- Buildings table
CREATE TABLE public.buildings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_hebrew TEXT NOT NULL, -- שם המבנה בעברית
    name_english TEXT, -- שם המבנה באנגלית (לפיתוח)
    building_code TEXT UNIQUE NOT NULL, -- קוד מבנה (A, B, C, etc.)
    building_type building_type NOT NULL,
    address_hebrew TEXT,
    floor_count INTEGER DEFAULT 1,
    total_area_sqm DECIMAL(10,2),
    construction_year INTEGER,
    description_hebrew TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX idx_buildings_code ON public.buildings(building_code);
CREATE INDEX idx_buildings_type ON public.buildings(building_type);
CREATE INDEX idx_buildings_active ON public.buildings(is_active);

-- =============================================================================
-- INSPECTION TYPES TABLE - סוגי בדיקות
-- =============================================================================

-- Inspection categories enum
CREATE TYPE inspection_category AS ENUM (
    'electrical', 'plumbing', 'hvac', 'structural', 
    'safety', 'fire', 'security', 'network', 'environmental'
);

-- Priority levels enum
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- Inspection types table (523 different types)
CREATE TABLE public.inspection_types (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_hebrew TEXT NOT NULL, -- שם הבדיקה בעברית
    name_english TEXT NOT NULL, -- שם הבדיקה באנגלית
    code TEXT UNIQUE NOT NULL, -- קוד בדיקה (E001, P002, etc.)
    description_hebrew TEXT,
    category inspection_category NOT NULL,
    subcategory TEXT,
    estimated_duration_minutes INTEGER DEFAULT 60,
    requires_photo BOOLEAN DEFAULT false,
    requires_signature BOOLEAN DEFAULT false,
    requires_certification BOOLEAN DEFAULT false,
    required_tools TEXT[], -- כלים נדרשים
    safety_requirements TEXT[], -- דרישות בטיחות
    frequency_days INTEGER, -- תדירות בימים
    priority priority_level DEFAULT 'medium',
    compliance_standard TEXT, -- תקן ציות
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX idx_inspection_types_category ON public.inspection_types(category);
CREATE INDEX idx_inspection_types_code ON public.inspection_types(code);
CREATE INDEX idx_inspection_types_active ON public.inspection_types(is_active);
CREATE INDEX idx_inspection_types_priority ON public.inspection_types(priority);

-- =============================================================================
-- INSPECTIONS TABLE - בדיקות
-- =============================================================================

-- Inspection status enum
CREATE TYPE inspection_status AS ENUM (
    'pending',      -- ממתין
    'scheduled',    -- מתוזמן
    'in_progress',  -- בביצוע
    'completed',    -- הושלם
    'failed',       -- נכשל
    'cancelled',    -- בוטל
    'needs_review'  -- נדרשת בדיקה חוזרת
);

-- Main inspections table
CREATE TABLE public.inspections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inspection_number TEXT UNIQUE NOT NULL, -- מספר בדיקה ייחודי
    type_id UUID NOT NULL REFERENCES public.inspection_types(id),
    building_id UUID NOT NULL REFERENCES public.buildings(id),
    inspector_id UUID REFERENCES public.users(id),
    reviewer_id UUID REFERENCES public.users(id), -- מאשר הבדיקה
    
    -- Scheduling
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_time_start TIME,
    scheduled_time_end TIME,
    
    -- Execution
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    actual_duration_minutes INTEGER,
    
    -- Status and priority  
    status inspection_status NOT NULL DEFAULT 'pending',
    priority priority_level DEFAULT 'medium',
    
    -- Location details
    floor_number INTEGER,
    room_number TEXT,
    location_description_hebrew TEXT,
    
    -- Content
    notes_hebrew TEXT,
    findings_hebrew TEXT,
    recommendations_hebrew TEXT,
    
    -- Files and media
    photos TEXT[], -- מערך כתובות תמונות
    documents TEXT[], -- מערך מסמכים
    signature_inspector TEXT, -- חתימת בודק
    signature_reviewer TEXT, -- חתימת מאשר
    
    -- Compliance
    passed BOOLEAN,
    compliance_score INTEGER CHECK (compliance_score >= 0 AND compliance_score <= 100),
    next_inspection_due DATE,
    
    -- Weather/Environmental (for outdoor inspections)
    weather_conditions TEXT,
    temperature_celsius DECIMAL(4,1),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes for performance
CREATE INDEX idx_inspections_type ON public.inspections(type_id);
CREATE INDEX idx_inspections_building ON public.inspections(building_id);
CREATE INDEX idx_inspections_inspector ON public.inspections(inspector_id);
CREATE INDEX idx_inspections_status ON public.inspections(status);
CREATE INDEX idx_inspections_scheduled_date ON public.inspections(scheduled_date);
CREATE INDEX idx_inspections_priority ON public.inspections(priority);
CREATE INDEX idx_inspections_number ON public.inspections(inspection_number);

-- =============================================================================
-- INSPECTION CHECKLIST ITEMS - פריטי רשימת בדיקה
-- =============================================================================

CREATE TABLE public.inspection_checklist_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inspection_type_id UUID NOT NULL REFERENCES public.inspection_types(id) ON DELETE CASCADE,
    item_text_hebrew TEXT NOT NULL,
    item_text_english TEXT,
    is_required BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL,
    expected_value TEXT, -- ערך צפוי
    measurement_unit TEXT, -- יחידת מידה
    min_value DECIMAL(10,2), -- ערך מינימלי
    max_value DECIMAL(10,2), -- ערך מקסימלי
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX idx_checklist_items_type ON public.inspection_checklist_items(inspection_type_id);
CREATE INDEX idx_checklist_items_required ON public.inspection_checklist_items(is_required);

-- =============================================================================
-- INSPECTION CHECKLIST RESPONSES - תגובות רשימת בדיקה
-- =============================================================================

CREATE TABLE public.inspection_checklist_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
    checklist_item_id UUID NOT NULL REFERENCES public.inspection_checklist_items(id),
    
    -- Response data
    checked BOOLEAN DEFAULT false,
    measured_value DECIMAL(10,2),
    text_response TEXT,
    notes_hebrew TEXT,
    
    -- Status
    passed BOOLEAN,
    requires_attention BOOLEAN DEFAULT false,
    
    -- Metadata
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one response per item per inspection
    UNIQUE(inspection_id, checklist_item_id)
);

-- Add indexes
CREATE INDEX idx_checklist_responses_inspection ON public.inspection_checklist_responses(inspection_id);
CREATE INDEX idx_checklist_responses_item ON public.inspection_checklist_responses(checklist_item_id);

-- =============================================================================
-- INSPECTION PHOTOS TABLE - תמונות בדיקה
-- =============================================================================

CREATE TABLE public.inspection_photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    inspection_id UUID NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- path in Supabase Storage
    file_size INTEGER,
    mime_type TEXT,
    caption_hebrew TEXT,
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    uploaded_by UUID REFERENCES public.users(id),
    is_primary BOOLEAN DEFAULT false, -- תמונה ראשית
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX idx_photos_inspection ON public.inspection_photos(inspection_id);
CREATE INDEX idx_photos_primary ON public.inspection_photos(is_primary);

-- =============================================================================
-- REPORTS TABLE - דוחות
-- =============================================================================

-- Report types enum
CREATE TYPE report_type AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom');

-- Report format enum  
CREATE TYPE report_format AS ENUM ('pdf', 'excel', 'word', 'html');

CREATE TABLE public.reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name_hebrew TEXT NOT NULL,
    description_hebrew TEXT,
    report_type report_type NOT NULL,
    format report_format NOT NULL,
    
    -- Filters
    building_ids UUID[],
    inspection_type_ids UUID[],
    date_from DATE,
    date_to DATE,
    status_filter inspection_status[],
    
    -- Generation
    generated_by UUID NOT NULL REFERENCES public.users(id),
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    file_path TEXT, -- path to generated file
    file_size INTEGER,
    
    -- Scheduling (for recurring reports)
    is_scheduled BOOLEAN DEFAULT false,
    schedule_cron TEXT, -- cron expression for scheduling
    next_run_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX idx_reports_type ON public.reports(report_type);
CREATE INDEX idx_reports_generated_by ON public.reports(generated_by);
CREATE INDEX idx_reports_scheduled ON public.reports(is_scheduled);

-- =============================================================================
-- AUDIT LOG TABLE - יומן ביקורת
-- =============================================================================

-- Action types enum
CREATE TYPE audit_action AS ENUM (
    'create', 'update', 'delete', 'login', 'logout', 
    'start_inspection', 'complete_inspection', 'approve_inspection',
    'generate_report', 'export_data', 'upload_photo'
);

CREATE TABLE public.audit_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id),
    action audit_action NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    description_hebrew TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add indexes
CREATE INDEX idx_audit_log_user ON public.audit_log(user_id);
CREATE INDEX idx_audit_log_action ON public.audit_log(action);
CREATE INDEX idx_audit_log_table ON public.audit_log(table_name);
CREATE INDEX idx_audit_log_created ON public.audit_log(created_at);

-- =============================================================================
-- NOTIFICATION SETTINGS TABLE - הגדרות התראות
-- =============================================================================

-- Notification types enum
CREATE TYPE notification_type AS ENUM (
    'inspection_due', 'inspection_overdue', 'inspection_completed',
    'inspection_failed', 'report_generated', 'system_maintenance'
);

-- Notification channels enum
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'push', 'in_app');

CREATE TABLE public.notification_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one setting per user per type per channel
    UNIQUE(user_id, notification_type, channel)
);

-- Add indexes
CREATE INDEX idx_notification_settings_user ON public.notification_settings(user_id);

-- =============================================================================
-- SYSTEM SETTINGS TABLE - הגדרות מערכת
-- =============================================================================

CREATE TABLE public.system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description_hebrew TEXT,
    is_public BOOLEAN DEFAULT false, -- can be read by regular users
    updated_by UUID REFERENCES public.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_checklist_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Managers can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('manager', 'admin')
        )
    );

-- Buildings policies (all authenticated users can read)
CREATE POLICY "Authenticated users can view buildings" ON public.buildings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Inspection types policies (all authenticated users can read)
CREATE POLICY "Authenticated users can view inspection types" ON public.inspection_types
    FOR SELECT USING (auth.role() = 'authenticated');

-- Inspections policies
CREATE POLICY "Technicians can view their own inspections" ON public.inspections
    FOR SELECT USING (auth.uid() = inspector_id);

CREATE POLICY "Technicians can create inspections" ON public.inspections
    FOR INSERT WITH CHECK (auth.uid() = inspector_id);

CREATE POLICY "Technicians can update their own inspections" ON public.inspections
    FOR UPDATE USING (auth.uid() = inspector_id);

CREATE POLICY "Managers can view all inspections" ON public.inspections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('manager', 'admin')
        )
    );

-- Checklist responses policies
CREATE POLICY "Users can manage checklist responses for their inspections" ON public.inspection_checklist_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.inspections 
            WHERE id = inspection_id 
            AND (inspector_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.users 
                WHERE id = auth.uid() 
                AND role IN ('manager', 'admin')
            ))
        )
    );

-- Photos policies
CREATE POLICY "Users can manage photos for their inspections" ON public.inspection_photos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.inspections 
            WHERE id = inspection_id 
            AND (inspector_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.users 
                WHERE id = auth.uid() 
                AND role IN ('manager', 'admin')
            ))
        )
    );

-- Reports policies
CREATE POLICY "Users can view reports they created" ON public.reports
    FOR SELECT USING (generated_by = auth.uid());

CREATE POLICY "Managers can view all reports" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('manager', 'admin')
        )
    );

-- Audit log policies (admin only)
CREATE POLICY "Admins can view audit log" ON public.audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Notification settings policies
CREATE POLICY "Users can manage their own notification settings" ON public.notification_settings
    FOR ALL USING (auth.uid() = user_id);

-- System settings policies
CREATE POLICY "Users can view public system settings" ON public.system_settings
    FOR SELECT USING (is_public = true);

CREATE POLICY "Admins can manage all system settings" ON public.system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- =============================================================================
-- FUNCTIONS FOR AUTOMATIC UPDATES
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buildings_updated_at BEFORE UPDATE ON public.buildings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspection_types_updated_at BEFORE UPDATE ON public.inspection_types 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inspections_updated_at BEFORE UPDATE ON public.inspections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON public.notification_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate inspection number
CREATE OR REPLACE FUNCTION generate_inspection_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.inspection_number = 'INS-' || to_char(NEW.created_at, 'YYYY') || '-' || 
                           LPAD(nextval('inspection_number_seq')::text, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create sequence and trigger for inspection numbers
CREATE SEQUENCE inspection_number_seq;
CREATE TRIGGER generate_inspection_number_trigger 
    BEFORE INSERT ON public.inspections 
    FOR EACH ROW EXECUTE FUNCTION generate_inspection_number();

-- Function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_log (user_id, action, table_name, record_id, new_values)
        VALUES (auth.uid(), 'create', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_values, new_values)
        VALUES (auth.uid(), 'update', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_values)
        VALUES (auth.uid(), 'delete', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create audit triggers for key tables
CREATE TRIGGER audit_users_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_inspections_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.inspections 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- View for inspection details with related data
CREATE VIEW inspection_details AS
SELECT 
    i.id,
    i.inspection_number,
    i.status,
    i.priority,
    i.scheduled_date,
    i.completed_at,
    i.notes_hebrew,
    i.passed,
    
    -- Inspection type details
    it.name_hebrew as type_name_hebrew,
    it.category as type_category,
    it.estimated_duration_minutes,
    
    -- Building details
    b.name_hebrew as building_name_hebrew,
    b.building_code,
    b.building_type,
    
    -- Inspector details
    u_inspector.full_name as inspector_name,
    u_inspector.phone as inspector_phone,
    
    -- Reviewer details
    u_reviewer.full_name as reviewer_name,
    
    -- Metrics
    i.actual_duration_minutes,
    i.compliance_score,
    
    i.created_at,
    i.updated_at
    
FROM public.inspections i
JOIN public.inspection_types it ON i.type_id = it.id
JOIN public.buildings b ON i.building_id = b.id
LEFT JOIN public.users u_inspector ON i.inspector_id = u_inspector.id
LEFT JOIN public.users u_reviewer ON i.reviewer_id = u_reviewer.id;

-- View for inspection statistics
CREATE VIEW inspection_statistics AS
SELECT 
    COUNT(*) as total_inspections,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_inspections,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_inspections,
    COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_inspections,
    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_inspections,
    COUNT(CASE WHEN passed = true THEN 1 END) as passed_inspections,
    COUNT(CASE WHEN scheduled_date::date = CURRENT_DATE THEN 1 END) as today_inspections,
    ROUND(AVG(actual_duration_minutes), 2) as avg_duration_minutes,
    ROUND(AVG(compliance_score), 2) as avg_compliance_score
FROM public.inspections;

-- =============================================================================
-- INITIAL SYSTEM SETTINGS
-- =============================================================================

INSERT INTO public.system_settings (key, value, description_hebrew, is_public) VALUES
('app_name', 'מערכת מעקב בדיקות הנדסיות', 'שם האפליקציה', true),
('company_name', 'קריית התקשוב', 'שם החברה', true),
('timezone', 'Asia/Jerusalem', 'אזור זמן של המערכת', true),
('locale', 'he-IL', 'שפת המערכת', true),
('date_format', 'DD/MM/YYYY', 'פורמט תאריך', true),
('max_file_size_mb', '10', 'גודל קובץ מקסימלי למעלה', false),
('inspection_reminder_days', '3', 'ימים לפני התראה על בדיקה', false),
('auto_assign_inspections', 'false', 'השמה אוטומטית של בדיקות', false);

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE public.users IS 'משתמשי המערכת - טכנאים, מנהלים ומנהלי מערכת';
COMMENT ON TABLE public.buildings IS 'מבני קריית התקשוב הטעונים בדיקה';
COMMENT ON TABLE public.inspection_types IS '523 סוגי הבדיקות השונות במתחם';
COMMENT ON TABLE public.inspections IS 'בדיקות בפועל שבוצעו או מתוזמנות';
COMMENT ON TABLE public.inspection_checklist_items IS 'פריטי בדיקה לכל סוג בדיקה';
COMMENT ON TABLE public.inspection_checklist_responses IS 'תגובות לפריטי בדיקה';
COMMENT ON TABLE public.inspection_photos IS 'תמונות שצורפו לבדיקות';
COMMENT ON TABLE public.reports IS 'דוחות שנוצרו במערכת';
COMMENT ON TABLE public.audit_log IS 'יומן פעילות למעקב ובקרה';
COMMENT ON TABLE public.notification_settings IS 'הגדרות התראות למשתמשים';
COMMENT ON TABLE public.system_settings IS 'הגדרות מערכת כלליות';

-- Index for full-text search in Hebrew
CREATE INDEX idx_inspections_notes_fts ON public.inspections 
    USING gin(to_tsvector('simple', coalesce(notes_hebrew, '')));

CREATE INDEX idx_inspections_findings_fts ON public.inspections 
    USING gin(to_tsvector('simple', coalesce(findings_hebrew, '')));

-- Schema creation completed successfully!
-- מבנה הנתונים נוצר בהצלחה!