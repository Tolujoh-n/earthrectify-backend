const User = require("../../models/userModel");
const Farm = require("../../models/farmModel");

const getStats = async (req, res) => {
  try {
    const totalFarmers = await User.countDocuments({ isVerifier: false });
    const totalVerifiers = await User.countDocuments({ isVerifier: true });
    const farmData = await Farm.aggregate([
      {
        $group: {
          _id: null,
          totalLandmass: {
            $sum: { $multiply: ["$land_mass.length", "$land_mass.width"] },
          },
          totalCarbonYield: { $sum: "$carbon_credit_yield" },
        },
      },
    ]);

    res.json({
      totalFarmers,
      totalVerifiers,
      totalLandmass: farmData[0] ? farmData[0].totalLandmass : 0,
      totalCarbonYield: farmData[0] ? farmData[0].totalCarbonYield : 0,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getStats };
