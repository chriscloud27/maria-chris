// Quick Notion connection test script.
// Run with: npx ts-node scripts/test-notion.ts
import 'dotenv/config'; // loads .env.local when run from repo root if you have DOTENV configured; or use { path: '.env.local' }
import { Client } from '@notionhq/client';
import { notionConfig } from '../src/config/notion';

async function main() {
  if (!notionConfig.token || !notionConfig.databaseId) {
    console.error('NOTION_TOKEN or NOTION_DATABASE_ID missing in environment.');
    process.exit(1);
  }

  const client = new Client({ auth: notionConfig.token });

  try {
    const db = await client.databases.retrieve({ database_id: notionConfig.databaseId });
    console.log('Notion connection OK.');
    // Print some basic info to confirm
    console.log('Database id:', notionConfig.databaseId);
    // Attempt to show the title (may be nested)
    // @ts-ignore
    const titleProp = Array.isArray(db.title) ? db.title.map((t: any) => t.plain_text).join('') : undefined;
    if (titleProp) console.log('Database title:', titleProp);
    process.exit(0);
  } catch (err: any) {
    console.error('Notion connection failed:', err?.message || err);
    process.exit(2);
  }
}

main();
