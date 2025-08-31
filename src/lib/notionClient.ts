import { Client } from "@notionhq/client";
import { notionConfig } from "../config/notion";

export const notion = new Client({ auth: notionConfig.token });

export async function addRSVP({
  name,
  email,
  rsvp,
  notes,
}: {
  name: string;
  email: string;
  rsvp: string; // e.g. "Yes" | "No" | "Maybe"
  notes?: string;
}) {
  // Await the Notion API call
  return await notion.pages.create({
    parent: { database_id: notionConfig.databaseId },
    properties: {
      // The name of the property in Notion, which is "Name"
      // The name of the property in Notion, which is "Name"
      Name: { title: [{ text: { content: name } }] },
      Email: { email },
      RSVP: { select: { name: rsvp } },
      ...(notes ? { Notes: { rich_text: [{ text: { content: notes } }] } } : {}),
    },
  });
}
