import assert from "node:assert/strict";

import {
  toPackageName,
  toPascalCase
} from "../../dist/core/utils/stringUtils.js";

export const stringUtilsTestCases = [
  {
    name: "toPascalCase normalizes separators and casing",
    run() {
      assert.equal(toPascalCase("cars"), "Cars");
      assert.equal(toPascalCase("car_history"), "CarHistory");
      assert.equal(toPascalCase("car-history-item"), "CarHistoryItem");
    }
  },
  {
    name: "toPackageName normalizes values for package.json",
    run() {
      assert.equal(toPackageName("Generated Cars App"), "generated-cars-app");
      assert.equal(toPackageName("  API2APP Demo  "), "api2app-demo");
      assert.equal(toPackageName("!!!"), "generated-app");
    }
  }
];
