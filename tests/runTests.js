import { cliValidationTestCases } from "./testCases/cliValidationTests.js";
import { openApiTestCases } from "./testCases/openApiTests.js";
import { projectTestCases } from "./testCases/projectTests.js";
import { stringUtilsTestCases } from "./testCases/stringUtilsTests.js";

const testCases = [
  ...openApiTestCases,
  ...cliValidationTestCases,
  ...stringUtilsTestCases,
  ...projectTestCases
];

let failed = 0;

for (const testCase of testCases) {
  try {
    await testCase.run();
    console.log(`PASS ${testCase.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${testCase.name}`);
    console.error(error);
  }
}

if (failed > 0) {
  throw new Error(`${failed} test(s) failed`);
}

console.log(`Completed ${testCases.length} tests successfully.`);
