export function toPascalCase(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\w+/g, (word) => word[0].toUpperCase() + word.slice(1))
    .replace(/\s+/g, "");
}

export function toPackageName(value: string): string {
  const normalizedValue = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedValue || "generated-app";
}
