const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const farmRoutes = require("./routes/farmRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const statsRoutes = require("./routes/stats/statsRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const calculateCarbonYield = require("./utils/calculateCarbonYield");
const scheduleTasks = require("./utils/scheduleTasks");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

mongoose
  .connect(
    "mongodb+srv://tolujohnofficial:0O6OhRiBgMDHOsDM@cluster0.rxkcsyh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: ["http://localhost:3000", "https://earthrectify.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/farms", farmRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/stats", statsRoutes);

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(notFound);
app.use(errorHandler);

scheduleTasks();

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
