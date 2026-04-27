import fs from "fs-extra";
import path from "node:path";

import type { Endpoint } from "../openapi/types.js";
import { toPackageName, toPascalCase } from "../utils/stringUtils.js";
import {
  renderAppComponent,
  renderEnvExample,
  renderEmptyApp,
  renderGeneratedGitignore,
  renderGeneratedReadme,
  renderIndexHtml,
  renderListPage,
  renderMainFile,
  renderPackageJson,
  renderStyles,
  renderTsConfig,
  renderViteConfig
} from "./templates.js";

export async function createReactProject(outputDir: string) {
  const outputDirName = path.basename(outputDir);

  await fs.writeFile(
    path.join(outputDir, "package.json"),
    renderPackageJson(toPackageName(outputDirName))
  );

  await fs.writeFile(path.join(outputDir, "index.html"), renderIndexHtml());
  await fs.writeFile(path.join(outputDir, "tsconfig.json"), renderTsConfig());
  await fs.writeFile(
    path.join(outputDir, "vite.config.ts"),
    renderViteConfig()
  );
  await fs.writeFile(
    path.join(outputDir, ".gitignore"),
    renderGeneratedGitignore()
  );
  await fs.writeFile(
    path.join(outputDir, "README.md"),
    renderGeneratedReadme(outputDirName)
  );
  await fs.writeFile(
    path.join(outputDir, ".env.example"),
    renderEnvExample()
  );

  await fs.ensureDir(path.join(outputDir, "src", "api"));
  await fs.ensureDir(path.join(outputDir, "src", "components"));
  await fs.ensureDir(path.join(outputDir, "src", "pages"));
  await fs.ensureDir(path.join(outputDir, "src", "types"));
}

export async function generatePages(outputDir: string, endpoints: Endpoint[]) {
  const listEndpoints = endpoints.filter((endpoint) => endpoint.method === "GET");

  for (const endpoint of listEndpoints) {
    const componentName = `${toPascalCase(endpoint.name)}List`;
    const title = `${toPascalCase(endpoint.name)} List`;
    const content = renderListPage(endpoint, componentName, title);

    await fs.writeFile(
      path.join(outputDir, "src", "pages", `${componentName}.tsx`),
      content
    );
  }
}

export async function generateAppFile(outputDir: string, endpoints: Endpoint[]) {
  const firstGet = endpoints.find((endpoint) => endpoint.method === "GET");
  const appContent = firstGet
    ? renderAppComponent(`${toPascalCase(firstGet.name)}List`)
    : renderEmptyApp();

  await fs.writeFile(path.join(outputDir, "src", "App.tsx"), appContent);
  await fs.writeFile(path.join(outputDir, "src", "main.tsx"), renderMainFile());
}

export async function generateStyles(outputDir: string) {
  await fs.writeFile(path.join(outputDir, "src", "style.css"), renderStyles());
}
