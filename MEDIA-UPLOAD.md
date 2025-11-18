# Media Upload System

The Media Upload system allows guests to upload photos and videos directly to a shared Google Drive folder. It features a drag-and-drop interface, file validation, rate limiting, and a gallery view of uploaded content.

## Features

- **Anonymous Uploads**: No login required for guests.
- **Google Drive Storage**: Files are securely stored in a specific Google Drive folder.
- **Gallery View**: Automatically displays thumbnails of uploaded images and videos.
- **Validation**: Checks file types (images, MP4) and size (max 10MB).
- **Rate Limiting**: Prevents abuse by limiting uploads per IP address.

## Setup Guide

### 1. Google Cloud Setup

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "Wedding Media").
3.  Enable the **Google Drive API**.
4.  Create a **Service Account**:
    *   Go to **IAM & Admin** > **Service Accounts**.
    *   Create a new service account.
    *   Create a JSON key for this account and download it.

### 2. Google Drive Setup

1.  Create a folder in your Google Drive (e.g., "Wedding Uploads").
2.  **Share** this folder with the **Service Account email address** (found in the JSON key file).
3.  Give the service account **Editor** permissions.
4.  Copy the **Folder ID** from the URL (the string after `folders/`).

### 3. Environment Variables

Add the following to your `.env.local` file:

```bash
# Google Drive Folder ID
DRIVE_FOLDER_ID="your_folder_id_here"

# Google Service Account Key (JSON content)
# Must be a single line or properly quoted
GOOGLE_SERVICE_ACCOUNT_KEY='{
  "type": "service_account",
  "project_id": "...",
  ...
}'
```

### 4. Next.js Configuration

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

## Usage

The feature is implemented via:

1.  **Component**: `src/components/MediaUpload.tsx` - The frontend widget.
2.  **API Route**: `src/app/api/mediaupload/route.ts` - Handles uploads and listing files.

To use it in a page:

```tsx
import { MediaUpload } from "@/components/MediaUpload";

<MediaUpload 
  eventId="wedding-2025" 
  apiBaseUrl="/api/mediaupload" 
  title="Photos & Videos" 
  description="Share your moments!" 
/>
```

## Troubleshooting

- **"Rate limit exceeded"**: The API limits uploads per IP. Wait an hour or adjust `RATE_LIMIT_WINDOW` in the API route.
- **"Upload failed"**: Check server logs. Ensure the Service Account has "Editor" access to the Drive folder.
- **Images not loading**: Ensure `next.config.ts` has the correct `remotePatterns` and that the Drive folder allows viewing (Service Account permissions usually suffice for the API to generate links).
