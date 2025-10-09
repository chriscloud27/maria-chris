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
  '+1'?: boolean;
  AccommodationNeeded?: boolean;
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
  // '+1'?: { checkbox: boolean };
  // These are stored in Notion as select properties with options like 'Yes'/'No'.
  '19-Connect'?: { select: { name: string } };
  '+1'?: { select: { name: string } };
  AccommodationNeeded?: { select: { name: string } };
  '20-BigDay'?: { select: { name: string } };
  '21-Boat'?: { select: { name: string } };
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
  const { code, name, whatsapp, '19-Connect': connect19, 'BigDay': bigDay, '21-Boat': boat21, notes, song } = data;
  
  // Use code as primary identifier
  const existingPageId = code ? await findRSVPPageIdByCode(code) : null;

  const properties: NotionProperties = {
    Name: { title: [{ text: { content: name } }] },
    ...(whatsapp && { WhatsApp: { phone_number: whatsapp } }),
  // +1 is stored as a select (Yes/No) in Notion to match other event fields
  '+1': { select: { name: data['+1'] ? 'Yes' : 'No' } },
  AccommodationNeeded: { select: { name: data.AccommodationNeeded ? 'Yes' : 'No' } },
  // These are informational in Notion — only set them when true to avoid
  // sending explicit 'No' / false values which are unnecessary.
  // Persist as select options 'Yes' or 'No' — Notion will validate these as selects.
  '19-Connect': { select: { name: connect19 ? 'Yes' : 'No' } },
  '20-BigDay': { select: { name: bigDay ? 'Yes' : 'No' } },
  '21-Boat': { select: { name: boat21 ? 'Yes' : 'No' } },
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

// select helper removed — using checkbox properties for these fields now

// checkbox guard removed — using propIsYes for normalization

// Interpret a Notion property as boolean 'Yes' if:
// - it's a checkbox and checked, or
// - it's a select/title/rich_text whose text (case-insensitive) equals 'Yes'
function propIsYes(prop?: NotionProperty): boolean {
  if (!prop) return false;
  const t = (prop as { type?: string }).type;
  if (t === 'checkbox') {
    const checkboxProp = prop as Extract<NotionProperty, { type: 'checkbox' }>;
    return Boolean(checkboxProp.checkbox);
  }
  if (t === 'select') {
    const selectProp = prop as Extract<NotionProperty, { type: 'select' }>;
    return String(selectProp.select?.name || '').toLowerCase() === 'yes';
  }
  if (t === 'title') {
    const titleProp = prop as Extract<NotionProperty, { type: 'title' }>;
    return String(titleProp.title?.[0]?.plain_text || '').toLowerCase() === 'yes';
  }
  if (t === 'rich_text') {
    const rtProp = prop as Extract<NotionProperty, { type: 'rich_text' }>;
    return String(rtProp.rich_text?.[0]?.plain_text || '').toLowerCase() === 'yes';
  }
  return false;
}

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
  // checkbox helper removed (not needed for select conversions below)
    const getPhoneNumber = (prop?: NotionProperty): string => (prop && prop.type === 'phone_number' && prop.phone_number) || '';

    return {
      code: getRichText(properties.Code),
      name: getTitle(properties.Name),
      whatsapp: getPhoneNumber(properties.WhatsApp),
  '+1': propIsYes(properties['+1']),
  AccommodationNeeded: propIsYes(properties['AccommodationNeeded']),
  // rsvp is not stored in Notion; skip
  '19-Connect': propIsYes(properties['19-Connect']),
  'BigDay': propIsYes(properties['20-BigDay']),
  '21-Boat': propIsYes(properties['21-Boat']),
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
  // checkbox helper removed (not needed for select conversions below)
    const getPhoneNumber = (prop?: NotionProperty): string => (prop && prop.type === 'phone_number' && prop.phone_number) || '';

    return {
      code: getRichText(properties.Code),
      name: getTitle(properties.Name),
      whatsapp: getPhoneNumber(properties.WhatsApp),
  // rsvp is not stored in Notion; skip
  '+1': propIsYes(properties['+1']),
  AccommodationNeeded: propIsYes(properties['AccommodationNeeded']),
  '19-Connect': propIsYes(properties['19-Connect']),
  'BigDay': propIsYes(properties['20-BigDay']),
  '21-Boat': propIsYes(properties['21-Boat']),
      notes: getRichText(properties.Notes),
      song: getRichText(properties.Song),
    };
  }

  return null;
}
