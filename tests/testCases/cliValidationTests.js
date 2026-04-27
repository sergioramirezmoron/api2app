import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import fs from "fs-extra";

import { AppError } from "../../dist/core/errors.js";
import { loadOpenApiDocument } from "../../dist/core/openapi/loadDocument.js";
import { formatCliError, runCli } from "../../dist/cli/runCli.js";

export const cliValidationTestCases = [
  {
    name: "loadOpenApiDocument fails clearly when the file does not exist",
    async run() {
      const missingFile = path.join(os.tmpdir(), "api2app-missing-openapi.json");

      await assert.rejects(
        () => loadOpenApiDocument(missingFile),
        (error) =>
          error instanceof AppError &&
          error.code === "OPENAPI_FILE_NOT_FOUND" &&
          error.message.includes("OpenAPI file not found:")
      );
    }
  },
  {
    name: "loadOpenApiDocument fails clearly for invalid JSON input",
    async run() {
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "api2app-invalid-"));
      const invalidFile = path.join(tempDir, "invalid.openapi.json");

      try {
        await fs.writeFile(invalidFile, "{ invalid json");

        await assert.rejects(
          () => loadOpenApiDocument(invalidFile),
          (error) =>
            error instanceof AppError &&
            error.code === "INVALID_OPENAPI_DOCUMENT" &&
            error.message === "The provided file is not valid JSON."
        );
      } finally {
        await fs.remove(tempDir);
      }
    }
  },
  {
    name: "loadOpenApiDocument fails when the spec has no paths",
    async run() {
      const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "api2app-no-paths-"));
      const noPathsFile = path.join(tempDir, "no-paths.openapi.json");

      try {
        await fs.writeJson(noPathsFile, {
          openapi: "3.0.0",
          info: {
            title: "Empty API",
            version: "1.0.0"
          }
        });

        await assert.rejects(
          () => loadOpenApiDocument(noPathsFile),
          (error) =>
            error instanceof AppError &&
            error.code === "OPENAPI_PATHS_MISSING" &&
            error.message === "The OpenAPI document does not define any paths."
        );
      } finally {
        await fs.remove(tempDir);
      }
    }
  },
  {
    name: "loadOpenApiDocument fails when the spec has no supported HTTP endpoints",
    async run() {
      const tempDir = await fs.mkdtemp(
        path.join(os.tmpdir(), "api2app-no-endpoints-")
      );
      const noEndpointsFile = path.join(tempDir, "no-endpoints.openapi.json");

      try {
        await fs.writeJson(noEndpointsFile, {
          openapi: "3.0.0",
          info: {
            title: "Metadata-only API",
            version: "1.0.0"
          },
          paths: {
            "/cars": {
              summary: "Cars resource"
            }
          }
        });

        await assert.rejects(
          () => loadOpenApiDocument(noEndpointsFile),
          (error) =>
            error instanceof AppError &&
            error.code === "NO_SUPPORTED_ENDPOINTS" &&
            error.message ===
              "The OpenAPI document does not contain supported HTTP endpoints."
        );
      } finally {
        await fs.remove(tempDir);
      }
    }
  },
  {
    name: "formatCliError returns readable validation messages",
    run() {
      const message = formatCliError(
        new AppError("OPENAPI_FILE_NOT_FOUND", "OpenAPI file not found: demo.json")
      );

      assert.equal(message, "Error: OpenAPI file not found: demo.json");
    }
  },
  {
    name: "runCli returns a non-zero exit code and logs a clean error",
    async run() {
      const logger = {
        errorMessages: [],
        infoMessages: [],
        error(message) {
          this.errorMessages.push(message);
        },
        log(message) {
          this.infoMessages.push(message);
        }
      };

      const exitCode = await runCli("missing.openapi.json", "generated-app", logger);

      assert.equal(exitCode, 1);
      assert.deepEqual(logger.infoMessages, []);
      assert.equal(logger.errorMessages.length, 1);
      assert.match(logger.errorMessages[0], /^Error: OpenAPI file not found:/);
    }
  }
];
