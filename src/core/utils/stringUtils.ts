export function toPascalCase(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\w+/g, (word) => word[0].toUpperCase() + word.slice(1))
    .replace(/\s+/g, "");
}
