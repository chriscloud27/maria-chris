import 'dotenv/config';

type RSVPValue = 'Yes' | 'No' | 'Maybe';

// Derive types from the actual module shape to avoid `any`
type ModuleType = typeof import('./notionClient');
type AddRSVPFn = ModuleType['addRSVP'];

// Mock shape for Notion client pages.create
type NotionPagesMock = {
  create: jest.Mock<Promise<unknown>, [unknown]>;
};
type NotionMock = {
  pages: NotionPagesMock;
};

type NotionCreatePayload = {
  parent: { database_id: string };
  properties: {
    Name: { title: { text: { content: string } }[] };
    Email: { email: string };
    RSVP: { select: { name: string } };
    Notes?: { rich_text: { text: { content: string } }[] };
  };
};

let addRSVP: AddRSVPFn;
let notion: NotionMock;

beforeEach(async () => {
  // Ensure the config reads a test database id (no real secrets needed)
  process.env.NOTION_DATABASE_ID = 'test-db-id';
  jest.resetModules();

  // Dynamic import and typed assignment
  const mod = (await import('./notionClient')) as ModuleType;
  addRSVP = mod.addRSVP;

  // Cast imported notion to our mock shape via unknown (avoids `any`)
  notion = (mod.notion as unknown) as NotionMock;

  // Provide a mocked pages.create
  notion.pages = { create: jest.fn().mockResolvedValue({ id: 'page-id' }) };
});

test('calls notion.pages.create with expected payload including notes', async () => {
  const data = { name: 'John Doe', email: 'john@example.com', rsvp: 'Yes' as RSVPValue, notes: 'See you' };
  await addRSVP(data);

  expect(notion.pages.create).toHaveBeenCalledTimes(1);
  // cast the mocked call argument to a typed payload so `calledWith` is not `unknown`
  const calledWith = notion.pages.create.mock.calls[0][0] as NotionCreatePayload;
  // Name property is now used for the page title
  expect(calledWith.parent.database_id).toBe('test-db-id');
  expect(calledWith.properties.Name.title[0].text.content).toBe(data.name);
  expect(calledWith.properties.Email.email).toBe(data.email);
  expect(calledWith.properties.RSVP.select.name).toBe(data.rsvp);
  expect(calledWith.properties.Notes!.rich_text[0].text.content).toBe(data.notes);
});

test('omits Notes when notes not provided', async () => {
  notion.pages.create = jest.fn().mockResolvedValue({});
  const data = { name: 'Jane', email: 'jane@example.com', rsvp: 'No' as RSVPValue };
  await addRSVP(data);

  const calledWith = notion.pages.create.mock.calls[0][0];
  expect(calledWith.properties.Notes).toBeUndefined();
});
