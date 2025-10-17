const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const IdeaRouter = require("./routes/idea.route");
const AuthRouter = require("./routes/auth.route");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => {
    console.log("MongoDB successfully connected!");
  })
  .catch((err) => {
    console.log("Error Connecting to Mongodb | ", err);
  });

const allowedOrigins = [
  "http://localhost:3000",
  "https://sparkyume-frontend.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/ideas", IdeaRouter);
app.use("/api/auth", AuthRouter);

// Fallback 404 route
app.use((req, res, next) => {
  const error = new Error(`NOT FOUND - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Error Handler
app.use(errorHandler);

app.listen(process.env.PORT || 8000, () => {
  console.log("server started at port ", process.env.PORT);
});
