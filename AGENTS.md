# AGENTS.md

## Build/Lint/Test Commands

- Install dependencies: `bun install`
- Run application: `bun start` or `bun index.js`
- Run with options: `bun index.js -n 10 -u`
- Build a standalone binary: `bun run build` (outputs `./hn`)
- Run linter: `bun run lint`
- Fix linting issues: `bun run lint:fix`
- Format files: `bun run format`
- Check formatting: `bun run format:check`
- Run unit tests: `bun test`
- Run coverage: `bun run test:coverage`

## Code Style Guidelines

- Target Bun only; use its native `fetch` rather than Node HTTP libraries or workers
- Use ES Modules (import/export) with .js extension
- Use async/await for asynchronous operations
- Use arrow functions for callbacks and exports
- Use chalk for terminal colors (import as needed)
- Use yargs for command-line argument parsing
- Use descriptive variable names (camelCase)
- Use const for variables that don't change, let for those that do
- Use template literals for string interpolation
- Handle errors with try/catch blocks
- Keep functions focused and small
- Use meaningful comments for complex logic
- Follow StandardJS linting and Prettier formatting (no semicolons, single quotes, 2-space indentation)
- Place imports at the top of files
- Use early returns to reduce nesting

## Project Layout

- `index.js` is the CLI entry point
- `src/cli.js` parses arguments and orchestrates fetching/printing
- `src/fetch.js` contains Hacker News API access
- `src/format.js` contains terminal output formatting
- `test/` contains Bun unit tests

## Release

Pushing a `v*` tag triggers `.github/workflows/release.yml`, which runs linting, formatting, and tests before compiling standalone binaries for Linux, macOS, and Windows and attaching them to the GitHub release.
