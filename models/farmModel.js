const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const reportSchema = mongoose.Schema(
  {
    reporter_name: {
      type: String,
      required: true,
    },
    reporter_email: {
      type: String,
      required: true,
    },
    report_text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const farmSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    farm_business_name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    farm_address: {
      type: String,
      required: true,
    },
    land_mass: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
    },
    is_new_farm: {
      type: Boolean,
      required: true,
    },
    land_ownership_documents: {
      type: String,
      required: true,
    },
    land_photos: [
      {
        type: String,
        required: true,
      },
    ],
    thumbnail_image: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Registered", "Approved", "Rejected", "Updated", "Damaged"],
      default: "Registered",
    },
    carbon_credit_yield: {
      type: Number,
      required: true,
      default: 0,
    },
    activities: [commentSchema],
    reviews: [commentSchema],
    comments: [commentSchema],
    reports: [reportSchema],
  },
  {
    timestamps: true,
  }
);

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
