import path from "node:path";

import type {
  OpenApiLoader,
  ProjectBuilder,
  ProjectWriter
} from "./ports.js";
import { loadOpenApiDocument } from "../infrastructure/openapi/swaggerParserOpenApiLoader.js";
import { buildReactProjectArtifacts } from "../infrastructure/project/reactProjectBuilder.js";
import { writeProjectArtifacts } from "../infrastructure/project/fileSystemProjectWriter.js";

type GenerateAppDependencies = {
  openApiLoader: OpenApiLoader;
  projectBuilder: ProjectBuilder;
  projectWriter: ProjectWriter;
};

const defaultDependencies: GenerateAppDependencies = {
  openApiLoader: {
    load: loadOpenApiDocument
  },
  projectBuilder: {
    build: buildReactProjectArtifacts
  },
  projectWriter: {
    write: writeProjectArtifacts
  }
};

export async function generateApp(
  openapiFile: string,
  outputDir: string,
  dependencies: GenerateAppDependencies = defaultDependencies
) {
  const { endpoints } = await dependencies.openApiLoader.load(openapiFile);
  const artifacts = dependencies.projectBuilder.build({
    endpoints,
    outputDirName: path.basename(outputDir)
  });

  await dependencies.projectWriter.write(outputDir, artifacts);
}
