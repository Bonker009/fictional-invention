import { PrismaClient, HolidayType } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

const fixedHolidays = [
  // Public Holidays
  {
    month: 1,
    day: 1,
    nameKh: 'ទិវាចូលឆ្នាំសកល',
    nameEn: 'International New Year Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebration of the new year according to the Gregorian calendar',
  },
  {
    month: 1,
    day: 7,
    nameKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    nameEn: 'Victory Day over Genocide',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Commemorates the end of the Khmer Rouge regime in 1979',
  },
  {
    month: 2,
    day: 7,
    nameKh: 'ទិវារដ្ឋធម្មនុញ្ញ',
    nameEn: 'Constitution Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Commemorates the promulgation of the Cambodian Constitution',
  },
  {
    month: 3,
    day: 8,
    nameKh: 'ទិវាអន្តរជាតិនារី',
    nameEn: 'International Women\'s Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebrates women\'s rights and achievements',
  },
  {
    month: 4,
    day: 14,
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ ថ្ងៃទី១',
    nameEn: 'Khmer New Year Day 1',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'First day of the traditional Cambodian New Year celebration',
  },
  {
    month: 4,
    day: 15,
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ ថ្ងៃទី២',
    nameEn: 'Khmer New Year Day 2',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Second day of the traditional Cambodian New Year celebration',
  },
  {
    month: 4,
    day: 16,
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ ថ្ងៃទី៣',
    nameEn: 'Khmer New Year Day 3',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Third day of the traditional Cambodian New Year celebration',
  },
  {
    month: 5,
    day: 1,
    nameKh: 'ទិវាពលកម្មអន្តរជាតិ',
    nameEn: 'International Labour Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebrates the achievements of workers',
  },
  {
    month: 5,
    day: 14,
    nameKh: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល',
    nameEn: 'Royal Ploughing Ceremony',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Traditional ceremony marking the beginning of the rice growing season',
  },
  {
    month: 5,
    day: 20,
    nameKh: 'ទិវារំលឹកខួបគុកម្មាឃាត',
    nameEn: 'Day of Remembrance',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Remembers victims of the Khmer Rouge regime',
  },
  {
    month: 6,
    day: 1,
    nameKh: 'ទិវាកុមារអន្តរជាតិ',
    nameEn: 'International Children\'s Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebrates children and their rights',
  },
  {
    month: 6,
    day: 18,
    nameKh: 'ព្រះរាជពិធីរំឭកព្រះរាជត្រណមជយន្តី សម្តេចព្រះមហាក្សត្រី',
    nameEn: 'Queen Mother\'s Birthday',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebrates the birthday of Queen Mother Norodom Monineath',
  },
  {
    month: 9,
    day: 24,
    nameKh: 'ទិវារដ្ឋធម្មនុញ្ញ',
    nameEn: 'Constitutional Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Anniversary of the adoption of the Constitution',
  },
  {
    month: 10,
    day: 15,
    nameKh: 'ទិវារំឭកព្រះករុណា ព្រះបាទសម្តេចព្រះ នរោត្តម សីហនុ',
    nameEn: 'King Father Commemoration Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Commemorates the late King Father Norodom Sihanouk',
  },
  {
    month: 10,
    day: 29,
    nameKh: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ',
    nameEn: 'Coronation Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebrates the coronation of King Norodom Sihamoni',
  },
  {
    month: 11,
    day: 9,
    nameKh: 'ទិវាឯករាជ្យជាតិ',
    nameEn: 'Independence Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebrates Cambodia\'s independence from France in 1953',
  },
  {
    month: 12,
    day: 10,
    nameKh: 'ទិវាសិទ្ធិមនុស្សអន្តរជាតិ',
    nameEn: 'International Human Rights Day',
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Commemorates the adoption of the Universal Declaration of Human Rights',
  },
];

const lunarHolidays = [
  {
    nameKh: 'មាឃបូជា',
    nameEn: 'Meak Bochea (Magha Puja)',
    lunarMonth: 3,
    lunarDay: 15,
    type: 'religious' as HolidayType,
    isPublicHoliday: true,
    description: 'Buddhist holy day commemorating the spontaneous gathering of 1,250 disciples',
  },
  {
    nameKh: 'វិសាខបូជា',
    nameEn: 'Visak Bochea (Vesak)',
    lunarMonth: 6,
    lunarDay: 15,
    type: 'holy' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebrates the birth, enlightenment, and death of Buddha',
  },
  {
    nameKh: 'ចូលវស្សា',
    nameEn: 'Buddhist Lent Begin (Chol Vassa)',
    lunarMonth: 8,
    lunarDay: 15,
    type: 'religious' as HolidayType,
    isPublicHoliday: false,
    description: 'Beginning of the Buddhist Lent period',
  },
  {
    nameKh: 'ភ្ជុំបិណ្ឌ',
    nameEn: 'Pchum Ben (Ancestors\' Day)',
    lunarMonth: 10,
    lunarDay: 15,
    type: 'religious' as HolidayType,
    isPublicHoliday: true,
    description: 'Festival honoring deceased ancestors, one of the most important Cambodian holidays',
  },
  {
    nameKh: 'ចេញវស្សា',
    nameEn: 'Buddhist Lent End (Choeung Vassa)',
    lunarMonth: 11,
    lunarDay: 15,
    type: 'religious' as HolidayType,
    isPublicHoliday: false,
    description: 'End of the Buddhist Lent period',
  },
  {
    nameKh: 'បុណ្យអុំទូក',
    nameEn: 'Water Festival (Bon Om Touk)',
    lunarMonth: 12,
    lunarDay: 15,
    type: 'public' as HolidayType,
    isPublicHoliday: true,
    description: 'Celebrates the reversal of the Tonle Sap river flow, with boat races and festivities',
  },
];

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.calculatedLunarDate.deleteMany();
  await prisma.lunarHoliday.deleteMany();
  await prisma.holiday.deleteMany();

  console.log('Cleared existing data');

  // Seed fixed holidays
  for (const holiday of fixedHolidays) {
    await prisma.holiday.create({
      data: {
        ...holiday,
        isRecurring: true,
      },
    });
  }

  console.log(`Seeded ${fixedHolidays.length} fixed holidays`);

  // Seed lunar holidays
  for (const lunarHoliday of lunarHolidays) {
    await prisma.lunarHoliday.create({
      data: lunarHoliday,
    });
  }

  console.log(`Seeded ${lunarHolidays.length} lunar holidays`);

  // Calculate lunar dates for years 2024-2030
  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  let calculatedCount = 0;

  for (const year of years) {
    const allLunarHolidays = await prisma.lunarHoliday.findMany();

    for (const lunarHoliday of allLunarHolidays) {
      // Simplified calculation - in production, use a proper lunar calendar library
      const approximateDate = calculateLunarDate(year, lunarHoliday.lunarMonth, lunarHoliday.lunarDay);

      await prisma.calculatedLunarDate.create({
        data: {
          lunarHolidayId: lunarHoliday.id,
          year,
          month: approximateDate.getMonth() + 1,
          day: approximateDate.getDate(),
          gregorianDate: approximateDate,
        },
      });

      calculatedCount++;
    }
  }

  console.log(`Calculated ${calculatedCount} lunar dates for years ${years.join(', ')}`);
  console.log('Database seed completed successfully!');
}

// Simplified lunar date calculation
function calculateLunarDate(year: number, lunarMonth: number, lunarDay: number): Date {
  const LUNAR_MONTH_DAYS = 29.53;
  
  // Approximate start of lunar year
  const lunarYearStart = new Date(year, 1, 1); // Roughly February
  
  const daysFromStart = (lunarMonth - 1) * LUNAR_MONTH_DAYS + lunarDay;
  const gregorianDate = new Date(lunarYearStart);
  gregorianDate.setDate(gregorianDate.getDate() + Math.floor(daysFromStart));
  
  return gregorianDate;
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

