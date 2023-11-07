/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {
    "^.+[.]ts$": ["ts-jest", { tsconfig: "tests/tsconfig.json" }],
  },
  moduleNameMapper: {
    "^(.*)[.]js$": "$1",
  },
};
