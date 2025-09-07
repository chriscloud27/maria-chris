// Notion Integration Config
// NOTION_API_KEY and NOTION_DATABASE_ID must be set in server-side environment (.env.local)
export const notionConfig = {
  token: process.env.NOTION_API_KEY!,
  databaseId: process.env.NOTION_DATABASE_ID!,
};
