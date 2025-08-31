import { test, expect } from '@playwright/test';
import { Client } from '@notionhq/client';
import { notionConfig } from '../src/config/notion';

test('End-to-end RSVP submission', async ({ page }) => {
  // 1. Go to the RSVP page
  await page.goto('/rsvp'); // Adjust the path if necessary

  // 2. Fill out the form
  await page.fill('input[name="name"]', 'Integration Test User');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.selectOption('select[name="rsvp"]', 'Yes');
  await page.fill('textarea[name="notes"]', 'Integration test notes');

  // 3. Submit the form
  await page.click('button[type="submit"]');

  // 4. Wait for success message
  await page.waitForSelector('.bg-green-100'); // Adjust selector if needed
  await expect(page.locator('.bg-green-100')).toContainText('Thank you!');

  // 5. Verify data in Notion (using Notion API)
  const notion = new Client({ auth: notionConfig.token });
  const databaseId = notionConfig.databaseId;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Email',
      email: {
        equals: 'test@example.com',
      },
    },
  });

  expect(response.results.length).toBe(1);
  const rsvpEntry = response.results[0] as any; // Adjust type if needed
  expect(rsvpEntry.properties.Title.title[0].plain_text).toBe('Integration Test User');
  expect(rsvpEntry.properties.Email.email).toBe('test@example.com');
  expect(rsvpEntry.properties.RSVP.select.name).toBe('Yes');
  // Notes property might be undefined, so check if it exists first
  if (rsvpEntry.properties.Notes) {
    expect(rsvpEntry.properties.Notes.rich_text[0].plain_text).toBe('Integration test notes');
  }

  // 6. Clean up the test data (delete the entry from Notion)
  const pageId = rsvpEntry.id;
  await notion.pages.update({
    page_id: pageId,
    properties: {
      // You might need to archive or delete the page depending on your setup
      Archived: { checkbox: true }, // Example: Add an "Archived" property
    },
  });
});
