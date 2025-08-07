const cron = require("node-cron");
const Farm = require("../models/farmModel");
const User = require("../models/userModel");

const scheduleTasks = () => {
  // Schedule a task to run every 24 hours for carbon yield
  cron.schedule("0 0 * * *", async () => {
    console.log("Running carbon yield calculation...");
    const approvedFarms = await Farm.find({ status: "Approved" });

    for (const farm of approvedFarms) {
      const carbonYieldPerDay =
        (farm.land_mass.length * farm.land_mass.width) / 1000; // 10 credits per 100x100m = 0.001 credit per m^2
      farm.carbon_credit_yield += carbonYieldPerDay;

      const farmOwner = await User.findById(farm.user);
      if (farmOwner) {
        farmOwner.carbon_credit_balance += carbonYieldPerDay;
        await farmOwner.save();
      }

      await farm.save();
    }
    console.log("Carbon yield calculation complete.");
  });

  // Schedule a task to run on the 1st of every 3rd month
  cron.schedule("0 0 1 */3 *", async () => {
    console.log("Running farm status update...");
    await Farm.updateMany(
      { status: { $in: ["Approved", "Updated"] } },
      { $set: { status: "Updated" } }
    );
    console.log("Farm status update complete.");
  });
};

module.exports = scheduleTasks;
