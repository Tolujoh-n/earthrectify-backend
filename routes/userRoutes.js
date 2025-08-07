const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  becomeVerifier,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.post("/register", registerUser);
router.post("/login", loginUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router
  .route("/become-verifier")
  .put(protect, upload.single("image"), becomeVerifier);

module.exports = router;
