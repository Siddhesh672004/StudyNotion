const { ApiResponse } = require("../utils/apiResponse");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  const response = new ApiResponse(statusCode, null, message);

  if (process.env.NODE_ENV !== "production") {
    response.error = {
      name: err.name,
      stack: err.stack,
    };
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
