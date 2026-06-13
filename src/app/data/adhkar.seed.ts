import { Adhkar } from "../models/adhkar.model";

export const ADHKAR_SEED: Adhkar[] = [
  {
    id: "morning-001",
    category: "Morning",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ",
    transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah.",
    translation:
      "We have entered the morning and the dominion belongs to Allah; all praise is for Allah.",
    source: "Morning adhkar",
  },
  {
    id: "morning-002",
    category: "Morning",
    arabic:
      "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration:
      "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namut, wa ilaykan-nushur.",
    translation:
      "O Allah, by You we enter the morning and evening, by You we live and die, and to You is the resurrection.",
    source: "Tirmidhi",
  },
  {
    id: "evening-001",
    category: "Evening",
    arabic: "أَمْسَيْنَا وَأَمْسَى المُلْكُ لِلَّهِ، وَالحَمْدُ لِلَّهِ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah.",
    translation:
      "We have entered the evening and the dominion belongs to Allah; all praise is for Allah.",
    source: "Evening adhkar",
  },
  {
    id: "evening-002",
    category: "Evening",
    arabic:
      "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ المَصِيرُ",
    transliteration:
      "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namut, wa ilaykal-masir.",
    translation:
      "O Allah, by You we enter the evening and morning, by You we live and die, and to You is the return.",
    source: "Tirmidhi",
  },
  {
    id: "after-prayer-001",
    category: "After Prayers",
    arabic: "أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ",
    transliteration: "Astaghfirullah, Astaghfirullah, Astaghfirullah.",
    translation:
      "I seek Allah’s forgiveness. I seek Allah’s forgiveness. I seek Allah’s forgiveness.",
    source: "Muslim",
  },
  {
    id: "after-prayer-002",
    category: "After Prayers",
    arabic:
      "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الجَلَالِ وَالإِكْرَامِ",
    transliteration:
      "Allahumma Antas-Salam wa minkas-salam, tabarakta ya dhal-jalali wal-ikram.",
    translation:
      "O Allah, You are Peace and from You comes peace. Blessed are You, Owner of majesty and honour.",
    source: "Muslim",
  },
  {
    id: "sleep-001",
    category: "Before Sleep",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: "In Your name, O Allah, I die and I live.",
    source: "Bukhari",
  },
  {
    id: "daily-001",
    category: "Daily",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "SubhanAllahi wa bihamdih.",
    translation: "Glory is to Allah and praise is to Him.",
    source: "Bukhari and Muslim",
  },
  {
    id: "daily-002",
    category: "Daily",
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah.",
    translation: "There is no power and no strength except with Allah.",
    source: "Bukhari and Muslim",
  },
  {
  id: 'astaghfirullah',
  arabic: 'أَسْتَغْفِرُ اللَّهَ',
  transliteration: 'Astaghfirullah.',
  translation: 'I seek Allah’s forgiveness.',
  category: 'Daily',
  source: 'Common dhikr',
  favourite: false,
  custom: false
},
{
  id: 'subhan-allahi-wa-bihamdih',
  arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
  transliteration: 'Subhan Allahi wa bihamdih.',
  translation: 'Glory is to Allah and praise is to Him.',
  category: 'Daily',
  source: 'Bukhari and Muslim',
  favourite: false,
  custom: false
},
{
  id: 'alhamdulillah',
  arabic: 'الْحَمْدُ لِلَّهِ',
  transliteration: 'Alhamdu lillah.',
  translation: 'All praise is due to Allah.',
  category: 'Daily',
  source: 'Qur’an 1:2',
  favourite: false,
  custom: false
},
{
  id: 'la-ilaha-illa-allah',
  arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
  transliteration: 'La ilaha illa Allah.',
  translation: 'There is no god worthy of worship except Allah.',
  category: 'Daily',
  source: 'Common dhikr',
  favourite: false,
  custom: false
},
{
  id: 'la-hawla-wa-la-quwwata',
  arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
  transliteration: 'La hawla wa la quwwata illa billah.',
  translation: 'There is no power and no strength except with Allah.',
  category: 'Daily',
  source: 'Bukhari and Muslim',
  favourite: false,
  custom: false
},
{
  id: 'salawat',
  arabic: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
  transliteration: 'Allahumma salli wa sallim ‘ala nabiyyina Muhammad.',
  translation: 'O Allah, send prayers and peace upon our Prophet Muhammad.',
  category: 'Daily',
  source: 'Common salawat',
  favourite: false,
  custom: false
},
{
  id: 'allahumma-a-inni',
  arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
  transliteration: 'Allahumma a‘inni ‘ala dhikrika wa shukrika wa husni ‘ibadatik.',
  translation: 'O Allah, help me remember You, thank You, and worship You in the best way.',
  category: 'Daily',
  source: 'Abu Dawud and An-Nasa’i',
  favourite: false,
  custom: false
}
];
