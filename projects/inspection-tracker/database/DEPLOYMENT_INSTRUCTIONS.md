# Hebrew Inspection Tracker - Database Deployment Instructions
# הוראות פריסת בסיס הנתונים - מערכת מעקב בדיקות עברית

## Manual Deployment via Supabase Dashboard
## פריסה ידנית דרך דשבורד Supabase

### Step 1: Access Supabase SQL Editor
### שלב 1: גישה לעורך SQL של Supabase

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to the **SQL Editor** in the left sidebar
3. Click on **+ New Query** to create a new SQL query

### Step 2: Deploy Minimal Schema
### שלב 2: פריסת סכמה מינימלית

1. Open the file: `schema-minimal.sql`
2. Copy the entire contents of the file
3. Paste it into the Supabase SQL Editor
4. Click **RUN** to execute the schema

**Expected Result:** The schema should create all tables, enums, indexes, and functions successfully.

### Step 3: Deploy Basic Seed Data
### שלב 3: פריסת נתוני בסיס

1. After the schema is successfully deployed, open: `seed-basic-data.sql`
2. Copy the entire contents of the file
3. Paste it into a new SQL query in Supabase
4. Click **RUN** to execute the seed data

**Expected Result:** This will populate:
- 25 buildings (מבנים)
- 56 inspection types (סוגי בדיקות)
- 12 regulators (רגולטורים)
- 5 red teams (צוותים אדומים)
- Basic system settings (הגדרות מערכת)

### Step 4: Verify Deployment
### שלב 4: אימות הפריסה

Run these verification queries in the SQL Editor:

```sql
-- Check if all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count records in main tables
SELECT 
    'buildings' as table_name, COUNT(*) as count FROM buildings
UNION ALL
SELECT 
    'inspection_types' as table_name, COUNT(*) as count FROM inspection_types
UNION ALL
SELECT 
    'regulators' as table_name, COUNT(*) as count FROM regulators
UNION ALL
SELECT 
    'red_teams' as table_name, COUNT(*) as count FROM red_teams
UNION ALL
SELECT 
    'system_settings' as table_name, COUNT(*) as count FROM system_settings;

-- Test Hebrew text search
SELECT name_hebrew, building_code 
FROM buildings 
WHERE to_tsvector('simple', name_hebrew) @@ to_tsquery('simple', 'מבנה')
LIMIT 5;
```

**Expected Results:**
- Should see 11 tables created
- buildings: 25 records
- inspection_types: 56 records  
- regulators: 12 records
- red_teams: 5 records
- system_settings: 8+ records
- Hebrew search should return building records

### Step 5: Test Application Connection
### שלב 5: בדיקת חיבור האפליקציה

After successful deployment, test the application:

```bash
cd frontend
npm run dev
```

The application should now connect to Supabase with Hebrew data loaded.

## Troubleshooting
## פתרון בעיות

### Common Issues:

1. **"type already exists" errors**
   - This is normal if re-running the schema
   - The `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object` blocks handle this

2. **"permission denied" errors**
   - Ensure you're using the service role key
   - Check that RLS policies allow the operations

3. **Hebrew text not displaying correctly**
   - Ensure your application is using UTF-8 encoding
   - Check that the font supports Hebrew characters

4. **Search not working**
   - Verify the GIN indexes were created successfully
   - Test search queries in the SQL editor first

### Manual Cleanup (if needed):

```sql
-- Drop all tables (use with caution!)
DROP TABLE IF EXISTS inspection_checklist_responses CASCADE;
DROP TABLE IF EXISTS inspection_checklist_items CASCADE;
DROP TABLE IF EXISTS inspection_photos CASCADE;
DROP TABLE IF EXISTS inspections CASCADE;
DROP TABLE IF EXISTS inspection_types CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS red_teams CASCADE;
DROP TABLE IF EXISTS regulators CASCADE;
DROP TABLE IF EXISTS inspection_rounds CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS dropdown_options CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS building_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS inspection_category CASCADE;
DROP TYPE IF EXISTS priority_level CASCADE;
DROP TYPE IF EXISTS inspection_status CASCADE;

-- Drop sequences
DROP SEQUENCE IF EXISTS inspection_number_seq CASCADE;
```

## Files to Deploy (in order):
## קבצים לפריסה (לפי סדר):

1. `schema-minimal.sql` - Core database structure
2. `seed-basic-data.sql` - Reference data and basic settings

## Next Steps:
## שלבים הבאים:

After successful deployment:
1. Start the frontend application
2. Test Hebrew UI and data display
3. Test create/read operations with Hebrew data
4. Verify search functionality with Hebrew text
5. Test mobile responsiveness with RTL layout

---

**Note:** If you encounter any issues during deployment, check the Supabase logs in the dashboard for detailed error messages.

**הערה:** אם אתה נתקל בבעיות במהלך הפריסה, בדוק את יומני Supabase בדשבורד להודעות שגיאה מפורטות.