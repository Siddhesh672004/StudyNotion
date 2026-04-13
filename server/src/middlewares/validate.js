const AppError = require("../utils/AppError");

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    throw new AppError(422, JSON.stringify(errors));
  }

  req.body = result.data;
  next();
};

module.exports = validate;
