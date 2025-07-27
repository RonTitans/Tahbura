// Hebrew UI strings for the inspection tracking system
export const HEBREW_STRINGS = {
  // General UI
  general: {
    loading: 'טוען...',
    saving: 'שומר...',
    submit: 'שלח',
    cancel: 'ביטול',
    save: 'שמור',
    edit: 'ערוך',
    delete: 'מחק',
    view: 'הצג',
    search: 'חיפוש',
    filter: 'סינון',
    refresh: 'רענן',
    export: 'ייצא',
    import: 'ייבא',
    yes: 'כן',
    no: 'לא',
    close: 'סגור',
    back: 'חזור'
  },

  // Navigation
  navigation: {
    dashboard: 'דשבורד',
    inspections: 'בדיקות',
    newInspection: 'בדיקה חדשה',
    reports: 'דוחות',
    settings: 'הגדרות',
    profile: 'פרופיל',
    logout: 'התנתק'
  },

  // Inspection Types
  inspectionTypes: {
    electrical: 'בדיקה חשמלית',
    plumbing: 'בדיקה סניטרית',
    hvac: 'בדיקת מיזוג אוויר',
    structural: 'בדיקה קונסטרוקטיבית',
    safety: 'בדיקת בטיחות',
    fire: 'בדיקת כיבוי אש',
    security: 'בדיקת אבטחה',
    network: 'בדיקת תקשורת'
  },

  // Inspection Status
  status: {
    pending: 'ממתין',
    inProgress: 'בביצוע',
    completed: 'הושלם',
    failed: 'נכשל',
    cancelled: 'בוטל',
    needsReview: 'נדרשת בדיקה חוזרת'
  },

  // Form Labels
  forms: {
    inspectionType: 'סוג בדיקה',
    building: 'בניין',
    floor: 'קומה',
    room: 'חדר',
    technician: 'טכנאי',
    scheduledDate: 'תאריך מתוכנן',
    completedDate: 'תאריך השלמה',
    notes: 'הערות',
    photos: 'תמונות',
    signature: 'חתימה',
    priority: 'עדיפות',
    duration: 'משך זמן (דקות)',
    tools: 'כלים נדרשים'
  },

  // Form Placeholders
  placeholders: {
    selectInspectionType: 'בחר סוג בדיקה',
    selectBuilding: 'בחר בניין',
    selectTechnician: 'בחר טכנאי',
    enterNotes: 'הוסף הערות נוספות...',
    searchInspections: 'חפש בדיקות...',
    filterByStatus: 'סנן לפי סטטוס',
    filterByBuilding: 'סנן לפי בניין',
    filterByDate: 'סנן לפי תאריך'
  },

  // Validation Messages
  validation: {
    required: 'שדה זה הוא חובה',
    email: 'כתובת אימייל לא תקינה',
    phone: 'מספר טלפון לא תקין',
    minLength: (min: number) => `נדרש לפחות ${min} תווים`,
    maxLength: (max: number) => `מקסימום ${max} תווים`,
    positiveNumber: 'נדרש מספר חיובי',
    dateInPast: 'התאריך חייב להיות בעבר',
    dateInFuture: 'התאריך חייב להיות בעתיד',
    invalidDate: 'תאריך לא תקין',
    imageRequired: 'חובה לצרף תמונה לבדיקה זו',
    signatureRequired: 'חובה לחתום על הבדיקה'
  },

  // Success Messages
  success: {
    inspectionCreated: 'הבדיקה נוצרה בהצלחה',
    inspectionUpdated: 'הבדיקה עודכנה בהצלחה',
    inspectionDeleted: 'הבדיקה נמחקה בהצלחה',
    inspectionCompleted: 'הבדיקה הושלמה בהצלחה',
    dataExported: 'הנתונים יוצאו בהצלחה',
    profileUpdated: 'הפרופיל עודכן בהצלחה'
  },

  // Error Messages
  errors: {
    general: 'אירעה שגיאה במערכת',
    networkError: 'שגיאת רשת - בדוק את החיבור לאינטרנט',
    unauthorized: 'אין הרשאה לביצוע פעולה זו',
    notFound: 'הפריט לא נמצא',
    serverError: 'שגיאת שרת פנימית',
    validationError: 'שגיאה בנתונים שהוזנו',
    uploadError: 'שגיאה בהעלאת הקובץ',
    exportError: 'שגיאה בייצוא הנתונים',
    offline: 'אין חיבור לרשת - הדיווח יישלח כשתתחבר',
    sessionExpired: 'תוקף ההתחברות פג, אנא התחבר מחדש'
  },

  // Dashboard
  dashboard: {
    title: 'דשבורד ניהול - קריית התקשוב',
    subtitle: 'מעקב בדיקות הנדסיות בזמן אמת',
    todayInspections: 'בדיקות היום',
    pendingInspections: 'בדיקות ממתינות',
    completedInspections: 'בדיקות שהושלמו',
    failedInspections: 'בדיקות שנכשלו',
    recentInspections: 'בדיקות אחרונות',
    upcomingInspections: 'בדיקות קרובות',
    overdueInspections: 'בדיקות באיחור',
    completionRate: 'אחוז השלמה',
    averageDuration: 'משך זמן ממוצע'
  },

  // Table Headers
  table: {
    inspectionId: 'מזהה בדיקה',
    type: 'סוג בדיקה',
    building: 'בניין',
    technician: 'טכנאי',
    status: 'סטטוס',
    scheduledDate: 'תאריך מתוכנן',
    completedDate: 'תאריך השלמה',
    duration: 'משך זמן',
    priority: 'עדיפות',
    actions: 'פעולות'
  },

  // Mobile App
  mobile: {
    newInspection: 'בדיקה הנדסית חדשה',
    takePhoto: 'צלם תמונה',
    addPhoto: 'צרף תמונה',
    saveInspection: 'שמור בדיקה',
    photosSelected: (count: number) => `נבחרו ${count} תמונות`,
    offlineMode: 'מצב לא מקוון',
    syncPending: 'הבדיקה תישלח כשתתחבר לרשת'
  },

  // Date & Time
  dateTime: {
    today: 'היום',
    yesterday: 'אתמול',
    tomorrow: 'מחר',
    thisWeek: 'השבוע',
    thisMonth: 'החודש',
    lastWeek: 'השבוע שעבר',
    lastMonth: 'החודש שעבר',
    days: ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'],
    months: [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ]
  },

  // Priority Levels
  priority: {
    low: 'נמוכה',
    medium: 'בינונית',
    high: 'גבוהה',
    urgent: 'דחופה'
  },

  // Building Types
  buildingTypes: {
    office: 'משרדים',
    datacenter: 'מרכז נתונים',
    warehouse: 'מחסן',
    laboratory: 'מעבדה',
    production: 'ייצור',
    utilities: 'תשתיות'
  },

  // Export/Reports
  export: {
    exportToExcel: 'ייצא לאקסל',
    exportToPdf: 'ייצא ל-PDF',
    printReport: 'הדפס דוח',
    detailedReport: 'דוח מפורט',
    summaryReport: 'דוח סיכום',
    dateRange: 'טווח תאריכים',
    selectPeriod: 'בחר תקופה'
  },

  // Empty States
  empty: {
    noInspections: 'אין בדיקות להצגה',
    noResults: 'לא נמצאו תוצאות',
    noData: 'אין נתונים להצגה',
    noPhotos: 'לא צורפו תמונות',
    createFirst: 'צור את הבדיקה הראשונה'
  },

  // Confirmation Messages
  confirm: {
    deleteInspection: 'האם אתה בטוח שברצונך למחוק את הבדיקה?',
    cancelInspection: 'האם אתה בטוח שברצונך לבטל את הבדיקה?',
    completeInspection: 'האם אתה בטוח שברצונך לסמן את הבדיקה כמושלמת?',
    logout: 'האם אתה בטוח שברצונך להתנתק?',
    unsavedChanges: 'יש לך שינויים שלא נשמרו. האם אתה בטוח שברצונך לצאת?'
  }
} as const;

// Type for Hebrew strings
export type HebrewStringsType = typeof HEBREW_STRINGS;