import { AppError, getErrorMessage } from "../core/errors.js";
import { generateApp } from "../core/generateApp.js";

type Logger = {
  error: (message: string) => void;
  log: (message: string) => void;
};

export async function runCli(
  openapiFile: string,
  outputDir: string,
  logger: Logger = console
) {
  try {
    await generateApp(openapiFile, outputDir);
    logger.log(`App generated successfully in: ${outputDir}`);
    return 0;
  } catch (error) {
    logger.error(formatCliError(error));
    return 1;
  }
}

export function formatCliError(error: unknown) {
  if (error instanceof AppError) {
    return `Error: ${getErrorMessage(error)}`;
  }

  return `Unexpected error: ${getErrorMessage(error)}`;
}
