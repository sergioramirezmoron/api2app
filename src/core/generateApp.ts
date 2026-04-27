import fs from "fs-extra";

import {
  extractEndpoints,
  extractFieldsFromOperation,
  getResourceName
} from "./openapi/extractors.js";
import { loadOpenApiDocument } from "./openapi/loadDocument.js";
import type { Endpoint } from "./openapi/types.js";
import {
  createReactProject,
  generateAppFile,
  generatePages,
  generateStyles
} from "./project/scaffold.js";

export async function generateApp(openapiFile: string, outputDir: string) {
  const { endpoints } = await loadOpenApiDocument(openapiFile);

  await fs.emptyDir(outputDir);

  await createReactProject(outputDir);
  await generatePages(outputDir, endpoints);
  await generateAppFile(outputDir, endpoints);
  await generateStyles(outputDir);
}

export { extractEndpoints, extractFieldsFromOperation, getResourceName };
export type { Endpoint };
