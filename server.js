const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// eslint-disable-next-line no-unused-vars
const colors = require("colors");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

// Route files
// const logs = require("./routes/logs");
// const auth = require("./routes/auth");

const app = express();

// Dev logging middleware
process.env.NODE_ENV === "development" && app.use(morgan("dev"));

// Returns middleware that parses json
app.use(bodyParser.json());

// mount routes
// app.use("/api/v1/logs", logs);
// app.use("/api/v1/auth", auth);
app.use("/", (req, res, next) => {
  res.send("notifier service");
});
// setting up custom error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  // eslint-disable-next-line no-console
  console.log(
    `Notifier service running in ${process.env.NODE_ENV} mode on port ${PORT}`
      .yellow.bold,
  ),
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  // eslint-disable-next-line no-console
  console.log(`Unhandled Rejection at:${promise} reason:${err}`.red);
  // close & exit process
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err, origin) => {
  // eslint-disable-next-line no-console
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n${`Exception origin: ${origin}`.red}`,
  );
});
