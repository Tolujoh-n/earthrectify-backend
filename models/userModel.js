const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: function () {
        return !this.wallet_address;
      },
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: function () {
        return !this.wallet_address;
      },
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.wallet_address;
      },
    },
    wallet_address: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerifier: {
      type: Boolean,
      required: true,
      default: false,
    },
    verifierInfo: {
      nin_number: { type: String },
      voter_card_id: { type: String },
      phone_number: { type: String },
      active_mail: { type: String },
      image: { type: String },
    },
    bio: {
      type: String,
    },
    carbon_credit_balance: {
      type: Number,
      required: true,
      default: 0,
    },
    verifier_credit_balance: {
      type: Number,
      required: true,
      default: 0,
    },
    totalFarmsVerified: {
      type: Number,
      default: 0,
    },
    totalVerifierCreditYield: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 👇 Add this next block here
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 👇 Then continue as usual
const User = mongoose.model("User", userSchema);

module.exports = User;
