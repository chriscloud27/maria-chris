# RSVP - Notion Read-Only Integration

This document describes only the read-only portion of the Notion integration used by the RSVP flow (search / verify-code). It documents the server-side helpers that query Notion and the expected Notion property mappings.

## Purpose
- Provide a concise reference for the functions that read RSVP rows from Notion used by:
  - `GET /api/rsvp/search?name=...` (name-based lookup)
  - `GET /api/rsvp/verify-code?code=...` (code-based lookup)

## Key functions (server-side)
- `findRSVPByName(name)`
  - Queries the configured Notion database for pages where the `Name` title contains `name`.
  - Returns the first match (page_size: 1) or `null`.
  - Converts Notion property values to a simple JS object:
    - `name` (title -> string)
    - `email` (email -> string)
    - `rsvp` (select -> string)
    - `notes` (rich_text -> string)
    - `song` (rich_text -> string)
    - `boat` (checkbox -> boolean)
    - `whatsapp` (phone_number -> string)

- `findRSVPByCode(code, filterType = 'rich_text' | 'title')`
  - Queries the Notion database for a page where the `Code` property equals the provided code.
  - `filterType` chooses whether to check `Code` as `rich_text` (text field) or `title` (page title). The API currently tries `rich_text` first, then `title`.
  - Returns the first match (page_size: 1) or `null`.
  - Returned JS object includes the same keys as `findRSVPByName` plus `code` when applicable.

- `findRSVPByEmail(email)` (helper)
  - Queries the database for `Email` equals `email` and returns the first page id or `null`.

## Notion property mapping (expected)
- `Name` - Notion `title` (page title)
- `Email` - Notion `email`
- `RSVP` - Notion `select` (values like `Attending`, `Not Attending`, `Maybe`)
- `Notes` - Notion `rich_text`
- `Song` - Notion `rich_text`
- `Boat` - Notion `checkbox` (boolean expected)
- `WhatsApp` - Notion `phone_number`
- `Code` - Notion `rich_text` (or sometimes `title` depending on your Notion schema)

## Where these are used
- `src/app/api/rsvp/search/route.ts` calls `findRSVPByName` and returns a JSON object to the client for prefill.
- `src/app/api/rsvp/verify-code/route.ts` calls `findRSVPByCode` (tries `rich_text` then `title`) and returns full record.
- Both functions only return the first matching page (single result behavior).

## Notes & recommendations
- `Released` filtering: If you want to exclude draft/unreleased rows, add an additional Notion query filter `Released: { checkbox: { equals: true } }` to both functions.
- `Code` type: Standardize `Code` to a single Notion type (prefer `rich_text`) to avoid the double-lookup fallback.
- `Boat` type mismatch: Ensure `Boat` is stored as `checkbox` (true/false) in Notion to match the read helpers.

## Example usage (server-side)
- Name lookup: `const rsvp = await findRSVPByName('Mar'); // returns first match or null`
- Code lookup: `const rsvp = await findRSVPByCode('ABC123', 'rich_text');`

---
Generated based on implementation in `src/lib/notionClient.ts`.
