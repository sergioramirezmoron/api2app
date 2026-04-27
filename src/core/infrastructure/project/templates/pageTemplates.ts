import Handlebars from "handlebars";

import type { Endpoint } from "../../../domain/openapi/types.js";

const listPageTemplate = Handlebars.compile(`
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
`);

export function renderListPage(
  endpoint: Endpoint,
  componentName: string,
  title: string
) {
  return listPageTemplate({
    componentName,
    title,
    method: endpoint.method,
    path: endpoint.path,
    fields: endpoint.fields
  });
}

export function renderEmptyApp() {
  return `import "./style.css";

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
`;
}

export function renderAppComponent(componentName: string) {
  return `import "./style.css";
import ${componentName} from "./pages/${componentName}";

export default function App() {
  return <${componentName} />;
}
`;
}

export function renderMainFile() {
  return `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
}
