import assert from "node:assert/strict";

import {
  extractEndpoints,
  extractFieldsFromOperation,
  getResourceName
} from "../../dist/core/openapi/extractors.js";

export const openApiTestCases = [
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
  }
];
