import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

if (!apiKey || !databaseId) {
  console.error('Error: Missing NOTION_TOKEN or NOTION_DATABASE_ID in your .env.local file.');
  process.exit(1);
}

const notion = new Client({ auth: apiKey });

// Generate a random code like "4821-XK9D"
function generateCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000).toString();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let letters = '';
  for (let i = 0; i < 4; i++) {
    letters += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${digits}-${letters}`;
}

async function backfillCodes(dbId: string) {
  const response = await notion.databases.query({
    database_id: dbId,
  });

  for (const page of response.results) {
    const pageId = page.id;

    // @ts-expect-error - dynamic property access
    const codeProp = page.properties?.Code?.rich_text;
    if (codeProp && codeProp.length > 0) {
      console.log(`Skipping page ${pageId}, already has code.`);
      continue;
    }

    const newCode = generateCode();
    console.log(`Updating page ${pageId} with code ${newCode}`);

    await notion.pages.update({
      page_id: pageId,
      properties: {
        Code: {
          rich_text: [{ text: { content: newCode } }],
        },
      },
    });
  }
}

backfillCodes(databaseId).catch(err => {
  console.error('Error running backfill:', err);
  process.exit(1);
});
