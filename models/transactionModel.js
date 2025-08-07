const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: ["deposit", "transfer", "swap"],
    },
    token: {
      type: String,
      required: true,
      enum: ["Hbar", "ERECO", "VERECO"],
    },
    amount: {
      type: Number,
      required: true,
    },
    from_address: {
      type: String,
    },
    to_address: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
