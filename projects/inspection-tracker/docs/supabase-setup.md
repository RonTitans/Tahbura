# הגדרת Supabase למערכת בדיקות הנדסיות
# Supabase Setup for Hebrew Inspection System

## הקדמה | Overview

מדריך זה יעזור לך להגדיר בסיס נתונים Supabase עבור מערכת מעקב בדיקות הנדסיות עם תמיכה מלאה בעברית ו-RTL.

This guide will help you set up a Supabase database for the Hebrew inspection tracking system with full Hebrew and RTL support.

## שלב 1: יצירת חשבון Supabase | Step 1: Create Supabase Account

### 1.1 הרשמה חינמית | Free Registration
1. גש לאתר [Supabase.com](https://supabase.com)
2. לחץ על "Start your project" 
3. בחר "Sign up" והירשם עם GitHub או אימייל
4. אמת את כתובת האימייל שלך

### 1.2 יצירת פרויקט חדש | Create New Project
1. לחץ על "New Project"
2. בחר את הארגון שלך (או צור חדש)
3. הגדר את פרטי הפרויקט:
   - **Project Name**: `inspection-tracker-he` (Hebrew Inspection Tracker)
   - **Database Password**: צור סיסמה חזקה (שמור אותה!)
   - **Region**: בחר `eu-west-1` (Europe) לקליטה טובה יותר בישראל
   - **Pricing Plan**: Free (מספיק לפיתוח ובדיקות)

## שלב 2: הגדרות עברית ו-RTL | Step 2: Hebrew & RTL Configuration

### 2.1 הגדרות בסיס הנתונים | Database Settings
1. בלוח הבקרה של Supabase, עבור ל"Settings" > "Database"
2. בחלק "Database Configuration", וודא:
   - **Character Set**: `UTF8`
   - **Collation**: `en_US.UTF-8` (תומך בעברית)
   - **Timezone**: `Asia/Jerusalem`

### 2.2 הגדרות אבטחה | Security Settings
1. עבור ל"Settings" > "API"
2. **Project URL**: העתק את הכתובת (נדרש לחיבור)
3. **API Keys**: 
   - **anon/public key**: העתק (בטוח לחשיפה)
   - **service_role key**: העתק (רק לשרת!)

### 2.3 Authentication Settings
1. עבור ל"Authentication" > "Settings"
2. **Site URL**: הגדר ל`http://localhost:5173` (לפיתוח)
3. **Additional URLs**: הוסף כתובות נוספות לצורך פריסה
4. **Email Templates**: התאם לעברית (אופציונלי)

## שלב 3: יבוא Schema | Step 3: Import Schema

### 3.1 ביצוע SQL Schema
1. עבור ל"SQL Editor" בלוח הבקרה
2. העתק את התוכן מקובץ `database/schema.sql`
3. הדבק במעבד ה-SQL ולחץ "Run"
4. וודא שכל הטבלאות נוצרו בהצלחה

### 3.2 אכלוס נתונים ראשוניים | Initial Data Population
1. הרץ את הסקריפטים ב`database/seed-data.sql`
2. וודא שיש לך:
   - ✅ סוגי בדיקות (523 סוגים)
   - ✅ בניינים (4 מבנים עיקריים)
   - ✅ משתמשי בדיקה
   - ✅ נתוני דמו לבדיקות

## שלב 4: הגדרת Row Level Security (RLS)

### 4.1 הפעלת RLS
```sql
-- הפעל RLS על כל הטבלאות
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

### 4.2 מדיניות גישה | Access Policies
```sql
-- טכנאים יכולים לראות רק את הבדיקות שלהם
CREATE POLICY "Technicians can view own inspections" ON inspections
  FOR SELECT USING (inspector_id = auth.uid());

-- מנהלים יכולים לראות הכל  
CREATE POLICY "Managers can view all inspections" ON inspections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('manager', 'admin')
    )
  );

-- טכנאים יכולים ליצור בדיקות חדשות
CREATE POLICY "Technicians can create inspections" ON inspections
  FOR INSERT WITH CHECK (inspector_id = auth.uid());
```

## שלב 5: הגדרת Realtime | Step 5: Realtime Configuration

### 5.1 הפעלת Realtime
1. עבור ל"Database" > "Replication"
2. הפעל Realtime עבור הטבלאות:
   - ✅ `inspections`
   - ✅ `inspection_status_updates`
   - ❌ `users` (מידע רגיש)
   - ❌ `auth.users` (מידע רגיש)

### 5.2 בדיקת חיבור Realtime
```javascript
// בדיקה ב-Console של הדפדפן
const { data, error } = await supabase
  .channel('inspections')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'inspections' },
    (payload) => console.log('Change received!', payload)
  )
  .subscribe()
```

## שלב 6: הגדרת Storage | Step 6: Storage Configuration

### 6.1 יצירת Bucket לתמונות
1. עבור ל"Storage"
2. צור Bucket חדש:
   - **Name**: `inspection-photos`
   - **Public**: כן (לגישה לתמונות)
   - **File size limit**: 10MB
   - **Allowed MIME types**: `image/*`

### 6.2 מדיניות Storage
```sql
-- אפשר לטכנאים להעלות תמונות
CREATE POLICY "Technicians can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'inspection-photos' AND
    auth.role() = 'authenticated'
  );

-- אפשר לכולם לראות תמונות
CREATE POLICY "Everyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'inspection-photos');
```

## שלב 7: הגדרות סביבה | Step 7: Environment Configuration

### 7.1 קובץ Environment 
צור קובץ `.env.local` בתיקיית הפרונטאנד:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=מערכת מעקב בדיקות הנדסיות
VITE_COMPANY_NAME=קריית התקשוב
VITE_DEFAULT_LOCALE=he-IL
VITE_APP_TIMEZONE=Asia/Jerusalem
```

### 7.2 בדיקת חיבור | Connection Test
הרץ בטרמינל של הפרונטאנד:

```bash
npm run dev
```

ובדוק שהאפליקציה מתחברת ל-Supabase ללא שגיאות.

## שלב 8: גיבויים ומעקב | Step 8: Backups & Monitoring

### 8.1 הגדרת גיבויים אוטומטיים
1. בתוכנית החינמית: גיבוי אוטומטי ל-7 ימים
2. לפריסה: שדרג לתוכנית Pro לגיבויים מתקדמים

### 8.2 מעקב ביצועים
1. עבור ל"Settings" > "Usage"
2. עקוב אחר:
   - **Database size**: מקסימום 500MB בחינם
   - **API requests**: מקסימום 50K בחודש
   - **Storage**: מקסימום 1GB
   - **Realtime connections**: מקסימום 200

## בעיות נפוצות | Common Issues

### 🔧 בעיית חיבור | Connection Issues
```javascript
// בדיקת חיבור בסיסי
const { data, error } = await supabase.auth.getSession()
if (error) console.error('Connection failed:', error)
else console.log('Connected successfully:', data)
```

### 🔧 בעיות עברית | Hebrew Issues
- וודא UTF-8 encoding בכל הקבצים
- בדוק ש-direction: rtl מוגדר ב-CSS
- השתמש בגופנים עבריים (Rubik, Assistant)

### 🔧 בעיות RLS | RLS Issues
```sql
-- בדיקת מדיניות RLS
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 🔧 בעיות Performance
- הוסף אינדקסים לשאילתות נפוצות
- השתמש ב-select() לשדות ספציפיים בלבד
- הגבל תוצאות עם limit()

## קישורים שימושיים | Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Documentation](https://supabase.com/docs/guides/realtime)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

## תמיכה | Support

🆘 **זקוק לעזרה?**
- Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: [github.com/supabase/supabase](https://github.com/supabase/supabase)
- Community Forum: [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)

---

**הערה חשובה:** שמור את פרטי הגישה (URL ו-Keys) במקום בטוח ואל תחשוף אותם בקוד או ב-Git!

**Important Note:** Keep your credentials (URL & Keys) secure and never expose them in code or Git!