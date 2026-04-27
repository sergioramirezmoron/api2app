import type {
  Endpoint,
  Field,
  OpenApiLike,
  OperationLike,
  SchemaLike
} from "./types.js";

const HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace"
]);

const DEFAULT_FIELDS: Field[] = [
  { name: "id", label: "ID" },
  { name: "name", label: "NAME" }
];

export function extractEndpoints(api: OpenApiLike): Endpoint[] {
  const endpoints: Endpoint[] = [];
  const paths = api.paths ?? {};

  for (const routePath of Object.keys(paths)) {
    const methods = paths[routePath];

    for (const method of Object.keys(methods)) {
      if (!HTTP_METHODS.has(method)) {
        continue;
      }

      const operation = methods[method] as OperationLike;

      endpoints.push({
        name: getResourceName(routePath),
        path: routePath,
        method: method.toUpperCase(),
        fields: extractFieldsFromOperation(operation)
      });
    }
  }

  return endpoints;
}

export function extractFieldsFromOperation(operation: OperationLike): Field[] {
  const schema = getResponseSchema(operation);
  const itemSchema = schema?.type === "array" ? schema.items : schema;
  const properties = itemSchema?.properties ?? {};

  const fields = Object.keys(properties).map((fieldName) => ({
    name: fieldName,
    label: fieldName.toUpperCase()
  }));

  return fields.length > 0 ? fields : DEFAULT_FIELDS;
}

export function getResourceName(routePath: string): string {
  const parts = routePath.split("/").filter(Boolean);
  return parts[0] ?? "resource";
}

function getResponseSchema(operation: OperationLike): SchemaLike | undefined {
  const responses = operation.responses ?? {};

  for (const statusCode of ["200", "201", "default"]) {
    const responseSchema =
      responses[statusCode]?.content?.["application/json"]?.schema;

    if (responseSchema) {
      return responseSchema;
    }
  }

  return undefined;
}
