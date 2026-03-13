export interface Site {
  id: string;
  name: string;
  label: string;
  url: string;
}

export const SITES: Site[] = [
  { id: "all", name: "كل المواقع", label: "كل المواقع", url: "" },
  { id: "ferkous", name: "موقع الشيخ فركوس حفظه الله", label: "الشيخ فركوس", url: "https://ferkous.app" },
  { id: "al-badr", name: "موقع الشيخ عبد الرزاق البدر حفظه الله", label: "الشيخ عبد الرزاق البدر", url: "https://al-badr.net" },
  { id: "rslan", name: "موقع الشيخ رسلان حفظه الله", label: "الشيخ رسلان", url: "https://rslan.com" },
  { id: "dralfawzann", name: "موقع الشيخ الفوزان حفظه الله لهيئة كبار العلماء", label: "الشيخ الفوزان", url: "https://dralfawzann.com" },
  { id: "binbaz", name: "موقع الشيخ إبن باز رحمه الله", label: "الشيخ إبن باز", url: "https://binbaz.org.sa" },
  { id: "aluthaymeen", name: "موقع الشيخ إبن عثيمين رحمه الله لهيئة كبار العلماء", label: "الشيخ إبن عثيمين (هيئة)", url: "https://aluthaymeen.net" },
  { id: "binothaimeen", name: "موقع الشيخ إبن عثيمين رحمه الله", label: "الشيخ إبن عثيمين", url: "https://binothaimeen.net" },
  { id: "rabee", name: "موقع الشيخ ربيع بن هادي المدخلي رحمه الله", label: "الشيخ ربيع المدخلي", url: "https://rabee.net" },
  { id: "sualruhaily", name: "موقع الشيخ سليمان الرحيلي حفظه الله", label: "الشيخ سليمان الرحيلي", url: "https://www.sualruhaily.com" },
];
