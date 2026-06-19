# Cloudinary Upload Preset Setup

## Quick Setup (2 minutes)

Your Cloudinary Cloud Name is already configured: `dpeh316e0`

You just need to create the upload preset for the website.

### **Step 1: Go to Cloudinary Dashboard**

1. Go to https://cloudinary.com/console
2. Login to your account
3. You'll see your Cloud Name: `dpeh316e0` at the top

### **Step 2: Create Upload Preset**

1. Click **Settings** (gear icon) at bottom left
2. Go to **Upload** tab
3. Scroll to "Upload presets" section
4. Click **"Add upload preset"** button

### **Step 3: Configure the Preset**

Fill in these settings:

**Basic Settings:**
- **Preset name:** `picksmart_uploads`
- **Unsigned:** Toggle ON (very important!)
- **Folder:** `picksmart/uploads` (optional but organized)

**Transformation Settings:**
- **Auto format:** ON (auto WebP/JPEG)
- **Quality:** auto
- **Fetch format:** auto

**Resource Settings:**
- **Max file size:** 50 MB (for videos)
- **Allowed formats:** jpg, jpeg, png, gif, webp, mp4, mov, avi, webm

Leave everything else as default.

### **Step 4: Save the Preset**

Click **"Save"** button at the bottom

---

## Verification

Your upload preset is ready when:
- Preset name: `picksmart_uploads`
- Status: **Active**
- Signing mode: **Unsigned**

---

## What This Does

Now when users upload images/videos on your website:

1. Click "Upload Hero Image" or "Upload Video"
2. File uploads directly to your Cloudinary account
3. File is optimized automatically
4. URL is saved to Firestore
5. Images display 10x faster globally

---

## Test Upload

1. Open your website's submit.html
2. Password: `PickSmart@786`
3. Try uploading an image
4. Should upload instantly!

If upload fails, check:
- Preset name is exactly: `picksmart_uploads`
- Preset is set to "Unsigned"
- Cloud Name in config.js is: `dpeh316e0`

---

**Your Cloudinary is now ready!** 🚀

Next: Deploy to Vercel/Netlify (3 minutes)
