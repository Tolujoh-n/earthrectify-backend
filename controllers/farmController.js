const Farm = require("../models/farmModel");

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILES:", req.files);

    const {
      farm_business_name,
      country,
      farm_address,
      land_mass,
      is_new_farm,
      phone_number,
    } = req.body;

    const parsedLandMass = JSON.parse(land_mass || "{}");

    const farm = new Farm({
      user: req.user._id,
      farm_business_name,
      country,
      farm_address,
      land_mass: {
        length: parsedLandMass.length,
        width: parsedLandMass.width,
      },
      is_new_farm,
      land_ownership_documents:
        req.files?.land_ownership_documents?.[0]?.path || null,
      land_photos: req.files?.land_photos?.map((file) => file.path) || [],
      thumbnail_image: req.files?.thumbnail_image?.[0]?.path || null,
      phone_number,
    });

    const createdFarm = await farm.save();
    res.status(201).json(createdFarm);
  } catch (error) {
    console.error("Farm creation error:", error); // <--- log full error
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

// @desc    Get all farms
// @route   GET /api/farms
// @access  Public
const getFarms = async (req, res) => {
  const { search, filter } = req.query;
  const keyword = search ? { name: { $regex: search, $options: "i" } } : {};

  let sortOrder = {};
  if (filter === "recent") {
    sortOrder = { createdAt: -1 };
  } else if (filter === "yield_high_to_low") {
    sortOrder = { carbon_credit_yield: -1 };
  } else if (filter === "yield_low_to_high") {
    sortOrder = { carbon_credit_yield: 1 };
  }

  try {
    const farms = await Farm.find({ ...keyword })
      .populate("user", "username")
      .sort(sortOrder);
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get single farm
// @route   GET /api/farms/:id
// @access  Public
const getFarmById = async (req, res) => {
  const farm = await Farm.findById(req.params.id);

  if (farm) {
    res.json(farm);
  } else {
    res.status(404);
    throw new Error("Farm not found");
  }
};

// @desc    Get farms posted by a specific user
// @route   GET /api/farms/user
// @access  Private
const getUserFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user farms" });
  }
};

// @desc    Create new comment
// @route   POST /api/farms/:id/comments
// @access  Private
const createFarmComment = async (req, res) => {
  const { comment, image } = req.body;

  const farm = await Farm.findById(req.params.id);

  if (farm) {
    const newComment = {
      comment,
      image,
      username: req.user.username,
      user: req.user._id,
    };

    farm.comments.push(newComment);

    await farm.save();
    res.status(201).json({ message: "Comment added" });
  } else {
    res.status(404);
    throw new Error("Farm not found");
  }
};

const createFarmActivity = async (req, res) => {
  const { comment, image, video } = req.body;

  const farm = await Farm.findById(req.params.id);

  if (farm) {
    if (
      farm.user.toString() !== req.user._id.toString() &&
      !req.user.isVerifier
    ) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const newActivity = {
      comment,
      image,
      video,
      username: req.user.username,
      user: req.user._id,
    };

    farm.activities.push(newActivity);

    await farm.save();
    res.status(201).json({ message: "Activity added" });
  } else {
    res.status(404);
    throw new Error("Farm not found");
  }
};

// @desc    Delete a farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res) => {
  const farm = await Farm.findById(req.params.id);

  if (farm) {
    if (farm.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await farm.remove();
    res.json({ message: "Farm removed" });
  } else {
    res.status(404);
    throw new Error("Farm not found");
  }
};

// @desc    Update a farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res) => {
  const { land_mass, status } = req.body;

  const farm = await Farm.findById(req.params.id);

  if (farm) {
    if (
      farm.user.toString() !== req.user._id.toString() &&
      !req.user.isVerifier
    ) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const oldStatus = farm.status;
    farm.land_mass = land_mass || farm.land_mass;
    farm.status = status || farm.status;

    if (req.user.isVerifier) {
      if (land_mass) {
        farm.status = "Approved";
      }
      if (farm.status !== oldStatus) {
        req.user.verifier_credit_balance += 50;
        req.user.totalFarmsVerified += 1;
        req.user.totalVerifierCreditYield += 50;
        await req.user.save();
      }
    } else if (land_mass) {
      farm.status = "Updated";
    }

    const updatedFarm = await farm.save();
    res.json(updatedFarm);
  } else {
    res.status(404);
    throw new Error("Farm not found");
  }
};

const reportFarm = async (req, res) => {
  const { reporter_name, reporter_email, report_text } = req.body;

  const farm = await Farm.findById(req.params.id);

  if (farm) {
    const newReport = {
      reporter_name,
      reporter_email,
      report_text,
    };

    farm.reports.push(newReport);

    await farm.save();
    res.status(201).json({ message: "Report submitted" });
  } else {
    res.status(404);
    throw new Error("Farm not found");
  }
};

module.exports = {
  createFarm,
  getFarms,
  getFarmById,
  getUserFarms,
  createFarmComment,
  deleteFarm,
  updateFarm,
  createFarmActivity,
  reportFarm,
};
