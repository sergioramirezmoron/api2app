# 🚀 API2APP

> Turn your OpenAPI file into a working React app in seconds.

---

## 🧠 What is API2APP?

API2APP is a CLI tool that generates a fully working React frontend from an OpenAPI (Swagger) file.

Instead of manually building tables, forms, and API calls, API2APP does it automatically.

---

## ⚡ Quick Start

```bash
npx api2app ./openapi.json --output my-app
cd my-app
npm install
npm run dev
```

---

## 🎯 What it does

Given an OpenAPI file like this:

```json
{
  "/cars": {
    "get": {},
    "post": {}
  }
}
```

API2APP generates:

- 📋 List pages (tables)
- 🧾 Columns based on schema
- 🔗 API-ready structure
- 🎨 Basic UI layout
- ⚡ Working React app

---

## 🧸 Simple Explanation

You give it instructions:

> "I have cars, and I can get them"

API2APP creates:

> A page where you can see those cars in a table automatically

---

## 📦 Generated Structure

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

## 🔥 Features

- ⚡ Instant frontend generation
- 🧠 Reads OpenAPI schemas
- 📊 Auto table generation
- 🎨 Clean UI out of the box
- 🧩 Fully editable code

---

## 🚧 Status

Early MVP

Planned features:

- [ ] Real API fetch
- [ ] Forms generation (create/edit)
- [ ] Authentication support
- [ ] Routing
- [ ] Better UI components

---

## 🛠 Tech Stack

- TypeScript
- Node.js
- React
- Vite
- Handlebars

---

## 🤝 Contributing

Pull requests are welcome.

If you find a bug or want to improve something, feel free to open an issue.

---

## ⭐ Support

If you like this project, give it a star ⭐ on GitHub!

---

## 📄 License

MIT
