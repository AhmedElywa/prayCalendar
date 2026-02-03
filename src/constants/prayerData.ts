export const eventNames = {
  en: ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Midnight'],
  ar: ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء', 'منتصف الليل'],
};

export const jumuahNames = {
  en: "Jumu'ah",
  ar: 'الجمعة',
};

export const alarmOptionsData = [
  { value: 5, label: { en: '5 minutes before', ar: 'قبل 5 دقائق' } },
  { value: 10, label: { en: '10 minutes before', ar: 'قبل 10 دقائق' } },
  { value: 15, label: { en: '15 minutes before', ar: 'قبل 15 دقيقة' } },
  { value: 30, label: { en: '30 minutes before', ar: 'قبل 30 دقيقة' } },
  { value: 0, label: { en: 'In the time', ar: 'في الموعد' } },
  { value: -5, label: { en: '5 minutes after', ar: 'بعد 5 دقائق' } },
  { value: -10, label: { en: '10 minutes after', ar: 'بعد 10 دقائق' } },
];
