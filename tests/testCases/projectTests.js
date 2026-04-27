import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "fs-extra";

import { generateApp } from "../../dist/core/generateApp.js";

export const projectTestCases = [
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
