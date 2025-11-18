# MediaUpload Widget Feature Specification

## Vision

The MediaUpload widget aims to enhance the wedding landing page by providing guests with a simple, secure, and engaging way to share photos and videos from the event. As an embedded component, it allows anonymous uploads without requiring user accounts, fostering community and capturing memories in real-time. The widget will store media in Google Drive for easy access and management, aligning with the site's elegant, mobile-friendly design. This feature promotes guest participation, creates a digital scrapbook, and adds value to the overall wedding experience without disrupting the site's core functionality.

Key goals:
- **Simplicity**: Minimal friction for uploads and viewing.
- **Security**: Protect against abuse while ensuring privacy.
- **Integration**: Seamlessly fit into the existing Next.js wedding site.
- **Scalability**: Start with MVP and expand based on usage.

## Requirements

### Functional Requirements
- **Upload Functionality**:
  - Allow guests to upload photos (JPEG/PNG) and short videos (MP4) up to 10MB.
  - Support drag-and-drop or click-to-select file input.
  - Display upload progress and success/error messages.
  - Anonymous uploads (no login required).
- **Gallery Display**:
  - Show a grid of uploaded media thumbnails.
  - Allow clicking thumbnails to view full-size images/videos (opens in new tab or modal).
  - Fetch and display media dynamically from storage.
- **Validation**:
  - Client-side: Check file type and size before upload.
  - Server-side: Re-validate and reject invalid files.
- **Security**:
  - Rate limiting: Max 5 uploads per IP per hour.
  - No direct client access to storage APIs (server-side proxy).
  - Basic virus scanning via Google Drive (if available).
  - Store files in a dedicated Google Drive folder.

### Non-Functional Requirements
- **Performance**: Uploads should complete within 30 seconds; gallery loads in <5 seconds.
- **Usability**: Mobile-responsive, accessible (WCAG compliant), and matches site's purple/green theme.
- **Reliability**: Handle network failures gracefully with retry options.
- **Security**: Use environment variables for API keys; no PII storage.
- **Compatibility**: Works on modern browsers; integrates with existing Next.js stack.
- **Scalability**: Support up to 500 uploads initially; monitor and expand as needed.

### Technical Requirements
- **Frontend**: React component using TypeScript, Tailwind CSS, and existing site patterns.
- **Backend**: Next.js API route for handling uploads and fetches.
- **Storage**: Google Drive API (via `googleapis` library).
- **Dependencies**: Add `googleapis` (v126+ for compatibility).
- **Environment**: Google Cloud service account key stored securely.

## Implementation Plan

### Phase 1: Setup and MVP (2-4 hours)
1. **Google Drive Setup** (15-20 min):
   - Create Google Cloud project and enable Drive API.
   - Generate service account key and store in `.env.local` as `GOOGLE_SERVICE_ACCOUNT_KEY`.
   - Create shared Drive folder (e.g., "Maria & Chris Wedding Media") and note folder ID in env as `DRIVE_FOLDER_ID`.

2. **Backend Implementation** (1 hour):
   - Create `/src/app/api/mediaupload/route.ts`.
   - Implement POST handler: Validate file, upload to Drive, return success.
   - Implement GET handler: Fetch file list from Drive, return metadata (ID, name, thumbnail URL).
   - Add rate limiting logic (simple in-memory for MVP).

3. **Frontend Implementation** (1-2 hours):
   - Create `/src/components/MediaUpload.tsx`.
   - Add file input, upload button, progress indicator, and gallery grid.
   - Integrate with API for uploads and fetches.
   - Style with Tailwind to match site (e.g., purple accents, responsive grid).

4. **Integration** (30 min):
   - Add MediaUpload component to `/src/app/[locale]/page.tsx`.
   - Update navigation in `/src/messages/en.json` if adding a dedicated page.
   - Test locally: Upload file, verify in Drive, check gallery display.

### Phase 2: Testing and Refinement (1-2 hours)
1. **Testing**:
   - Unit tests for API validation.
   - Manual testing: Upload various file types, check errors, verify gallery.
   - Mobile testing and accessibility checks.
2. **Refinements**:
   - Add loading states, error retries, and user feedback.
   - Optimize: Compress images on upload if needed.
   - Security audit: Ensure no key exposure.

### Phase 3: Deployment and Monitoring (30 min)
1. **Deploy**: Push to production with env vars set.
2. **Monitor**: Track upload volumes and errors via logs.
3. **Feedback Loop**: Gather guest feedback for future iterations.

### Risks and Mitigations
- **Risk**: Google API quota exceeded. **Mitigation**: Monitor usage; switch to OneDrive if needed.
- **Risk**: Security vulnerabilities. **Mitigation**: Regular audits; use signed URLs for downloads.
- **Risk**: Performance issues. **Mitigation**: Lazy-load gallery; add caching.

### Future Expansions
- Add video playback in gallery.
- User attribution (optional name field).
- Moderation tools for admins.
- Real-time updates via WebSockets.

This plan ensures a stable, secure MVP with minimal disruption to the existing site.