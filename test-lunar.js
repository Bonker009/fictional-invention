// Simple test for Khmer Lunar Calendar
const { KhmerLunarCalendarService } = require('./dist/domain/services/KhmerLunarCalendarService');

console.log('='.repeat(60));
console.log('🌙 KHMER LUNAR CALENDAR TEST');
console.log('='.repeat(60));

// Test dates from the .NET example
const testDates = [
  { date: '2017-12-10', expectedCode: '0910256101R07' },
  { date: '2018-01-01', expectedCode: '0910256102K15S' },
  { date: '2024-11-09', expectedCode: null }, // Today
];

testDates.forEach(({ date, expectedCode }) => {
  const testDate = new Date(date);
  const lunarDate = KhmerLunarCalendarService.getKhmerLunarDate(testDate);
  
  console.log('\n' + '-'.repeat(60));
  console.log(`📅 Gregorian Date: ${date}`);
  console.log(`📝 Lunar Code: ${lunarDate.code}`);
  if (expectedCode) {
    const match = lunarDate.code === expectedCode ? '✅' : '❌';
    console.log(`🎯 Expected Code: ${expectedCode} ${match}`);
  }
  console.log(`\n🇰🇭 Full Description:`);
  console.log(`   ${lunarDate.fullDescription}`);
  console.log(`\n📊 Details:`);
  console.log(`   Sak: ${lunarDate.sakKh} (${lunarDate.sak})`);
  console.log(`   Animal Year: ${lunarDate.animalYearKh} (${lunarDate.animalYear})`);
  console.log(`   Buddhist Era: ${lunarDate.buddhistEra} (${KhmerLunarCalendarService.convertToKhmerNum(lunarDate.buddhistEra)})`);
  console.log(`   Lunar Month: ${lunarDate.lunarMonthKh} (${lunarDate.lunarMonth})`);
  console.log(`   Moon Phase: ${lunarDate.moonPhaseKh} (${lunarDate.moonPhase})`);
  console.log(`   Lunar Day: ${lunarDate.lunarDayKh} (${lunarDate.lunarDay})`);
  console.log(`   Holy Day: ${lunarDate.isHolyDay ? 'Yes (សីល)' : 'No'}`);
});

console.log('\n' + '='.repeat(60));
console.log('✅ Khmer Lunar Calendar Test Complete!');
console.log('='.repeat(60));

