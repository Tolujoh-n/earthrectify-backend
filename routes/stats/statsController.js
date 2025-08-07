const User = require("../../models/userModel");
const Farm = require("../../models/farmModel");

exports.getStats = async (req, res) => {
  try {
    // Total farmers: all users
    const totalFarmers = await User.countDocuments();
    // Total verifiers: users with isVerifier true
    const totalVerifiers = await User.countDocuments({ isVerifier: true });

    // Get all farms
    const farms = await Farm.find();
    // Total landmass: sum of all farm land_mass (length * width)
    const totalLandmass = farms.reduce((sum, farm) => {
      if (farm.land_mass && farm.land_mass.length && farm.land_mass.width) {
        return sum + farm.land_mass.length * farm.land_mass.width;
      }
      return sum;
    }, 0);

    // Total carbon yield: sum of carbon_credit_yield for all farms with status 'Approved'
    const totalCarbonYield = farms
      .filter((farm) => farm.status === "Approved")
      .reduce((sum, farm) => sum + (farm.carbon_credit_yield || 0), 0);

    res.json({
      totalFarmers,
      totalVerifiers,
      totalLandmass,
      totalCarbonYield,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
