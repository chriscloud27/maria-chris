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
  kids?: boolean;
  '+1'?: boolean;
  AccommodationNeeded?: boolean;
  '19-Connect'?: boolean;
  'RSVP-DE'?: boolean;
  '21-Boat'?: boolean;
  notes?: string;
};

// This is the type for the properties object passed to notion.pages.create or notion.pages.update
// code (string), name (string), whatsapp (string), RSVP (string), 21-Boat (string), 19-Connect (string)
type NotionProperties = {
  Code?: { rich_text: [{ text: { content: string } }] };
  Name: { title: [{ text: { content: string } }] };
  // Email: { email: string };
  Kids?: { number: number };
  '19-Connect'?: { status: { name: string } };
  '+1'?: { number: number };
  AccommodationNeeded?: { select: { name: string } };
  'RSVP-DE'?: { select: { name: string } };
  '21-Boat'?: { status: { name: string } };
  Notes?: { rich_text: [{ text: { content: string } }] };
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
  const { code, name, kids, '+1': plusOne, 'RSVP-DE': bigDay, notes } = data;
  
  // Use code as primary identifier
  const existingPageId = code ? await findRSVPPageIdByCode(code) : null;

  const properties: NotionProperties = {
    Name: { title: [{ text: { content: name } }] },
    Kids: { number: kids ? 1 : 0 },
  '+1': { number: plusOne ? 1 : 0 },
  'RSVP-DE': { select: { name: bigDay ? 'Yes' : 'No' } },
  ...(notes && { Notes: { rich_text: [{ text: { content: notes } }] } }),
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

// select helper removed - using checkbox properties for these fields now

// checkbox guard removed - using propIsYes for normalization

// Interpret a Notion property as boolean 'Yes' if:
// - it's a checkbox and checked, or
// - it's a select/title/rich_text whose text (case-insensitive) equals 'Yes'
function propIsYes(prop?: NotionProperty): boolean {
  if (!prop) return false;
  const t = (prop as { type?: string }).type;
  if (t === 'number') {
    const numProp = prop as Extract<NotionProperty, { type: 'number' }>;
    return numProp.number === 1;
  }
  if (t === 'checkbox') {
    const checkboxProp = prop as Extract<NotionProperty, { type: 'checkbox' }>;
    return Boolean(checkboxProp.checkbox);
  }
  if (t === 'select') {
    const selectProp = prop as Extract<NotionProperty, { type: 'select' }>;
    return String(selectProp.select?.name || '').toLowerCase() === 'yes';
  }
  if (t === 'status') {
    const statusProp = prop as Extract<NotionProperty, { type: 'status' }>;
    return String(statusProp.status?.name || '').toLowerCase() === 'yes';
  }
  if (t === 'title') {
    const titleProp = prop as Extract<NotionProperty, { type: 'title' }>;
    return String(titleProp.title?.[0]?.plain_text || '').toLowerCase() === 'yes';
  }
  if (t === 'multi_select') {
    const multiSelectProp = prop as Extract<NotionProperty, { type: 'multi_select' }>;
    return multiSelectProp.multi_select.some(option => String(option.name || '').toLowerCase() === 'yes');
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

    return {
      code: getRichText(properties.Code),
      name: getTitle(properties.Name),
      kids: propIsYes(properties.Kids),
  '+1': propIsYes(properties['+1']),
  'RSVP-DE': propIsYes(properties['RSVP-DE']),
      notes: getRichText(properties.Notes),
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

    return {
      code: getRichText(properties.Code),
      name: getTitle(properties.Name),
      kids: propIsYes(properties.Kids),
  // rsvp is not stored in Notion; skip
  '+1': propIsYes(properties['+1']),
  'RSVP-DE': propIsYes(properties['RSVP-DE']),
      notes: getRichText(properties.Notes),
    };
  }

  return null;
}
