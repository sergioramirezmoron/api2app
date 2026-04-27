import SwaggerParser from "@apidevtools/swagger-parser";
import fs from "fs-extra";

import {
  extractEndpoints,
  extractFieldsFromOperation,
  getResourceName
} from "./openapi/extractors.js";
import type { Endpoint, OpenApiLike } from "./openapi/types.js";
import {
  createReactProject,
  generateAppFile,
  generatePages,
  generateStyles
} from "./project/scaffold.js";

export async function generateApp(openapiFile: string, outputDir: string) {
  const api = await SwaggerParser.dereference(openapiFile);
  const endpoints = extractEndpoints(api as OpenApiLike);

  await fs.emptyDir(outputDir);

  await createReactProject(outputDir);
  await generatePages(outputDir, endpoints);
  await generateAppFile(outputDir, endpoints);
  await generateStyles(outputDir);
}

export { extractEndpoints, extractFieldsFromOperation, getResourceName };
export type { Endpoint };
