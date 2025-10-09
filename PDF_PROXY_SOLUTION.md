# PDF Proxy Solution

## Problem
Cloudinary URLs were returning 401 (Unauthorized) errors when trying to view uploaded PDFs directly in the browser, even though the upload preset was set to "Public" access.

## Root Cause
Your Cloudinary account has authentication requirements that override upload preset settings. Direct URLs to raw files (PDFs) require authentication, which browsers cannot provide.

## Solution: Backend PDF Proxy

Instead of trying to access Cloudinary URLs directly, we now **proxy PDF requests through our backend server**.

### How It Works

1. **Frontend requests PDF preview**
   - User clicks "Preview" button
   - Frontend generates a proxy URL: `http://localhost:5010/api/cloudinary/view/student_prints/filename.pdf`

2. **Backend fetches from Cloudinary**
   - Backend receives the proxy request
   - Backend authenticates with Cloudinary using API credentials
   - Backend fetches the PDF file from Cloudinary
   - Backend streams the PDF directly to the frontend

3. **Frontend displays PDF**
   - Browser receives PDF from our backend (no 401 errors!)
   - PDF displays in the iframe modal

### Benefits

✅ **No more 401 errors** - Backend handles authentication
✅ **Secure** - API credentials stay on the server
✅ **Fast** - Streaming response (no file buffering)
✅ **Browser-friendly** - PDFs served with correct headers for inline viewing
✅ **Caching** - Backend adds cache headers for performance

### Implementation Details

**Backend Route** (`/backend/routes/cloudinary.js`):
```javascript
router.get('/view/:publicId(*)', async (req, res) => {
  // 1. Get public ID from URL
  // 2. Fetch resource details from Cloudinary API
  // 3. Stream PDF file from Cloudinary to response
  // 4. Set proper Content-Type and headers
});
```

**Frontend Service** (`cloudinaryService.ts`):
```typescript
static getProxiedUrl(publicId: string): string {
  // Returns: http://localhost:5010/api/cloudinary/view/{publicId}
}
```

**Usage** (`PrintPage.tsx`):
```typescript
const handlePreviewPdf = (file) => {
  const proxiedUrl = CloudinaryService.getProxiedUrl(file.publicId);
  setPreviewPdf({ ...file, viewUrl: proxiedUrl });
};
```

## Testing

1. Refresh browser at http://localhost:5174
2. Upload a new PDF file
3. Click "Preview" button
4. Console should show: `🔗 Generated proxied URL: http://localhost:5010/api/cloudinary/view/...`
5. PDF should display without errors! 🎉

## Production Deployment

When deploying to production, update the proxy URL in `cloudinaryService.ts`:

```typescript
const proxiedUrl = `${import.meta.env.VITE_BACKEND_URL}/api/cloudinary/view/${encodeURIComponent(fullPublicId)}`;
```

Add to your `.env` file:
```
VITE_BACKEND_URL=https://your-backend-domain.com
```

## Future Improvements

- Add caching layer (Redis) for frequently accessed PDFs
- Implement download endpoint with `Content-Disposition: attachment`
- Add rate limiting to prevent abuse
- Support other file types (images, videos) through same proxy
