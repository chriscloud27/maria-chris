// Notion Integration Config
// NOTION_TOKEN and NOTION_DATABASE_ID must be set in server-side environment (.env.local)
export const notionConfig = {
  token: process.env.NOTION_TOKEN!,
  databaseId: process.env.NOTION_DATABASE_ID!,
};
