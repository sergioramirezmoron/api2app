import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "fs-extra";

import {
  extractEndpoints,
  extractFieldsFromOperation,
  generateApp,
  getResourceName
} from "../dist/core/generateApp.js";

const testCases = [
  {
    name: "extractEndpoints only keeps HTTP operations",
    run() {
      const endpoints = extractEndpoints({
        paths: {
          "/cars": {
            get: {
              responses: {
                200: {
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          id: { type: "number" }
                        }
                      }
                    }
                  }
                }
              }
            },
            parameters: [
              {
                name: "limit",
                in: "query"
              }
            ],
            summary: "Cars endpoint"
          }
        }
      });

      assert.equal(endpoints.length, 1);
      assert.equal(endpoints[0]?.method, "GET");
      assert.deepEqual(endpoints[0]?.fields, [{ name: "id", label: "ID" }]);
    }
  },
  {
    name: "extractFieldsFromOperation falls back to 201 and default fields",
    run() {
      const createdFields = extractFieldsFromOperation({
        responses: {
          201: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    brand: { type: "string" },
                    model: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      assert.deepEqual(createdFields, [
        { name: "brand", label: "BRAND" },
        { name: "model", label: "MODEL" }
      ]);

      const fallbackFields = extractFieldsFromOperation({
        responses: {}
      });

      assert.deepEqual(fallbackFields, [
        { name: "id", label: "ID" },
        { name: "name", label: "NAME" }
      ]);
    }
  },
  {
    name: "getResourceName uses the first path segment",
    run() {
      assert.equal(getResourceName("/cars/{id}/history"), "cars");
      assert.equal(getResourceName("/"), "resource");
    }
  },
  {
    name: "generateApp creates a usable Vite React project structure",
    async run() {
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "api2app-"));
      const outputDir = path.join(tempDir, "generated-cars-app");
      const openapiFile = path.resolve("examples", "cars.openapi.json");

      try {
        await generateApp(openapiFile, outputDir);

        const expectedFiles = [
          "index.html",
          "package.json",
          "tsconfig.json",
          "vite.config.ts",
          path.join("src", "App.tsx"),
          path.join("src", "CarsList.tsx"),
          path.join("src", "main.tsx"),
          path.join("src", "style.css")
        ];

        for (const relativePath of expectedFiles) {
          const exists = await fs.pathExists(path.join(outputDir, relativePath));
          assert.equal(exists, true, `${relativePath} should exist`);
        }

        const packageJson = await fs.readJson(path.join(outputDir, "package.json"));
        assert.equal(packageJson.name, "generated-cars-app");
        assert.equal(packageJson.private, true);
        assert.equal(packageJson.devDependencies["@vitejs/plugin-react"], "latest");
        assert.equal(packageJson.dependencies.react, "latest");

        const carsListContent = await fs.readFile(
          path.join(outputDir, "src", "CarsList.tsx"),
          "utf8"
        );
        assert.match(
          carsListContent,
          /Generated from endpoint: <code>GET \/cars<\/code>/
        );
        assert.match(carsListContent, /<th>PRICE<\/th>/);
        assert.match(carsListContent, /<td>\{item\["fuel"\]\}<\/td>/);
      } finally {
        await fs.remove(tempDir);
      }
    }
  }
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
