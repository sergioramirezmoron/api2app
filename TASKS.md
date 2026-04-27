# TASKS

Roadmap to turn API2APP into a professional, functional, public-facing project.

Rule of work:

- One task = one branch
- One branch = one pull request
- Prefer small, reviewable changes
- Merge with squash
- Do not start the next task until the previous one is stable

Recommended branch prefixes:

- `feat/...`
- `fix/...`
- `docs/...`
- `refactor/...`
- `chore/...`

Recommended workflow for every task:

1. Create a branch from `main`
2. Implement only the scope of that task
3. Run local validation
4. Open a pull request
5. Merge only after review

---

## Phase 1: Publishable Foundation

These tasks make the repository credible before wider promotion.

## Task 01 - Add linting and editor standards

Branch:

`chore/add-eslint-and-editorconfig`

Why:

The project needs a clear, automated style baseline before it grows.

What to do:

- Add ESLint with a modern TypeScript configuration
- Add `.editorconfig`
- Add `npm run lint`
- Fix current lint issues
- Document lint usage in `README.md`

Validation:

- `npm run lint`
- `npm run test`

Done when:

- The repository has a repeatable lint command
- New code style is enforced automatically

## Task 02 - Add GitHub Actions CI

Branch:

`chore/add-github-actions-ci`

Why:

A public repo without CI looks unfinished and is harder to trust.

What to do:

- Add a workflow for `build`, `test`, and later `lint`
- Trigger on push and pull request
- Make checks visible in GitHub
- Add a status badge to `README.md`

Validation:

- Workflow passes on a pull request
- Required checks can be selected in branch rules

Done when:

- Every PR is validated automatically
- `main` can be protected with real checks

## Task 03 - Refactor the generator into modules

Branch:

`refactor/split-generator-core`

Why:

`src/core/generateApp.ts` currently mixes parsing, generation, and file writing. That will slow future features.

What to do:

- Split parsing logic into dedicated files
- Split template rendering into dedicated files
- Split file output helpers into dedicated files
- Keep the public behavior unchanged
- Add focused tests per module

Validation:

- `npm run test`
- `npm run build`

Done when:

- Core logic is separated by responsibility
- Future features can be added without growing one large file

## Task 04 - Improve CLI validation and error handling

Branch:

`fix/harden-cli-validation`

Why:

The CLI needs predictable behavior for invalid input if it is going to be used by strangers.

What to do:

- Handle missing files clearly
- Handle invalid JSON or invalid OpenAPI documents clearly
- Handle specs with no supported endpoints
- Return clean exit codes
- Improve console messages for success and failure

Validation:

- Test invalid file path
- Test invalid OpenAPI input
- Test valid example file

Done when:

- Users understand what failed and how to fix it
- The CLI fails cleanly instead of noisily

## Task 05 - Improve generated project quality

Branch:

`feat/improve-generated-scaffold`

Why:

The generated app should feel intentional, not like a rough dump of files.

What to do:

- Generate a `.gitignore` inside the scaffold
- Generate a small `README.md` inside the scaffold
- Generate a `.env.example` for future API base URL usage
- Improve generated `package.json` metadata where relevant
- Revisit folder structure for future growth

Validation:

- Generate an app from `examples/cars.openapi.json`
- Review generated files manually

Done when:

- The output project looks like a real starting point
- A user can understand the generated app without reverse engineering it

## Task 06 - Add a scaffold smoke test

Branch:

`chore/add-generated-app-smoke-test`

Why:

The project should verify not only that files are created, but that the generated app can actually build.

What to do:

- Extend tests to generate an app in a temp folder
- Install generated dependencies in CI
- Run the generated app build as a smoke test
- Keep the test isolated and deterministic

Validation:

- Root tests pass
- Generated scaffold build passes in CI

Done when:

- The repository proves that its output is usable

---

## Phase 2: Functional MVP

These tasks move API2APP from static scaffold to useful generator.

## Task 07 - Add real GET data fetching

Branch:

`feat/add-get-fetch-client`

Why:

Without real fetching, the generated app is only a visual mock.

What to do:

- Add a simple API client layer to the generated project
- Use `VITE_API_BASE_URL`
- Fetch real data for generated GET list pages
- Add loading, error, and empty states

Validation:

- Generate an app against a test API
- Verify list page fetches and renders remote data

Done when:

- Generated list pages display real backend data

## Task 08 - Add routing for generated resources

Branch:

`feat/add-generated-routing`

Why:

A multi-resource app without routing does not scale.

What to do:

- Add `react-router-dom` to generated apps
- Generate one route per main resource
- Generate a home or index page
- Add simple navigation between pages

Validation:

- Generate a spec with multiple GET resources
- Verify navigation between pages

Done when:

- A generated app can browse multiple resources cleanly

## Task 09 - Generate TypeScript resource types

Branch:

`feat/generate-resource-types`

Why:

Professional scaffolds should not be driven by anonymous objects only.

What to do:

- Generate shared type definitions from response schemas
- Reuse those types in pages and API helpers
- Improve field inference to carry basic scalar types

Validation:

- `npm run build`
- Generate sample output and inspect `src/types`

Done when:

- Generated code is typed in a maintainable way

## Task 10 - Add create and edit form generation

Branch:

`feat/generate-crud-forms`

Why:

This is the first feature that makes the project feel like more than a list-page generator.

What to do:

- Read `requestBody` schemas for POST, PUT, and PATCH
- Generate create and edit forms
- Support at least string, number, and boolean fields
- Add basic client-side validation

Validation:

- Use an example spec with POST and PUT
- Verify forms render and submit payloads correctly

Done when:

- Generated apps include basic create and edit flows

## Task 11 - Add configurable output templates

Branch:

`feat/add-template-selection`

Why:

Users will want different output styles as the project grows.

What to do:

- Add a `--template` flag
- Support at least `basic` and `crud`
- Document template differences
- Add tests for template selection

Validation:

- Generate apps with both templates
- Verify expected files differ by template

Done when:

- The CLI supports more than one generation strategy cleanly

---

## Phase 3: Open Source Credibility

These tasks help the project look serious in public and easier to contribute to.

## Task 12 - Add community health files

Branch:

`docs/add-community-health-files`

Why:

Good open source projects explain how people can contribute and interact.

What to do:

- Add `CONTRIBUTING.md`
- Add `CODE_OF_CONDUCT.md`
- Add a pull request template
- Add issue templates

Validation:

- Review GitHub repository tabs and templates manually

Done when:

- Contributors know how to propose changes and report issues

## Task 13 - Add repository metadata and release hygiene

Branch:

`chore/add-release-metadata`

Why:

Package metadata and release basics matter before publishing to npm or promoting on GitHub.

What to do:

- Improve `package.json` metadata
- Add `repository`, `homepage`, `bugs`, `files`, and `engines`
- Decide versioning policy
- Add a release checklist section to documentation

Validation:

- Review package metadata manually
- Run `npm pack` locally

Done when:

- The package looks publishable and complete

## Task 14 - Add demos, screenshots, and example specs

Branch:

`docs/add-demo-assets`

Why:

GitHub attention comes from showing the project, not only describing it.

What to do:

- Add two or three representative OpenAPI examples
- Add screenshots or GIFs of generated apps
- Add a before and after section to `README.md`
- Decide whether `demo-app` should be versioned as an official example

Validation:

- Review README visually on GitHub

Done when:

- The repository communicates value in a few seconds

## Task 15 - Prepare public launch

Branch:

`chore/prepare-public-launch`

Why:

A public launch should feel intentional, not improvised.

What to do:

- Final review of README, tasks, examples, and CI
- Clean repository topics and description on GitHub
- Publish first release notes
- Prepare a short launch post with a clear demo

Validation:

- Repository landing page looks polished
- Main branch is protected
- CI passes

Done when:

- The project is ready to be shared confidently

---

## Suggested Execution Order

If the goal is to make the project both professional and functional before promotion, use this order:

1. Task 01
2. Task 02
3. Task 03
4. Task 04
5. Task 05
6. Task 06
7. Task 07
8. Task 08
9. Task 09
10. Task 10
11. Task 11
12. Task 12
13. Task 13
14. Task 14
15. Task 15

## Success Criteria

API2APP is ready for serious public promotion when:

- the repository has CI, linting, and tests
- the generator creates apps that build and fetch real data
- the documentation matches reality
- the repository looks maintained and contributor-friendly
- the generated output feels like a real starter, not a toy
