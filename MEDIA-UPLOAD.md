# Media Upload System

The Media Upload system allows guests to upload photos and videos directly to a shared Google Drive folder. It features a drag-and-drop interface, file validation, rate limiting, multi-language support, and a gallery view of uploaded content.

## Features

- **Anonymous Uploads**: No login required for guests
- **OAuth Authentication**: Uses your Google account credentials to upload on behalf of guests
- **Google Drive Storage**: Files are securely stored in a specific Google Drive folder
- **Gallery View**: Automatically displays thumbnails of uploaded images and videos
- **Validation**: Checks file types (images, MP4, MOV) and size (max 10MB per file)
- **Rate Limiting**: Prevents abuse by limiting uploads per IP address (50 files per hour)
- **Multi-language Support**: Translated UI in English, German, and Spanish
- **Batch Upload**: Upload multiple files at once with preview

## Architecture

```
User Browser → MediaUpload Component → /api/mediaupload → Google Drive (via OAuth)
                                                        ↓
                                               Your Google Account
```

## Setup Guide

### 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one, e.g., "maria-chris")
3. Enable the **Google Drive API**:
   - Go to **APIs & Services** > **Library**
   - Search for "Google Drive API"
   - Click **Enable**

4. Configure **OAuth Consent Screen**:
   - Go to **APIs & Services** > **OAuth consent screen**
   - User Type: **External**
   - App name: "Maria & Chris Wedding" (or your choice)
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `../auth/drive.file` and `../auth/drive.readonly`
   - Test users: Add your Google email address
   - Publishing status: Keep as "Testing" or publish to "In production"

5. Create **OAuth 2.0 Client ID**:
   - Go to **APIs & Services** > **Credentials**
   - Click **+ CREATE CREDENTIALS** > **OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Name: "Wedding Media Upload"
   - Authorized redirect URIs:
     - For local development: `http://localhost:3000/callback/google`
     - For production: `https://maria-chris.vercel.app/callback/google`
   - Click **CREATE**
   - Copy the **Client ID** and **Client Secret**

### 2. Google Drive Setup

1. Create a folder in your Google Drive (e.g., "Wedding Uploads")
2. Copy the **Folder ID** from the URL:
   - URL format: `https://drive.google.com/drive/folders/[FOLDER_ID]`
   - Example: If URL is `https://drive.google.com/drive/folders/1ceJdAQQY-6IumqlGLqYzJZSW10e_gzX9`
   - Folder ID is: `1ceJdAQQY-6IumqlGLqYzJZSW10e_gzX9`

### 3. Environment Variables Setup

Add the following to your `.env.local` file:

```bash
# Notion Configuration (if using RSVP)
NOTION_API_KEY=your_notion_key
NOTION_DATABASE_ID=your_database_id

# Google Drive OAuth Configuration
GOOGLE_CLIENT_ID=your_client_id_from_step_1
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_1
GOOGLE_REDIRECT_URI=http://localhost:3000/callback/google  # Change for production
GOOGLE_REFRESH_TOKEN=  # Will be generated in next step

# Google Drive Folder
DRIVE_FOLDER_ID=your_folder_id_from_step_2
```

### 4. One-Time OAuth Authentication

This step generates a refresh token that allows the backend to upload files on your behalf:

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit the OAuth initiation URL:
   ```
   http://localhost:3000/api/auth/google
   ```

3. Sign in with your Google account (the one that has access to the Drive folder)

4. You may see a warning "This app hasn't been verified by Google":
   - Click **Advanced**
   - Click **Go to [your app name] (unsafe)**
   - This is safe - it's your own app

5. Authorize the app to access your Google Drive

6. You'll be redirected to a success page with JSON output:
   ```json
   {
     "success": true,
     "tokens": {
       "GOOGLE_REFRESH_TOKEN": "1//0gXXXXXXXXXXXXXXX..."
     },
     "instructions": [...]
   }
   ```

7. Copy the `GOOGLE_REFRESH_TOKEN` value

8. Add it to your `.env.local` file:
   ```bash
   GOOGLE_REFRESH_TOKEN=1//0gXXXXXXXXXXXXXXX...
   ```

9. Restart your development server to load the new token

### 5. Next.js Configuration

Ensure `next.config.ts` allows images from Google domains:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
    ],
  },
};
```

### 6. Verify Installation

1. Navigate to your page with the MediaUpload component
2. Try uploading a test image
3. Check that:
   - The file appears in your Google Drive folder
   - The gallery section displays the uploaded image
   - No errors appear in the browser console or server logs

## Implementation Details

### Files Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── google/
│   │   │       └── route.ts          # OAuth initiation
│   │   └── mediaupload/
│   │       └── route.ts              # Upload & list files
│   └── callback/
│       └── google/
│           └── route.ts              # OAuth callback handler
└── components/
    └── MediaUpload.tsx               # Frontend component
└── messages/
    ├── en.json                       # English translations
    ├── de.json                       # German translations
    └── es.json                       # Spanish translations
```

### API Routes

#### `POST /api/mediaupload`
Uploads files to Google Drive.

**Request:**
- Content-Type: `multipart/form-data`
- Body: 
  - `file`: File(s) to upload (multiple allowed)
  - `eventId`: Event identifier (optional)

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "id": "file_id",
      "name": "photo.jpg",
      "webViewLink": "https://drive.google.com/..."
    }
  ],
  "errors": []  // Array of error messages for failed uploads
}
```

#### `GET /api/mediaupload?eventId=wedding-2025`
Lists uploaded files from Google Drive.

**Response:**
```json
{
  "files": [
    {
      "id": "file_id",
      "name": "photo.jpg",
      "mimeType": "image/jpeg",
      "thumbnailLink": "https://lh3.googleusercontent.com/...",
      "webViewLink": "https://drive.google.com/..."
    }
  ]
}
```

#### `GET /api/auth/google`
Initiates OAuth flow. Redirects to Google for authentication.

#### `GET /callback/google`
OAuth callback handler. Exchanges authorization code for refresh token.

### Component Usage

```tsx
import { MediaUpload } from "@/components/MediaUpload";

export default function MediaPage() {
  return (
    <MediaUpload 
      eventId="maria-chris"           // Unique event identifier
      apiBaseUrl="/api/mediaupload"   // API endpoint
      title="Photos & Videos 📸"      // Section title
      description="Upload your favorite moments!"  // Description
    />
  );
}
```

### Translation Keys

The component uses `next-intl` for translations. All text is translatable via:

```json
{
  "media": {
    "upload": {
      "selectFiles": "Click to select photos or videos",
      "uploadButton": "Upload Media",
      "uploading": "Uploading...",
      "uploadSuccess": "Upload successful!",
      // ... more keys
    },
    "gallery": {
      "title": "Shared Moments",
      "noPhotos": "No photos yet. Be the first to share!"
    }
  }
}
```

### Rate Limiting

The API implements in-memory rate limiting:
- **Window**: 1 hour
- **Limit**: 50 files per IP address
- **Cost**: Each uploaded file counts as 1

To adjust limits, modify these constants in `src/app/api/mediaupload/route.ts`:
```typescript
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_UPLOADS_PER_WINDOW = 50;         // Max files per window
```

### File Validation

**Accepted file types:**
- Images: JPEG, PNG, GIF, WebP
- Videos: MP4, MOV (QuickTime)

**File size limit:** 10MB per file

To modify, update in `src/app/api/mediaupload/route.ts`:
```typescript
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime'];
```

## Production Deployment

### Vercel Environment Variables

Add these to your Vercel project:

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI` (set to `https://maria-chris.vercel.app/callback/google`)
   - `GOOGLE_REFRESH_TOKEN`
   - `DRIVE_FOLDER_ID`

### Update Redirect URI in Google Cloud Console

1. Go to Google Cloud Console > Credentials
2. Edit your OAuth 2.0 Client ID
3. Add production redirect URI: `https://maria-chris.vercel.app/callback/google`
4. Save

### Generate Production Refresh Token (if needed)

If you need to regenerate the refresh token for production:

1. Deploy your app to Vercel with the Client ID and Secret
2. Visit: `https://maria-chris.vercel.app/api/auth/google`
3. Complete OAuth flow
4. Copy the refresh token and add it to Vercel environment variables
5. Redeploy

## Troubleshooting

### "Rate limit exceeded"
- The API limits uploads per IP address
- Wait 1 hour or adjust `RATE_LIMIT_WINDOW` in `route.ts`
- Consider using a distributed cache (Redis) for production

### "Upload failed" or "GOOGLE_REFRESH_TOKEN is not set"
- Ensure you completed the OAuth flow and copied the refresh token
- Check that the refresh token is in `.env.local`
- Restart the development server after adding the token
- Verify the token is not expired (shouldn't expire unless revoked)

### "Access blocked: This app's request is invalid"
- Verify redirect URI matches exactly in Google Cloud Console
- Check for typos in Client ID and Client Secret
- Ensure the redirect URI includes the correct protocol (http/https)

### "Error 403: access_denied"
- Add your email as a test user in OAuth consent screen
- If in "Testing" mode, only test users can access
- Consider publishing the app or switching to "In production"

### Images not loading in gallery
- Ensure `next.config.ts` has correct `remotePatterns`
- Check that files are actually uploaded to the Drive folder
- Verify the Drive API is enabled in Google Cloud Console
- Check browser console for CORS or image loading errors

### "File not found" error
- Verify `DRIVE_FOLDER_ID` is correct
- Ensure your Google account has access to the folder
- Check that the folder hasn't been deleted or moved

### OAuth token expired
- Refresh tokens generally don't expire unless revoked
- If revoked, repeat the OAuth flow to get a new refresh token
- The backend automatically refreshes access tokens using the refresh token

## Security Considerations

1. **Never commit `.env.local`** to version control
2. **Keep refresh token secret** - it provides full access to your Drive
3. **Rate limiting** prevents abuse but can be circumvented with multiple IPs
4. **File validation** is done server-side to prevent malicious uploads
5. **Consider adding:**
   - File scanning for malware
   - More sophisticated rate limiting (Redis-based)
   - Content moderation
   - User authentication for sensitive events

## Future Enhancements

Potential improvements:
- [ ] Video thumbnail generation
- [ ] Image compression before upload
- [ ] Direct file download links
- [ ] Admin panel to manage uploads
- [ ] Email notifications on new uploads
- [ ] Image cropping/editing before upload
- [ ] Social media sharing
- [ ] Comments on uploaded media
