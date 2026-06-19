# PickSmart.pk - Complete Setup Guide

## Overview

PickSmart.pk is a modern, production-ready affiliate marketing website built with vanilla JavaScript, Firebase backend, and a sleek dark-mode design. This guide will walk you through the complete setup process.

## Project Structure

```
/vercel/share/v0-project/
├── index.html              # Homepage
├── reviews.html            # Reviews grid with filters
├── article.html            # Single article page with comments
├── deals.html              # Hot deals page
├── about.html              # About page
├── contact.html            # Contact form page
├── privacy.html            # Privacy Policy (FTC/AdSense compliant)
├── disclosure.html         # Affiliate Disclosure (required for AdSense)
├── submit.html             # Password-protected article submission
├── 404.html                # 404 error page
├── config.js               # Firebase configuration (CRITICAL - update this)
├── app.js                  # Main JavaScript logic and Firebase integration
├── style.css               # Global styles (dark mode + glassmorphism)
├── translations.js         # EN/Urdu bilingual support
├── sitemap.xml             # SEO sitemap
├── robots.txt              # SEO robots file
└── SETUP_GUIDE.md          # This file
```

## Step 1: Firebase Setup (CRITICAL)

### 1.1 Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a new project"
3. Enter project name: "PickSmart"
4. Accept terms and create project
5. Wait for provisioning to complete

### 1.2 Set Up Firestore Database
1. In Firebase Console, click "Firestore Database" in left sidebar
2. Click "Create Database"
3. Select "Start in production mode" (then configure rules later)
4. Choose region: "asia-southeast1" (closest to Pakistan)
5. Click "Enable"

### 1.3 Set Up Firebase Storage
1. Click "Storage" in left sidebar
2. Click "Get Started"
3. Accept default security rules for now
4. Click "Done"
5. Your default storage bucket will be created

### 1.4 Get Firebase Config
1. Go to Project Settings (gear icon) > Project settings
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add web app
4. Register as "PickSmart Web"
5. Copy the Firebase config object shown on screen
6. **CRITICAL:** Replace the placeholder values in `config.js` with your actual credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 2: Firebase Security Rules Setup

### 2.1 Firestore Rules
In Firestore console, go to "Rules" tab and replace with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to articles
    match /articles/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Public read/write for comments (with rate limiting via frontend)
    match /comments/{document=**} {
      allow read: if true;
      allow write: if request.resource.data.articleId != null;
    }
    
    // Public read access to deals
    match /deals/{document=**} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

### 2.2 Storage Rules
In Storage console, go to "Rules" tab and replace with:

```firebase
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read-only access to all files
    match /{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Allow uploads only for articles directory
    match /articles/{allPaths=**} {
      allow write: if request.auth != null;
    }
    
    // Allow uploads only for videos directory
    match /videos/{allPaths=**} {
      allow write: if request.auth != null;
    }
  }
}
```

## Step 3: Contact Form Setup

### Option A: Use Formspree (Recommended - Free)
1. Go to https://formspree.io/
2. Sign up with your email
3. Create a new form
4. You'll get a form ID (like: xovqqanq)
5. In `contact.html`, update the Formspree endpoint:
   ```javascript
   fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```
6. Replace `YOUR_FORM_ID` with your actual Formspree ID

### Option B: Use Firebase Functions (Advanced)
Set up a Cloud Function to handle emails (requires paid Firebase plan)

## Step 4: Sample Data Creation

### 4.1 Create Sample Articles
1. Go to Firestore Console
2. Create collection: "articles"
3. Add sample documents with this structure:

```json
{
  "title": "Best Earphones Under Rs. 2000 on Daraz — 2025 Review",
  "category": "earphones",
  "description": "Find the best budget earphones...",
  "content": "Full article HTML content here...",
  "heroImage": "[upload image via Firebase Storage]",
  "images": ["url1", "url2"],
  "pros": ["Great sound", "Comfortable fit", "Long battery"],
  "cons": ["Average build quality"],
  "darazLink": "https://daraz.pk/...",
  "price": 1999,
  "rating": 4,
  "views": 0,
  "likes": 0,
  "comments": 0,
  "createdAt": 2025-01-15 (timestamp),
  "videoUrl": ""
}
```

### 4.2 Create Sample Deals
Create collection: "deals"

```json
{
  "title": "Samsung Galaxy Buds - Special Price",
  "description": "True wireless earbuds with noise cancellation",
  "image": "[firebase storage url]",
  "price": 7999,
  "darazLink": "https://daraz.pk/...",
  "badge": "hot",
  "createdAt": 2025-01-15 (timestamp)
}
```

## Step 5: Google AdSense Setup

### 5.1 Prerequisites Met
- Privacy Policy: ✓ (privacy.html)
- Affiliate Disclosure: ✓ (disclosure.html)
- Original Content: ✓ (Add your articles)
- No Prohibited Content: ✓

### 5.2 Apply for AdSense
1. Go to https://adsense.google.com/
2. Click "Sign up now"
3. Enter your website URL: https://yourdomain.com
4. Complete verification (usually requires adding code to website)
5. Once approved, add your ad code to placeholder slots in HTML files

### 5.3 Ad Placeholder Locations
Ad placeholders are marked in HTML files with:
```html
<!-- Google AdSense Ad Slot -->
```

Current ad slots:
- Homepage: Leaderboard (728x90) below navbar
- Sidebar: Medium rectangle (300x250)
- Articles: In-article ads (336x280)
- Footer: Leaderboard (728x90)

## Step 6: Deployment

### Option A: Vercel (Recommended - Free & Fast)
1. Push code to GitHub
2. Go to https://vercel.com/
3. Import your GitHub repository
4. Add environment variables (Firebase config)
5. Deploy automatically

### Option B: Netlify
1. Connect GitHub repo
2. Build settings: Default
3. Publish directory: ./ (root)
4. Deploy

### Option C: GitHub Pages
1. Push to GitHub
2. Go to repository Settings > Pages
3. Select main branch as source
4. Your site will be live at https://yourusername.github.io/PickSmart

## Step 7: Post-Launch Optimization

### 7.1 Update Meta Tags
Search and replace:
- `picksmart.pk` → your actual domain
- `smartdealsproamazon@gmail.com` → your email

### 7.2 Update Social Links
Edit footer links to point to your:
- Facebook page
- Instagram account
- TikTok channel
- YouTube channel

### 7.3 Verify on Search Engines
1. **Google Search Console:**
   - Go to https://search.google.com/search-console
   - Add your website
   - Upload sitemap.xml
   - Request indexing

2. **Bing Webmaster Tools:**
   - Go to https://www.bing.com/webmasters
   - Add your website
   - Upload sitemap.xml

### 7.4 Enable HTTPS
If using Vercel/Netlify:
- SSL is automatic
If using GitHub Pages:
- HTTPS is automatic

## Step 8: Article Submission Process

### How to Add Articles
1. Navigate to: https://yourdomain.com/submit.html
2. Password: `PickSmart@786`
3. Fill in the form:
   - Title
   - Category
   - Hero Image (upload file)
   - Additional Images (optional)
   - Video (optional)
   - Article Content (HTML allowed)
   - Pros/Cons
   - Daraz affiliate link
   - Price & rating
4. Click "Publish Article"
5. Article appears immediately on Reviews page
6. 5-8 AI-generated comments are auto-added

## Step 9: Language Setup

### Bilingual Support (EN/Urdu)
- Language toggle button in navbar
- Preference saved to localStorage
- RTL layout automatically switches for Urdu
- All content has both translations in translations.js

To add custom translations:
1. Edit `translations.js`
2. Add key-value pairs to both `en` and `ur` objects
3. Use `data-i18n="key"` attribute in HTML elements

## Step 10: Monitoring & Maintenance

### Weekly Tasks
- Review new comments for spam
- Monitor Firebase usage/costs
- Check Google Search Console for errors

### Monthly Tasks
- Publish 2-3 new articles
- Update hot deals
- Respond to contact form inquiries

### Monthly Costs (Firebase)
- Firestore: ~$1-5 (varies by usage)
- Storage: ~$0.50-2 (varies by usage)
- Total typical cost: $5-10/month for small traffic

## Troubleshooting

### Problem: Firebase not connecting
**Solution:** Check that API key in config.js is correct and all characters match exactly

### Problem: Images not uploading
**Solution:** Check Firebase Storage quota and ensure you have write permissions set

### Problem: Comments not appearing
**Solution:** Check Firestore rules allow write access to comments collection

### Problem: Contact form not working
**Solution:** Verify Formspree ID is correct in contact.html

### Problem: Articles not loading
**Solution:** 
1. Check browser console for errors
2. Verify Firestore has articles collection
3. Ensure Firebase config is valid

## Security Best Practices

1. **Never commit real Firebase keys** - use environment variables
2. **Enable HTTPS** - all modern hosts support it
3. **Rate limit submissions** - frontend rate limiting implemented
4. **Moderate comments** - review before publishing in production
5. **Update rules regularly** - especially before adding features

## Performance Optimization

- Images are lazy loaded
- CSS is minified and optimized
- JavaScript is modular and efficient
- Firebase queries use proper indexing
- Caching strategy implemented

## SEO Checklist

- [x] Meta titles and descriptions
- [x] Open Graph tags
- [x] JSON-LD schema markup
- [x] sitemap.xml
- [x] robots.txt
- [x] Mobile responsive
- [x] Fast loading
- [x] HTTPS ready
- [x] Canonical tags

## Next Steps

1. Deploy to your hosting platform
2. Set up Firebase with your credentials
3. Add first articles
4. Submit to Google Search Console
5. Apply for Google AdSense
6. Monitor analytics via Firebase

## Support & Contact

For issues or questions:
- Email: smartdealsproamazon@gmail.com
- Check Firebase documentation: https://firebase.google.com/docs
- SEO help: https://developers.google.com/search

## License

This website is ready for commercial use. All code is yours to use and modify.

---

**Last Updated:** January 2025
**Version:** 1.0 - Production Ready
