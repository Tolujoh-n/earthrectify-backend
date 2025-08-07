// Calculates carbon credit yield for a farm
// Rules: 100m x 100m = 10 credits per 24h
// Yield only counts if status is 'Approved'
// Optionally, you can pass a date range for more advanced calculations

function calculateCarbonYield(farm) {
  if (!farm || farm.status !== 'Approved') return 0;
  const { land_mass, createdAt, approvedAt, updatedAt } = farm;
  if (!land_mass || !land_mass.length || !land_mass.width) return 0;

  // Area in m^2
  const area = land_mass.length * land_mass.width;
  // Credits per day
  const creditsPerDay = (area / (100 * 100)) * 10;

  // Calculate days since approval (or fallback to createdAt/updatedAt)
  const now = new Date();
  let startDate = farm.approvedAt || farm.updatedAt || farm.createdAt;
  if (!startDate) return 0;
  startDate = new Date(startDate);
  const daysApproved = Math.max(1, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

  return creditsPerDay * daysApproved;
}

module.exports = calculateCarbonYield; 