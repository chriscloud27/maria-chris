import { Client, isFullPage } from '@notionhq/client';
import { notionConfig } from '../config/notion';
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const notion = new Client({ auth: notionConfig.token });

type RsvpData = {
  name: string;
  email: string;
  rsvp: string;
  notes?: string;
  song?: string;
  boat?: boolean;
};

async function findRSVPByEmail(email: string): Promise<string | null> {
  if (!email) return null;
  const response = await notion.databases.query({
    database_id: notionConfig.databaseId,
    filter: {
      property: 'Email',
      email: {
        equals: email,
      },
    },
    page_size: 1,
  });

  if (response.results.length > 0) {
    return response.results[0].id;
  }
  return null;
}

export async function addRSVP(data: RsvpData) {
  const { name, email, rsvp, notes, song, boat } = data;
  const existingPageId = await findRSVPByEmail(email);

  const properties: any = {
    Name: { title: [{ text: { content: name } }] },
    Email: { email },
    RSVP: { select: { name: rsvp } },
    ...(notes && { Notes: { rich_text: [{ text: { content: notes } }] } }),
    ...(song && { Song: { rich_text: [{ text: { content: song } }] } }),
    ...(boat !== undefined && { Boat: { select: { name: boat ? 'Yes' : 'No' } } }),
  };

  if (existingPageId) {
    return await notion.pages.update({
      page_id: existingPageId,
      properties,
    });
  } else {
    return await notion.pages.create({
      parent: { database_id: notionConfig.databaseId },
      properties,
    });
  }
}

type NotionProperty = PageObjectResponse['properties'][string];

export async function findRSVPByName(name: string) {
  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: notionConfig.databaseId,
    filter: {
      property: 'Name',
      title: {
        contains: name,
      },
    },
    page_size: 1,
  });

  if (response.results.length > 0) {
    const page = response.results[0];
    if (!isFullPage(page)) {
      return null;
    }

    const properties = page.properties;

    const getRichText = (prop: NotionProperty): string =>
      (prop.type === 'rich_text' && prop.rich_text[0]?.plain_text) || '';
    const getTitle = (prop: NotionProperty): string => (prop.type === 'title' && prop.title[0]?.plain_text) || '';
    const getEmail = (prop: NotionProperty): string => (prop.type === 'email' && prop.email) || '';
    const getSelect = (prop: NotionProperty): string => (prop.type === 'select' && prop.select?.name) || 'Yes';
    const getCheckbox = (prop: NotionProperty): boolean => (prop.type === 'select' && prop.select?.name === 'Yes') || false;

    return {
      name: getTitle(properties.Name),
      email: getEmail(properties.Email),
      rsvp: getSelect(properties.RSVP),
      notes: getRichText(properties.Notes),
      song: getRichText(properties.Song),
      boat: getCheckbox(properties.Boat),
    };
  }

  return null;
}
