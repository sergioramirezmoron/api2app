import assert from "node:assert/strict";

import { toPascalCase } from "../../dist/core/utils/stringUtils.js";

export const stringUtilsTestCases = [
  {
    name: "toPascalCase normalizes separators and casing",
    run() {
      assert.equal(toPascalCase("cars"), "Cars");
      assert.equal(toPascalCase("car_history"), "CarHistory");
      assert.equal(toPascalCase("car-history-item"), "CarHistoryItem");
    }
  }
];
