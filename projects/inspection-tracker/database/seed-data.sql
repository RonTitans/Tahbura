-- Seed Data for Hebrew Inspection Tracking System
-- נתוני בסיס למערכת מעקב בדיקות עברית

-- Insert system settings
INSERT INTO system_settings (key, value, description_hebrew) VALUES
('app_name', 'מערכת מעקב בדיקות הנדסיות', 'שם האפליקציה'),
('company_name', 'קריית התקשוב', 'שם החברה'),
('version', '1.0.0', 'גרסת המערכת'),
('default_inspection_duration', '60', 'משך בדיקה ברירת מחדל בדקות'),
('max_photos_per_inspection', '10', 'מקסימום תמונות לבדיקה'),
('require_signature_for_completion', 'true', 'האם נדרש חתימה להשלמת בדיקה'),
('default_timezone', 'Asia/Jerusalem', 'אזור זמן ברירת מחדל'),
('date_format', 'DD/MM/YYYY', 'פורמט תאריך'),
('language', 'he', 'שפת המערכת'),
('rtl_support', 'true', 'תמיכה בכיוון ימין לשמאל')
ON CONFLICT (key) DO NOTHING;

-- Insert sample buildings for testing (based on Hebrew data center naming)
INSERT INTO buildings (building_code, name_hebrew, name_english, building_type, address_hebrew, floor_count, description_hebrew, is_active) VALUES
('מבנה 10A', 'Building 10A', '10A', 'office', 'קריית התקשוב', 4, 'מבנה משרדים ותקשורת'),
('מבנה 10B', 'Building 10B', '10B', 'office', 'קריית התקשוב', 4, 'מבנה משרדים ותקשורת'),
('מבנה 10C', 'Building 10C', '10C', 'office', 'קריית התקשוב', 4, 'מבנה משרדים ותקשורת'),
('מבנה 10D', 'Building 10D', '10D', 'office', 'קריית התקשוב', 4, 'מבנה משרדים ותקשורת'),
('מבנה 20', 'Building 20', '20', 'technical', 'קריית התקשוב', 3, 'מבנה טכני'),
('מבנה 30', 'Building 30', '30', 'technical', 'קריית התקשוב', 3, 'מבנה טכני'),
('מבנה 40', 'Building 40', '40', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 50', 'Building 50', '50', 'technical', 'קריית התקשוב', 3, 'מבנה טכני'),
('מבנה 60', 'Building 60', '60', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 70', 'Building 70', '70', 'technical', 'קריית התקשוב', 3, 'מבנה טכני'),
('מבנה 80', 'Building 80', '80', 'technical', 'קריית התקשוב', 3, 'מבנה טכני'),
('מבנה 90', 'Building 90', '90', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 100', 'Building 100', '100', 'office', 'קריית התקשוב', 5, 'מבנה משרדים'),
('מבנה 110', 'Building 110', '110', 'technical', 'קריית התקשוב', 3, 'מבנה טכני'),
('מבנה 120', 'Building 120', '120', 'technical', 'קריית התקשוב', 3, 'מבנה טכני'),
('מבנה 130', 'Building 130', '130', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 140', 'Building 140', '140', 'technical', 'קריית התקשוב', 3, 'מבנה טכני'),
('מבנה 161', 'Building 161', '161', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 162', 'Building 162', '162', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 163', 'Building 163', '163', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 164', 'Building 164', '164', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 171', 'Building 171', '171', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 172', 'Building 172', '172', 'technical', 'קריית התקשוב', 2, 'מבנה טכני'),
('מבנה 200', 'Building 200', '200', 'datacenter', 'קריית התקשוב', 3, 'מרכז נתונים'),
('מבנה 200B', 'Building 200B', '200B', 'datacenter', 'קריית התקשוב', 3, 'מרכז נתונים'),
('כלל המבנים', 'All Buildings', 'ALL', 'general', 'קריית התקשוב', 0, 'כלל המבנים באתר'),
('ליבת מערכות', 'Systems Core', 'CORE', 'datacenter', 'קריית התקשוב', 1, 'ליבת המערכות המרכזית');

-- =============================================================================
-- BUILDING MANAGERS - מנהלי מבנים (from Excel data)
-- =============================================================================

INSERT INTO public.building_managers (name_hebrew, name_english, email, phone, buildings_managed) VALUES
('יוסי שמש', 'Yossi Shemesh', 'yossi@example.com', '050-1234567', ARRAY['10A', '40']),
('ערן ברגיל', 'Eran Bargil', 'eran@example.com', '050-2345678', ARRAY['10B']),
('יקיר נבון', 'Yakir Navon', 'yakir@example.com', '050-3456789', ARRAY['10C']),
('זיו חג''בי', 'Ziv Hagbi', 'ziv@example.com', '050-4567890', ARRAY['10D']),
('איציק דאבוש', 'Itzik Daboush', 'itzik@example.com', '050-5678901', ARRAY['20']),
('מיכאל קפלון', 'Michael Kaplon', 'michael@example.com', '050-6789012', ARRAY['30']),
('חנוך חוטר', 'Hanoch Hoter', 'hanoch@example.com', '050-7890123', ARRAY['40']),
('אורנית ג''יספאן', 'Ornit Jisspan', 'ornit@example.com', '050-8901234', ARRAY['50']),
('זיו מטודי', 'Ziv Metodi', 'ziv.m@example.com', '050-9012345', ARRAY['60']),
('דוד שוחט', 'David Shohat', 'david@example.com', '050-0123456', ARRAY['100']),
('ערן ברגיל + רונן פרץ', 'Eran Bargil + Ronen Peretz', 'eran.ronen@example.com', '050-1357924', ARRAY['200']);

-- =============================================================================
-- TEAMS - צוותים (from Excel data)
-- =============================================================================

INSERT INTO public.teams (name_hebrew, name_english, description_hebrew, team_leader) VALUES
('דנה אבני + ציון לחיאני', 'Dana Avni + Zion Lahiani', 'צוות בדיקות משולב', 'דנה אבני'),
('שירן פיטוסי', 'Shiran Pitusi', 'צוות בדיקות טכניות', 'שירן פיטוסי'),
('עידן אוחיון', 'Idan Ohion', 'צוות תשתיות', 'עידן אוחיון'),
('שירן + אורי', 'Shiran + Uri', 'צוות בדיקות מיוחדות', 'שירן'),
('לירון קוטלר', 'Liron Kotler', 'צוות בדיקות מתקדמות', 'לירון קוטלר');

-- =============================================================================
-- INSPECTION TYPES - סוגי בדיקות (from Excel data)
-- =============================================================================

INSERT INTO public.inspection_types (name_hebrew, name_english, code, category, subcategory, description_hebrew, estimated_duration_minutes, requires_photo, priority) VALUES
-- בדיקות הנדסיות
('הנדסית', 'Engineering Inspection', 'ENG001', 'engineering', 'general', 'בדיקה הנדסית כללית', 90, true, 'high'),
('הנדסית טהורה', 'Pure Engineering', 'ENG002', 'engineering', 'pure', 'בדיקה הנדסית טהורה', 120, true, 'high'),
('הנדסית טהורה- קרינה', 'Pure Engineering - Radiation', 'ENG003', 'engineering', 'radiation', 'בדיקה הנדסית טהורה לקרינה', 90, true, 'high'),
('הנדסית טהורה- איטום הצפה וניקוזים', 'Pure Engineering - Waterproofing and Drainage', 'ENG004', 'engineering', 'waterproofing', 'בדיקת איטום הצפה וניקוזים', 75, true, 'medium'),
('הנדסית טהורה- אקוסטיקה', 'Pure Engineering - Acoustics', 'ENG005', 'engineering', 'acoustics', 'בדיקה אקוסטית', 60, false, 'medium'),
('הנדסית טהורה-פינוי עשן', 'Pure Engineering - Smoke Evacuation', 'ENG006', 'engineering', 'smoke_evacuation', 'בדיקת מערכת פינוי עשן', 90, true, 'high'),

-- בדיקות אפיוניות
('אפיונית', 'Characterization Inspection', 'CHAR001', 'characterization', 'general', 'בדיקה אפיונית כללית', 60, true, 'medium'),

-- בדיקות תפעוליות
('בדיקה תפעולית למבנה', 'Operational Building Inspection', 'OPR001', 'operational', 'building', 'בדיקה תפעולית כללית למבנה', 120, true, 'high'),
('הרצה תפעולית', 'Operational Start-up', 'OPR002', 'operational', 'startup', 'הרצה תפעולית של מערכות', 180, true, 'high'),
('הרצת תפ"מים ורציפות תפקוד', 'UPS and Continuity Test', 'OPR003', 'operational', 'ups_continuity', 'הרצת מערכות תפ"מ ורציפות תפקוד', 150, true, 'high'),

-- בדיקות בינוי תומך
('בינוי תומך תפעול', 'Supporting Construction Operations', 'SUP001', 'supporting', 'operations', 'בדיקת בינוי תומך תפעול', 90, true, 'medium'),
('בדיקת בינוי תומך תקשוב במכלולי תקשוב', 'Communication Supporting Construction', 'SUP002', 'supporting', 'communication', 'בדיקת בינוי תומך תקשוב', 120, true, 'medium'),

-- בדיקות רשתות
('רשת אקטיבית שמורה', 'Reserved Active Network', 'NET001', 'network', 'reserved', 'בדיקת רשת אקטיבית שמורה', 90, true, 'high'),
('רשת אקטיבית סודית', 'Secret Active Network', 'NET002', 'network', 'secret', 'בדיקת רשת אקטיבית סודית', 120, true, 'high'),
('רשת אקטיבית סודי ביותר', 'Top Secret Active Network', 'NET003', 'network', 'top_secret', 'בדיקת רשת אקטיבית סודי ביותר', 150, true, 'urgent'),
('רשת מבצעי כולל שו"ב', 'Operational Network including Control Room', 'NET004', 'network', 'operational', 'רשת מבצעי כולל שו"ב', 90, true, 'high'),
('רשת אינטרנט - ליבה', 'Internet Network - Core', 'NET005', 'network', 'internet_core', 'רשת אינטרנט ליבה', 60, true, 'medium'),
('רשת אינטרנט - שו"ב', 'Internet Network - Control Room', 'NET006', 'network', 'internet_control', 'רשת אינטרנט שו"ב', 60, true, 'medium'),
('רשת בקרת מבנה - ליבה', 'Building Control Network - Core', 'NET007', 'network', 'building_control_core', 'רשת בקרת מבנה ליבה', 75, true, 'high'),
('רשת בקרת מבנה - שו"ב', 'Building Control Network - Control Room', 'NET008', 'network', 'building_control', 'רשת בקרת מבנה שו"ב', 75, true, 'high'),
('רשת מולטימדיה - ליבה', 'Multimedia Network - Core', 'NET009', 'network', 'multimedia_core', 'רשת מולטימדיה ליבה', 60, true, 'medium'),
('רשת מולטימדיה - שו"ב', 'Multimedia Network - Control Room', 'NET010', 'network', 'multimedia_control', 'רשת מולטימדיה שו"ב', 60, true, 'medium'),
('רשת שמורה - ליבה', 'Reserved Network - Core', 'NET011', 'network', 'reserved_core', 'רשת שמורה ליבה', 90, true, 'high'),
('רשת שמורה - שו"ב', 'Reserved Network - Control Room', 'NET012', 'network', 'reserved_control', 'רשת שמורה שו"ב', 90, true, 'high'),

-- בדיקות תשתיות
('תשתית פאסיבית פנים מבנה', 'Indoor Passive Infrastructure', 'INF001', 'infrastructure', 'indoor_passive', 'בדיקת תשתית פאסיבית בתוך המבנה', 120, true, 'high'),
('תשתית פאסיבית בין מבנים', 'Inter-Building Passive Infrastructure', 'INF002', 'infrastructure', 'inter_building', 'בדיקת תשתית פאסיבית בין מבנים', 150, true, 'high'),
('תשתיות IT - ליבה - אינטרנט', 'IT Infrastructure - Core - Internet', 'INF003', 'infrastructure', 'it_core_internet', 'תשתיות IT ליבה אינטרנט', 90, true, 'high'),
('תשתיות IT - ליבה - בקרת מבנה', 'IT Infrastructure - Core - Building Control', 'INF004', 'infrastructure', 'it_core_building', 'תשתיות IT ליבה בקרת מבנה', 90, true, 'high'),
('תשתיות IT - ליבה - מולטימדיה', 'IT Infrastructure - Core - Multimedia', 'INF005', 'infrastructure', 'it_core_multimedia', 'תשתיות IT ליבה מולטימדיה', 75, true, 'medium'),
('תשתיות IT - ליבה -שמורה', 'IT Infrastructure - Core - Reserved', 'INF006', 'infrastructure', 'it_core_reserved', 'תשתיות IT ליבה שמורה', 90, true, 'high'),
('תשתיות שד"ב', 'Command and Control Infrastructure', 'INF007', 'infrastructure', 'command_control', 'תשתיות שד"ב', 120, true, 'high'),
('בדיקת תשתיות בין מבנים למקטע', 'Inter-Building Infrastructure Inspection by Section', 'INF008', 'infrastructure', 'inter_building_section', 'בדיקת תשתיות בין מבנים למקטע', 180, true, 'high'),
('בדיקת תשתיות בין מבנים למקטע מבנים 40,70,80', 'Inter-Building Infrastructure Buildings 40,70,80', 'INF009', 'infrastructure', 'buildings_40_70_80', 'בדיקת תשתיות מבנים 40,70,80', 200, true, 'high'),

-- בדיקות מערכות אבטחה
('בדיקות מערכות אבטחה', 'Security Systems Inspection', 'SEC001', 'security', 'general', 'בדיקת מערכות אבטחה כלליות', 90, true, 'high'),
('מערכת אבטחה היקפית ליבה', 'Core Perimeter Security System', 'SEC002', 'security', 'perimeter_core', 'מערכת אבטחה היקפית ליבה', 120, true, 'high'),
('מערכת אבטחה היקפית \nליבה', 'Core Perimeter Security System Alt', 'SEC003', 'security', 'perimeter_core_alt', 'מערכת אבטחה היקפית ליבה', 120, true, 'high'),
('מערכת אזעקה ליבה', 'Core Alarm System', 'SEC004', 'security', 'alarm_core', 'מערכת אזעקה ליבה', 60, true, 'high'),
('מערכת בקרת כניסה ליבה', 'Core Access Control System', 'SEC005', 'security', 'access_control_core', 'מערכת בקרת כניסה ליבה', 75, true, 'high'),
('מערכת שו"ב אבטחה ליבה', 'Core Security Control Room System', 'SEC006', 'security', 'security_control_room', 'מערכת שו"ב אבטחה ליבה', 90, true, 'high'),

-- בדיקות מולטימדיה
('בדיקות מערכות מולטימדיה', 'Multimedia Systems Inspection', 'MUL001', 'multimedia', 'general', 'בדיקת מערכות מולטימדיה', 75, true, 'medium'),
('מולטימדיה זכיין ליבה\nכולל מערכת שו"ב מולטימדיה', 'Core Contractor Multimedia with Control Room', 'MUL002', 'multimedia', 'contractor_core', 'מולטימדיה זכיין ליבה כולל שו"ב', 120, true, 'medium'),

-- בדיקות עמדות קצה
('בדיקות עמדות קצה', 'End Station Inspections', 'END001', 'end_stations', 'general', 'בדיקת עמדות קצה', 45, true, 'medium'),

-- בדיקות טלפוניה
('מערכת טלפוניה ליבה', 'Core Telephony System', 'TEL001', 'telephony', 'core', 'מערכת טלפוניה ליבה', 60, true, 'medium'),

-- בדיקות כריזה
('מערכת כריזה ליבה', 'Core Announcement System', 'ANN001', 'announcement', 'core', 'מערכת כריזה ליבה', 45, true, 'medium'),

-- בדיקות מערכות ניהול
('מערכת ניהול עיר ליבה', 'Core City Management System', 'CMS001', 'management', 'city_core', 'מערכת ניהול עיר ליבה', 90, true, 'medium'),
('מערכת ניהול תשתיות ליבה', 'Core Infrastructure Management System', 'IMS001', 'management', 'infrastructure_core', 'מערכת ניהול תשתיות ליבה', 90, true, 'high'),
('מערכת נוב מרכזית', 'Central NOC System', 'NOC001', 'management', 'noc', 'מערכת נוב מרכזית', 120, true, 'high'),

-- בדיקות מיוחדות
('בדיקת EMP', 'EMP Testing', 'EMP001', 'special', 'emp', 'בדיקת EMP', 180, true, 'urgent'),
('בדיקת ארונות חוץ', 'External Cabinet Inspection', 'CAB001', 'special', 'external_cabinets', 'בדיקת ארונות חוץ', 90, true, 'medium'),
('מערכת טמ"ס ליבה', 'Core SCADA System', 'SCADA001', 'special', 'scada_core', 'מערכת טמ"ס ליבה', 120, true, 'high'),
('מערכת שילוט אלקטרוני ליבה', 'Core Electronic Signage System', 'SIGN001', 'special', 'signage_core', 'מערכת שילוט אלקטרוני ליבה', 60, true, 'low'),

-- בדיקות הגנה סייבר
('הגנה בסייבר - ליבה - אינטרנט', 'Cyber Defense - Core - Internet', 'CYB001', 'cyber', 'core_internet', 'הגנה בסייבר ליבה אינטרנט', 120, false, 'high'),
('הגנה בסייבר - ליבה - בקרת מבנה', 'Cyber Defense - Core - Building Control', 'CYB002', 'cyber', 'core_building', 'הגנה בסייבר ליבה בקרת מבנה', 120, false, 'high'),
('הגנה בסייבר - ליבה - מולטימדיה', 'Cyber Defense - Core - Multimedia', 'CYB003', 'cyber', 'core_multimedia', 'הגנה בסייבר ליבה מולטימדיה', 90, false, 'medium'),
('הגנה בסייבר - ליבה - שמורה', 'Cyber Defense - Core - Reserved', 'CYB004', 'cyber', 'core_reserved', 'הגנה בסייבר ליבה שמורה', 120, false, 'high'),

-- ספירות וסקרים
('ספירת אמצעי תקשוב', 'Communication Equipment Count', 'COUNT001', 'inventory', 'communication', 'ספירת אמצעי תקשוב', 180, true, 'low'),
('ספירת ריהוט', 'Furniture Count', 'COUNT002', 'inventory', 'furniture', 'ספירת ריהוט', 120, true, 'low'),

-- הכנה והכשרה
('שבוע תרגול והטמעה', 'Training and Implementation Week', 'TRAIN001', 'training', 'implementation', 'שבוע תרגול והטמעה', 2400, false, 'medium');

-- =============================================================================
-- INSPECTION LEADERS - מובילי בדיקות (from Excel data)
-- =============================================================================

INSERT INTO public.inspection_leaders (name_hebrew, name_english, email, phone, specialization, experience_years) VALUES
('יגאל גזמן', 'Yigal Gazman', 'yigal@example.com', '050-1111111', 'הנדסה', 15),
('יוסי שמש', 'Yossi Shemesh', 'yossi@example.com', '050-2222222', 'אפיון', 12),
('אורנית ג''יספאן', 'Ornit Jisspan', 'ornit@example.com', '050-3333333', 'הנדסה טהורה', 10),
('זיו חג''בי', 'Ziv Hagbi', 'ziv@example.com', '050-4444444', 'תשתיות', 8),
('לירון קוטלר', 'Liron Kotler', 'liron@example.com', '050-5555555', 'תשתיות פאסיביות', 7),
('טלי עיני', 'Tali Eini', 'tali@example.com', '050-6666666', 'בטחון מידע', 9),
('מיכאל קפלון', 'Michael Kaplon', 'michael@example.com', '050-7777777', 'בינוי תומך', 11),
('חן זוהר ראדה', 'Chen Zohar Rada', 'chen@example.com', '050-8888888', 'רשתות אקטיביות', 13),
('לנה ספבק', 'Lena Spvek', 'lena@example.com', '050-9999999', 'רשתות מתקדמות', 6),
('ניר מנדלבוים', 'Nir Mandelbaum', 'nir@example.com', '050-0000000', 'בדיקות תפעוליות', 14),
('יקיר נבון', 'Yakir Navon', 'yakir@example.com', '050-1122334', 'הנדסה כללית', 9),
('אבינועם הרשברג', 'Avinoam Hershberg', 'avinoam@example.com', '050-2233445', 'מערכות מיוחדות', 12),
('אורי כהן', 'Uri Cohen', 'uri@example.com', '050-3344556', 'תקשורת', 8),
('איציק דאבוש', 'Itzik Daboush', 'itzik@example.com', '050-4455667', 'בינוי', 10),
('אריה אלקובי', 'Arie Alkobi', 'arie@example.com', '050-5566778', 'אבטחה', 15),
('דוד מרציאנו', 'David Marciano', 'david.m@example.com', '050-6677889', 'מולטימדיה', 7),
('דוד שוחט', 'David Shohat', 'david.s@example.com', '050-7788990', 'ניהול מערכות', 11),
('זיו מטודי', 'Ziv Metodi', 'ziv.m@example.com', '050-8899001', 'בדיקות מבנה', 9),
('חיים כהן', 'Haim Cohen', 'haim@example.com', '050-9900112', 'חשמל', 13),
('חנוך חוטר', 'Hanoch Hoter', 'hanoch@example.com', '050-0011223', 'רשתות', 12),
('עדן קקון', 'Eden Kakon', 'eden@example.com', '050-1122334', 'בדיקות מיוחדות', 6),
('ערן ברגיל+ רונן פרץ', 'Eran Bargil + Ronen Peretz', 'eran.ronen@example.com', '050-2233445', 'צוות משולב', 10),
('קארין נוקי', 'Karin Noki', 'karin@example.com', '050-3344556', 'איכות', 8),
('רוי בנימין', 'Roy Benjamin', 'roy@example.com', '050-4455667', 'בטיחות', 11),
('רונן סולומון', 'Ronen Solomon', 'ronen.s@example.com', '050-5566778', 'מערכות בקרה', 9),
('רונן קעטבי', 'Ronen Katabi', 'ronen.k@example.com', '050-6677889', 'רגולציה', 7),
('רועי צברי', 'Roi Tzbari', 'roi@example.com', '050-7788990', 'תפעול', 12),
('שלומי שפר', 'Shlomi Shafer', 'shlomi@example.com', '050-8899001', 'הנדסה', 10),
('שרון אלעזרי', 'Sharon Elazari', 'sharon.e@example.com', '050-9900112', 'בדיקות', 8),
('שרון נזירי', 'Sharon Naziri', 'sharon.n@example.com', '050-0011223', 'מערכות', 9),
('נטשה וסקובייניק', 'Natasha Vaskobeinik', 'natasha@example.com', '050-1234567', 'בדיקות מתקדמות', 11);

-- =============================================================================
-- REGULATORS - רגולטורים (from Excel data)
-- =============================================================================

INSERT INTO public.regulators (name_hebrew, name_english, description_hebrew, contact_person, phone) VALUES
('אהו"ב', 'AHOV', 'אגף הנדסה ובינוי', 'מנהל אהו"ב', '03-1234567'),
('בטחון', 'Security', 'יחידת הבטחון', 'קצין בטחון ראשי', '03-2345678'),
('בטחון מידע', 'Information Security', 'יחידת בטחון מידע', 'קצין בטמ"ח', '03-3456789'),
('בטיחות', 'Safety', 'יחידת הבטיחות', 'קצין בטיחות', '03-4567890'),
('ברה"צ', 'BRAHATZ', 'בריאות הציבור', 'רופא מחוזי', '03-5678901'),
('הגנ"ס', 'HAGANS', 'הגנה אזרחית', 'מפקד הגנ"ס', '03-6789012'),
('הגנת מחנות', 'Camp Protection', 'הגנת מחנות', 'קצין הגנת מחנות', '03-7890123'),
('חושן', 'Hoshen', 'יחידת חושן', 'מפקד חושן', '03-8901234'),
('חושן - אלי אלגזר', 'Hoshen - Eli Elgazar', 'חושן - אלי אלגזר', 'אלי אלגזר', '03-9012345'),
('חושן - חנוך חוטר', 'Hoshen - Hanoch Hoter', 'חושן - חנוך חוטר', 'חנוך חוטר', '03-0123456'),
('חושן - רונן קעטבי', 'Hoshen - Ronen Katabi', 'חושן - רונן קעטבי', 'רונן קעטבי', '03-1357924'),
('כוורת', 'Koveret', 'יחידת כוורת', 'מפקד כוורת', '03-2468135'),
('כש"ג', 'KASHAG', 'כלי שיט וגשרים', 'מהנדס כש"ג', '03-3579246'),
('מהנדס חשמל ראשי', 'Chief Electrical Engineer', 'מהנדס חשמל ראשי', 'מהנדס חשמל ראשי', '03-4680357'),
('מזון', 'Food', 'יחידת המזון', 'קצין מזון', '03-5791468'),
('מצו"ב', 'MATZOV', 'מטה צבא ובטחון', 'ראש מצו"ב', '03-6802579'),
('מקרפ"ר', 'MAKRAPAR', 'מקלטים וקרפ"ר', 'מהנדס מקרפ"ר', '03-7913680'),
('רבנות', 'Rabbinate', 'רבנות צבאית', 'רב ראשי', '03-8024791');

-- =============================================================================
-- DROPDOWN OPTIONS - אפשרויות רשימות נפתחות
-- =============================================================================

-- Coordinated options
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('coordinated', 'כן', 'Yes', 1),
('coordinated', 'לא', 'No', 2);

-- Report options
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('report_attached', 'כן', 'Yes', 1),
('report_attached', 'לא', 'No', 2);

-- Report distributed options
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('report_distributed', 'כן', 'Yes', 1),
('report_distributed', 'לא', 'No', 2);

-- Reinspection options
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('reinspection', 'כן', 'Yes', 1),
('reinspection', 'לא', 'No', 2);

-- Inspection rounds
INSERT INTO public.dropdown_options (category, value_hebrew, value_english, sort_order) VALUES
('inspection_round', '1', '1', 1),
('inspection_round', '2', '2', 2),
('inspection_round', '3', '3', 3),
('inspection_round', '4', '4', 4);

-- =============================================================================
-- INITIAL SYSTEM SETTINGS
-- =============================================================================

-- Update system settings with Hebrew values
UPDATE public.system_settings SET value = 'מערכת מעקב בדיקות הנדסיות - קריית התקשוב' WHERE key = 'app_name';
UPDATE public.system_settings SET value = 'קריית התקשוב' WHERE key = 'company_name';

-- Add more system settings
INSERT INTO public.system_settings (key, value, description_hebrew, is_public) VALUES
('inspection_code_prefix', 'INS', 'קידומת למספר בדיקה', false),
('default_inspection_duration', '60', 'משך זמן ברירת מחדל לבדיקה (דקות)', false),
('max_photos_per_inspection', '20', 'מספר תמונות מקסימלי לבדיקה', true),
('working_hours_start', '07:00', 'שעת תחילת יום עבודה', true),
('working_hours_end', '17:00', 'שעת סיום יום עבודה', true),
('weekend_work_allowed', 'false', 'האם מותר לעבוד בסוף השבוע', false),
('emergency_contact_phone', '102', 'טלפון חירום', true),
('maintenance_mode', 'false', 'מצב תחזוקה', false);

-- =============================================================================
-- CHECKLIST ITEMS FOR COMMON INSPECTIONS
-- =============================================================================

-- Engineering Inspection Checklist
INSERT INTO public.inspection_checklist_items (inspection_type_id, item_text_hebrew, item_text_english, is_required, order_index, expected_value) VALUES
((SELECT id FROM public.inspection_types WHERE code = 'ENG001'), 'בדיקת תיק מבנה', 'Building documentation check', true, 1, 'שלם ומעודכן'),
((SELECT id FROM public.inspection_types WHERE code = 'ENG001'), 'בדיקת תכניות עדכניות', 'Updated plans check', true, 2, 'קיימות'),
((SELECT id FROM public.inspection_types WHERE code = 'ENG001'), 'בדיקת רישיונות', 'Permits check', true, 3, 'תקפים'),
((SELECT id FROM public.inspection_types WHERE code = 'ENG001'), 'בדיקת תקינות מבנה', 'Structural integrity', true, 4, 'תקין'),
((SELECT id FROM public.inspection_types WHERE code = 'ENG001'), 'בדיקת מערכות יסוד', 'Basic systems check', true, 5, 'פועלות'),

-- Network Inspection Checklist
((SELECT id FROM public.inspection_types WHERE code = 'NET001'), 'בדיקת קישוריות', 'Connectivity test', true, 1, 'פעיל'),
((SELECT id FROM public.inspection_types WHERE code = 'NET001'), 'בדיקת מהירות', 'Speed test', true, 2, 'לפי מפרט'),
((SELECT id FROM public.inspection_types WHERE code = 'NET001'), 'בדיקת אבטחה', 'Security check', true, 3, 'מאובטח'),
((SELECT id FROM public.inspection_types WHERE code = 'NET001'), 'בדיקת יציבות', 'Stability test', true, 4, 'יציב'),
((SELECT id FROM public.inspection_types WHERE code = 'NET001'), 'בדיקת גיבוי', 'Backup test', false, 5, 'פועל'),

-- Infrastructure Inspection Checklist
((SELECT id FROM public.inspection_types WHERE code = 'INF001'), 'בדיקת כבלים', 'Cable inspection', true, 1, 'תקינים'),
((SELECT id FROM public.inspection_types WHERE code = 'INF001'), 'בדיקת חיבורים', 'Connection check', true, 2, 'מהודקים'),
((SELECT id FROM public.inspection_types WHERE code = 'INF001'), 'בדיקת תעלות', 'Conduit check', true, 3, 'תקינות'),
((SELECT id FROM public.inspection_types WHERE code = 'INF001'), 'בדיקת סימון', 'Labeling check', true, 4, 'ברור'),
((SELECT id FROM public.inspection_types WHERE code = 'INF001'), 'בדיקת נגישות', 'Accessibility check', false, 5, 'נגיש');

-- =============================================================================
-- DATA POPULATION COMPLETED
-- =============================================================================

-- Reset sequences to ensure proper numbering
SELECT setval('inspection_number_seq', 1000, false);

-- Create indexes for Hebrew full-text search
CREATE INDEX IF NOT EXISTS idx_inspection_types_name_hebrew_fts ON public.inspection_types 
    USING gin(to_tsvector('simple', name_hebrew));

CREATE INDEX IF NOT EXISTS idx_buildings_name_hebrew_fts ON public.buildings 
    USING gin(to_tsvector('simple', name_hebrew));

-- Add comments
COMMENT ON TABLE public.inspection_types IS 'מכיל סוגי בדיקות מקובץ האקסל עם תיאורים בעברית';
COMMENT ON TABLE public.buildings IS 'מבני קריית התקשוב מקובץ האקסל';
COMMENT ON TABLE public.building_managers IS 'מנהלי מבנים מקובץ האקסל';
COMMENT ON TABLE public.teams IS 'צוותי בדיקות מקובץ האקסל';
COMMENT ON TABLE public.inspection_leaders IS 'מובילי בדיקות מקובץ האקסל';
COMMENT ON TABLE public.regulators IS 'רגולטורים מקובץ האקסל';

-- Success message
SELECT 'נתוני האקסל נוצרו בהצלחה! Excel data created successfully!' as status;