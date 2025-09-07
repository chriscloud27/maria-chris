import 'dotenv/config';
import { findRSVPByCode } from '../src/lib/notionClient';

async function testCode() {
  const code = process.argv[2] || '4062-TB1L';
  
  console.log(`Testing code: ${code}`);
  console.log('Environment check:', {
    hasToken: !!process.env.NOTION_API_KEY,
    hasDatabaseId: !!process.env.NOTION_DATABASE_ID,
  });
  
  try {
    console.log('Trying rich_text filter...');
    let result = await findRSVPByCode(code, 'rich_text');
    
    if (result) {
      console.log('Found with rich_text filter:', result);
    } else {
      console.log('Not found with rich_text filter');
      
      console.log('Trying title filter...');
      result = await findRSVPByCode(code, 'title');
      
      if (result) {
        console.log('Found with title filter:', result);
      } else {
        console.log('Not found with either filter');
      }
    }
  } catch (error: unknown) {
    console.error('Error during lookup:', error);
  }
}

testCode().then(() => {
  console.log('Test completed');
  process.exit(0);
}).catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
