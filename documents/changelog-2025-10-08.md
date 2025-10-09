# Changelog - October 8, 2025

## Changes Implemented

### 1. ✅ Photo Limit Increased to 12

**Changed from:** 10 photos maximum
**Changed to:** 12 photos maximum

**Files Modified:**
- Created `client/src/utils/constants.ts` with centralized constants
  - `MAX_PHOTOS = 12`
  - `MAX_FILE_SIZE = 10MB`
  - `ACCEPTED_IMAGE_TYPES`

- Updated `client/src/components/AddPhotoCard.tsx`
  - Now imports MAX_PHOTOS from constants
  - Shows "Limit: 12" message when at capacity
  - Disables interaction when limit reached

- Updated `client/src/pages/Home.tsx`
  - Imports MAX_PHOTOS constant
  - Enforces limit when adding multiple photos
  - Shows user-friendly toast messages

- Updated example files:
  - `client/src/components/examples/PhotoCounter.tsx`
  - `client/src/components/examples/PhotoGrid.tsx`
  - `client/src/components/examples/PhotoUploader.tsx`

---

### 2. ✅ Grid Layout Fixed to 3 Columns

**Changed from:** Responsive grid (2/3/4 columns)
**Changed to:** Always 3 columns across all screen sizes

**Files Modified:**
- `client/src/components/PhotoGrid.tsx`
  ```tsx
  // Before:
  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-8"

  // After:
  className="grid grid-cols-3 gap-2 p-4 pb-8"
  ```

**Impact:**
- Consistent grid layout on all devices
- Tighter spacing (gap-2 instead of gap-4)
- Matches app specification exactly

---

### 3. ✅ Gesture Mapping Updated

**Changed from:**
- Single tap → Next photo (with 300ms delay for double-tap detection)
- Double-tap → Delete dialog

**Changed to:**
- Single tap → Next photo (immediate)
- Double-tap → Toggle zoom (1x ↔ 2x)
- **Long-press (500ms) → Delete dialog**

**Files Modified:**
- `client/src/components/PhotoViewer.tsx`
  - Removed `lastTapRef` (no longer needed)
  - Added `onDoubleClick` handler for zoom toggle
  - Added `onLongPress` handler for delete dialog
  - Configured `longPress` threshold at 500ms
  - Simplified `onClick` handler (no more delay)

**UX Improvements:**
- Single tap is now instant (no 300ms delay)
- Double-tap zoom is intuitive for photo viewers
- Long-press for delete prevents accidental deletions
- Matches common photo app patterns

---

### 4. ✅ Thumbnail Generation System

**New Feature:** Automatic thumbnail generation for performance optimization

**Schema Changes:**
- `shared/schema.ts`
  - Added `thumbnail: Blob` field to Photo interface
  - Thumbnails are square-cropped for grid display

**New Files Created:**
- `client/src/utils/thumbnailGenerator.ts`
  - `generateThumbnail(file: File): Promise<Blob>`
  - `generateThumbnails(files: File[]): Promise<Blob[]>`
  - Creates 400x400px center-cropped thumbnails
  - Uses Canvas API for efficient processing
  - JPEG quality: 0.85 (85%)

**Database Migration:**
- `client/src/services/photoStorage.ts`
  - Updated from version 1 to version 2
  - Added migration handler for existing photos
  - Backward compatible (uses full image if thumbnail missing)

**Component Updates:**
- `client/src/hooks/usePhotoStore.ts`
  - Generates thumbnail alongside full image on upload
  - Uses `Promise.all()` for parallel processing
  - No slowdown in upload experience

- `client/src/components/PhotoCard.tsx`
  - Uses thumbnail for grid display
  - Falls back to full image if thumbnail unavailable
  - Maintains compatibility with old data

**Performance Benefits:**
- **Memory:** Grid loads ~400KB thumbnails instead of full 5-10MB images
- **Speed:** Faster scrolling and initial load
- **Bandwidth:** Reduced memory footprint for large collections
- **Future-Ready:** Foundation for virtual scrolling if unlimited photos added

---

## Technical Details

### Constants Centralization
All app-wide constants now live in `client/src/utils/constants.ts`:
```typescript
export const MAX_PHOTOS = 12;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ACCEPTED_IMAGE_MIMES = ACCEPTED_IMAGE_TYPES.join(',');
```

### Thumbnail Generation Algorithm
1. Load image into memory
2. Calculate center square crop (Math.min(width, height))
3. Draw cropped region to 400x400 canvas
4. Export as JPEG blob at 85% quality
5. Clean up object URLs

### Database Versioning
- Version 1: Original schema
- Version 2: Thumbnail support added
- Migration is non-destructive
- Old photos work without thumbnails

---

## Breaking Changes

### None!
All changes are backward compatible:
- Old photos without thumbnails still display (uses full image)
- Database migration is automatic
- No user action required

---

## Testing Recommendations

1. **Photo Limit**: Try adding 13th photo, should be blocked
2. **Grid Layout**: View on mobile/tablet/desktop, should always be 3 columns
3. **Gestures**:
   - Single tap → should advance immediately
   - Double-tap → should zoom in/out
   - Long-press (hold 500ms) → should show delete dialog
4. **Thumbnails**:
   - Add new photos → should generate thumbnails
   - Grid should load faster than before
   - Photos should still look good in grid

---

## Files Created
- `client/src/utils/constants.ts`
- `client/src/utils/thumbnailGenerator.ts`
- `documents/changelog-2025-10-08.md` (this file)

## Files Modified
- `client/src/components/AddPhotoCard.tsx`
- `client/src/components/PhotoCard.tsx`
- `client/src/components/PhotoGrid.tsx`
- `client/src/components/PhotoViewer.tsx`
- `client/src/components/examples/PhotoCounter.tsx`
- `client/src/components/examples/PhotoGrid.tsx`
- `client/src/components/examples/PhotoUploader.tsx`
- `client/src/hooks/usePhotoStore.ts`
- `client/src/pages/Home.tsx`
- `client/src/services/photoStorage.ts`
- `shared/schema.ts`

---

## Next Steps (If Desired)

From the gap analysis, these are high-priority items still pending:

1. **Virtual Scrolling** - Not needed with 12-photo limit, but would be essential if going unlimited
2. **Web Share API** - Enable native sharing to other apps
3. **Testing Suite** - Add Vitest unit tests and Playwright E2E tests
4. **Accessibility** - ARIA labels, keyboard nav, screen reader support
5. **First-time Experience** - Welcome screen and gesture tutorial

Let me know if you'd like to tackle any of these next!
