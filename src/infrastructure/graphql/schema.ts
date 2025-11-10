import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Query {
    currentDate: CurrentDateResult
    convertDate(date: String!): ConvertDateResult
    khmerMonths: [KhmerMonth!]!
    khmerDays: [KhmerDay!]!
    buddhistEra(year: Int!): YearConversion
    gregorianYear(beYear: Int!): YearConversion
    holidays(year: Int, type: HolidayTypeFilter): HolidaysResult
    holidaysByMonth(year: Int, month: Int): HolidaysResult
    holidaysByDate(date: String!): [Holiday!]!
    upcomingHolidays(limit: Int): [Holiday!]!
    checkHoliday(date: String!): CheckHolidayResult
    publicHolidays(year: Int): HolidaysResult
    religiousHolidays(year: Int): HolidaysResult
    bulkHolidays(startDate: String!, endDate: String!): [Holiday!]!
  }

  enum HolidayTypeFilter {
    all
    public
    religious
  }

  type CurrentDateResult {
    gregorian: DateInfo
    buddhistEra: BuddhistEraDateInfo
    formatted: FormattedDate
    holidays: [Holiday!]
    isHoliday: Boolean!
  }

  type ConvertDateResult {
    gregorian: DateInfo
    buddhistEra: BuddhistEraDateInfo
    formatted: FormattedDate
    holidays: [Holiday!]
    isHoliday: Boolean!
  }

  type DateInfo {
    year: Int!
    month: Int!
    day: Int!
    dayName: String!
  }

  type BuddhistEraDateInfo {
    year: Int!
    month: Int!
    day: Int!
    monthName: String!
    dayName: String!
  }

  type FormattedDate {
    khmer: String!
    english: String!
  }

  type KhmerMonth {
    index: Int!
    khmer: String!
    english: String!
  }

  type KhmerDay {
    index: Int!
    khmer: String!
    english: String!
  }

  type YearConversion {
    gregorian: Int!
    buddhistEra: Int!
    difference: Int!
  }

  type Holiday {
    month: Int!
    day: Int!
    nameKh: String!
    nameEn: String!
    type: String!
    isPublicHoliday: Boolean!
    description: String
    date: String
    year: Int
    buddhistEra: Int
  }

  type HolidaysResult {
    holidays: [Holiday!]!
    year: Int!
    buddhistEra: Int!
    month: Int
    monthName: String
    total: Int!
    publicHolidays: Int
  }

  type CheckHolidayResult {
    date: String!
    isHoliday: Boolean!
    holidays: [HolidayInfo!]!
  }

  type HolidayInfo {
    nameKh: String!
    nameEn: String!
    type: String!
    isPublicHoliday: Boolean!
    description: String
  }
`);

