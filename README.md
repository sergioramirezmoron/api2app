# API2APP

[![CI](https://github.com/sergioramirezmoron/api2app/actions/workflows/ci.yml/badge.svg)](https://github.com/sergioramirezmoron/api2app/actions/workflows/ci.yml)

Generate a React + Vite scaffold from an OpenAPI file.

API2APP is currently an MVP CLI. Its purpose today is to read an OpenAPI document and generate a basic frontend starting point for documented resources.

## Current Scope

What the tool does today:

- Parses an OpenAPI file
- Detects HTTP endpoints from `paths`
- Infers table fields from response schemas
- Generates a React + Vite project scaffold
- Creates a basic list page for `GET` resources

What the tool does not do yet:

- Real API fetching
- Routing between generated pages
- Form generation for create or edit flows
- Authentication
- Production-ready CRUD behavior

This distinction matters. API2APP should currently be understood as a scaffold generator, not a full application generator.

## Example Output

Given an OpenAPI file with a resource like:

```json
{
  "paths": {
    "/cars": {
      "get": {
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "number" },
                      "brand": { "type": "string" },
                      "model": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

API2APP generates a project like:

```text
my-app/
|-- index.html
|-- package.json
|-- tsconfig.json
|-- vite.config.ts
`-- src/
    |-- App.tsx
    |-- CarsList.tsx
    |-- main.tsx
    `-- style.css
```

## Installation

### Run locally from this repository

```bash
npm install
npm run build
node dist/index.js ./examples/cars.openapi.json --output generated-app
```

### Run in development mode

```bash
npm install
npm run dev -- ./examples/cars.openapi.json --output generated-app
```

## CLI Usage

```bash
api2app <openapi-file> --output <directory>
```

Example:

```bash
api2app ./openapi.json --output my-app
```

Then install and run the generated app:

```bash
cd my-app
npm install
npm run dev
```

## Development

Project scripts:

- `npm run build`: compile the CLI
- `npm run lint`: run ESLint against the repository source
- `npm run test`: compile and run regression tests
- `npm run check`: alias for the current validation flow
- `npm run dev -- <openapi-file> -o <dir>`: run the generator from source

## Testing

The project includes a lightweight regression test runner that validates:

- endpoint extraction
- field inference
- resource naming
- real scaffold generation from the example OpenAPI file

Run tests with:

```bash
npm run test
```

Continuous integration runs `build`, `lint`, and `test` automatically on pushes and pull requests targeting `main`.

## Project Status

This repository is in early MVP stage.

The current priority is to make the generator:

- predictable
- testable
- honest in scope
- easy to evolve

Before wider publication, the project still needs:

- ESLint and formatting standards
- CI checks in GitHub Actions
- modularization of the generator internals
- better CLI error handling
- real data fetching support

## Branch and Commit Conventions

Use short-lived branches named by intent:

- `feat/...`
- `fix/...`
- `docs/...`
- `refactor/...`
- `chore/...`

Examples:

- `feat/add-fetch-client`
- `fix/openapi-response-parsing`
- `docs/rewrite-readme`

Commit format:

```text
type: short description
```

Examples:

```text
feat: add generated routing scaffold
fix: ignore non-http path metadata
docs: rewrite readme for mvp scope
refactor: split generator into modules
```

## Recommended Workflow

1. Create a branch from `main`.
2. Make focused changes.
3. Run `npm run test`.
4. Open a pull request.
5. Merge to `main` only after review.

## Roadmap

Short-term priorities:

1. Rewrite and align documentation
2. Split the generator into maintainable modules
3. Add linting and CI
4. Improve CLI validation and error messages
5. Generate fetch-ready resource pages
6. Add routing and form generation

## License

MIT
