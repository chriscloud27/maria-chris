## Testing & Quality Assurance

Das Projekt nutzt moderne Test- und Qualitätswerkzeuge:

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

Weitere Details zur Testkonfiguration findest du in `vitest.config.ts` und `playwright.config.ts`.
# Wedding Landing Page

This project is a landing page for our wedding, built with Next.js, React, and Tailwind CSS.

## Environment Variables

To set up the project, create a `.env.local` file in the root directory based on `.env.local.example`. The following environment variables are required for different functionalities:

### Notion Integration (RSVP and Messages)
- `NOTION_API_KEY`: Your Notion integration API key (from [Notion Integrations](https://www.notion.com/my-integrations)). Required for RSVP functionality to store guest responses.
- `NOTION_DATABASE_ID`: The ID of the Notion database for RSVP data (copy from Notion URL). Required for RSVP.
- `NOTION_MESSAGES_API_KEY`: Your Notion integration API key for messages (can be the same as above if using the same integration). Required for message-related features.
- `NOTION_MESSAGES_DATABASE_ID`: The ID of the Notion database for messages. Required for message functionality.

### Google Drive OAuth (Media Upload)
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID (from Google Cloud Console). Required for media upload authentication.
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret. Required for media upload.
- `GOOGLE_REDIRECT_URI`: The redirect URI for OAuth (e.g., `http://localhost:3000/callback/google` for development, or your production URL). Required for media upload.
- `GOOGLE_REFRESH_TOKEN`: The refresh token obtained during OAuth setup. Required for media upload to maintain access.
- `DRIVE_FOLDER_ID`: The ID of the Google Drive folder where uploaded media will be stored. Required for media upload.
- `DRIVE_FOLDER_ID_JGA`: The ID of an additional Google Drive folder (possibly for specific use cases). Required if using JGA features.

Copy the values from `.env.local.example` and replace the placeholders with your actual secrets. Never commit `.env.local` to version control.

## RSVP System

The RSVP system allows guests to RSVP to our wedding and stores their responses in a Notion database.

### Setup

1. **Environment Variables:** Ensure `NOTION_API_KEY` and `NOTION_DATABASE_ID` are set as described above.

2. **Notion Database:** Create a Notion database with the following properties:
   - `Title` (Title): Guest name.
   - `Email` (Email): Guest email address.
   - `RSVP` (Select): Options: `Yes`, `No`, `Maybe`.
   - `Notes` (Rich text): Any additional notes from the guest.

3. **Dependencies:** Install the project dependencies: `npm install`

### Usage

1. **Start the Development Server:** `npm run dev`
2. **Access the Landing Page:** Open `http://localhost:3000`, go to RSVP, fill and submit the form.
3. **Verify:** Check your Notion database for the RSVP data.

### Important Considerations

- **Database Requirements:** Ensure correct properties as listed.
- **Notion Connection:** Verify permissions for read/write.
- **End-to-End Tests:** Use a separate test database. Run with `npm run test:e2e`.
- **Error Handling:** Check logs for issues.

### Notion Integration Files

- `/src/components/Rsvp.tsx`: RSVP form component.
- `/src/lib/schema.ts`: Data schema.
- `/src/app/api/rsvp/route.ts`: API route for submission.
- `/src/lib/notionClient.ts`: Notion client setup.
- `/src/config/notion.ts`: Configuration.
- `/test/rsvp.integration.test.ts`: Integration tests.

## Media Upload System

The project includes a feature for guests to upload photos and videos to Google Drive.

- **Documentation**: See [MEDIA-UPLOAD.md](./MEDIA-UPLOAD.md) for setup instructions and usage details.
- **Key Config**: Requires the Google OAuth variables listed above in `.env.local`.
