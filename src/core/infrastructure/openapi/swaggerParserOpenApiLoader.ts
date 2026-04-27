import SwaggerParser from "@apidevtools/swagger-parser";
import fs from "fs-extra";
import path from "node:path";

import { AppError, getErrorMessage } from "../../errors.js";
import { extractEndpoints } from "../../domain/openapi/extractors.js";
import type { OpenApiLike } from "../../domain/openapi/types.js";
import type { LoadedOpenApiDocument } from "../../application/ports.js";

export async function loadOpenApiDocument(
  openapiFile: string
): Promise<LoadedOpenApiDocument> {
  const resolvedPath = path.resolve(openapiFile);
  const fileExists = await fs.pathExists(resolvedPath);

  if (!fileExists) {
    throw new AppError(
      "OPENAPI_FILE_NOT_FOUND",
      `OpenAPI file not found: ${resolvedPath}`
    );
  }

  let rawContents: string;

  try {
    rawContents = await fs.readFile(resolvedPath, "utf8");
  } catch (error) {
    throw new AppError(
      "OPENAPI_FILE_READ_FAILED",
      `The OpenAPI file could not be read: ${resolvedPath}`,
      getErrorMessage(error)
    );
  }

  let parsedApi: OpenApiLike;

  try {
    parsedApi = JSON.parse(rawContents) as OpenApiLike;
  } catch (error) {
    throw new AppError(
      "INVALID_OPENAPI_DOCUMENT",
      "The provided file is not valid JSON.",
      getErrorMessage(error)
    );
  }

  validateDocumentStructure(parsedApi);

  const extractedEndpoints = extractEndpoints(parsedApi);

  if (extractedEndpoints.length === 0) {
    throw new AppError(
      "NO_SUPPORTED_ENDPOINTS",
      "The OpenAPI document does not contain supported HTTP endpoints."
    );
  }

  let api: OpenApiLike;

  try {
    api = (await SwaggerParser.dereference(resolvedPath)) as OpenApiLike;
  } catch (error) {
    throw new AppError(
      "INVALID_OPENAPI_DOCUMENT",
      "The provided file is not a valid OpenAPI document.",
      getErrorMessage(error)
    );
  }

  return {
    api,
    endpoints: extractEndpoints(api)
  };
}

function validateDocumentStructure(api: OpenApiLike) {
  const paths = api.paths ?? {};

  if (Object.keys(paths).length === 0) {
    throw new AppError(
      "OPENAPI_PATHS_MISSING",
      "The OpenAPI document does not define any paths."
    );
  }
}
