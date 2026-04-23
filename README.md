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

## RSVP System

The RSVP system allows guests to RSVP to our wedding and stores their responses in a Notion database.

### Setup

1.  **Environment Variables:**

    *   Create a `.env.local` file in the root directory of the project.
    *   Add the following environment variables:

        ```
        NOTION_TOKEN=<your_notion_integration_token>
        NOTION_DATABASE_ID=<your_notion_database_id>
        RESEND_API_KEY=<your_resend_api_key>
        ```

## Media Upload System

The project includes a feature for guests to upload photos and videos to Google Drive.

- **Documentation**: See [MEDIA-UPLOAD.md](./MEDIA-UPLOAD.md) for setup instructions and usage details.
- **Key Config**: Requires `GOOGLE_SERVICE_ACCOUNT_KEY` and `DRIVE_FOLDER_ID` in `.env.local`.
        RESEND_FROM_EMAIL=<your_resend_from_email>
        RSVP_DEADLINE=<rsvp_deadline_date> # e.g., '2026-05-10T23:59:59'
        ```

    *   `NOTION_TOKEN`:  Internal integration secret from [https://www.notion.com/my-integrations](https://www.notion.com/my-integrations).
    *   `NOTION_DATABASE_ID`: The UUID of the RSVP Sync database (copied from Notion URL).
    *   `RESEND_API_KEY`: Your Resend API key for sending confirmation emails.
    *   `RESEND_FROM_EMAIL`: The email address to send confirmation emails from (e.g., `Wedding RSVP <noreply@yourdomain.com>`).
    *   `RSVP_DEADLINE`: The deadline for submitting RSVPs.

2.  **Notion Database:**

    *   Create a Notion database with the following properties:
        *   `Title` (Title): Guest name.
        *   `Email` (Email): Guest email address.
        *   `RSVP` (Select):  Options: `Yes`, `No`, `Maybe`.
        *   `Notes` (Rich text):  Any additional notes from the guest.

3.  **Dependencies:**

    *   Install the project dependencies:

        ```bash
        npm install
        ```

### Usage

1.  **Start the Development Server:**

    ```bash
    npm run dev
    ```

2.  **Access the Landing Page:**

    *   Open your browser and navigate to `http://localhost:3000`.
    *   Go to the RSVP section and fill out the form.
    *   Submit the form.

3.  **Verify the Data:**

    *   Check your Notion database to ensure that the RSVP data has been successfully added.
    *   Check your email to ensure that you have received a confirmation email.

### Important Considerations

*   **Database Requirements:** Ensure that your Notion database has the correct properties (`Title`, `Email`, `RSVP`, `Notes`) with the specified types.
*   **Notion Connection:** Verify that your `NOTION_TOKEN` has the necessary permissions to read and write to the Notion database.
*   **End-to-End Tests:**

    *   This project includes end-to-end tests using Playwright to verify the entire flow from form input to Notion DB update.
    *   To run the tests:

        ```bash
        npm install --save-dev playwright @notionhq/client
        npx playwright test
        ```

    *   **Test Database:** It's crucial to use a separate Notion database for testing to avoid corrupting your production data. Set up a new database in Notion and update the `NOTION_DATABASE_ID` in your `.env.local` file (or a separate `.env.test.local` if you configure your test environment that way).
    *   **Authentication:** Make sure your `NOTION_TOKEN` is valid and has the necessary permissions to read and write to the test database.
    *   **Cleanup:** The tests include a cleanup step to delete the test data from the Notion database after the test runs.
*   **Error Handling:** The API route includes error handling and logging to help diagnose any issues. Check the server-side logs for more details if you encounter any errors.

### Notion Integration Files

*   `/src/components/Rsvp.tsx`: The React component for the RSVP form.
*   `/src/lib/schema.ts`: Defines the schema for the RSVP data using Zod.
*   `/src/app/api/rsvp/route.ts`: The Next.js API route that handles the form submission and writes to Notion.
*   `/src/lib/notionClient.ts`: Initializes the Notion client and provides the `addRSVP` function.
*   `/src/config/notion.ts`: Contains the configuration for the Notion integration.
*   `/test/rsvp.integration.test.ts`: Contains the end-to-end integration tests.

## Backfill Notion Codes

The `backfillnotioncodes` script generates and assigns unique RSVP codes to guests in your Notion database who don't already have one.

### Prerequisites

- Ensure your `.env.local` file is configured with `NOTION_API_KEY` and `NOTION_DATABASE_ID` (same as for the RSVP system).
- The Notion database should have a "Code" property (Rich text type).

### Running the Script

```bash
npx ts-node scripts/backfillNotionCodes.ts
```

### What it does

- Queries all pages in your Notion RSVP database.
- Checks each guest entry for an existing code in the "Code" property.
- Generates a random unique code (format: XXXX-YYYY, e.g., 4821-XK9D) for entries without codes.
- Updates the Notion page with the new code.
- Skips entries that already have codes.
- Processes all pages, handling pagination automatically.

### Output

The script will log its progress, showing how many pages were processed, skipped, and updated.
