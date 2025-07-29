// Hebrew date and number formatting utilities

/**
 * Format date in Hebrew/Israeli format (DD/MM/YYYY)
 */
export const formatHebrewDate = (date: Date): string => {
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

/**
 * Format date and time in Hebrew/Israeli format
 */
export const formatHebrewDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Format number in Hebrew/Israeli format with thousands separator
 */
export const formatHebrewNumber = (num: number): string => {
  return new Intl.NumberFormat('he-IL').format(num);
};

/**
 * Format currency in Israeli Shekels
 */
export const formatHebrewCurrency = (amount: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS'
  }).format(amount);
};

/**
 * Get Hebrew day name
 */
export const getHebrewDayName = (date: Date): string => {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  return days[date.getDay()];
};

/**
 * Get Hebrew month name
 */
export const getHebrewMonthName = (date: Date): string => {
  const months = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];
  return months[date.getMonth()];
};

/**
 * Parse Hebrew date string (DD/MM/YYYY) to Date object
 */
export const parseHebrewDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Get relative time in Hebrew (e.g., "לפני שעה", "בעוד יומיים")
 */
export const getHebrewRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (Math.abs(diffDays) >= 1) {
    if (diffDays > 0) {
      return diffDays === 1 ? 'מחר' : `בעוד ${diffDays} ימים`;
    } else {
      return diffDays === -1 ? 'אתמול' : `לפני ${Math.abs(diffDays)} ימים`;
    }
  }

  if (Math.abs(diffHours) >= 1) {
    if (diffHours > 0) {
      return diffHours === 1 ? 'בעוד שעה' : `בעוד ${diffHours} שעות`;
    } else {
      return diffHours === -1 ? 'לפני שעה' : `לפני ${Math.abs(diffHours)} שעות`;
    }
  }

  if (Math.abs(diffMinutes) >= 1) {
    if (diffMinutes > 0) {
      return diffMinutes === 1 ? 'בעוד דקה' : `בעוד ${diffMinutes} דקות`;
    } else {
      return diffMinutes === -1 ? 'לפני דקה' : `לפני ${Math.abs(diffMinutes)} דקות`;
    }
  }

  return 'עכשיו';
};

/**
 * Format duration in Hebrew (e.g., "45 דקות", "2 שעות ו-30 דקות")
 */
export const formatHebrewDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} דקות`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return hours === 1 ? 'שעה' : `${hours} שעות`;
  }

  const hoursText = hours === 1 ? 'שעה' : `${hours} שעות`;
  const minutesText = `${remainingMinutes} דקות`;

  return `${hoursText} ו-${minutesText}`;
};

/**
 * Check if text contains Hebrew characters
 */
export const isHebrewText = (text: string): boolean => {
  const hebrewRegex = /[\u0590-\u05FF]/;
  return hebrewRegex.test(text);
};

/**
 * Clean Hebrew text for search (remove diacritics, normalize)
 */
export const normalizeHebrewText = (text: string): string => {
  return text
    .replace(/[\u0591-\u05C7]/g, '') // Remove Hebrew diacritics
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .toLowerCase();
};

/**
 * Convert English digits to Hebrew digits (optional display feature)
 */
export const toHebrewDigits = (text: string): string => {
  const hebrewDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return text.replace(/[0-9]/g, (digit) => hebrewDigits[parseInt(digit)]);
};

/**
 * Format percentage in Hebrew
 */
export const formatHebrewPercentage = (value: number): string => {
  return `${formatHebrewNumber(Math.round(value))}%`;
};

/**
 * Get Hebrew ordinal number (ראשון, שני, שלישי, etc.)
 */
export const getHebrewOrdinal = (num: number): string => {
  const ordinals: { [key: number]: string } = {
    1: 'ראשון',
    2: 'שני', 
    3: 'שלישי',
    4: 'רביעי',
    5: 'חמישי',
    6: 'שישי',
    7: 'שביעי',
    8: 'שמיני',
    9: 'תשיעי',
    10: 'עשירי'
  };

  return ordinals[num] || `${num}`;
};

/**
 * Format time range in Hebrew
 */
export const formatHebrewTimeRange = (startTime: Date, endTime: Date): string => {
  const start = new Intl.DateTimeFormat('he-IL', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(startTime);

  const end = new Intl.DateTimeFormat('he-IL', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(endTime);

  return `${start} - ${end}`;
};