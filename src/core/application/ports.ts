import type { Endpoint, OpenApiLike } from "../domain/openapi/types.js";
import type { GeneratedArtifact } from "../domain/project/generatedArtifact.js";

export type LoadedOpenApiDocument = {
  api: OpenApiLike;
  endpoints: Endpoint[];
};

export type OpenApiLoader = {
  load: (openapiFile: string) => Promise<LoadedOpenApiDocument>;
};

export type ProjectBuilderInput = {
  endpoints: Endpoint[];
  outputDirName: string;
};

export type ProjectBuilder = {
  build: (input: ProjectBuilderInput) => GeneratedArtifact[];
};

export type ProjectWriter = {
  write: (outputDir: string, artifacts: GeneratedArtifact[]) => Promise<void>;
};
