# Notion Integration - Structure & Workflow (Next.js)

Summary: a concise pattern for integrating a Notion database into a Next.js app. Use environment variables for credentials, API route handlers to talk to Notion, and a client-side form that calls those handlers for search, verification, and create/update.

## 1. Environment
- Add credentials to environment:
  - `NOTION_API_KEY` - integration token (do not commit).
  - `NOTION_DATABASE_ID` - target database id.
- local file: `.env.local`
  ```
  NOTION_API_KEY=your_secret_token
  NOTION_DATABASE_ID=your_database_id
  ```

## 2. API routes (server-side)
- Location: `src/app/api/rsvp/*` (App Router) or `pages/api/rsvp/*` (Pages Router).
- Responsibilities:
  - `GET /api/rsvp/search?name=...` - query database for partial name matches; return fields (name, email, rsvp, notes, song, boat, whatsapp).
  - `GET /api/rsvp/verify-code?code=...` - query database for `Code` equals provided code; return full record or 404.
  - `POST /api/rsvp` - create or update Notion page with posted form data.
- Implementation notes:
  - Use `@notionhq/client`:
    ```js
    import { Client } from "@notionhq/client";
    const notion = new Client({ auth: process.env.NOTION_API_KEY });
    const dbId = process.env.NOTION_DATABASE_ID;
    ```
  - Query:
    - Use `notion.databases.query({ database_id: dbId, filter: { property: 'Code', /* ... */ } })`.
    - For partial name searches use `filter: { property: 'Name', rich_text: { contains: name } }`.
  - Create/update:
    - Map form values to Notion property types (title, rich_text, select, checkbox, phone, email).
    - If page exists update with `notion.pages.update({ page_id, properties })`, else `notion.pages.create({ parent: { database_id: dbId }, properties })`.

## 3. Client-side (example flow)
- Component responsibilities:
  - Input invitation code → call `GET /api/rsvp/verify-code?code=...`. If found, autofill form and lock in `verifiedCode`.
  - Debounced name input (>=3 chars) → call `GET /api/rsvp/search?name=...` to prefill existing data.
  - Submit form → `POST /api/rsvp` with form fields and `code: verifiedCode`.
  - Honeypot field for spam protection: if filled, simulate success without sending.
- UX:
  - Keep form visible after success; show inline status messages.
  - Provide "enter another code" to allow re-verification.

## 4. Mapping & property types
- Map UI fields to Notion properties; example:
## 4. Mapping & property types
- `Code` -> `Rich Text` or `Number` - unique invitation code used for verification. Store as `rich_text` if it contains letters, or `number` for numeric-only codes.
- `Name` -> `Title` (Notion `title`) - main person name used as the page title.
- `Email` -> `Email` (Notion `email`).
- `Phone` -> `Phone` (Notion `phone_number`).
- `RSVP` -> `Select` (Notion `select`) - suggested options: `Attending`, `Not Attending`, `Maybe`.
- `Guests` -> `Number` (Notion `number`) - number of additional guests.
- `Boat` -> `Checkbox` (Notion `checkbox`) - whether a boat transfer is requested.
- `Song` -> `Rich Text` (Notion `rich_text`) - song request.
- `Notes` -> `Rich Text` (Notion `rich_text`) - freeform notes (dietary needs, accessibility, etc.).
- `WhatsApp` -> `Phone` (Notion `phone_number`) or `Checkbox` if you only need a yes/no flag.
- `Released` -> `Checkbox` (Notion `checkbox`) - `true` when this row should be shown/imported publicly.

Ensure server converts JS types to Notion property format in API handlers. Example conversions:

- JS string -> Notion `rich_text` or `title` object
- JS boolean -> Notion `checkbox`
- JS number -> Notion `number`
- Select values -> Notion `select: { name: 'Attending' }`

Example Notion property payload (for create/update):

```
{
  Code: { rich_text: [{ text: { content: "ABC123" } }] },
  Name: { title: [{ text: { content: "Maria Gomez" } }] },
  Email: { email: "maria@example.com" },
  Phone: { phone_number: "+4915123456789" },
  RSVP: { select: { name: "Attending" } },
  Guests: { number: 2 },
  Boat: { checkbox: true },
  Song: { rich_text: [{ text: { content: "La Camisa Negra" } }] },
  Notes: { rich_text: [{ text: { content: "Vegetarian" } }] },
  WhatsApp: { phone_number: "+4915123456789" },
  Released: { checkbox: true }
}
```

## Example Row
| Property | Notion Type | Example Value |
|---|---|---|
| `Code` | `Rich Text` | `ABC123` |
| `Name` | `Title` | `Maria Gomez` |
| `Email` | `Email` | `maria@example.com` |
| `Phone` | `Phone` | `+4915123456789` |
| `RSVP` | `Select` | `Attending` |
| `Guests` | `Number` | `2` |
| `Boat` | `Checkbox` | `true` |
| `Song` | `Rich Text` | `La Camisa Negra` |
| `Notes` | `Rich Text` | `Vegetarian` |
| `WhatsApp` | `Phone` | `+4915123456789` |
| `Released` | `Checkbox` | `true` |

This example row will be imported/disclosed by public endpoints because `Released` is `true`.

---

## 5. Security & deployment
- Store keys in host env (AWS Amplify).
- Share database with the Notion integration so token has access.
- Rotate compromised tokens immediately.
- Server should validate inputs and avoid echoing raw Notion errors to clients.

## 6. Testing & debugging
- Local testing:
  - Start dev server: `npm run dev`
  - Test endpoint: `curl "http://localhost:3000/api/rsvp/verify-code?code=ABC"`
- Add logging and handle Notion rate limits with retries/backoff.

## 7. Extending
- Add webhooks or scheduled sync jobs if external updates are important.
- Add optimistic UI or background processing for heavy Notion operations.

---

If you want, I can now:
- Search the repo for the exact API handlers and paste the real handler code.
- Generate a ready-to-use `src/app/api/rsvp/` handler set that matches the schema used in your `Rsvp.tsx`. Which would you prefer?
