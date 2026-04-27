import SwaggerParser from "@apidevtools/swagger-parser";
import fs from "fs-extra";
import path from "node:path";
import Handlebars from "handlebars";

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

type Field = {
  name: string;
  label: string;
};

export type Endpoint = {
  name: string;
  path: string;
  method: string;
  fields: Field[];
};

type SchemaLike = {
  type?: string;
  items?: SchemaLike;
  properties?: Record<string, unknown>;
};

type JsonContentLike = {
  schema?: SchemaLike;
};

type ResponseLike = {
  content?: {
    "application/json"?: JsonContentLike;
  };
};

type OperationLike = {
  responses?: Record<string, ResponseLike>;
};

type OpenApiLike = {
  paths?: Record<string, Record<string, unknown>>;
};

export async function generateApp(openapiFile: string, outputDir: string) {
  const api = await SwaggerParser.dereference(openapiFile);
  const endpoints = extractEndpoints(api as OpenApiLike);

  await fs.emptyDir(outputDir);

  await createReactProject(outputDir);
  await generatePages(outputDir, endpoints);
  await generateAppFile(outputDir, endpoints);
  await generateStyles(outputDir);
}

export function extractEndpoints(api: OpenApiLike): Endpoint[] {
  const endpoints: Endpoint[] = [];
  const paths = api.paths ?? {};

  for (const routePath of Object.keys(paths)) {
    const methods = paths[routePath];

    for (const method of Object.keys(methods)) {
      if (!HTTP_METHODS.has(method)) {
        continue;
      }

      const resourceName = getResourceName(routePath);
      const operation = methods[method] as OperationLike;

      endpoints.push({
        name: resourceName,
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

  if (fields.length === 0) {
    return [
      { name: "id", label: "ID" },
      { name: "name", label: "NAME" }
    ];
  }

  return fields;
}

function getResponseSchema(operation: OperationLike) {
  const responses = operation?.responses ?? {};

  for (const statusCode of ["200", "201", "default"]) {
    const responseSchema =
      responses[statusCode]?.content?.["application/json"]?.schema;

    if (responseSchema) {
      return responseSchema;
    }
  }

  return undefined;
}

export function getResourceName(routePath: string): string {
  const parts = routePath.split("/").filter(Boolean);
  return parts[0] ?? "resource";
}

async function createReactProject(outputDir: string) {
  await fs.writeFile(
    path.join(outputDir, "package.json"),
    JSON.stringify(
      {
        name: path.basename(outputDir),
        private: true,
        scripts: {
          dev: "vite",
          build: "vite build",
          preview: "vite preview"
        },
        dependencies: {
          react: "latest",
          "react-dom": "latest"
        },
        devDependencies: {
          "@vitejs/plugin-react": "latest",
          vite: "latest",
          typescript: "latest",
          "@types/react": "latest",
          "@types/react-dom": "latest"
        }
      },
      null,
      2
    )
  );

  await fs.writeFile(
    path.join(outputDir, "index.html"),
    `<div id="root"></div><script type="module" src="/src/main.tsx"></script>`
  );

  await fs.writeFile(
    path.join(outputDir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          allowJs: false,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          module: "ESNext",
          moduleResolution: "Bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx"
        },
        include: ["src"],
        references: []
      },
      null,
      2
    )
  );

  await fs.writeFile(
    path.join(outputDir, "vite.config.ts"),
    `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
`
  );

  await fs.ensureDir(path.join(outputDir, "src"));
}

async function generatePages(outputDir: string, endpoints: Endpoint[]) {
  const listEndpoints = endpoints.filter((e) => e.method === "GET");

  const template = `
const exampleItem = {
{{#each fields}}
  {{name}}: "{{name}} example",
{{/each}}
};

export default function {{componentName}}() {
  const items = [exampleItem];

  return (
    <main className="page">
      <section className="card">
        <div className="header">
          <div>
            <p className="eyebrow">Generated page</p>
            <h1>{{title}}</h1>
          </div>

          <button className="primaryButton">Create new</button>
        </div>

        <p className="endpoint">
          Generated from endpoint: <code>{{method}} {{path}}</code>
        </p>

        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                {{#each fields}}
                <th>{{label}}</th>
                {{/each}}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  {{#each fields}}
                  <td>{item["{{name}}"]}</td>
                  {{/each}}
                  <td className="actions">
                    <button>View</button>
                    <button>Edit</button>
                    <button>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
`;

  for (const endpoint of listEndpoints) {
    const componentName = toPascalCase(endpoint.name) + "List";
    const compiled = Handlebars.compile(template);

    const content = compiled({
      componentName,
      title: `${toPascalCase(endpoint.name)} List`,
      method: endpoint.method,
      path: endpoint.path,
      fields: endpoint.fields
    });

    await fs.writeFile(
      path.join(outputDir, "src", `${componentName}.tsx`),
      content
    );
  }
}

async function generateAppFile(outputDir: string, endpoints: Endpoint[]) {
  const firstGet = endpoints.find((e) => e.method === "GET");

  if (!firstGet) {
    await fs.writeFile(
      path.join(outputDir, "src", "App.tsx"),
      `import "./style.css";

export default function App() {
  return (
    <main className="page">
      <section className="card">
        <h1>No GET endpoints found</h1>
        <p>Your OpenAPI file does not contain any GET endpoint yet.</p>
      </section>
    </main>
  );
}
`
    );
  } else {
    const componentName = toPascalCase(firstGet.name) + "List";

    await fs.writeFile(
      path.join(outputDir, "src", "App.tsx"),
      `import "./style.css";
import ${componentName} from "./${componentName}";

export default function App() {
  return <${componentName} />;
}
`
    );
  }

  await fs.writeFile(
    path.join(outputDir, "src", "main.tsx"),
    `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`
  );
}

async function generateStyles(outputDir: string) {
  await fs.writeFile(
    path.join(outputDir, "src", "style.css"),
    `
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: #f4f7fb;
  color: #111827;
  font-family: Arial, Helvetica, sans-serif;
}

.page {
  min-height: 100vh;
  padding: 40px;
}

.card {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
}

.header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #6366f1;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  font-size: 32px;
}

.endpoint {
  color: #4b5563;
  margin-bottom: 24px;
}

code {
  background: #eef2ff;
  color: #3730a3;
  padding: 4px 8px;
  border-radius: 8px;
}

.tableWrapper {
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background: #f9fafb;
  font-size: 13px;
  text-transform: uppercase;
  color: #6b7280;
}

tr:last-child td {
  border-bottom: none;
}

button {
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

button:hover {
  background: #f3f4f6;
}

.primaryButton {
  background: #4f46e5;
  color: white;
  border-color: #4f46e5;
}

.primaryButton:hover {
  background: #4338ca;
}

.actions {
  display: flex;
  gap: 8px;
}
`
  );
}

function toPascalCase(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\w+/g, (word) => word[0].toUpperCase() + word.slice(1))
    .replace(/\s+/g, "");
}
