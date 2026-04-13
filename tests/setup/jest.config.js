module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/../integration", "<rootDir>/../unit"],
  testMatch: ["**/*.test.js"],
  collectCoverageFrom: ["server/src/**/*.js"],
};
