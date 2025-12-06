import { NextResponse } from 'next/server';
import { notion } from '@/lib/notionClient';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            property: 'Table_nr',
            number: {
              is_not_empty: true
            }
          },
          {
            property: 'Name',
            title: {
              is_not_empty: true
            }
          }
        ]
      }
    });

    const guests = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map((page) => {
        const properties = page.properties;
        return {
          Name: properties.Name?.type === 'title' ? properties.Name.title[0]?.plain_text || '' : '',
          Table_nr: properties.Table_nr?.type === 'number' ? properties.Table_nr.number?.toString() || '' : ''
        };
      });

    return NextResponse.json(guests);
  } catch (error) {
    console.error('Error fetching guests from Notion:', error);
    return NextResponse.json({ error: 'Failed to fetch guests' }, { status: 500 });
  }
}