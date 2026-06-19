# PickSmart.pk - Quick Start Checklist

Get your affiliate site live in 30 minutes!

## Phase 1: Firebase Setup (5 minutes)

- [ ] Go to https://console.firebase.google.com/
- [ ] Create new project "PickSmart"
- [ ] Create Firestore Database (asia-southeast1)
- [ ] Enable Cloud Storage
- [ ] Copy Firebase config from Project Settings
- [ ] Update `config.js` with your credentials (API Key, Project ID, etc.)

## Phase 2: Firestore Configuration (5 minutes)

- [ ] Go to Firestore > Rules
- [ ] Copy and paste the rules from SETUP_GUIDE.md step 2.1
- [ ] Go to Storage > Rules
- [ ] Copy and paste the rules from SETUP_GUIDE.md step 2.2
- [ ] Publish both rulesets

## Phase 3: Add Sample Content (5 minutes)

- [ ] Create "articles" collection in Firestore
- [ ] Add 3 sample articles (use SETUP_GUIDE.md example structure)
- [ ] Create "deals" collection
- [ ] Add 3 sample deals
- [ ] Create "comments" collection (leave empty for now)

## Phase 4: Contact Form Setup (3 minutes)

### Option: Formspree (Free & Easy)
- [ ] Go to https://formspree.io/
- [ ] Sign up with your email
- [ ] Create new form
- [ ] Copy your form ID (e.g., xovqqanq)
- [ ] Open `contact.html`
- [ ] Find line: `fetch('https://formspree.io/f/xovqqanq'`
- [ ] Replace `xovqqanq` with your form ID

## Phase 5: Prepare for Deployment (5 minutes)

- [ ] Update all email addresses: `smartdealsproamazon@gmail.com` → your email
- [ ] Update social media links in footer (Facebook, Instagram, TikTok, YouTube)
- [ ] Update your domain in Open Graph tags (search for `picksmart.pk`)
- [ ] Review Privacy Policy and Affiliate Disclosure (update if needed)

## Phase 6: Deploy (5 minutes)

### Option A: Vercel (Recommended)
- [ ] Push code to GitHub
- [ ] Go to https://vercel.com/
- [ ] Click "Import Project"
- [ ] Select your GitHub repository
- [ ] Click "Deploy"
- [ ] Your site is live!

### Option B: Netlify
- [ ] Connect GitHub repository
- [ ] Build settings: Default (leave blank)
- [ ] Publish directory: ./ (root)
- [ ] Click "Deploy"

### Option C: GitHub Pages
- [ ] Push to GitHub
- [ ] Settings > Pages > Main branch
- [ ] Site live at: `https://yourusername.github.io/PickSmart`

## Phase 7: Go Live with Search Engines (5 minutes)

- [ ] Go to https://search.google.com/search-console
- [ ] Add your website
- [ ] Upload `sitemap.xml` (URL: yoursite.com/sitemap.xml)
- [ ] Request indexing for homepage
- [ ] Go to https://www.bing.com/webmasters
- [ ] Add your website
- [ ] Upload sitemap

## Phase 8: Google AdSense (1 hour, ongoing)

- [ ] Go to https://adsense.google.com/
- [ ] Sign up with your domain
- [ ] Complete verification (usually 24-48 hours)
- [ ] Once approved, get your ad code
- [ ] Paste ad code into 5 placeholder slots in HTML
- [ ] Wait for ads to appear (can take 24 hours)

## Test Your Site

Open each page and verify:
- [ ] Homepage loads with hero section
- [ ] Reviews page shows articles
- [ ] Article page loads with comments
- [ ] Deals page displays products
- [ ] Language toggle (EN/اردو) switches language
- [ ] Mobile responsive (test on phone)
- [ ] Contact form submits successfully
- [ ] Share buttons work (WhatsApp, Facebook, etc.)

## First Article Submission

1. Go to: `https://yoursite.com/submit.html`
2. Enter password: `PickSmart@786`
3. Fill out article form:
   - Title: "Best Earphones Under Rs. 2000"
   - Category: "Earphones"
   - Upload hero image
   - Add content
   - Add pros/cons
   - Paste Daraz affiliate link
   - Set rating
4. Click "Publish Article"
5. Check that article appears on Reviews page within 2 seconds

## Monthly Tasks

- [ ] Publish 2-3 new articles
- [ ] Update deals section
- [ ] Review and moderate comments
- [ ] Check Google Search Console for errors
- [ ] Monitor Firebase usage/costs

## Important Reminders

**CRITICAL: Update config.js**
Your Firebase credentials MUST be in config.js or nothing will work!

**Change Article Password**
Update password in submit.html line ~80 before going live

**Save Formspree ID**
Your contact form won't work without this

**Verify Email**
Update contact email in 3 places:
- contact.html
- privacy.html
- disclosure.html

**Test Everything**
Before announcing, test all pages on mobile and desktop

## Revenue Tips

1. **AdSense**: Enable in first month for passive income
2. **Affiliate Links**: Use on every product page (no extra cost to users)
3. **Grow Traffic**: Write 1-2 new articles weekly
4. **SEO**: Target long-tail keywords (e.g., "best budget earphones pakistan")
5. **Social**: Share links on TikTok, Instagram, YouTube Shorts

## Support

**Stuck?** Read SETUP_GUIDE.md for detailed instructions

**Firebase Issue?** Check https://firebase.google.com/docs

**SEO Help?** Check https://developers.google.com/search

**AdSense Issue?** Check https://support.google.com/adsense

---

**Timeline: 30 minutes to live → Your first commission in 7 days**

Good luck with PickSmart.pk!
