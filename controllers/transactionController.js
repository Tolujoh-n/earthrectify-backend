const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

const createTransaction = async (req, res) => {
  // ... logic to create transaction
};

const getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id });
  res.json(transactions);
};

module.exports = { createTransaction, getTransactions };
