const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const upload = require("./middlewares/upload");
const errorHandler = require("./middlewares/errorHandler");
const v1Routes = require("./routes/v1");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(upload);

app.use("/api/v1", v1Routes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.use(errorHandler);

module.exports = app;
