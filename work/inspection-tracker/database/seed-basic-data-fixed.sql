-- מערכת מעקב בדיקות הנדסיות - נתוני בסיס (מתוקן)
-- Hebrew Construction Site Inspection Tracking System - Basic Seed Data (Fixed)
-- 
-- This file contains basic reference data with corrected enum values:
-- - Buildings (without manager_id)
-- - Inspection types
-- - Regulators  
-- - Red teams
-- - Basic system settings
-- 
-- Users and inspections will be added later after authentication setup

-- =============================================================================
-- SYSTEM SETTINGS - הגדרות מערכת
-- =============================================================================

INSERT INTO public.system_settings (key, value, description_hebrew, is_public) VALUES
('app_name', 'מערכת מעקב בדיקות הנדסיות - קריית התקשוב', 'שם האפליקציה', true),
('company_name', 'קריית התקשוב', 'שם החברה', true),
('version', '1.0.0', 'גרסת המערכת', true),
('default_inspection_duration', '60', 'משך בדיקה ברירת מחדל בדקות', false),
('max_photos_per_inspection', '10', 'מקסימום תמונות לבדיקה', true),
('require_signature_for_completion', 'true', 'האם נדרש חתימה להשלמת בדיקה', false),
('default_timezone', 'Asia/Jerusalem', 'אזור זמן ברירת מחדל', true),
('date_format', 'DD/MM/YYYY', 'פורמט תאריך', true),
('language', 'he', 'שפת המערכת', true),
('rtl_support', 'true', 'תמיכה בכיוון ימין לשמאל', true)
ON CONFLICT (key) DO NOTHING;

-- =============================================================================
-- INSPECTION ROUNDS - סבבי בדיקות
-- =============================================================================

INSERT INTO public.inspection_rounds (round_number, name_hebrew, description_hebrew) VALUES
(1, 'סבב ראשון', 'סבב בדיקות ראשון - בדיקה ראשונית של המבנה'),
(2, 'סבב שני', 'סבב בדיקות שני - בדיקת המשך ובדיקת תיקונים'),
(3, 'סבב שלישי', 'סבב בדיקות שלישי - בדיקה סופית ואישור מוכנות'),
(4, 'סבב רביעי', 'סבב בדיקות רביעי - בדיקות נוספות לפי הצורך')
ON CONFLICT (round_number) DO NOTHING;

-- =============================================================================
-- REGULATORS - רגולטורים (12 organizations from Excel)
-- =============================================================================

INSERT INTO public.regulators (name_hebrew, name_english, description_hebrew) VALUES
('חושן', 'Khoshen', 'חטיבת תקשוב וסייבר'),
('אהו"ב', 'AHUB', 'אגף התקשוב'),
('רבנות', 'Rabbinate', 'רבנות צבאית'),
('מקרפ"ר', 'MKRPR', 'מרכז קליטה ופילוח רכש'),
('כוורת', 'Kaveret', 'יחידת כוורת'),
('מזון', 'Food Services', 'שירותי מזון'),
('הגנת מחנות', 'Base Protection', 'הגנת מחנות וביטחון'),
('מהנדס חשמל ראשי', 'Chief Electrical Engineer', 'מהנדס חשמל ראשי'),
('ברה"צ', 'BRHTS', 'בריאות הציבור'),
('בטחון מידע', 'Information Security', 'בטחון מידע'),
('מצו"ב', 'MTSUB', 'מרכז צוותי בנייה'),
('כש"ג', 'KSHG', 'כשרות וגהרת')
ON CONFLICT (name_hebrew) DO NOTHING;

-- =============================================================================
-- RED TEAMS - צוותים אדומים (5 teams from Excel)
-- =============================================================================

INSERT INTO public.red_teams (name_hebrew, description_hebrew) VALUES
('דנה אבני + ציון לחיאני', 'צוות אדום ראשי - דנה אבני וציון לחיאני'),
('שירן פיטוסי', 'צוות אדום - שירן פיטוסי'),
('עידן אוחיון', 'צוות אדום - עידן אוחיון'),
('שירן + אורי', 'צוות אדום משולב - שירן ואורי'),
('לירון קוטלר', 'צוות אדום - לירון קוטלר')
ON CONFLICT (name_hebrew) DO NOTHING;

-- =============================================================================
-- BUILDINGS - מבנים (25 buildings from Excel, with corrected building types)
-- =============================================================================

INSERT INTO public.buildings (building_code, name_hebrew, name_english, building_type, address_hebrew, floor_count, description_hebrew, is_active) VALUES
-- Data center buildings
('10A', 'מבנה 10A', 'Building 10A', 'datacenter', 'קריית התקשוב, אזור תעשיה', 4, 'מבנה מרכז נתונים 10A', true),
('10B', 'מבנה 10B', 'Building 10B', 'datacenter', 'קריית התקשוב, אזור תעשיה', 4, 'מבנה מרכז נתונים 10B', true),
('10C', 'מבנה 10C', 'Building 10C', 'datacenter', 'קריית התקשוב, אזור תעשיה', 4, 'מבנה מרכז נתונים 10C', true),
('10D', 'מבנה 10D', 'Building 10D', 'datacenter', 'קריית התקשוב, אזור תעשיה', 4, 'מבנה מרכז נתונים 10D', true),

-- Office and utilities buildings (changed from 'technical' to 'utilities')
('20', 'מבנה 20', 'Building 20', 'utilities', 'קריית התקשוב, אזור תעשיה', 3, 'מבנה שירותים טכניים 20', true),
('30', 'מבנה 30', 'Building 30', 'office', 'קריית התקשוב, אזור תעשיה', 3, 'מבנה משרדים 30', true),
('40', 'מבנה 40', 'Building 40', 'utilities', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה שירותים טכניים 40', true),
('50', 'מבנה 50', 'Building 50', 'utilities', 'קריית התקשוב, אזור תעשיה', 3, 'מבנה שירותים טכניים 50', true),
('60', 'מבנה 60', 'Building 60', 'utilities', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה שירותים טכניים 60', true),
('70', 'מבנה 70', 'Building 70', 'utilities', 'קריית התקשוב, אזור תעשיה', 3, 'מבנה שירותים טכניים 70', true),
('80', 'מבנה 80', 'Building 80', 'utilities', 'קריית התקשוב, אזור תעשיה', 3, 'מבנה שירותים טכניים 80', true),
('90', 'מבנה 90', 'Building 90', 'utilities', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה שירותים טכניים 90', true),

-- Office and administrative buildings
('100', 'מבנה 100', 'Building 100', 'office', 'קריית התקשוב, אזור תעשיה', 5, 'מבנה משרדים 100', true),
('110', 'מבנה 110', 'Building 110', 'utilities', 'קריית התקשוב, אזור תעשיה', 3, 'מבנה שירותים טכניים 110', true),
('120', 'מבנה 120', 'Building 120', 'utilities', 'קריית התקשוב, אזור תעשיה', 3, 'מבנה שירותים טכניים 120', true),
('130', 'מבנה 130', 'Building 130', 'utilities', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה שירותים טכניים 130', true),
('140', 'מבנה 140', 'Building 140', 'utilities', 'קריית התקשוב, אזור תעשיה', 3, 'מבנה שירותים טכניים 140', true),

-- Laboratory and specialized buildings
('161', 'מבנה 161', 'Building 161', 'laboratory', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה מעבדה מיוחד 161', true),
('162', 'מבנה 162', 'Building 162', 'laboratory', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה מעבדה מיוחד 162', true),
('163', 'מבנה 163', 'Building 163', 'laboratory', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה מעבדה מיוחד 163', true),
('164', 'מבנה 164', 'Building 164', 'laboratory', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה מעבדה מיוחד 164', true),
('171', 'מבנה 171', 'Building 171', 'laboratory', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה מעבדה מיוחד 171', true),
('172', 'מבנה 172', 'Building 172', 'laboratory', 'קריית התקשוב, אזור תעשיה', 2, 'מבנה מעבדה מיוחד 172', true),

-- Main data centers
('200', 'מבנה 200', 'Building 200', 'datacenter', 'קריית התקשוב, אזור תעשיה', 3, 'מרכז נתונים ראשי 200', true),
('200B', 'מבנה 200B', 'Building 200B', 'datacenter', 'קריית התקשוב, אזור תעשיה', 3, 'מרכז נתונים משני 200B', true),

-- Core systems
('ליבת מערכות', 'ליבת מערכות', 'Systems Core', 'datacenter', 'קריית התקשוב, אזור תעשיה', 1, 'ליבת המערכות המרכזית', true)

ON CONFLICT (building_code) DO NOTHING;

-- =============================================================================
-- INSPECTION TYPES - סוגי בדיקות (56 types from Excel analysis)
-- =============================================================================

INSERT INTO public.inspection_types (name_hebrew, name_english, code, description_hebrew, category, estimated_duration_minutes, requires_photo, priority, is_active) VALUES

-- Engineering inspections
('הנדסית', 'Engineering Inspection', 'ENG001', 'בדיקה הנדסית כללית', 'engineering', 90, true, 'high', true),
('הנדסית טהורה', 'Pure Engineering', 'ENG002', 'בדיקה הנדסית טהורה', 'engineering', 120, true, 'high', true),
('הנדסית טהורה- קרינה', 'Pure Engineering - Radiation', 'ENG003', 'בדיקה הנדסית טהורה לקרינה', 'engineering', 90, true, 'high', true),
('הנדסית טהורה- איטום הצפה וניקוזים', 'Pure Engineering - Waterproofing', 'ENG004', 'בדיקת איטום הצפה וניקוזים', 'engineering', 75, true, 'medium', true),
('הנדסית טהורה- אקוסטיקה', 'Pure Engineering - Acoustics', 'ENG005', 'בדיקה אקוסטית', 'engineering', 60, false, 'medium', true),
('הנדסית טהורה-פינוי עשן', 'Pure Engineering - Smoke Evacuation', 'ENG006', 'בדיקת מערכת פינוי עשן', 'engineering', 90, true, 'high', true),

-- Characterization inspections
('אפיונית', 'Characterization Inspection', 'CHAR001', 'בדיקה אפיונית כללית', 'characterization', 60, true, 'medium', true),

-- Operational inspections
('בדיקה תפעולית למבנה', 'Operational Building Inspection', 'OPR001', 'בדיקה תפעולית כללית למבנה', 'operational', 120, true, 'high', true),
('הרצה תפעולית', 'Operational Start-up', 'OPR002', 'הרצה תפעולית של מערכות', 'operational', 180, true, 'high', true),
('הרצת תפ"מים ורציפות תפקוד', 'UPS and Continuity Test', 'OPR003', 'הרצת מערכות תפ"מ ורציפות תפקוד', 'operational', 150, true, 'high', true),

-- Supporting construction
('בינוי תומך תפעול', 'Supporting Construction Operations', 'SUP001', 'בדיקת בינוי תומך תפעול', 'supporting', 90, true, 'medium', true),
('בדיקת בינוי תומך תקשוב במכלולי תקשוב', 'Communication Supporting Construction', 'SUP002', 'בדיקת בינוי תומך תקשוב', 'supporting', 120, true, 'medium', true),

-- Network inspections
('רשת אקטיבית שמורה', 'Reserved Active Network', 'NET001', 'בדיקת רשת אקטיבית שמורה', 'network', 90, true, 'high', true),
('רשת אקטיבית סודית', 'Secret Active Network', 'NET002', 'בדיקת רשת אקטיבית סודית', 'network', 120, true, 'high', true),
('רשת אקטיבית סודי ביותר', 'Top Secret Active Network', 'NET003', 'בדיקת רשת אקטיבית סודי ביותר', 'network', 150, true, 'urgent', true),
('רשת מבצעי כולל שו"ב', 'Operational Network with Control Room', 'NET004', 'רשת מבצעי כולל שו"ב', 'network', 90, true, 'high', true),
('רשת אינטרנט - ליבה', 'Internet Network - Core', 'NET005', 'רשת אינטרנט ליבה', 'network', 60, true, 'medium', true),
('רשת אינטרנט - שו"ב', 'Internet Network - Control Room', 'NET006', 'רשת אינטרנט שו"ב', 'network', 60, true, 'medium', true),
('רשת בקרת מבנה - ליבה', 'Building Control Network - Core', 'NET007', 'רשת בקרת מבנה ליבה', 'network', 75, true, 'high', true),
('רשת בקרת מבנה - שו"ב', 'Building Control Network - Control Room', 'NET008', 'רשת בקרת מבנה שו"ב', 'network', 75, true, 'high', true),
('רשת מולטימדיה - ליבה', 'Multimedia Network - Core', 'NET009', 'רשת מולטימדיה ליבה', 'network', 60, true, 'medium', true),
('רשת מולטימדיה - שו"ב', 'Multimedia Network - Control Room', 'NET010', 'רשת מולטימדיה שו"ב', 'network', 60, true, 'medium', true),
('רשת שמורה - ליבה', 'Reserved Network - Core', 'NET011', 'רשת שמורה ליבה', 'network', 90, true, 'high', true),
('רשת שמורה - שו"ב', 'Reserved Network - Control Room', 'NET012', 'רשת שמורה שו"ב', 'network', 90, true, 'high', true),

-- Infrastructure inspections
('תשתית פאסיבית פנים מבנה', 'Indoor Passive Infrastructure', 'INF001', 'בדיקת תשתית פאסיבית בתוך המבנה', 'infrastructure', 120, true, 'high', true),
('תשתית פאסיבית בין מבנים', 'Inter-Building Passive Infrastructure', 'INF002', 'בדיקת תשתית פאסיבית בין מבנים', 'infrastructure', 150, true, 'high', true),
('תשתיות IT - ליבה - אינטרנט', 'IT Infrastructure - Core - Internet', 'INF003', 'תשתיות IT ליבה אינטרנט', 'infrastructure', 90, true, 'high', true),
('תשתיות IT - ליבה - בקרת מבנה', 'IT Infrastructure - Core - Building Control', 'INF004', 'תשתיות IT ליבה בקרת מבנה', 'infrastructure', 90, true, 'high', true),
('תשתיות IT - ליבה - מולטימדיה', 'IT Infrastructure - Core - Multimedia', 'INF005', 'תשתיות IT ליבה מולטימדיה', 'infrastructure', 75, true, 'medium', true),
('תשתיות IT - ליבה -שמורה', 'IT Infrastructure - Core - Reserved', 'INF006', 'תשתיות IT ליבה שמורה', 'infrastructure', 90, true, 'high', true),
('תשתיות שד"ב', 'Command and Control Infrastructure', 'INF007', 'תשתיות שד"ב', 'infrastructure', 120, true, 'high', true),
('בדיקת תשתיות בין מבנים למקטע', 'Inter-Building Infrastructure by Section', 'INF008', 'בדיקת תשתיות בין מבנים למקטע', 'infrastructure', 180, true, 'high', true),
('בדיקת תשתיות בין מבנים למקטע מבנים 40,70,80', 'Inter-Building Infrastructure Buildings 40,70,80', 'INF009', 'בדיקת תשתיות מבנים 40,70,80', 'infrastructure', 200, true, 'high', true),

-- Security system inspections
('בדיקות מערכות אבטחה', 'Security Systems Inspection', 'SEC001', 'בדיקת מערכות אבטחה כלליות', 'security', 90, true, 'high', true),
('מערכת אבטחה היקפית ליבה', 'Core Perimeter Security System', 'SEC002', 'מערכת אבטחה היקפית ליבה', 'security', 120, true, 'high', true),
('מערכת אזעקה ליבה', 'Core Alarm System', 'SEC003', 'מערכת אזעקה ליבה', 'security', 60, true, 'high', true),
('מערכת בקרת כניסה ליבה', 'Core Access Control System', 'SEC004', 'מערכת בקרת כניסה ליבה', 'security', 75, true, 'high', true),
('מערכת שו"ב אבטחה ליבה', 'Core Security Control Room System', 'SEC005', 'מערכת שו"ב אבטחה ליבה', 'security', 90, true, 'high', true),

-- Multimedia systems
('בדיקות מערכות מולטימדיה', 'Multimedia Systems Inspection', 'MUL001', 'בדיקת מערכות מולטימדיה', 'multimedia', 75, true, 'medium', true),
('מולטימדיה זכיין ליבה כולל מערכת שו"ב מולטימדיה', 'Core Contractor Multimedia with Control Room', 'MUL002', 'מולטימדיה זכיין ליבה כולל שו"ב', 'multimedia', 120, true, 'medium', true),

-- End stations
('בדיקות עמדות קצה', 'End Station Inspections', 'END001', 'בדיקת עמדות קצה', 'end_stations', 45, true, 'medium', true),

-- Telephony
('מערכת טלפוניה ליבה', 'Core Telephony System', 'TEL001', 'מערכת טלפוניה ליבה', 'telephony', 60, true, 'medium', true),

-- Announcement systems
('מערכת כריזה ליבה', 'Core Announcement System', 'ANN001', 'מערכת כריזה ליבה', 'announcement', 45, true, 'medium', true),

-- Management systems
('מערכת ניהול עיר ליבה', 'Core City Management System', 'CMS001', 'מערכת ניהול עיר ליבה', 'management', 90, true, 'medium', true),
('מערכת ניהול תשתיות ליבה', 'Core Infrastructure Management System', 'IMS001', 'מערכת ניהול תשתיות ליבה', 'management', 90, true, 'high', true),
('מערכת נוב מרכזית', 'Central NOC System', 'NOC001', 'מערכת נוב מרכזית', 'management', 120, true, 'high', true),

-- Special inspections
('בדיקת EMP', 'EMP Testing', 'EMP001', 'בדיקת EMP', 'special', 180, true, 'urgent', true),
('בדיקת ארונות חוץ', 'External Cabinet Inspection', 'CAB001', 'בדיקת ארונות חוץ', 'special', 90, true, 'medium', true),
('מערכת טמ"ס ליבה', 'Core SCADA System', 'SCADA001', 'מערכת טמ"ס ליבה', 'special', 120, true, 'high', true),
('מערכת שילוט אלקטרוני ליבה', 'Core Electronic Signage System', 'SIGN001', 'מערכת שילוט אלקטרוני ליבה', 'special', 60, true, 'low', true),

-- Cyber defense
('הגנה בסייבר - ליבה - אינטרנט', 'Cyber Defense - Core - Internet', 'CYB001', 'הגנה בסייבר ליבה אינטרנט', 'cyber', 120, false, 'high', true),
('הגנה בסייבר - ליבה - בקרת מבנה', 'Cyber Defense - Core - Building Control', 'CYB002', 'הגנה בסייבר ליבה בקרת מבנה', 'cyber', 120, false, 'high', true),
('הגנה בסייבר - ליבה - מולטימדיה', 'Cyber Defense - Core - Multimedia', 'CYB003', 'הגנה בסייבר ליבה מולטימדיה', 'cyber', 90, false, 'medium', true),
('הגנה בסייבר - ליבה - שמורה', 'Cyber Defense - Core - Reserved', 'CYB004', 'הגנה בסייבר ליבה שמורה', 'cyber', 120, false, 'high', true),

-- Inventory and surveys
('ספירת אמצעי תקשוב', 'Communication Equipment Count', 'COUNT001', 'ספירת אמצעי תקשוב', 'inventory', 180, true, 'low', true),
('ספירת ריהוט', 'Furniture Count', 'COUNT002', 'ספירת ריהוט', 'inventory', 120, true, 'low', true),

-- Training
('שבוע תרגול והטמעה', 'Training and Implementation Week', 'TRAIN001', 'שבוע תרגול והטמעה', 'training', 2400, false, 'medium', true)

ON CONFLICT (code) DO NOTHING;

-- =============================================================================
-- DROPDOWN OPTIONS - אפשרויות רשימות נפתחות
-- =============================================================================

-- Coordinated options
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('coordinated', 'כן', 'Yes', 1),
('coordinated', 'לא', 'No', 2),
('coordinated', 'חלקית', 'Partial', 3)
ON CONFLICT (category, value_hebrew) DO NOTHING;

-- Report attachment options
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('report_attached', 'כן', 'Yes', 1),
('report_attached', 'לא', 'No', 2),
('report_attached', 'בהכנה', 'In Preparation', 3)
ON CONFLICT (category, value_hebrew) DO NOTHING;

-- Report distribution options
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('report_distributed', 'כן', 'Yes', 1),
('report_distributed', 'לא', 'No', 2),
('report_distributed', 'בתהליך', 'In Process', 3)
ON CONFLICT (category, value_hebrew) DO NOTHING;

-- Re-inspection options
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('reinspection', 'כן', 'Yes', 1),
('reinspection', 'לא', 'No', 2),
('reinspection', 'נדרש', 'Required', 3)
ON CONFLICT (category, value_hebrew) DO NOTHING;

-- =============================================================================
-- SUCCESS MESSAGE
-- =============================================================================

-- Output success message
SELECT 'נתוני הבסיס נוצרו בהצלחה! Basic data created successfully!' as status,
       'כולל: ' || 
       (SELECT COUNT(*) FROM buildings) || ' מבנים, ' ||
       (SELECT COUNT(*) FROM inspection_types) || ' סוגי בדיקות, ' ||
       (SELECT COUNT(*) FROM regulators) || ' רגולטורים, ' ||
       (SELECT COUNT(*) FROM red_teams) || ' צוותים אדומים' as summary;