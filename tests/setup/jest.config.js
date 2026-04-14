module.exports = {
  rootDir: "..",
  testEnvironment: "node",
  testMatch: [
    "<rootDir>/integration/**/*.test.js",
    "<rootDir>/unit/**/*.test.js",
  ],
  setupFilesAfterEnv: ["<rootDir>/setup/setupTests.js"],
  moduleDirectories: ["node_modules", "<rootDir>/../server/node_modules"],
  testTimeout: 30000,
  collectCoverageFrom: [
    "<rootDir>/../server/src/controllers/{Category,Payments}.js",
    "<rootDir>/../server/src/services/progressService.js",
    "<rootDir>/../server/src/middlewares/validate.js",
    "<rootDir>/../server/src/validators/auth.validator.js",
  ],
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      lines: 75,
      statements: 75,
    },
  },
};
