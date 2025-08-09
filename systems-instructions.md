## Testing & Quality Assurance

Das Projekt verwendet folgende Teststrategie:

- **Unit/Component-Tests:** Vitest + React Testing Library (jsdom)
- **E2E-Tests:** Playwright
- **Linting:** ESLint
- **Type-Checking:** TypeScript

### Test-Skripte (package.json)

```json
"scripts": {
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest --run --reporter=dot",
    "test:watch": "vitest",
    "test:coverage": "vitest --run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:ci": "npm run lint && npm run typecheck && vitest --run --coverage && playwright test"
}
```

### Testausführung

- **Alle Unit-Tests:** `npm test`
- **E2E-Tests:** `npm run test:e2e`
- **CI-Workflow:** `npm run test:ci`

Siehe auch die Konfigurationsdateien `vitest.config.ts` und `playwright.config.ts`.
# System Instructions for GitHub Copilot

This document provides instructions for GitHub Copilot to effectively assist in the development of the wedding landing page project.

## Project Overview

The project is a responsive, static wedding landing page for Carolin & Sebastian. It's built with Next.js and aims to provide guests with information about the wedding and collect RSVPs.

## Tech Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Bundler**: Turbopack
- **Linting**: ESLint
- **Package Manager**: npm
- **Deployment**: Vercel (or other static hosting)


## Key Architectural Decisions

- **`src/` directory**: All source code is located in the `src/` directory.
- **Content Management**: All user-facing text and data is stored in `src/content/wedding.json`. When adding or modifying content, edit this file. Components should import content from this file rather than hardcoding text.
- **Component-Based Architecture**: The UI is built with reusable React components located in `src/components/`. Each major section of the page has its own component.
- **RSVP Form**: The RSVP form is a simple HTML form that submits data to a third-party service like Formspree. The endpoint is configured in `src/content/wedding.json`.
- **Static Site Generation**: The site is intended to be deployed as a static site. Avoid server-side rendering or API routes that are not compatible with a static export.
- **Next.js Partial Prerendering (PPR) & Async Params**: For layouts and pages under `/app/[locale]/`, always use async function signatures and treat `params` as a Promise. Example:
    ```ts
    export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
        const { locale } = await params;
        // ...
    }
    ```
- **Internationalization (next-intl)**: Always set a global `timeZone` (e.g., `'America/Bogota'`) and pass it to `NextIntlClientProvider` to avoid hydration mismatches. Load messages server-side and pass them as props to a client component.
- **Testing**: No automated test setup is present by default. If tests are required, set up a framework like Jest or Vitest and add a `test` script to `package.json`.

## Development Workflow

1.  **Run the development server**:
    ```bash
    npm run dev
    ```
2.  **Adding or modifying sections**:
    - Create or edit the corresponding component in `src/components/`.
    - Add or update the content in `src/content/wedding.json`.
    - Add the new component to `src/app/page.tsx`.
3.  **Styling**: Use Tailwind CSS utility classes for styling. Custom styles should be added to `src/app/globals.css`.
4.  **Linting**: Run `npm run lint` to check for code quality issues.


## Copilot's Role

- **Code Generation**: Assist in creating new components, functions, and logic based on the project's architecture and tech stack.
- **Content Integration**: When asked to add or change content, update `src/content/wedding.json` and ensure the components correctly reference the new content.
- **Styling**: Help with implementing designs using Tailwind CSS.
- **Refactoring**: Suggest improvements to code quality, performance, and maintainability.
- **Internationalization**: Ensure all locale-aware components and layouts follow the async params and timeZone best practices for next-intl.
- **Answering Questions**: Provide information about the project based on these instructions and the existing codebase.
