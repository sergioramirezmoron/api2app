#!/usr/bin/env node

import { Command } from "commander";
import { runCli } from "./cli/runCli.js";

const program = new Command();

program
  .name("api2app")
  .description("Generate a React frontend from an OpenAPI file")
  .argument("<openapi-file>", "Path to OpenAPI JSON file")
  .option("-o, --output <dir>", "Output directory", "generated-app")
  .action(async (openapiFile: string, options: { output: string }) => {
    const exitCode = await runCli(openapiFile, options.output);
    process.exit(exitCode);
  });

program.parse();
