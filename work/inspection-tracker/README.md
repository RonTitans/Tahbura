# 🏗️ מערכת מעקב בדיקות הנדסיות - קריית התקשוב
# Hebrew Construction Site Inspection Tracking System

[![Hebrew](https://img.shields.io/badge/Language-Hebrew-blue.svg)](https://he.wikipedia.org/wiki/עברית)
[![RTL](https://img.shields.io/badge/Layout-RTL-green.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Writing_Modes)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green.svg)](https://supabase.com/)

## 📋 Overview | סקירה כללית

A comprehensive digital inspection tracking system designed specifically for Hebrew-speaking construction and data center environments. Replaces traditional Excel + WhatsApp workflows with a modern, mobile-first application supporting 523+ inspection types.

מערכת דיגיטלית מקיפה למעקב בדיקות הנדסיות, מותאמת במיוחד לסביבות בנייה ומרכזי נתונים דוברי עברית. מחליפה זרימות עבודה מסורתיות של Excel + WhatsApp באפליקציה מודרנית המותאמת לנייד ותומכת ב-523+ סוגי בדיקות.

---

## ✨ Key Features | תכונות מרכזיות

### 🇮🇱 Hebrew-First Design | עיצוב עברי ראשון
- **Full RTL Support** - תמיכה מלאה בכיוון ימין לשמאל
- **Hebrew UI Components** - רכיבי ממשק בעברית
- **Israeli Date Format** - פורמט תאריך ישראלי (DD/MM/YYYY)
- **Hebrew Form Validation** - אימות טפסים בעברית

### 📱 Mobile-First | נייד ראשון
- **PWA Ready** - מוכן לאפליקציית PWA
- **Touch Optimized** - מותאם למגע
- **Camera Integration** - אינטגרציה עם מצלמה
- **Offline Mode** - מצב עבודה ללא אינטרנט

### 🏢 Data Center Focused | מותאם למרכז נתונים
- **523 Inspection Types** - 523 סוגי בדיקות
- **Building Management** - ניהול מבנים
- **Team Coordination** - תיאום צוותים
- **Excel Import/Export** - יבוא/יצוא אקסל

### 🔒 Enterprise Security | אבטחה ארגונית
- **Role-Based Access** - גישה מבוססת תפקיד
- **Row Level Security** - אבטחה ברמת השורה
- **Audit Trails** - מסלולי ביקורת
- **Secure File Upload** - העלאת קבצים מאובטחת

---

## 🚀 Quick Start | התחלה מהירה

### Prerequisites | דרישות מקדימות
- Node.js 18+ installed
- Supabase account and project
- Windows environment (for batch scripts)

### 1. Project Setup | הגדרת הפרויקט
```bash
# Clone or download the project
cd inspection-tracker

# Run setup script
scripts\setup-project.bat
```

### 2. Configure Environment | הגדרת סביבה
```bash
# Edit backend environment
backend\.env

# Edit frontend environment  
frontend\.env
```

### 3. Initialize Database | אתחול בסיס נתונים
```bash
# Setup database schema
scripts\setup-database.bat

# Import Excel data (optional)
scripts\import-data.bat "path\to\your\excel\file.xlsx"
```

### 4. Start Development | התחלת פיתוח
```bash
# Start both servers
scripts\start-dev.bat

# Access the application
# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

---

## 📁 Project Structure | מבנה הפרויקט

```
inspection-tracker/
├── 📁 backend/                 # Node.js API Server
│   ├── src/
│   │   ├── config/            # Supabase configuration
│   │   ├── scripts/           # Database & import scripts
│   │   └── index.js           # Express server
│   └── package.json
│
├── 📁 frontend/                # React TypeScript App
│   ├── src/
│   │   ├── components/        # Hebrew UI components
│   │   ├── pages/             # Application pages
│   │   ├── lib/               # Supabase client
│   │   └── utils/             # Hebrew utilities
│   └── package.json
│
├── 📁 database/                # Database Schema
│   ├── schema.sql             # Complete schema
│   └── seed-data.sql          # Initial data
│
├── 📁 scripts/                 # Development Scripts
│   ├── start-dev.bat          # Start development
│   ├── setup-project.bat      # Project setup
│   ├── setup-database.bat     # Database setup
│   └── import-data.bat        # Data import
│
├── CLAUDE.md                   # Development guidelines
├── PROJECT_MAP.md              # Detailed project map
└── README.md                   # This file
```

---

## 🛠️ Technology Stack | מחסנית טכנולוגית

### Frontend | צד לקוח
- **React 19** - Modern React with concurrent features
- **TypeScript 5.8** - Type safety and better DX
- **Vite 7** - Fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS with RTL support
- **React Router 7** - Client-side routing
- **React Hook Form** - Form management
- **React Query** - Server state management
- **Zustand** - Client state management

### Backend | צד שרת
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Database-level security

### Development Tools | כלי פיתוח
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Batch Scripts** - Windows automation

---

## 🏗️ Architecture | ארכיטקטורה

### Database Design | עיצוב בסיס הנתונים
```sql
-- Core Tables
users                    -- משתמשי המערכת
buildings               -- מבנים באתר  
inspection_types        -- סוגי בדיקות
inspections            -- בדיקות שבוצעו
system_settings        -- הגדרות מערכת

-- Support Tables
building_managers      -- מנהלי מבנים
teams                 -- צוותי עבודה
inspection_leaders    -- מובילי בדיקות
regulators           -- רגולטורים
dropdown_options     -- אפשרויות רשימות
```

### Component Architecture | ארכיטקטורת רכיבים
```typescript
// Hebrew UI Components
HebrewButton         // כפתור עברי
HebrewInput          // קלט עברי
HebrewSelect         // רשימה נפתחת עברית
HebrewDatePicker     // בחירת תאריך עברית
HebrewTable          // טבלה עברית

// Layout Components
RTLContainer         // מכולה RTL
HebrewNavigation     // ניווט עברי
MobileHeader         // כותרת נייד
DashboardLayout      // פריסת דשבורד
```

---

## 📊 Features Roadmap | מפת דרכים לתכונות

### ✅ Completed | הושלם
- [x] Hebrew-first UI design
- [x] RTL layout system
- [x] Database schema with Hebrew support
- [x] Excel import functionality
- [x] Development automation scripts
- [x] TypeScript type definitions
- [x] Supabase integration

### 🔄 In Progress | בתהליך
- [ ] API endpoint implementation
- [ ] User authentication system
- [ ] Photo upload and management
- [ ] Report generation system
- [ ] Mobile PWA features

### 📅 Planned | מתוכנן
- [ ] Advanced reporting dashboard
- [ ] Offline mode support
- [ ] Push notifications
- [ ] User management interface
- [ ] Audit log viewing
- [ ] Advanced search and filtering

---

## 📱 User Interfaces | ממשקי משתמש

### 🔧 Technician Interface | ממשק טכנאי
- **Mobile Report Form** - טופס דיווח נייד
- **Inspection Checklist** - רשימת בדיקה
- **Photo Capture** - צילום תמונות
- **Signature Collection** - איסוף חתימות

### 👨‍💼 Manager Interface | ממשק מנהל
- **Real-time Dashboard** - דשבורד בזמן אמת
- **Progress Tracking** - מעקב התקדמות
- **Report Generation** - יצירת דוחות
- **Team Management** - ניהול צוותים

### 👑 Admin Interface | ממשק מנהל מערכת
- **User Management** - ניהול משתמשים
- **System Configuration** - הגדרת מערכת
- **Data Import/Export** - יבוא/יצוא נתונים
- **Audit Logs** - יומני ביקורת

---

## 🔐 Security & Compliance | אבטחה ותקנות

### Authentication | הזדהות
- **Supabase Auth** - מערכת הזדהות מובנית
- **Role-based permissions** - הרשאות מבוססות תפקיד
- **Session management** - ניהול הפעלות
- **Secure password policies** - מדיניות סיסמאות מאובטחת

### Data Protection | הגנת נתונים
- **Row Level Security (RLS)** - אבטחה ברמת השורה
- **Encrypted data storage** - אחסון נתונים מוצפן
- **Secure file uploads** - העלאת קבצים מאובטחת
- **Input validation** - אימות קלטים

### Compliance | תקנות
- **GDPR compliance ready** - מוכן לתקנת GDPR
- **Audit trail logging** - רישום מסלול ביקורת
- **Data retention policies** - מדיניות שמירת נתונים
- **Backup and recovery** - גיבוי ושחזור

---

## 🌐 Internationalization | בינאום

### Hebrew Support | תמיכה בעברית
- **Full RTL layout** - פריסה מלאה RTL
- **Hebrew typography** - טיפוגרפיה עברית
- **Date/time formatting** - עיצוב תאריך/שעה ישראלי
- **Number formatting** - עיצוב מספרים ישראלי
- **Keyboard support** - תמיכה במקלדת עברית

### Localization | לוקליזציה
- **Hebrew UI strings** - מחרוזות ממשק בעברית
- **Error messages in Hebrew** - הודעות שגיאה בעברית
- **Validation messages** - הודעות אימות בעברית
- **Help text** - טקסט עזרה בעברית

---

## 📊 Performance & Scalability | ביצועים ומדרגיות

### Frontend Performance | ביצועי Frontend
- **Code splitting** - פיצול קוד
- **Lazy loading** - טעינה עצלה
- **Image optimization** - אופטימיזציית תמונות
- **PWA caching** - מטמון PWA

### Backend Performance | ביצועי Backend
- **Database indexing** - אינדקסים במסד הנתונים
- **Query optimization** - אופטימיזציית שאילתות
- **Connection pooling** - מאגר חיבורים
- **Caching strategies** - אסטרטגיות מטמון

### Scalability | מדרגיות
- **Horizontal scaling ready** - מוכן להרחבה אופקית
- **Database partitioning** - חלוקת מסד נתונים
- **CDN integration** - אינטגרציית CDN
- **Load balancing** - איזון עומסים

---

## 🧪 Testing Strategy | אסטרטגיית בדיקות

### Unit Testing | בדיקות יחידה
- **Component testing** - בדיקת רכיבים
- **Utility function testing** - בדיקת פונקציות עזר
- **API endpoint testing** - בדיקת נקודות קצה API
- **Database function testing** - בדיקת פונקציות מסד נתונים

### Integration Testing | בדיקות אינטגרציה
- **API integration** - אינטגרציית API
- **Database integration** - אינטגרציית מסד נתונים
- **Authentication flow** - זרימת הזדהות
- **File upload flow** - זרימת העלאת קבצים

### E2E Testing | בדיקות מקצה לקצה
- **User workflows** - זרימות משתמש
- **Mobile responsiveness** - רספונסיביות נייד
- **RTL layout testing** - בדיקת פריסה RTL
- **Performance testing** - בדיקות ביצועים

---

## 📖 Documentation | תיעוד

### For Developers | למפתחים
- **[CLAUDE.md](./CLAUDE.md)** - Development guidelines and memory
- **[PROJECT_MAP.md](./PROJECT_MAP.md)** - Detailed project structure
- **API Documentation** - תיעוד API (בפיתוח)
- **Component Documentation** - תיעוד רכיבים (בפיתוח)

### For Users | למשתמשים
- **User Manual** - מדריך משתמש (מתוכנן)
- **Video Tutorials** - מדריכי וידאו (מתוכננים)
- **FAQ** - שאלות נפוצות (מתוכנן)
- **Troubleshooting Guide** - מדריך פתרון בעיות (מתוכנן)

---

## 🤝 Contributing | תרומה לפרויקט

### Development Setup | הגדרת פיתוח
1. **Fork the repository** - צור fork של הרפוזיטורי
2. **Run setup scripts** - הרץ סקריפטי הגדרה
3. **Configure environment** - הגדר משתני סביבה
4. **Start development** - התחל פיתוח

### Code Standards | תקני קוד
- **TypeScript first** - TypeScript ראשון
- **Hebrew comments for UI** - הערות בעברית לממשק
- **RTL-compatible styling** - עיצוב תואם RTL
- **Comprehensive testing** - בדיקות מקיפות
- **Security-first approach** - גישה מותאמת אבטחה

### Submission Process | תהליך הגשה
1. **Create feature branch** - צור ענף תכונה
2. **Implement changes** - יישם שינויים
3. **Add tests** - הוסף בדיקות
4. **Update documentation** - עדכן תיעוד
5. **Submit pull request** - הגש pull request

---

## 📞 Support & Contact | תמיכה ויצירת קשר

### Getting Help | קבלת עזרה
- **Documentation** - עיין בתיעוד הפרויקט
- **Project Scripts** - השתמש בסקריפטי הפרויקט
- **Environment Check** - בדוק הגדרת הסביבה
- **Database Connection** - וודא חיבור למסד הנתונים

### Troubleshooting | פתרון בעיות
```bash
# Test database connection
node backend/src/scripts/setup-database.js

# Verify environment variables
echo $VITE_SUPABASE_URL

# Check server status
curl http://localhost:3001/health
```

---

## 📄 License | רישיון

This project is developed for internal use in construction and data center inspection workflows. All rights reserved.

פרויקט זה פותח לשימוש פנימי בזרימות עבודה של בדיקות בנייה ומרכזי נתונים. כל הזכויות שמורות.

---

## 🏗️ Built With ❤️ for Hebrew Construction Industry
## 🇮🇱 בנוי באהבה עבור תעשיית הבנייה הישראלית

**Project Status**: ✅ Ready for Development  
**Version**: 1.0.0  
**Last Updated**: 2025-01-27  
**Language Support**: Hebrew (עברית) + RTL Layout