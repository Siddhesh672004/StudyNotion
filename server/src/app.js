const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const upload = require("./middlewares/upload");
const errorHandler = require("./middlewares/errorHandler");
const { ApiResponse } = require("./utils/apiResponse");
const AppError = require("./utils/AppError");
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

// Normalize legacy controller payloads into the standard API envelope.
app.use((req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (payload) => {
    const isStandardEnvelope =
      payload &&
      typeof payload === "object" &&
      Object.prototype.hasOwnProperty.call(payload, "statusCode") &&
      Object.prototype.hasOwnProperty.call(payload, "data") &&
      Object.prototype.hasOwnProperty.call(payload, "message") &&
      Object.prototype.hasOwnProperty.call(payload, "success");

    if (isStandardEnvelope) {
      return originalJson(payload);
    }

    const statusCode = res.statusCode || 200;

    if (
      payload &&
      typeof payload === "object" &&
      Object.prototype.hasOwnProperty.call(payload, "success")
    ) {
      const { success, data, message, error, ...rest } = payload;
      const normalizedData =
        data !== undefined ? data : Object.keys(rest).length > 0 ? rest : null;

      const wrapped = new ApiResponse(
        statusCode,
        normalizedData,
        message || (success ? "Success" : "Request failed")
      );

      // Keep explicit legacy success flags (some handlers use 200 with success:false).
      wrapped.success = success;

      if (error !== undefined) {
        wrapped.error = error;
      }

      return originalJson(wrapped);
    }

    return originalJson(
      new ApiResponse(
        statusCode,
        payload ?? null,
        statusCode < 400 ? "Success" : "Request failed"
      )
    );
  };

  next();
});

app.use("/api/v1", v1Routes);

app.get("/", (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { health: "ok" }, "Your server is up and running...."));
});

app.use((req, res, next) => {
  next(new AppError(404, `Route not found: ${req.originalUrl}`));
});

app.use(errorHandler);

module.exports = app;
