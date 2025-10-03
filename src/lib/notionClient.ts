import { Client, isFullPage } from '@notionhq/client';
import { notionConfig } from '../config/notion';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const notion = new Client({ auth: notionConfig.token });

type RsvpData = {
  'CO/DE': string;
  code?: string;
  name: string;
  email: string;
  whatsapp?: string;
  rsvp: string;
  '+1'?: boolean;
  '19-Connect'?: boolean;
  '21-Boat'?: boolean;
  notes?: string;
  song?: string;
};

// This is the type for the properties object passed to notion.pages.create or notion.pages.update
type NotionProperties = {
  'CO/DE': { rich_text: [{ text: { content: string } }] };
  Code?: { rich_text: [{ text: { content: string } }] };
  Name: { title: [{ text: { content: string } }] };
  Email: { email: string };
  WhatsApp?: { phone_number: string };
  RSVP: { select: { name: string } };
  '+1'?: { checkbox: boolean };
  '19-Connect'?: { checkbox: boolean };
  '21-Boat'?: { checkbox: boolean };
  Notes?: { rich_text: [{ text: { content: string } }] };
  Song?: { rich_text: [{ text: { content: string } }] };
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
  const { 'CO/DE': coDe, code, name, email, whatsapp, rsvp, '+1': plusOne, '19-Connect': connect19, '21-Boat': boat21, notes, song } = data;
  
  // Use code as primary identifier, fall back to email if no code
  const existingPageId = code ? await findRSVPPageIdByCode(code) : await findRSVPByEmail(email);

  const properties: NotionProperties = {
    'CO/DE': { rich_text: [{ text: { content: coDe } }] },
    Name: { title: [{ text: { content: name } }] },
    Email: { email },
    RSVP: { select: { name: rsvp } },
    ...(whatsapp && { WhatsApp: { phone_number: whatsapp } }),
    ...(plusOne !== undefined && { '+1': { checkbox: plusOne } }),
    ...(connect19 !== undefined && { '19-Connect': { checkbox: connect19 } }),
    ...(boat21 !== undefined && { '21-Boat': { checkbox: boat21 } }),
    ...(notes && { Notes: { rich_text: [{ text: { content: notes } }] } }),
    ...(song && { Song: { rich_text: [{ text: { content: song } }] } }),
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
      'CO/DE': getRichText(properties['CO/DE']),
      code: getRichText(properties.Code),
      name: getTitle(properties.Name),
      email: getEmail(properties.Email),
      whatsapp: getPhoneNumber(properties.WhatsApp),
      rsvp: getSelect(properties.RSVP),
      '+1': getCheckbox(properties['+1']),
      '19-Connect': getCheckbox(properties['19-Connect']),
      '21-Boat': getCheckbox(properties['21-Boat']),
      notes: getRichText(properties.Notes),
      song: getRichText(properties.Song),
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
      'CO/DE': getRichText(properties['CO/DE']),
      code: getRichText(properties.Code),
      name: getTitle(properties.Name),
      email: getEmail(properties.Email),
      whatsapp: getPhoneNumber(properties.WhatsApp),
      rsvp: getSelect(properties.RSVP),
      '+1': getCheckbox(properties['+1']),
      '19-Connect': getCheckbox(properties['19-Connect']),
      '21-Boat': getCheckbox(properties['21-Boat']),
      notes: getRichText(properties.Notes),
      song: getRichText(properties.Song),
    };
  }

  return null;
}
