/**
 * Authentic du'a (supplications) for each prayer time.
 * Sources: Sahih Bukhari, Sahih Muslim, Fortress of the Muslim (Hisn al-Muslim).
 */

export interface Dua {
  ar: string;
  en: string;
}

export const prayerDuas: Record<string, Dua[]> = {
  Fajr: [
    {
      ar: 'اللّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
      en: 'O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds',
    },
    {
      ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
      en: 'We have entered the morning and the dominion belongs to Allah, and all praise is for Allah',
    },
  ],
  Sunrise: [
    {
      ar: 'لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
      en: 'None has the right to be worshipped but Allah alone, with no partner. His is the dominion and His is the praise, and He is Able to do all things',
    },
  ],
  Dhuhr: [
    {
      ar: 'اللّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
      en: 'O Allah, help me to remember You, thank You, and worship You in the best manner',
    },
  ],
  Asr: [
    {
      ar: 'أَسْتَغْفِرُ اللهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
      en: 'I seek the forgiveness of Allah, there is no god but He, the Living, the Sustainer, and I repent to Him',
    },
  ],
  Maghrib: [
    {
      ar: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
      en: 'We have entered the evening and the dominion belongs to Allah, and all praise is for Allah',
    },
    {
      ar: 'اللّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ وَأَعُوذُ بِكَ مِنْ شَرِّ هَذِهِ اللَّيْلَةِ',
      en: 'O Allah, I ask You for the good of this night and seek refuge in You from its evil',
    },
  ],
  Isha: [
    {
      ar: 'اللّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
      en: 'O Allah, in Your name I die and I live',
    },
  ],
  Midnight: [
    {
      ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
      en: 'Our Lord, give us good in this world and good in the Hereafter, and save us from the punishment of the Fire',
    },
  ],
};

/**
 * Get a du'a for a specific prayer, rotating by day of year for variety.
 */
export function getDuaForPrayer(prayerName: string, dayOfYear: number, lang: 'en' | 'ar'): string | null {
  const duas = prayerDuas[prayerName];
  if (!duas || duas.length === 0) return null;
  const dua = duas[dayOfYear % duas.length];
  return lang === 'ar' ? dua.ar : `${dua.ar}\n${dua.en}`;
}
