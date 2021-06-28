import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  watchPlugins: ["jest-watch-typeahead/filename", "jest-watch-typeahead/testname"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/**/src/**/*.{spec,test}.{js,ts,tsx}"],
  transform: {
    "^.+\\.css$": "<rootDir>/jest/cssTransform.js",
  },
  moduleNameMapper: {
    "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy",
    "@app/(.*)": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
};

export default config;
