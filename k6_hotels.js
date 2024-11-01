const cities = [2114, 2198, 536, 3765, 2080, 513, 1069, 438, 2621, 2008, 3312]

const hotelRequests = Array.from({ length: cities.length }, (_, i) => ({
  endDate: new Date(new Date('2024-10-31').setDate(new Date('2024-10-31').getDate() + (i * 2) + 1)).toISOString().split('T')[0],
  startDate: new Date(new Date('2024-10-31').setDate(new Date('2024-10-31').getDate() + (i * 2))).toISOString().split('T')[0],
  city: cities[i],  // city ID
  adults: 2,
  children: [],
  limit: 16,
  offset: 0,
  sort: null
}));

export default hotelRequests;