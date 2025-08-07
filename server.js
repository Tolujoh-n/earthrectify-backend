const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const farmRoutes = require("./routes/farmRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const statsRoutes = require("./routes/stats/statsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const calculateCarbonYield = require("./utils/calculateCarbonYield");
const scheduleTasks = require("./utils/scheduleTasks");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://earthrectify.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Scheduled tasks
scheduleTasks();

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit if DB connection fails
  });
