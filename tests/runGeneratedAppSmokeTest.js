import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";
import fs from "fs-extra";

import { generateApp } from "../dist/core/generateApp.js";

const npmCommand = "npm";

async function runCommand(command, args, cwd) {
  await new Promise((resolve, reject) => {
    const child =
      process.platform === "win32"
        ? spawn(
            "cmd.exe",
            ["/d", "/s", "/c", `${command} ${args.map(escapeWindowsArg).join(" ")}`],
            {
              cwd,
              stdio: "inherit"
            }
          )
        : spawn(command, args, {
            cwd,
            stdio: "inherit"
          });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

function escapeWindowsArg(argument) {
  if (/^[a-z0-9-_=./:@]+$/i.test(argument)) {
    return argument;
  }

  return `"${argument.replace(/"/g, '\\"')}"`;
}

async function main() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "api2app-smoke-"));
  const outputDir = path.join(tempDir, "generated-cars-app");
  const openapiFile = path.resolve("examples", "cars.openapi.json");

  try {
    await generateApp(openapiFile, outputDir);

    const packageJsonPath = path.join(outputDir, "package.json");
    const packageJsonExists = await fs.pathExists(packageJsonPath);
    assert.equal(packageJsonExists, true, "generated package.json should exist");

    await runCommand(npmCommand, ["install", "--no-fund", "--no-audit"], outputDir);
    await runCommand(npmCommand, ["run", "build"], outputDir);
  } finally {
    await fs.remove(tempDir);
  }
}

await main();
