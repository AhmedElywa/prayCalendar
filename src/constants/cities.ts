export interface City {
  slug: string;
  name: { en: string; ar: string };
  country: { en: string; ar: string };
  flag: string; // Country flag emoji
  latitude: number;
  longitude: number;
  timezone: string;
  method: number; // AlAdhan calculation method
  population?: number; // for sorting
}

export const cities: City[] = [
  // Egypt
  {
    slug: 'cairo',
    name: { en: 'Cairo', ar: 'القاهرة' },
    country: { en: 'Egypt', ar: 'مصر' },
    flag: '🇪🇬',
    latitude: 30.0444,
    longitude: 31.2357,
    timezone: 'Africa/Cairo',
    method: 5,
    population: 21000000,
  },
  {
    slug: 'alexandria',
    name: { en: 'Alexandria', ar: 'الإسكندرية' },
    country: { en: 'Egypt', ar: 'مصر' },
    flag: '🇪🇬',
    latitude: 31.2001,
    longitude: 29.9187,
    timezone: 'Africa/Cairo',
    method: 5,
    population: 5200000,
  },
  {
    slug: 'giza',
    name: { en: 'Giza', ar: 'الجيزة' },
    country: { en: 'Egypt', ar: 'مصر' },
    flag: '🇪🇬',
    latitude: 30.0131,
    longitude: 31.2089,
    timezone: 'Africa/Cairo',
    method: 5,
    population: 4000000,
  },

  // Saudi Arabia
  {
    slug: 'makkah',
    name: { en: 'Makkah', ar: 'مكة المكرمة' },
    country: { en: 'Saudi Arabia', ar: 'السعودية' },
    flag: '🇸🇦',
    latitude: 21.4225,
    longitude: 39.8262,
    timezone: 'Asia/Riyadh',
    method: 4,
    population: 2000000,
  },
  {
    slug: 'madinah',
    name: { en: 'Madinah', ar: 'المدينة المنورة' },
    country: { en: 'Saudi Arabia', ar: 'السعودية' },
    flag: '🇸🇦',
    latitude: 24.4539,
    longitude: 39.6142,
    timezone: 'Asia/Riyadh',
    method: 4,
    population: 1500000,
  },
  {
    slug: 'riyadh',
    name: { en: 'Riyadh', ar: 'الرياض' },
    country: { en: 'Saudi Arabia', ar: 'السعودية' },
    flag: '🇸🇦',
    latitude: 24.7136,
    longitude: 46.6753,
    timezone: 'Asia/Riyadh',
    method: 4,
    population: 7600000,
  },
  {
    slug: 'jeddah',
    name: { en: 'Jeddah', ar: 'جدة' },
    country: { en: 'Saudi Arabia', ar: 'السعودية' },
    flag: '🇸🇦',
    latitude: 21.5433,
    longitude: 39.1728,
    timezone: 'Asia/Riyadh',
    method: 4,
    population: 4700000,
  },

  // UAE
  {
    slug: 'dubai',
    name: { en: 'Dubai', ar: 'دبي' },
    country: { en: 'UAE', ar: 'الإمارات' },
    flag: '🇦🇪',
    latitude: 25.2048,
    longitude: 55.2708,
    timezone: 'Asia/Dubai',
    method: 8,
    population: 3500000,
  },
  {
    slug: 'abu-dhabi',
    name: { en: 'Abu Dhabi', ar: 'أبوظبي' },
    country: { en: 'UAE', ar: 'الإمارات' },
    flag: '🇦🇪',
    latitude: 24.4539,
    longitude: 54.3773,
    timezone: 'Asia/Dubai',
    method: 8,
    population: 1500000,
  },

  // Turkey
  {
    slug: 'istanbul',
    name: { en: 'Istanbul', ar: 'إسطنبول' },
    country: { en: 'Turkey', ar: 'تركيا' },
    flag: '🇹🇷',
    latitude: 41.0082,
    longitude: 28.9784,
    timezone: 'Europe/Istanbul',
    method: 13,
    population: 15500000,
  },
  {
    slug: 'ankara',
    name: { en: 'Ankara', ar: 'أنقرة' },
    country: { en: 'Turkey', ar: 'تركيا' },
    flag: '🇹🇷',
    latitude: 39.9334,
    longitude: 32.8597,
    timezone: 'Europe/Istanbul',
    method: 13,
    population: 5700000,
  },

  // Morocco
  {
    slug: 'casablanca',
    name: { en: 'Casablanca', ar: 'الدار البيضاء' },
    country: { en: 'Morocco', ar: 'المغرب' },
    flag: '🇲🇦',
    latitude: 33.5731,
    longitude: -7.5898,
    timezone: 'Africa/Casablanca',
    method: 21,
    population: 3700000,
  },
  {
    slug: 'rabat',
    name: { en: 'Rabat', ar: 'الرباط' },
    country: { en: 'Morocco', ar: 'المغرب' },
    flag: '🇲🇦',
    latitude: 34.0209,
    longitude: -6.8417,
    timezone: 'Africa/Casablanca',
    method: 21,
    population: 1900000,
  },

  // Indonesia
  {
    slug: 'jakarta',
    name: { en: 'Jakarta', ar: 'جاكرتا' },
    country: { en: 'Indonesia', ar: 'إندونيسيا' },
    flag: '🇮🇩',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
    method: 20,
    population: 10500000,
  },

  // Malaysia
  {
    slug: 'kuala-lumpur',
    name: { en: 'Kuala Lumpur', ar: 'كوالالمبور' },
    country: { en: 'Malaysia', ar: 'ماليزيا' },
    flag: '🇲🇾',
    latitude: 3.139,
    longitude: 101.6869,
    timezone: 'Asia/Kuala_Lumpur',
    method: 17,
    population: 8000000,
  },

  // Pakistan
  {
    slug: 'karachi',
    name: { en: 'Karachi', ar: 'كراتشي' },
    country: { en: 'Pakistan', ar: 'باكستان' },
    flag: '🇵🇰',
    latitude: 24.8607,
    longitude: 67.0011,
    timezone: 'Asia/Karachi',
    method: 1,
    population: 16000000,
  },
  {
    slug: 'lahore',
    name: { en: 'Lahore', ar: 'لاهور' },
    country: { en: 'Pakistan', ar: 'باكستان' },
    flag: '🇵🇰',
    latitude: 31.5204,
    longitude: 74.3587,
    timezone: 'Asia/Karachi',
    method: 1,
    population: 13000000,
  },
  {
    slug: 'islamabad',
    name: { en: 'Islamabad', ar: 'إسلام آباد' },
    country: { en: 'Pakistan', ar: 'باكستان' },
    flag: '🇵🇰',
    latitude: 33.6844,
    longitude: 73.0479,
    timezone: 'Asia/Karachi',
    method: 1,
    population: 1100000,
  },

  // Bangladesh
  {
    slug: 'dhaka',
    name: { en: 'Dhaka', ar: 'دكا' },
    country: { en: 'Bangladesh', ar: 'بنغلاديش' },
    flag: '🇧🇩',
    latitude: 23.8103,
    longitude: 90.4125,
    timezone: 'Asia/Dhaka',
    method: 1,
    population: 22000000,
  },

  // India
  {
    slug: 'mumbai',
    name: { en: 'Mumbai', ar: 'مومباي' },
    country: { en: 'India', ar: 'الهند' },
    flag: '🇮🇳',
    latitude: 19.076,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    method: 1,
    population: 21000000,
  },
  {
    slug: 'delhi',
    name: { en: 'Delhi', ar: 'دلهي' },
    country: { en: 'India', ar: 'الهند' },
    flag: '🇮🇳',
    latitude: 28.7041,
    longitude: 77.1025,
    timezone: 'Asia/Kolkata',
    method: 1,
    population: 19000000,
  },
  {
    slug: 'hyderabad',
    name: { en: 'Hyderabad', ar: 'حيدر آباد' },
    country: { en: 'India', ar: 'الهند' },
    flag: '🇮🇳',
    latitude: 17.385,
    longitude: 78.4867,
    timezone: 'Asia/Kolkata',
    method: 1,
    population: 10000000,
  },

  // UK
  {
    slug: 'london',
    name: { en: 'London', ar: 'لندن' },
    country: { en: 'UK', ar: 'بريطانيا' },
    flag: '🇬🇧',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
    method: 12,
    population: 9000000,
  },
  {
    slug: 'birmingham',
    name: { en: 'Birmingham', ar: 'برمنغهام' },
    country: { en: 'UK', ar: 'بريطانيا' },
    flag: '🇬🇧',
    latitude: 52.4862,
    longitude: -1.8904,
    timezone: 'Europe/London',
    method: 12,
    population: 1150000,
  },

  // USA
  {
    slug: 'new-york',
    name: { en: 'New York', ar: 'نيويورك' },
    country: { en: 'USA', ar: 'أمريكا' },
    flag: '🇺🇸',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
    method: 2,
    population: 8300000,
  },
  {
    slug: 'los-angeles',
    name: { en: 'Los Angeles', ar: 'لوس أنجلوس' },
    country: { en: 'USA', ar: 'أمريكا' },
    flag: '🇺🇸',
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: 'America/Los_Angeles',
    method: 2,
    population: 3900000,
  },
  {
    slug: 'chicago',
    name: { en: 'Chicago', ar: 'شيكاغو' },
    country: { en: 'USA', ar: 'أمريكا' },
    flag: '🇺🇸',
    latitude: 41.8781,
    longitude: -87.6298,
    timezone: 'America/Chicago',
    method: 2,
    population: 2700000,
  },
  {
    slug: 'houston',
    name: { en: 'Houston', ar: 'هيوستن' },
    country: { en: 'USA', ar: 'أمريكا' },
    flag: '🇺🇸',
    latitude: 29.7604,
    longitude: -95.3698,
    timezone: 'America/Chicago',
    method: 2,
    population: 2300000,
  },
  {
    slug: 'detroit',
    name: { en: 'Detroit', ar: 'ديترويت' },
    country: { en: 'USA', ar: 'أمريكا' },
    flag: '🇺🇸',
    latitude: 42.3314,
    longitude: -83.0458,
    timezone: 'America/Detroit',
    method: 2,
    population: 640000,
  },

  // Canada
  {
    slug: 'toronto',
    name: { en: 'Toronto', ar: 'تورنتو' },
    country: { en: 'Canada', ar: 'كندا' },
    flag: '🇨🇦',
    latitude: 43.6532,
    longitude: -79.3832,
    timezone: 'America/Toronto',
    method: 2,
    population: 2900000,
  },

  // Germany
  {
    slug: 'berlin',
    name: { en: 'Berlin', ar: 'برلين' },
    country: { en: 'Germany', ar: 'ألمانيا' },
    flag: '🇩🇪',
    latitude: 52.52,
    longitude: 13.405,
    timezone: 'Europe/Berlin',
    method: 3,
    population: 3700000,
  },

  // France
  {
    slug: 'paris',
    name: { en: 'Paris', ar: 'باريس' },
    country: { en: 'France', ar: 'فرنسا' },
    flag: '🇫🇷',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
    method: 12,
    population: 2200000,
  },

  // Nigeria
  {
    slug: 'lagos',
    name: { en: 'Lagos', ar: 'لاغوس' },
    country: { en: 'Nigeria', ar: 'نيجيريا' },
    flag: '🇳🇬',
    latitude: 6.5244,
    longitude: 3.3792,
    timezone: 'Africa/Lagos',
    method: 3,
    population: 15000000,
  },

  // Iraq
  {
    slug: 'baghdad',
    name: { en: 'Baghdad', ar: 'بغداد' },
    country: { en: 'Iraq', ar: 'العراق' },
    flag: '🇮🇶',
    latitude: 33.3152,
    longitude: 44.3661,
    timezone: 'Asia/Baghdad',
    method: 3,
    population: 8000000,
  },

  // Jordan
  {
    slug: 'amman',
    name: { en: 'Amman', ar: 'عمّان' },
    country: { en: 'Jordan', ar: 'الأردن' },
    flag: '🇯🇴',
    latitude: 31.9454,
    longitude: 35.9284,
    timezone: 'Asia/Amman',
    method: 23,
    population: 4000000,
  },

  // Kuwait
  {
    slug: 'kuwait-city',
    name: { en: 'Kuwait City', ar: 'مدينة الكويت' },
    country: { en: 'Kuwait', ar: 'الكويت' },
    flag: '🇰🇼',
    latitude: 29.3759,
    longitude: 47.9774,
    timezone: 'Asia/Kuwait',
    method: 9,
    population: 3000000,
  },

  // Qatar
  {
    slug: 'doha',
    name: { en: 'Doha', ar: 'الدوحة' },
    country: { en: 'Qatar', ar: 'قطر' },
    flag: '🇶🇦',
    latitude: 25.2854,
    longitude: 51.531,
    timezone: 'Asia/Qatar',
    method: 10,
    population: 2400000,
  },

  // Tunisia
  {
    slug: 'tunis',
    name: { en: 'Tunis', ar: 'تونس' },
    country: { en: 'Tunisia', ar: 'تونس' },
    flag: '🇹🇳',
    latitude: 36.8065,
    longitude: 10.1815,
    timezone: 'Africa/Tunis',
    method: 18,
    population: 2700000,
  },

  // Algeria
  {
    slug: 'algiers',
    name: { en: 'Algiers', ar: 'الجزائر' },
    country: { en: 'Algeria', ar: 'الجزائر' },
    flag: '🇩🇿',
    latitude: 36.7538,
    longitude: 3.0588,
    timezone: 'Africa/Algiers',
    method: 19,
    population: 3900000,
  },

  // Singapore
  {
    slug: 'singapore',
    name: { en: 'Singapore', ar: 'سنغافورة' },
    country: { en: 'Singapore', ar: 'سنغافورة' },
    flag: '🇸🇬',
    latitude: 1.3521,
    longitude: 103.8198,
    timezone: 'Asia/Singapore',
    method: 11,
    population: 5900000,
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
