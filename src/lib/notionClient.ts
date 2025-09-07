import { Client, isFullPage } from '@notionhq/client';
import { notionConfig } from '../config/notion';
import {
  PageObjectResponse,
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
  whatsapp?: string;
  code?: string;
};

// This is the type for the properties object passed to notion.pages.create or notion.pages.update
type NotionProperties = {
  Name: { title: [{ text: { content: string } }] };
  Email: { email: string };
  RSVP: { select: { name: string } };
  Notes?: { rich_text: [{ text: { content: string } }] };
  Song?: { rich_text: [{ text: { content: string } }] };
  Boat?: { select: { name: string } };
  WhatsApp?: { phone_number: string };
  Code?: { rich_text: [{ text: { content: string } }] };
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

async function findRSVPPageIdByCode(code: string): Promise<string | null> {
  if (!code) return null;
  
  // First try rich_text
  let response = await notion.databases.query({
    database_id: notionConfig.databaseId,
    filter: {
      property: 'Code',
      rich_text: {
        equals: code,
      },
    },
    page_size: 1,
  });

  if (response.results.length > 0) {
    return response.results[0].id;
  }

  // If not found, try title
  response = await notion.databases.query({
    database_id: notionConfig.databaseId,
    filter: {
      property: 'Code',
      title: {
        equals: code,
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
  const { name, email, rsvp, notes, song, boat, whatsapp, code } = data;
  
  // Use code as primary identifier, fall back to email if no code
  const existingPageId = code ? await findRSVPPageIdByCode(code) : await findRSVPByEmail(email);

  const properties: NotionProperties = {
    Name: { title: [{ text: { content: name } }] },
    Email: { email },
    RSVP: { select: { name: rsvp } },
    ...(notes && { Notes: { rich_text: [{ text: { content: notes } }] } }),
    ...(song && { Song: { rich_text: [{ text: { content: song } }] } }),
    ...(boat !== undefined && { Boat: { select: { name: boat ? 'Yes' : 'No' } } }),
    ...(whatsapp && { WhatsApp: { phone_number: whatsapp } }),
    // Only add Code if it's provided (for new records)
    ...(code && !existingPageId && { Code: { rich_text: [{ text: { content: code } }] } }),
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
    const getCheckbox = (prop: NotionProperty): boolean => (prop.type === 'checkbox' && prop.checkbox) || false;
    const getPhoneNumber = (prop: NotionProperty): string => (prop.type === 'phone_number' && prop.phone_number) || '';

    return {
      name: getTitle(properties.Name),
      email: getEmail(properties.Email),
      rsvp: getSelect(properties.RSVP),
      notes: getRichText(properties.Notes),
      song: getRichText(properties.Song),
      boat: getCheckbox(properties.Boat),
      whatsapp: getPhoneNumber(properties.WhatsApp),
    };
  }

  return null;
}

export async function findRSVPByCode(code: string, filterType: 'rich_text' | 'title' = 'rich_text') {
  const filter = filterType === 'rich_text' 
    ? {
        property: 'Code',
        rich_text: { equals: code },
      }
    : {
        property: 'Code',
        title: { equals: code },
      };

  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: notionConfig.databaseId,
    filter,
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
    const getCheckbox = (prop: NotionProperty): boolean => (prop.type === 'checkbox' && prop.checkbox) || false;
    const getPhoneNumber = (prop: NotionProperty): string => (prop.type === 'phone_number' && prop.phone_number) || '';

    return {
      name: getTitle(properties.Name),
      email: getEmail(properties.Email),
      rsvp: getSelect(properties.RSVP),
      notes: getRichText(properties.Notes),
      song: getRichText(properties.Song),
      boat: getCheckbox(properties.Boat),
      whatsapp: getPhoneNumber(properties.WhatsApp),
      code: getRichText(properties.Code),
    };
  }

  return null;
}
