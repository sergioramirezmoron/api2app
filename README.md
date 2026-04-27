# API2APP — Generate a React app from OpenAPI in seconds

Turn your API into a working frontend instantly. No boilerplate. No setup.

---

## What is API2APP?

API2APP is a CLI tool that generates a fully working React frontend from an OpenAPI (Swagger) file.

Instead of manually building tables, forms, routing, and API calls, API2APP does it automatically.

---

## Quick Start

```bash
npx api2app ./openapi.json --output my-app
cd my-app
npm install
npm run dev
```

---

## What it does

Given an OpenAPI file like:

```json
{
  "/cars": {
    "get": {},
    "post": {}
  }
}
```

API2APP generates:

- List pages (tables)
- Columns based on schema
- API-ready structure
- Basic UI layout
- Working React app

---

## Generated Structure

```
my-app/
├── src/
│   ├── App.tsx
│   ├── CarsList.tsx
│   ├── main.tsx
│   ├── style.css
├── index.html
├── package.json
```

---

## Features

- Instant frontend generation
- Reads OpenAPI schemas
- Auto table generation
- Clean UI out of the box
- Fully editable code

---

## Status

Early MVP

Planned features:

- Real API fetch
- Forms generation (create/edit)
- Routing
- Better UI components

---

## Tech Stack

- TypeScript
- Node.js
- React
- Vite
- Handlebars

---

## Development & Contribution Guide

### Branch Naming Convention

```
feature/add-forms
feature/generate-routes
fix/parser-error
docs/update-readme
```

---

### Commit Convention

Format:

```
type: short description
```

Types:

- feat: new feature
- fix: bug fix
- docs: documentation
- refactor: code improvement
- chore: maintenance
- style: formatting

Examples:

```
feat: add dynamic table generation
fix: resolve handlebars parsing issue
docs: update README usage section
refactor: improve endpoint parser
```

---

### Branch Protection Rules

The main branch is protected:

- No direct pushes allowed
- No force pushes allowed
- Pull Requests required
- Clean history enforced

---

### Workflow

1. Create a branch

```bash
git checkout -b feature/your-feature
```

2. Commit changes

```bash
git add .
git commit -m "feat: your feature"
```

3. Push branch

```bash
git push origin feature/your-feature
```

4. Open a Pull Request

---

## Contributing

Pull requests are welcome.

- Follow naming conventions
- Keep commits clean
- Keep code readable

---

## License

MIT
