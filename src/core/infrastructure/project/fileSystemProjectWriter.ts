import fs from "fs-extra";
import path from "node:path";

import type { GeneratedArtifact } from "../../domain/project/generatedArtifact.js";

export async function writeProjectArtifacts(
  outputDir: string,
  artifacts: GeneratedArtifact[]
) {
  await fs.emptyDir(outputDir);

  for (const artifact of artifacts) {
    const targetPath = path.join(outputDir, artifact.path);

    if (artifact.kind === "directory") {
      await fs.ensureDir(targetPath);
      continue;
    }

    await fs.ensureDir(path.dirname(targetPath));
    await fs.writeFile(targetPath, artifact.content);
  }
}
