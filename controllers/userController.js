const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password, wallet_address } = req.body;

  let userExists;

  if (wallet_address) {
    userExists = await User.findOne({ wallet_address });
    if (userExists) {
      res.status(400);
      throw new Error("Wallet already registered");
    }
  } else {
    userExists = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    if (!password || !username || !email) {
      res.status(400);
      throw new Error("Username, email, and password are required");
    }
  }

  const user = await User.create({
    username,
    email,
    password,
    wallet_address,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      wallet_address: user.wallet_address,
      isVerifier: user.isVerifier,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { usernameOrEmail, password, wallet_address } = req.body;

  let user;

  if (wallet_address) {
    user = await User.findOne({ wallet_address });

    if (user) {
      return res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        wallet_address: user.wallet_address,
        isVerifier: user.isVerifier,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("No user found with this wallet address");
    }
  }

  // Traditional login
  user = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      wallet_address: user.wallet_address,
      isVerifier: user.isVerifier,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      wallet_address: user.wallet_address,
      isVerifier: user.isVerifier,
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

// @desc    Become a verifier
// @route   PUT /api/users/become-verifier
// @access  Private
const becomeVerifier = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.isVerifier = true;
    user.verifierInfo = {
      nin_number: req.body.idType === "NIN" ? req.body.idNumber : null,
      voter_card_id: req.body.idType === "VoterCard" ? req.body.idNumber : null,
      phone_number: req.body.phoneNumber,
      active_mail: req.body.activeMail,
      image: req.file.path,
    };

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      wallet_address: updatedUser.wallet_address,
      isVerifier: updatedUser.isVerifier,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      wallet_address: updatedUser.wallet_address,
      isVerifier: updatedUser.isVerifier,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

module.exports = {
  registerUser,
  loginUser,
  becomeVerifier,
  getUserProfile,
  updateUserProfile,
};
