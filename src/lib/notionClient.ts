import { Client } from '@notionhq/client';
import { notionConfig } from '../config/notion';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const notion = new Client({ auth: notionConfig.token });

type RsvpData = {
  code?: string;
  name: string;
  whatsapp?: string;
  rsvp: string;
  '19-Connect'?: boolean;
  'BigDay'?: boolean;
  '21-Boat'?: boolean;
  notes?: string;
  song?: string;
};

// This is the type for the properties object passed to notion.pages.create or notion.pages.update
// code (string), name (string), whatsapp (string), RSVP (string), 21-Boat (string), 19-Connect (string)
type NotionProperties = {
  Code?: { rich_text: [{ text: { content: string } }] };
  Name: { title: [{ text: { content: string } }] };
  // Email: { email: string };
  WhatsApp?: { phone_number: string };
  RSVP: { select: { name: string } };
  // '+1'?: { checkbox: boolean };
  '19-Connect'?: { checkbox: boolean };
  'BigDay'?: { checkbox: boolean };
  '21-Boat'?: { checkbox: boolean };
  Notes?: { rich_text: [{ text: { content: string } }] };
  Song?: { rich_text: [{ text: { content: string } }] };
};


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
  const { code, name, whatsapp, rsvp, '19-Connect': connect19, 'BigDay': bigDay, '21-Boat': boat21, notes, song } = data;
  
  // Use code as primary identifier
  const existingPageId = code ? await findRSVPPageIdByCode(code) : null;

  const properties: NotionProperties = {
    Name: { title: [{ text: { content: name } }] },
    RSVP: { select: { name: rsvp } },
    ...(whatsapp && { WhatsApp: { phone_number: whatsapp } }),
    ...(connect19 !== undefined && { '19-Connect': { checkbox: connect19 } }),
    ...(bigDay !== undefined && { 'BigDay': { checkbox: bigDay } }),
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

// The Notion SDK versions vary in their helper exports. Instead of relying on
// `isFullPage` from the SDK, use a lightweight local guard to ensure the
// returned result looks like a page object with a `properties` field.
function isPageObject(obj: unknown): obj is { properties: PageObjectResponse['properties'] } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'properties' in (obj as Record<string, unknown>) &&
    typeof (obj as Record<string, unknown>).properties === 'object'
  );
}

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
    if (!isPageObject(page)) {
      return null;
    }

    const properties = page.properties as PageObjectResponse['properties'];

    const getRichText = (prop?: NotionProperty): string =>
      (prop && prop.type === 'rich_text' && prop.rich_text[0]?.plain_text) || '';
    const getTitle = (prop?: NotionProperty): string => (prop && prop.type === 'title' && prop.title[0]?.plain_text) || '';
    const getSelect = (prop?: NotionProperty): string => (prop && prop.type === 'select' && prop.select?.name) || 'Yes';
    const getCheckbox = (prop?: NotionProperty): boolean => (prop && prop.type === 'checkbox' && prop.checkbox) || false;
    const getPhoneNumber = (prop?: NotionProperty): string => (prop && prop.type === 'phone_number' && prop.phone_number) || '';

    return {
      code: getRichText(properties.Code),
      name: getTitle(properties.Name),
      whatsapp: getPhoneNumber(properties.WhatsApp),
      rsvp: getSelect(properties.RSVP),
      '19-Connect': getCheckbox(properties['19-Connect']),
      'BigDay': getCheckbox(properties['BigDay']),
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
    if (!isPageObject(page)) {
      return null;
    }

    const properties = page.properties as PageObjectResponse['properties'];

    const getRichText = (prop?: NotionProperty): string =>
      (prop && prop.type === 'rich_text' && prop.rich_text[0]?.plain_text) || '';
    const getTitle = (prop?: NotionProperty): string => (prop && prop.type === 'title' && prop.title[0]?.plain_text) || '';
    const getSelect = (prop?: NotionProperty): string => (prop && prop.type === 'select' && prop.select?.name) || 'Yes';
    const getCheckbox = (prop?: NotionProperty): boolean => (prop && prop.type === 'checkbox' && prop.checkbox) || false;
    const getPhoneNumber = (prop?: NotionProperty): string => (prop && prop.type === 'phone_number' && prop.phone_number) || '';

    return {
      code: getRichText(properties.Code),
      name: getTitle(properties.Name),
      whatsapp: getPhoneNumber(properties.WhatsApp),
      rsvp: getSelect(properties.RSVP),
      '19-Connect': getCheckbox(properties['19-Connect']),
      'BigDay': getCheckbox(properties['BigDay']),
      '21-Boat': getCheckbox(properties['21-Boat']),
      notes: getRichText(properties.Notes),
      song: getRichText(properties.Song),
    };
  }

  return null;
}
