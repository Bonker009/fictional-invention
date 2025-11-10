import { pool } from './pool';
import { logger } from '../logging/logger';
import dotenv from 'dotenv';

dotenv.config();

interface HolidayData {
  month: number;
  day: number;
  nameKh: string;
  nameEn: string;
  type: 'public' | 'religious';
  isPublicHoliday: boolean;
  description: string;
}

const holidays: HolidayData[] = [
  {
    month: 1,
    day: 1,
    nameKh: 'ទិវាចូលឆ្នាំសាកល',
    nameEn: 'International New Year Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'International New Year celebration',
  },
  {
    month: 1,
    day: 7,
    nameKh: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    nameEn: 'Victory over Genocide Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'Commemoration of the end of the Khmer Rouge regime',
  },
  {
    month: 3,
    day: 8,
    nameKh: 'ទិវាអន្តរជាតិនារី',
    nameEn: 'International Women\'s Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'International Women\'s Rights Day',
  },
  {
    month: 4,
    day: 14,
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ',
    nameEn: 'Khmer New Year',
    type: 'public',
    isPublicHoliday: true,
    description: 'Traditional Cambodian New Year celebration - Day 1',
  },
  {
    month: 4,
    day: 15,
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ',
    nameEn: 'Khmer New Year',
    type: 'public',
    isPublicHoliday: true,
    description: 'Traditional Cambodian New Year celebration - Day 2',
  },
  {
    month: 4,
    day: 16,
    nameKh: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ',
    nameEn: 'Khmer New Year',
    type: 'public',
    isPublicHoliday: true,
    description: 'Traditional Cambodian New Year celebration - Day 3',
  },
  {
    month: 5,
    day: 1,
    nameKh: 'ទិវាកម្មករអន្តរជាតិ',
    nameEn: 'International Labor Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'International Workers\' Day',
  },
  {
    month: 5,
    day: 14,
    nameKh: 'ព្រះជន្មលើវត្រព្រះស្តេចនរោត្តម សីហមុនី',
    nameEn: 'Royal Birthday of King Norodom Sihamoni',
    type: 'public',
    isPublicHoliday: true,
    description: 'Birthday of King Norodom Sihamoni',
  },
  {
    month: 5,
    day: 20,
    nameKh: 'ទិវាជាតិនៃការចងចាំ',
    nameEn: 'National Day of Remembrance',
    type: 'public',
    isPublicHoliday: false,
    description: 'Day of Anger - Remembrance of Khmer Rouge victims',
  },
  {
    month: 6,
    day: 1,
    nameKh: 'ទិវាកុមារអន្តរជាតិ',
    nameEn: 'International Children\'s Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'International Children\'s Day',
  },
  {
    month: 6,
    day: 18,
    nameKh: 'ព្រះជន្មរាជិនី នរោត្តម មុនិនាថ សីហនុ',
    nameEn: 'Birthday of Queen Mother Norodom Monineath',
    type: 'public',
    isPublicHoliday: true,
    description: 'Birthday of Her Majesty Queen Mother',
  },
  {
    month: 9,
    day: 24,
    nameKh: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ',
    nameEn: 'Constitution Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'Adoption of the Constitution Day',
  },
  {
    month: 10,
    day: 15,
    nameKh: 'ទិវាអនុស្សាវរីយ៍ព្រះករុណាព្រះបាទ នរោត្តម សីហនុ',
    nameEn: 'Commemoration Day of King-Father Norodom Sihanouk',
    type: 'public',
    isPublicHoliday: true,
    description: 'Remembrance Day of Late King-Father Norodom Sihanouk',
  },
  {
    month: 10,
    day: 29,
    nameKh: 'ទិវាគោរពព្រះសង្ឃ',
    nameEn: 'Coronation Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'Coronation Day of King Norodom Sihamoni',
  },
  {
    month: 11,
    day: 9,
    nameKh: 'ទិវាឯករាជ្យជាតិ',
    nameEn: 'National Independence Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'Independence Day from France (1953)',
  },
  {
    month: 12,
    day: 10,
    nameKh: 'ទិវាសិទ្ធិមនុស្សអន្តរជាតិ',
    nameEn: 'International Human Rights Day',
    type: 'public',
    isPublicHoliday: true,
    description: 'United Nations Human Rights Day',
  },
];

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    logger.info('Starting database seeding...');
    
    // Clear existing data
    await client.query('DELETE FROM holidays');
    logger.info('Cleared existing holiday data');
    
    // Insert holidays
    for (const holiday of holidays) {
      await client.query(
        `INSERT INTO holidays (month, day, name_kh, name_en, type, is_public_holiday, description, year)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NULL)`,
        [
          holiday.month,
          holiday.day,
          holiday.nameKh,
          holiday.nameEn,
          holiday.type,
          holiday.isPublicHoliday,
          holiday.description,
        ]
      );
    }
    
    await client.query('COMMIT');
    
    logger.info(`Database seeding completed. Inserted ${holidays.length} holidays`);
    process.exit(0);
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Seeding failed', { error });
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();

