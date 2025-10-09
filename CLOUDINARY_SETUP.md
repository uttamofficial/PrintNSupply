# Cloudinary Integration Setup

This document explains how to properly set up Cloudinary for storing website data like images, videos, and files in your PrintNSupply application.

## Prerequisites

You've already provided the following Cloudinary credentials:
- Cloud Name: `dcwzukqqw`
- API Key: `186845815876347`
- API Secret: `E4sZOwi0lAOtfJ6pukPm3ThIsHA`

## Setup Instructions

### 1. Configure Cloudinary Dashboard

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Log in with your credentials
3. Note your Cloud Name: `dcwzukqqw` (already configured in your environment files)

### 2. Create an Upload Preset

1. In the Cloudinary dashboard, go to "Settings" > "Upload"
2. Scroll down to "Upload Presets"
3. Click "Add upload preset"
4. Set the following options:
   - Name: `printnsupply`
   - Signing Mode: `Unsigned`
   - Folder: `student_prints` (or your preferred folder name)
5. Click "Save"

**Important**: Make sure to set the Signing Mode to "Unsigned" for frontend uploads to work.

### 3. Update Environment Variables

Your environment variables are already configured with your actual credentials:

**Backend (.env file):**
```env
CLOUDINARY_CLOUD_NAME=dcwzukqqw
CLOUDINARY_API_KEY=186845815876347
CLOUDINARY_API_SECRET=E4sZOwi0lAOtfJ6pukPm3ThIsHA
```

**Frontend (.env.local file):**
```env
VITE_CLOUDINARY_CLOUD_NAME=dcwzukqqw
VITE_CLOUDINARY_UPLOAD_PRESET=printnsupply
```

### 4. How It Works

The Cloudinary integration works as follows:

1. **Frontend File Selection**: Users select files through the file input in the PrintPage component
2. **Direct Upload**: Files are uploaded directly from the browser to Cloudinary using unsigned upload presets
3. **Storage**: Files are stored in your Cloudinary account in the `student_prints` folder
4. **Response**: The frontend receives the Cloudinary URL and other metadata
5. **Display**: Files can be viewed directly using the Cloudinary URLs

### 5. API Endpoints

The backend provides the following endpoints for file management:

- `POST /api/upload/single` - Upload a single file (through backend)
- `POST /api/upload/multiple` - Upload multiple files (through backend)
- `POST /api/upload/base64` - Upload base64 encoded data (through backend)
- `DELETE /api/upload/:publicId` - Delete a file by its public ID (through backend)

### 6. Security Considerations

1. **API Secret**: Never expose your API Secret in frontend code (kept in backend only)
2. **Unsigned Uploads**: Frontend uploads use unsigned presets for security
3. **File Validation**: The backend validates file types and sizes
4. **Cleanup**: Deleted files are removed from both the application and Cloudinary

### 7. Usage in Components

To use Cloudinary in your components:

```typescript
import CloudinaryService from './services/cloudinaryService';

// Upload a file directly from frontend
const handleFileUpload = async (file: File) => {
  try {
    const result = await CloudinaryService.uploadFile(file, 'student_prints');
    console.log('File uploaded:', result.url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Delete a file (goes through backend)
const handleFileDelete = async (publicId: string) => {
  try {
    await CloudinaryService.deleteFile(publicId);
    console.log('File deleted');
  } catch (error) {
    console.error('Delete failed:', error);
  }
};
```

### 8. Testing the Integration

1. Start both frontend and backend servers
2. Navigate to the Print Page
3. Select a PDF file to upload
4. The file should be uploaded directly to Cloudinary and appear in your Cloudinary dashboard
5. You should see a "View" link next to the file name that opens the Cloudinary URL

### 9. Troubleshooting

**Common Issues:**

1. **Upload Preset Not Found**: Make sure you've created an upload preset named `printnsupply` and set it to "Unsigned"
2. **Authentication Errors**: Verify your API key and secret are correct
3. **File Size Limits**: Cloudinary has file size limits based on your account type
4. **Network Issues**: Ensure your server can reach Cloudinary's API

**Checking Configuration:**

1. Verify environment variables are set correctly
2. Check the Cloudinary dashboard for upload logs
3. Look at server console logs for error messages

### 10. Advanced Configuration

For more advanced usage, you can:

1. Create multiple upload presets for different file types
2. Set up transformations and optimizations
3. Configure webhooks for upload notifications
4. Implement signed uploads for better security

Refer to the [Cloudinary Documentation](https://cloudinary.com/documentation) for more details.