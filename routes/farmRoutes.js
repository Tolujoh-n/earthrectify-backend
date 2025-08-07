const express = require("express");
const router = express.Router();
const {
  createFarm,
  getFarms,
  getFarmById,
  getUserFarms,
  createFarmComment,
  deleteFarm,
  updateFarm,
  createFarmActivity,
  reportFarm,
} = require("../controllers/farmController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.route("/user").get(protect, getUserFarms);
router
  .route("/")
  .post(
    protect,
    upload.fields([
      { name: "land_ownership_documents", maxCount: 1 },
      { name: "land_photos", maxCount: 5 },
      { name: "thumbnail_image", maxCount: 1 },
    ]),
    createFarm
  )
  .get(getFarms);
router
  .route("/:id")
  .get(getFarmById)
  .delete(protect, deleteFarm)
  .put(protect, upload.single("thumbnail_image"), updateFarm);
router.route("/:id/comments").post(protect, createFarmComment);
router.route("/:id/activities").post(protect, createFarmActivity);
router.route("/:id/report").post(protect, reportFarm);

module.exports = router;
