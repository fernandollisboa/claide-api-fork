module.exports = {
  transform: {
    "^.+\\.(js)$": "babel-jest",
  },
  clearMocks: true,
  testEnvironment: "node",
  restoreMocks: true,
  testPathIgnorePatterns: ["/node_modules/", "/factories/"],
  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/factories/", "/database/"],
  coverageDirectory: "coverage",
  coverageReporters: ["clover", "text"],
};
