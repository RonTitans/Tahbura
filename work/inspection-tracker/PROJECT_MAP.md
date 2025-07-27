# 🏗️ Hebrew Inspection Tracker - Project Map
# מפת פרויקט מערכת מעקב בדיקות עברית

## 📋 Project Overview | סקירת הפרויקט

**Project Name**: Hebrew Construction Site Inspection Tracking System  
**שם הפרויקט**: מערכת מעקב בדיקות הנדסיות לקריית התקשוב

**Goal**: Replace Excel + WhatsApp workflow with digital inspection tracking system for 523 inspection types  
**מטרה**: החלפת זרימת Excel + WhatsApp במערכת דיגיטלית למעקב 523 סוגי בדיקות

---

## 🗂️ Directory Structure | מבנה תיקיות

```
F:\ClaudeCode\work\inspection-tracker\
├── 📁 backend/                    # Node.js API Server
│   ├── 📁 src/
│   │   ├── 📁 config/
│   │   │   └── supabase.js        # Supabase admin config
│   │   ├── 📁 scripts/
│   │   │   ├── setup-database.js  # Database initialization
│   │   │   └── import-excel.js    # Excel data import
│   │   └── index.js               # Express server
│   ├── package.json               # Backend dependencies
│   └── .env.example               # Environment template
│
├── 📁 frontend/                   # React TypeScript App
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   └── 📁 ui/             # Hebrew UI components
│   │   ├── 📁 pages/
│   │   │   ├── Dashboard.tsx      # Manager dashboard
│   │   │   └── ReportForm.tsx     # Technician report form
│   │   ├── 📁 lib/
│   │   │   └── supabase.ts        # Supabase client config
│   │   └── 📁 utils/
│   │       ├── hebrew.ts          # Hebrew utilities
│   │       └── hebrewStrings.ts   # UI strings
│   ├── package.json               # Frontend dependencies
│   └── .env.example               # Environment template
│
├── 📁 database/                   # Database Schema & Data
│   ├── schema.sql                 # Complete database schema
│   ├── seed-data.sql              # Initial Hebrew data
│   └── 📁 migrations/             # Database migrations
│
├── 📁 scripts/                    # Development Scripts
│   ├── start-dev.bat              # Start development servers
│   ├── setup-project.bat          # Project initialization
│   ├── import-data.bat            # Import Excel data
│   └── setup-database.bat        # Database setup
│
├── CLAUDE.md                      # Development memory/guidelines
├── PROJECT_MAP.md                 # This file
└── README.md                      # Project documentation
```

---

## 🚀 Quick Start Guide | מדריך התחלה מהירה

### 1. Initial Setup | הגדרה ראשונית
```bash
# Run the setup script
scripts\setup-project.bat

# Configure environment variables
# Edit backend\.env and frontend\.env with your Supabase credentials
```

### 2. Database Setup | הגדרת בסיס נתונים
```bash
# Initialize database
scripts\setup-database.bat

# Import Excel data (optional)
scripts\import-data.bat "path\to\excel\file.xlsx"
```

### 3. Start Development | התחלת פיתוח
```bash
# Start both frontend and backend
scripts\start-dev.bat

# Access the application
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

---

## 🏗️ Architecture Overview | סקירת ארכיטקטורה

### Frontend Stack | מחסנית Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** with full RTL support
- **React Router** for navigation
- **React Hook Form** + **Zod** for forms
- **React Query** for data fetching
- **Zustand** for state management

### Backend Stack | מחסנית Backend
- **Node.js** + **Express** API server
- **Supabase** PostgreSQL database
- **Row Level Security** (RLS) for data protection
- **Excel import/export** with Hebrew support

### Database Design | עיצוב בסיס הנתונים
- **11 main tables** with Hebrew field names
- **Full text search** in Hebrew
- **Audit trails** for all changes
- **Real-time subscriptions** for live updates

---

## 📊 Key Features | תכונות מרכזיות

### ✅ Completed Features | תכונות שהושלמו
- [x] **Hebrew-first UI** - ממשק עברי מלא
- [x] **RTL Layout** - פריסה ימין לשמאל
- [x] **Database Schema** - סכמת בסיס נתונים
- [x] **Excel Import** - יבוא מקובץ אקסל
- [x] **Development Scripts** - סקריפטי פיתוח
- [x] **TypeScript Types** - טיפוסי TypeScript
- [x] **Supabase Integration** - אינטגרציה עם Supabase

### 🔄 In Development | בפיתוח
- [ ] **API Endpoints** - נקודות קצה API
- [ ] **Authentication** - הזדהות משתמשים
- [ ] **Photo Upload** - העלאת תמונות
- [ ] **Report Generation** - יצירת דוחות
- [ ] **Mobile PWA** - אפליקציית PWA נייד

### 📅 Planned Features | תכונות מתוכננות
- [ ] **Offline Mode** - מצב לא מקוון
- [ ] **Push Notifications** - התרעות דחיפה
- [ ] **Advanced Reporting** - דיווח מתקדם
- [ ] **User Management** - ניהול משתמשים
- [ ] **Audit Logs** - יומני ביקורת

---

## 🔧 Development Commands | פקודות פיתוח

### Frontend Commands | פקודות Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Commands | פקודות Backend
```bash
cd backend
npm start        # Start production server
npm run dev      # Start development server (with watch)
npm run setup-db # Setup database
npm run import-data # Import Excel data
```

### Database Commands | פקודות בסיס נתונים
```bash
# Setup database schema
node backend/src/scripts/setup-database.js

# Import Excel data
node backend/src/scripts/import-excel.js "file.xlsx"
```

---

## 📝 Configuration Files | קבצי תצורה

### Environment Variables | משתני סביבה

#### Backend (.env)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
PORT=3001
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_NAME="מערכת מעקב בדיקות הנדסיות"
VITE_COMPANY_NAME="קריית התקשוב"
VITE_API_URL=http://localhost:3001
```

---

## 🗄️ Database Schema | סכמת בסיס הנתונים

### Core Tables | טבלאות ליבה
1. **users** - משתמשי המערכת
2. **buildings** - מבנים באתר
3. **inspection_types** - סוגי בדיקות
4. **inspections** - בדיקות שבוצעו
5. **system_settings** - הגדרות מערכת

### Support Tables | טבלאות תמיכה
6. **building_managers** - מנהלי מבנים
7. **teams** - צוותי עבודה
8. **inspection_leaders** - מובילי בדיקות
9. **regulators** - רגולטורים
10. **dropdown_options** - אפשרויות רשימות
11. **inspection_checklist_items** - פריטי רשימת בדיקה

---

## 🎨 UI Components | רכיבי ממשק משתמש

### Hebrew UI Components | רכיבי ממשק עברי
- **HebrewButton** - כפתור עברי עם RTL
- **HebrewInput** - שדה קלט עברי
- **HebrewSelect** - רשימה נפתחת עברית
- **HebrewDatePicker** - בחירת תאריך עברית
- **HebrewTable** - טבלה עברית עם RTL

### Layout Components | רכיבי פריסה
- **RTL Container** - מכולה RTL
- **Hebrew Navigation** - ניווט עברי
- **Mobile Header** - כותרת נייד
- **Dashboard Layout** - פריסת דשבורד

---

## 📱 Mobile Support | תמיכה נייד

### PWA Features | תכונות PWA
- **Offline Mode** - עבודה ללא אינטרנט
- **Home Screen Install** - התקנה על המסך הראשי
- **Push Notifications** - התרעות דחיפה
- **Camera Integration** - אינטגרציה עם מצלמה

### Responsive Design | עיצוב רספונסיבי
- **Mobile First** - נייד קודם
- **Touch Optimized** - מותאם למגע
- **Large Buttons** - כפתורים גדולים
- **Easy Navigation** - ניווט קל

---

## 🔐 Security Features | תכונות אבטחה

### Authentication | הזדהות
- **Supabase Auth** - הזדהות Supabase
- **Role-Based Access** - גישה מבוססת תפקיד
- **Session Management** - ניהול הפעלות

### Data Protection | הגנת מידע
- **Row Level Security** - אבטחה ברמת השורה
- **Input Validation** - אימות קלטים
- **SQL Injection Protection** - הגנה מ-SQL Injection
- **XSS Protection** - הגנה מ-XSS

---

## 📊 Data Flow | זרימת נתונים

### Inspection Workflow | זרימת בדיקה
1. **Schedule** - תזמון בדיקה
2. **Assign** - הקצאה לטכנאי
3. **Execute** - ביצוע בשטח
4. **Document** - תיעוד ממצאים
5. **Review** - סקירה ואישור
6. **Report** - יצירת דוח

### Data Sources | מקורות נתונים
- **Excel Import** - יבוא מאקסל
- **Manual Entry** - הזנה ידנית
- **Mobile Forms** - טפסים ניידים
- **API Integration** - אינטגרציה API

---

## 🚨 Troubleshooting | פתרון בעיות

### Common Issues | בעיות נפוצות

#### Database Connection
```bash
# Test database connection
node -e "require('./backend/src/config/supabase.js').testConnection()"
```

#### Environment Variables
- Check .env files exist and have correct values
- Verify Supabase credentials are valid
- Ensure ports 3001 and 5173 are available

#### Hebrew Text Issues
- Verify UTF-8 encoding in all files
- Check font loading in browser
- Confirm RTL CSS is applied

---

## 📚 Resources | משאבים

### Development Resources | משאבי פיתוח
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS RTL](https://tailwindcss.com/docs/text-direction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

### Hebrew/RTL Resources | משאבי עברית/RTL
- [Hebrew Web Typography](https://hebrew-typography.com)
- [RTL CSS Guidelines](https://rtlstyling.com)
- [Hebrew Date Formatting](https://date-fns.org/docs/format)

---

## 🤝 Contributing | תרומה

### Development Guidelines | קווי מנחה לפיתוח
1. **Hebrew First** - עברית ראשונה
2. **RTL Support** - תמיכה מלאה ב-RTL
3. **TypeScript** - שימוש בטיפוסים
4. **Testing** - כתיבת בדיקות
5. **Documentation** - תיעוד בעברית ואנגלית

### Code Standards | תקני קוד
- Use TypeScript for all new code
- Follow ESLint configuration
- Write Hebrew comments for user-facing features
- Maintain RTL compatibility
- Test on mobile devices

---

## 📞 Support | תמיכה

### Getting Help | קבלת עזרה
- Check PROJECT_MAP.md (this file)
- Review CLAUDE.md for development guidelines
- Test with provided batch scripts
- Verify environment configuration

### Contact Information | פרטי יצירת קשר
- **Project**: Hebrew Inspection Tracker
- **Location**: F:\ClaudeCode\work\inspection-tracker\
- **Documentation**: CLAUDE.md, PROJECT_MAP.md, README.md

---

**Last Updated**: $(date)  
**Project Status**: ✅ Ready for Development  
**Hebrew Support**: ✅ Full RTL Implementation