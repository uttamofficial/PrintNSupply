# 🔧 Fix Cloudinary 401 Error - Upload Preset Configuration

## 🐛 The Problem

**Error:** `401 Unauthorized`  
**URL:** `https://res.cloudinary.com/dcwzukqqw/image/upload/fl_attachment:inline/student_prints/...`

This means your uploaded files are **not publicly accessible**. Cloudinary is blocking access because the upload preset `printnsupply` is not configured for public access.

---

## ✅ SOLUTION 1: Configure Cloudinary Upload Preset (RECOMMENDED)

### Step 1: Go to Cloudinary Dashboard

1. Visit: https://cloudinary.com/console
2. Log in to your account
3. Click on **Settings** (gear icon) in the top right
4. Go to **Upload** tab

### Step 2: Find Your Upload Preset

1. Look for the preset named: `printnsupply`
2. If it doesn't exist, click **Add upload preset**

### Step 3: Configure the Preset

Set these settings:

| Setting | Value | Why |
|---------|-------|-----|
| **Preset name** | `printnsupply` | Must match your .env |
| **Signing mode** | **Unsigned** | Allows client-side uploads |
| **Access mode** | **Public** | Makes files publicly accessible |
| **Delivery type** | **Upload** | Standard delivery |
| **Resource type** | **Raw** or **Auto** | Allows PDFs |
| **Allowed formats** | `pdf` | Only allow PDF uploads |
| **Folder** | `student_prints` | Organizes your files |

### Critical Settings:
```
✅ Signing Mode: Unsigned
✅ Access Control: Public
✅ Resource Type: Raw (or Auto)
```

### Step 4: Save the Preset

Click **Save** at the bottom

---

## ✅ SOLUTION 2: Use Existing Public Preset

If you don't want to configure the preset, use a different one:

### Find Public Presets

1. Go to Cloudinary Dashboard → Settings → Upload
2. Look for a preset with:
   - ✅ Signing mode: **Unsigned**
   - ✅ Access mode: **Public**

3. Copy its name

### Update Your .env File

```bash
# Change this line in frontend/.env.local
VITE_CLOUDINARY_UPLOAD_PRESET=your_public_preset_name
```

---

## ✅ SOLUTION 3: Create New Upload Preset

If `printnsupply` doesn't exist or you want a fresh start:

### Step 1: Create Preset

1. Go to: https://cloudinary.com/console/settings/upload
2. Click **Add upload preset**
3. Use these settings:

```
Preset name: ez-prints-public
Signing mode: Unsigned
Access mode: Public
Folder: student_prints
Allowed formats: pdf
Max file size: 50 MB
Resource type: Raw
```

### Step 2: Update .env

```bash
# In frontend/.env.local
VITE_CLOUDINARY_UPLOAD_PRESET=ez-prints-public
```

### Step 3: Restart Frontend

```bash
cd frontend
# Kill the dev server (Ctrl+C)
npm run dev
```

---

## 🧪 Quick Test After Configuration

### Test 1: Check Upload Preset

Visit this URL in your browser (replace with your cloud name):
```
https://api.cloudinary.com/v1_1/dcwzukqqw/upload_presets/printnsupply
```

You should see JSON response like:
```json
{
  "name": "printnsupply",
  "unsigned": true,
  "settings": {
    "access_mode": "public",
    ...
  }
}
```

**Look for:**
- ✅ `"unsigned": true`
- ✅ `"access_mode": "public"`

### Test 2: Upload a File

1. Go to: http://localhost:5174/print
2. Upload a PDF
3. Check console - should show:
```
🔍 Cloudinary Upload Response: {
  access_mode: "public",  ← Should be "public"
  ...
}
```

---

## 🔍 Debugging Steps

### Check 1: Verify Preset Exists

```bash
curl https://api.cloudinary.com/v1_1/dcwzukqqw/upload_presets/printnsupply
```

**Good Response:**
```json
{"name": "printnsupply", "unsigned": true, ...}
```

**Bad Response:**
```json
{"error": {"message": "Upload preset not found"}}
```

### Check 2: Test Upload

```bash
curl -X POST \
  https://api.cloudinary.com/v1_1/dcwzukqqw/raw/upload \
  -F file=@test.pdf \
  -F upload_preset=printnsupply \
  -F folder=student_prints
```

**Good Response:**
```json
{"secure_url": "https://...", "access_mode": "public", ...}
```

**Bad Response:**
```json
{"error": {"message": "Upload preset must be unsigned"}}
```

### Check 3: Try Accessing File

After upload, try accessing the URL:
```
https://res.cloudinary.com/dcwzukqqw/raw/upload/student_prints/FILE_ID.pdf
```

- ✅ PDF opens → Access is public
- ❌ 401 Error → Access is private

---

## 🎯 What Each Setting Does

| Setting | Public | Private | Effect |
|---------|--------|---------|--------|
| **Signing mode: Unsigned** | ✅ Yes | ❌ No | Allows browser uploads |
| **Access mode: Public** | ✅ Yes | ❌ No | Anyone can view files |
| **Resource type: Raw** | ✅ Yes | - | Better for PDFs |

---

## ⚠️ Common Mistakes

### Mistake 1: Preset is "Signed"
**Problem:** Can't upload from browser  
**Fix:** Change to "Unsigned"

### Mistake 2: Files are "Private"
**Problem:** 401 error when accessing  
**Fix:** Change access mode to "Public"

### Mistake 3: Wrong Resource Type
**Problem:** Upload fails or wrong URL  
**Fix:** Use "Raw" for PDFs

### Mistake 4: Wrong Preset Name
**Problem:** Upload preset not found  
**Fix:** Check spelling in .env matches Cloudinary

---

## 📋 Checklist

Before testing, verify:

**In Cloudinary Dashboard:**
- [ ] Preset `printnsupply` exists
- [ ] Signing mode is **Unsigned**
- [ ] Access mode is **Public**
- [ ] Allowed formats includes **pdf**
- [ ] Resource type is **Raw** or **Auto**

**In Your Code:**
- [ ] `.env.local` has correct preset name
- [ ] Frontend server restarted after .env changes
- [ ] No typos in cloud name

**Test Results:**
- [ ] Upload completes without errors
- [ ] Console shows `access_mode: "public"`
- [ ] File URL works in browser
- [ ] Preview modal opens
- [ ] No 401 errors

---

## 🚀 Alternative: Use Cloudinary Media Library Widget

If upload presets are too complicated, you can use Cloudinary's widget:

### Install Widget

```bash
npm install cloudinary
```

### Use Widget

```typescript
import { Cloudinary } from '@cloudinary/url-gen';

const cloudinary = new Cloudinary({
  cloud: { cloudName: 'dcwzukqqw' },
  url: { secure: true }
});
```

This automatically handles authentication!

---

## 📞 Still Having Issues?

### Option 1: Check Cloudinary Plan

Free plan might have restrictions:
- Max file size: 10 MB (upgrade for 50 MB)
- Limited transformations
- Limited bandwidth

### Option 2: Check Cloudinary Logs

1. Go to Cloudinary Dashboard
2. Click **Usage** → **Logs**
3. Look for 401 errors
4. See detailed error messages

### Option 3: Contact Cloudinary Support

If preset configuration doesn't help:
1. Go to: https://support.cloudinary.com
2. Describe the 401 error
3. Mention upload preset: `printnsupply`
4. Ask them to check your account settings

---

## ✅ After Fixing

Once you've configured the preset properly:

1. **Restart Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Clear Browser Cache:**
   - Press Ctrl+Shift+Delete
   - Clear cached files

3. **Test Upload:**
   - Upload a new PDF
   - Should work without 401 errors

4. **Verify Preview:**
   - Click Preview button
   - PDF should display

---

## 🎯 Summary

**Root Cause:** Upload preset `printnsupply` is not configured for public access

**Quick Fix:**
1. Go to Cloudinary Dashboard → Settings → Upload
2. Find/Create preset: `printnsupply`
3. Set: Signing mode = **Unsigned**, Access mode = **Public**
4. Save and restart frontend

**Test:** Upload PDF → Check console → Preview should work!

---

**Next Step:** Configure your Cloudinary upload preset and try again! 🚀
