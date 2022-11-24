module.exports = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,
  transform: {
    "^.+\\.(js)$": "babel-jest",
  },

  clearMocks: true,
  // resetMocks: true,

  testPathIgnorePatterns: ["/node_modules/", "/factories/"],

  collectCoverage: true,
  coveragePathIgnorePatterns: ["/node_modules/", "/factories/", "/database/"],
  coverageDirectory: "coverage",
  coverageReporters: ["clover", "text"],

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: ["**/src/**"],
};
