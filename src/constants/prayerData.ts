import type { Lang } from '../hooks/useLanguage';

export const eventNames: Record<Lang, string[]> = {
  en: ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'],
  ar: ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء', 'منتصف الليل'],
  tr: ['Sabah', 'Güneş', 'Öğle', 'İkindi', 'Akşam', 'Yatsı', 'Gece Yarısı'],
  fr: ['Fajr', 'Lever du soleil', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Minuit'],
  ur: ['فجر', 'طلوع آفتاب', 'ظہر', 'عصر', 'مغرب', 'عشاء', 'آدھی رات'],
  id: ['Subuh', 'Terbit', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Tengah Malam'],
};

export const jumuahNames: Record<Lang, string> = {
  en: "Jumu'ah",
  ar: 'الجمعة',
  tr: 'Cuma',
  fr: "Jumu'ah",
  ur: 'جمعہ',
  id: 'Jumat',
};

// Weekday names (0 = Sunday, 6 = Saturday)
export const weekdayNames: Record<Lang, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ar: ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
  tr: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  ur: ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'],
  id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
};

export const alarmOptionsData: Array<{ value: number; label: Record<Lang, string> }> = [
  {
    value: 5,
    label: {
      en: '5 minutes before',
      ar: 'قبل 5 دقائق',
      tr: '5 dakika önce',
      fr: '5 minutes avant',
      ur: '5 منٹ پہلے',
      id: '5 menit sebelum',
    },
  },
  {
    value: 10,
    label: {
      en: '10 minutes before',
      ar: 'قبل 10 دقائق',
      tr: '10 dakika önce',
      fr: '10 minutes avant',
      ur: '10 منٹ پہلے',
      id: '10 menit sebelum',
    },
  },
  {
    value: 15,
    label: {
      en: '15 minutes before',
      ar: 'قبل 15 دقيقة',
      tr: '15 dakika önce',
      fr: '15 minutes avant',
      ur: '15 منٹ پہلے',
      id: '15 menit sebelum',
    },
  },
  {
    value: 30,
    label: {
      en: '30 minutes before',
      ar: 'قبل 30 دقيقة',
      tr: '30 dakika önce',
      fr: '30 minutes avant',
      ur: '30 منٹ پہلے',
      id: '30 menit sebelum',
    },
  },
  {
    value: 0,
    label: { en: 'At the time', ar: 'في الموعد', tr: 'Zamanında', fr: "À l'heure", ur: 'وقت پر', id: 'Tepat waktu' },
  },
  {
    value: -5,
    label: {
      en: '5 minutes after',
      ar: 'بعد 5 دقائق',
      tr: '5 dakika sonra',
      fr: '5 minutes après',
      ur: '5 منٹ بعد',
      id: '5 menit setelah',
    },
  },
  {
    value: -10,
    label: {
      en: '10 minutes after',
      ar: 'بعد 10 دقائق',
      tr: '10 dakika sonra',
      fr: '10 minutes après',
      ur: '10 منٹ بعد',
      id: '10 menit setelah',
    },
  },
];
