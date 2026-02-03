import type { Lang } from '../hooks/useLanguage';

// Helper to get label with fallback to English
type MethodLabel = { en: string; ar: string; [key: string]: string };
export type MethodEntry = { value: number; label: MethodLabel };

export function getMethodLabel(label: MethodLabel, lang: Lang): string {
  return label[lang] || label.en;
}

const methods: MethodEntry[] = [
  { value: 0, label: { en: 'Shia Ithna-Ansari', ar: 'الشيعة الإثنا عشرية' } },
  { value: 1, label: { en: 'University of Islamic Sciences, Karachi', ar: 'جامعة العلوم الإسلامية، كراتشي' } },
  { value: 2, label: { en: 'Islamic Society of North America', ar: 'الجمعية الإسلامية لأمريكا الشمالية' } },
  { value: 3, label: { en: 'Muslim World League', ar: 'رابطة العالم الإسلامي' } },
  { value: 4, label: { en: 'Umm Al-Qura University, Makkah', ar: 'جامعة أم القرى، مكة' } },
  { value: 5, label: { en: 'Egyptian General Authority of Survey', ar: 'الهيئة المصرية العامة للمساحة' } },
  { value: 7, label: { en: 'Institute of Geophysics, University of Tehran', ar: 'معهد الجيوفيزياء، جامعة طهران' } },
  { value: 8, label: { en: 'Gulf Region', ar: 'دول الخليج' } },
  { value: 9, label: { en: 'Kuwait', ar: 'الكويت' } },
  { value: 10, label: { en: 'Qatar', ar: 'قطر' } },
  { value: 11, label: { en: 'Majlis Ugama Islam Singapura, Singapore', ar: 'مجلس علماء الإسلام السنغافوري' } },
  { value: 12, label: { en: 'Union Organization islamic de France', ar: 'اتحاد المنظمات الإسلامية في فرنسا' } },
  { value: 13, label: { en: 'Diyanet İşleri Başkanlığı, Turkey', ar: 'رئاسة الشؤون الدينية، تركيا' } },
  { value: 14, label: { en: 'Spiritual Administration of Muslims of Russia', ar: 'الإدارة الدينية لمسلمي روسيا' } },
  {
    value: 15,
    label: {
      en: 'Moonsighting Committee Worldwide (also requires shafaq paramteer)',
      ar: 'لجنة تحري الهلال العالمية (تتطلب أيضاً معامل الشفق)',
    },
  },
  { value: 16, label: { en: 'Dubai (experimental)', ar: 'دبي (تجريبي)' } },
  { value: 17, label: { en: 'Jabatan Kemajuan Islam Malaysia (JAKIM)', ar: 'إدارة تنمية الإسلام الماليزية (جاكيم)' } },
  { value: 18, label: { en: 'Tunisia', ar: 'تونس' } },
  { value: 19, label: { en: 'Algeria', ar: 'الجزائر' } },
  {
    value: 20,
    label: { en: 'KEMENAG - Kementerian Agama Republik Indonesia', ar: 'وزارة الشؤون الدينية الإندونيسية' },
  },
  { value: 21, label: { en: 'Morocco', ar: 'المغرب' } },
  { value: 22, label: { en: 'Comunidade Islamica de Lisboa', ar: 'الجالية الإسلامية في لشبونة' } },
  {
    value: 23,
    label: {
      en: 'Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan',
      ar: 'وزارة الأوقاف والشؤون والمقدسات الإسلامية، الأردن',
    },
  },
];

export default methods;
