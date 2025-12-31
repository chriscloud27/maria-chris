# Image Optimization Migration Guide

## Overview

This project has been updated to reduce Vercel image transformation requests by pre-generating optimized image sizes on upload and storing them in Google Drive subfolders.

## What Changed

### Before
- Images uploaded to a flat Google Drive folder
- Used Next.js `Image` component with Google Drive's auto-generated thumbnails
- Each gallery view triggered multiple Vercel transformations
- Quickly exceeded Vercel's free tier limit (5K transformations/month)

### After
- Images are processed server-side with `sharp` on upload
- 3 optimized variants created: thumb (400px), small (800px), medium (1200px)
- Organized in Google Drive subfolders: `/original`, `/thumbs`, `/small`, `/medium`
- Direct image serving via `<img>` tags with `srcset` for responsive loading
- **Zero Vercel image transformations** for gallery images

## Folder Structure

```
Google Drive Wedding Folder/
├── original/          # Original files (images and videos, uncompressed)
├── thumbs/           # 400x400 thumbnails (85% quality)
├── small/            # 800x800 for mobile (90% quality)
└── medium/           # 1200x1200 for desktop (92% quality)
```

## File Naming Convention

- Original: `filename.jpg` (in `/original`)
- Thumbnail: `filename_thumb.jpg` (in `/thumbs`)
- Small: `filename_small.jpg` (in `/small`)
- Medium: `filename_med.jpg` (in `/medium`)

## Videos

Videos are **not optimized** and stored only in the `/original` folder. They bypass the variant generation process.

## Migration Steps

### 1. Migration is Already Complete

If you're reading this, the codebase has already been updated. The changes include:

- ✅ Installed `sharp` package
- ✅ Updated `/api/mediaupload/route.ts`
- ✅ Updated `MediaUpload.tsx` component
- ✅ Created migration script

### 2. Migrate Existing Images

To process images already uploaded before this change, run the migration script:

```bash
npx tsx scripts/generateImageVariants.ts
```

This script will:
1. List all files in the wedding folder
2. Download each image
3. Generate thumb, small, and medium variants
4. Upload variants to appropriate subfolders
5. Move originals to `/original` folder
6. Skip videos (just move to `/original`)

**⚠️ Important Notes:**
- The script processes images in batches (may take time for large galleries)
- Requires Google Drive API access (uses same credentials as the app)
- Make sure `.env.local` is properly configured
- Run during off-peak hours if you have many images

### 3. Test the Migration

After running the script:

1. **Check Google Drive:**
   - Verify subfolders were created
   - Confirm variants exist for each image
   - Check that originals are in `/original`

2. **Test the Website:**
   - Visit `/media` page
   - Gallery should load thumbnails
   - Click images to open lightbox with larger variants
   - Test on mobile and desktop
   - Verify responsive images load appropriate sizes

3. **Verify Vercel Transformations:**
   - Go to Vercel Dashboard → Your Project → Analytics → Image Optimization
   - Monitor transformation count over next few days
   - Should remain at or near zero for gallery images

## New Upload Flow

When users upload new images:

1. File is uploaded via the upload form
2. Server validates file (type, size)
3. For **images**:
   - Original saved to `/original` (unchanged)
   - Sharp generates 3 variants (thumb, small, medium)
   - All 4 files uploaded to Google Drive in parallel
   - Metadata returned with all variant IDs
4. For **videos**:
   - Saved to `/original` only
   - No variants generated

## Technical Details

### Image Sizes
- **Thumb (400px):** Grid thumbnails, JPEG 85% quality
- **Small (800px):** Mobile lightbox, JPEG 90% quality
- **Medium (1200px):** Desktop lightbox, JPEG 92% quality
- **Original:** Unchanged for downloads

### Responsive Loading
Gallery uses:
```html
<img 
  src="thumb_url" 
  loading="lazy"
>
```

Lightbox uses:
```html
<img 
  src="medium_url"
  srcset="small_url 800w, medium_url 1200w"
  sizes="90vw"
>
```

### API Response Format

```json
{
  "files": [
    {
      "id": "original_file_id",
      "name": "image.jpg",
      "mimeType": "image/jpeg",
      "variants": {
        "thumb": "thumb_file_id",
        "small": "small_file_id", 
        "medium": "medium_file_id",
        "original": "original_file_id"
      }
    }
  ]
}
```

## Troubleshooting

### Images Not Showing After Migration

1. Check browser console for 404 errors
2. Verify variant IDs in API response match files in Google Drive
3. Ensure files have public read permissions
4. Clear browser cache

### Migration Script Fails

1. Check `.env.local` has all required variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `DRIVE_FOLDER_ID`
2. Verify Google Drive API access
3. Check available disk space (script downloads/processes images)
4. Run with `--trace-warnings` for more details

### High Memory Usage During Migration

The script processes images one at a time to avoid memory issues. If problems persist:
- Close other applications
- Process one folder at a time (comment out one folder in script)
- Add delays between uploads if hitting rate limits

## Performance Benefits

- **Before:** 50 images × 3 responsive sizes = ~150 transformations per page load
- **After:** 0 transformations (direct serving from Google Drive)
- **Bandwidth:** Images served at appropriate sizes (mobile gets 800px, not 2000px)
- **Loading Speed:** Lazy loading + srcset = faster initial page load

## Maintenance

### Monitoring
- Check Vercel transformation count monthly
- Monitor Google Drive storage usage
- Review error logs for upload failures

### Future Uploads
- New uploads automatically create variants
- No manual intervention needed
- Migration script not needed for new images

## Rollback Plan

If issues arise, you can revert by:

1. Checkout previous commit before this migration
2. Images will use old Google Drive thumbnail URLs
3. Re-enable Next.js Image component
4. Accept higher transformation counts

## Questions?

For issues or questions about this migration, check:
- [Next.js Image Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Vercel Image Optimization Limits](https://vercel.com/docs/image-optimization)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
