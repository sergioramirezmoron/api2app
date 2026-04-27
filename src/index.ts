#!/usr/bin/env node

import { Command } from "commander";
import { generateApp } from "./core/generateApp.js";

const program = new Command();

program
  .name("api2app")
  .description("Generate a React frontend from an OpenAPI file")
  .argument("<openapi-file>", "Path to OpenAPI JSON file")
  .option("-o, --output <dir>", "Output directory", "generated-app")
  .action(async (openapiFile: string, options: { output: string }) => {
    try {
      await generateApp(openapiFile, options.output);
      console.log(`✅ App generated successfully in: ${options.output}`);
    } catch (error) {
      console.error("❌ Error generating app:");
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
