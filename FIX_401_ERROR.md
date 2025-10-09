# 🔧 Fix 401 Unauthorized Error for PDF Preview

## 🐛 The Error

```
GET chrome-extension://...pdf net::ERR_ABORTED 401 (Unauthorized)
```

This means the PDF was uploaded successfully, but when trying to view it, Cloudinary returns 401 (Unauthorized).

---

## 🔍 Root Cause

The 401 error happens because your uploaded files have **restricted access** even though the preset shows "Access control: Public". This can happen due to:

1. **Delivery Type** setting in upload preset
2. **Account-level security settings**
3. **Resource type** mismatch

---

## ✅ SOLUTION 1: Check Upload Preset Delivery Type

### Go to Cloudinary Dashboard

1. Visit: https://cloudinary.com/console/settings/upload
2. Find preset: `printnsupply`
3. Click to edit it

### Check These Settings:

| Setting | Required Value | Why |
|---------|---------------|-----|
| **Delivery type** | `upload` | Allows public access |
| **Type** | `upload` (not `authenticated`) | Public delivery |
| **Access control** | `Public` | Makes files accessible |

### Critical: Check "Delivery Type"

Look for a setting called **"Delivery type"** or **"Type"**:
- ✅ Should be: `upload` 
- ❌ If it's: `authenticated` or `private` → Change it to `upload`

---

## ✅ SOLUTION 2: Update Upload Preset Settings

Click on your `printnsupply` preset and ensure:

```
┌─────────────────────────────────────────┐
│ Upload Preset Configuration            │
├─────────────────────────────────────────┤
│ Preset name: printnsupply              │
│ Signing Mode: Unsigned            ✅   │
│ Access Control: Public            ✅   │
│ Delivery Type: upload             ✅   │  ← CHECK THIS!
│ Resource Type: Raw or Auto             │
│ Folder: student_prints                 │
└─────────────────────────────────────────┘
```

---

## ✅ SOLUTION 3: Use Upload Delivery Type

If you see options like:
- `upload` (public)
- `private`
- `authenticated`

**Make sure** it's set to `upload` (public).

---

## 🔧 Code Changes I Made

I updated the code to use Cloudinary's `secure_url` directly instead of constructing custom URLs:

**Before:**
```typescript
// Constructed custom URL
viewUrl = `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}.pdf`;
```

**After:**
```typescript
// Use Cloudinary's secure_url directly
viewUrl = data.secure_url; // This should always work!
```

---

## 🧪 Test After Changes

### Step 1: Update Upload Preset in Cloudinary
1. Set **Delivery Type** to `upload`
2. Save the preset

### Step 2: Test Upload

```bash
# Frontend should reload automatically with HMR
# If not, refresh the page: http://localhost:5174
```

### Step 3: Upload a New PDF
1. Go to Print/Upload page
2. Upload a PDF
3. Check console - should see:
```javascript
🔍 Cloudinary Upload Response: {
  secure_url: "https://res.cloudinary.com/...",
  type: "upload",  ← Should say "upload" not "authenticated"
  access_mode: "public"
}
```

### Step 4: Test Preview
1. Click "Preview" button
2. Should open and display PDF
3. No 401 errors!

---

## 🔍 Debugging Steps

### Check 1: Look at Upload Response

In browser console, check what `type` field shows:

```javascript
// Good response:
{
  type: "upload",           ← Good! Public delivery
  access_mode: "public"
}

// Bad response:
{
  type: "authenticated",    ← Bad! Requires auth
  access_mode: "public"     ← Doesn't matter if type is wrong
}
```

### Check 2: Test URL Directly

1. Copy the `secure_url` from console
2. Paste it in a new browser tab
3. Try accessing it directly

**If it works in new tab but not in iframe:**
- It's a CORS or CSP issue

**If it returns 401 everywhere:**
- The file is marked as authenticated/private

### Check 3: Check Cloudinary Media Library

1. Go to: https://cloudinary.com/console/media_library
2. Find your uploaded file
3. Click on it
4. Check "Delivery type" - should show `upload`

---

## 🎯 Alternative: Create New Preset

If the existing preset has issues, create a fresh one:

### Step 1: Create New Preset

1. Go to: https://cloudinary.com/console/settings/upload
2. Click **"Add upload preset"**
3. Name it: `ez-prints-public`

### Step 2: Configure It

```
Preset name: ez-prints-public
Signing mode: Unsigned
Access control: Public
Delivery type: upload        ← IMPORTANT!
Resource type: Raw
Folder: student_prints
Max file size: 50 MB
Allowed formats: pdf
```

### Step 3: Update .env

```bash
# Edit: frontend/.env.local
VITE_CLOUDINARY_UPLOAD_PRESET=ez-prints-public
```

### Step 4: Restart Frontend

```bash
cd frontend
# Press Ctrl+C
npm run dev
```

---

## 📋 Upload Preset Checklist

Make sure ALL of these are correct:

- [ ] Preset name: `printnsupply` (or your new preset)
- [ ] Signing mode: **Unsigned**
- [ ] Access control: **Public**
- [ ] **Delivery type: upload** ← Most likely issue!
- [ ] Resource type: Raw or Auto
- [ ] Folder: student_prints
- [ ] Last updated: Recent (today)

---

## 🎬 Visual Guide: Where to Find Settings

In Cloudinary upload preset editor:

```
┌──────────────────────────────────────┐
│ Upload Preset Editor                 │
├──────────────────────────────────────┤
│                                      │
│ Preset name: [printnsupply]         │
│                                      │
│ Signing Mode:                        │
│   ○ Signed                           │
│   ● Unsigned              ← Set this │
│                                      │
│ Access Control:                      │
│   ○ Public                           │
│   ● Public               ← Set this  │
│                                      │
│ Type/Delivery Type:                  │
│   ● upload               ← CHECK!    │
│   ○ authenticated                    │
│   ○ private                          │
│                                      │
│ Resource Type: [Raw ▼]              │
│                                      │
│ Folder: [student_prints]            │
│                                      │
│         [Save] [Cancel]              │
└──────────────────────────────────────┘
```

---

## 🚨 Common Issues

### Issue 1: Type is "authenticated"
**Problem:** Files require authentication  
**Fix:** Change to "upload" type

### Issue 2: Access mode ignored
**Problem:** Access control doesn't apply if type is wrong  
**Fix:** Must set both type=upload AND access=public

### Issue 3: Old files still 401
**Problem:** Files uploaded before changing settings  
**Fix:** Re-upload the file with new settings

---

## ✅ Success Indicators

After fixing:

1. **Upload Response:**
```javascript
{
  type: "upload",          ✅
  access_mode: "public",   ✅
  secure_url: "https://..." ✅
}
```

2. **Console Output:**
```
🔍 Cloudinary Upload Response: {...}
🔗 Generated URLs: {...}
✅ No errors
```

3. **Preview:**
```
✅ Modal opens
✅ PDF displays
✅ No 401 errors in Network tab
```

4. **Direct URL:**
```
✅ Paste secure_url in browser
✅ PDF opens/downloads
✅ Status 200 (not 401)
```

---

## 🆘 If Still Getting 401

### Option 1: Check Account Settings

Some Cloudinary accounts have global security settings:

1. Go to: https://cloudinary.com/console/settings/security
2. Check if there are any restrictions
3. Look for "Strict transformations" or "Restricted media types"
4. Disable strict mode if enabled

### Option 2: Contact Cloudinary Support

If preset settings look correct but still getting 401:

1. Go to: https://support.cloudinary.com
2. Ask: "My unsigned upload preset creates files with 401 errors"
3. Provide: Your cloud name and preset name
4. They can check account-level settings

---

## 📝 Summary

**Main Issue:** Files uploaded with "authenticated" or "private" delivery type

**Fix Steps:**
1. Edit upload preset `printnsupply`
2. Set **Delivery Type** to `upload` (not authenticated)
3. Ensure **Access Control** is `Public`
4. Save preset
5. Re-upload a test PDF
6. Preview should work!

---

**Next Step:** Go to Cloudinary dashboard and check the Delivery Type setting! 🚀

https://cloudinary.com/console/settings/upload
