import type { ProjectBuilderInput } from "../../application/ports.js";
import {
  createDirectory,
  createFile,
  type GeneratedArtifact
} from "../../domain/project/generatedArtifact.js";
import { toPackageName, toPascalCase } from "../../utils/stringUtils.js";
import {
  renderEnvExample,
  renderGeneratedGitignore,
  renderGeneratedReadme,
  renderIndexHtml,
  renderPackageJson,
  renderStyles,
  renderTsConfig,
  renderViteConfig
} from "./templates/baseProjectTemplates.js";
import {
  renderAppComponent,
  renderEmptyApp,
  renderListPage,
  renderMainFile
} from "./templates/pageTemplates.js";

export function buildReactProjectArtifacts(
  input: ProjectBuilderInput
): GeneratedArtifact[] {
  const artifacts: GeneratedArtifact[] = [
    createFile("package.json", renderPackageJson(toPackageName(input.outputDirName))),
    createFile("index.html", renderIndexHtml()),
    createFile("tsconfig.json", renderTsConfig()),
    createFile("vite.config.ts", renderViteConfig()),
    createFile(".gitignore", renderGeneratedGitignore()),
    createFile("README.md", renderGeneratedReadme(input.outputDirName)),
    createFile(".env.example", renderEnvExample()),
    createDirectory(pathJoin("src", "api")),
    createDirectory(pathJoin("src", "components")),
    createDirectory(pathJoin("src", "pages")),
    createDirectory(pathJoin("src", "types")),
    createFile("src/style.css", renderStyles()),
    createFile("src/main.tsx", renderMainFile())
  ];

  for (const endpoint of input.endpoints.filter(
    (entry) => entry.method === "GET"
  )) {
    const componentName = `${toPascalCase(endpoint.name)}List`;
    const title = `${toPascalCase(endpoint.name)} List`;

    artifacts.push(
      createFile(
        pathJoin("src", "pages", `${componentName}.tsx`),
        renderListPage(endpoint, componentName, title)
      )
    );
  }

  artifacts.push(createFile("src/App.tsx", buildAppContent(input)));

  return artifacts;
}

function buildAppContent(input: ProjectBuilderInput) {
  const firstGet = input.endpoints.find((endpoint) => endpoint.method === "GET");

  return firstGet
    ? renderAppComponent(`${toPascalCase(firstGet.name)}List`)
    : renderEmptyApp();
}

function pathJoin(...parts: string[]) {
  return parts.join("/");
}
