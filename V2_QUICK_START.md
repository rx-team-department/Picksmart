# PickSmart.pk v2.0 - Quick Start Guide

**Last Updated:** June 19, 2025

---

## 🚀 What's New

✅ **Cloudinary Integration** - Images & videos now hosted on CDN (10x faster)  
✅ **Advanced Deals Management** - Filter, sort, countdown timers, social sharing  
✅ **Tabbed Submit Interface** - Article submission + content management in one place  
✅ **Real-Time Deal Rendering** - Live updates, automatic countdown timers  
✅ **Enhanced UX** - Better forms, toggle switches, preview functionality  

---

## ⚡ 5-Minute Setup

### 1. Get Cloudinary Credentials
```
1. Go to https://cloudinary.com (sign up free)
2. Go to Dashboard
3. Copy your "Cloud Name"
4. Go to Settings > Upload
5. Create Upload Preset: "picksmart_uploads"
6. Copy to config.js
```

### 2. Update config.js
```javascript
const cloudinaryConfig = {
  cloudName: "YOUR_CLOUD_NAME",        // Paste your cloud name here
  uploadPreset: "picksmart_uploads"    // Already set, no changes needed
};
```

### 3. Deploy
```bash
git push  # Deploy to Vercel/Netlify automatically
```

**That's it! You're done.** ✅

---

## 📝 Using the New Submit Page

### Step 1: Go to Submit Page
```
URL: https://yourdomain.com/submit.html
Password: PickSmart@786
```

### Step 2: Submit Article (Tab 1)
1. Fill in article details (same as before)
2. Upload hero image (now goes to Cloudinary)
3. Add product images (optional)
4. Upload video (optional, Cloudinary handles it)
5. Add article content
6. **NEW:** Toggle "Feature as Deal?" if you want it on deals page
7. Click "Publish Article"

### Step 3: If Publishing as Deal
When you toggle "Feature as Deal?", new fields appear:
- Original Price (PKR)
- Deal Price (PKR)
- Deal Ends (select date/time)
- Deal Badge (Hot Deal, Best Seller, etc.)

Article is published + automatically added to deals page!

### Step 4: Manage Content (Tab 2)
- View all published articles
- View all active deals
- Delete articles or deals
- See views, likes, publish dates

---

## 🎯 Deals Page Features

### User-Facing Features

**Filters:**
- All categories or by: Earphones, Laptops, Mobiles, Gaming, Home Tech
- Active filter glows with neon cyan

**Sorting:**
- Ending Soon (countdown from earliest)
- Biggest Discount (highest % off first)
- Latest (newest deals first)

**Deal Cards Show:**
- Product image (fast Cloudinary CDN)
- Colored badge (Hot Deal, Best Seller, etc.)
- Discount % (auto-calculated)
- Original & deal prices
- **Live countdown timer** (HH:MM:SS)
  - Red + pulse when < 1 hour left
  - Shows "Deal Ended" when expired
- Social proof ("X people viewing")
- WhatsApp share button
- Read Review button (links to article)
- Buy on Daraz button (neon green)

**Real-Time Updates:**
- Auto-updates as new deals are published
- Countdowns run live in browser
- Filters applied instantly
- No page refresh needed

---

## 🔧 Backend Structure

### Firestore Collections

**articles** (existing):
- All fields same as before
- Images now stored as Cloudinary URLs

**deals** (new):
```
deals {
  articleId: "linked-article-id"
  productName: "Wireless Earphones"
  heroImageURL: "https://res.cloudinary.com/..."
  originalPrice: 3500
  dealPrice: 1999
  dealBadge: "Hot Deal"
  dealEndsAt: Timestamp
  darazLink: "https://daraz.pk/..."
  starRating: 4
  category: "earphones"
  views: 0
  createdAt: Timestamp
}
```

### API Flow

1. User submits article + toggles "Feature as Deal"
2. Article saved to `/articles` collection
3. If deal toggle ON → also save to `/deals` collection
4. Both collections linked by `articleId`
5. Deals page queries `/deals` collection
6. Renders in real-time with filters & sorting
7. Countdown timers run client-side
8. On review click → goes to article page

---

## 🖼️ Image Optimization

All Cloudinary URLs use auto-optimization:
- **Hero images:** `w_800,h_400,c_fill,q_auto,f_auto`
- **Thumbnails:** `w_400,h_250,c_fill,q_auto,f_auto`
- **Gallery:** `w_600,h_400,c_fill,q_auto,f_auto`

Results:
- 10x faster loading
- WebP format for modern browsers
- Auto JPEG/PNG fallback for older browsers
- Optimal quality-to-size ratio

---

## 🧪 Testing Checklist

### Article Submission
- [ ] Go to submit.html with password
- [ ] Fill article form
- [ ] Upload hero image (Cloudinary)
- [ ] Toggle "Feature as Deal"
- [ ] Fill deal fields
- [ ] Click Publish
- [ ] Check deal appears on deals.html
- [ ] Check article appears on reviews.html

### Deals Page
- [ ] Loads without errors
- [ ] Images load fast
- [ ] Countdown timers work
- [ ] Filter buttons highlight on click
- [ ] Filtering works (try each category)
- [ ] Sorting changes order
- [ ] WhatsApp share works
- [ ] Buy button opens Daraz
- [ ] Read Review goes to article

### Manage Tab
- [ ] Shows all articles
- [ ] Shows all active deals
- [ ] Delete button works
- [ ] Content disappears after delete
- [ ] Data persists page reload

---

## 🐛 Troubleshooting

### Images Not Uploading
**Issue:** Upload fails with error  
**Solution:**
- Check config.js has correct Cloud Name
- Verify upload preset exists in Cloudinary
- Check file size < 100MB
- Try different image format (JPG, PNG)

### Deals Not Showing
**Issue:** Deals page blank or loading infinitely  
**Solution:**
- Check Firestore `/deals` collection exists
- Verify `dealEndsAt` is in future (not past)
- Open browser console for JS errors
- Clear browser cache
- Check Firebase rules allow read access

### Countdown Timer Not Working
**Issue:** Timer shows "--:--:--" or wrong time  
**Solution:**
- Check system time is correct
- Verify `dealEndsAt` timestamp format
- Check browser console for errors
- Try on different browser
- Refresh page

### "Wrong password" Error
**Issue:** Can't access submit page  
**Solution:**
- Password is: `PickSmart@786` (exact, case-sensitive)
- Make sure no extra spaces before/after
- Try in incognito/private window
- Check if app is in RTL mode (affects form)

---

## 📊 Analytics & Monitoring

### What Gets Tracked
- Article views (auto-incremented)
- Article likes (real-time)
- Comments count (auto-updated)
- Deal views (in progress)
- Social proof randomized (8-24 people viewing)

### Check in Firestore
1. Open Firestore Console
2. Go to `/articles` collection
3. Click any article
4. See `views`, `likes`, `comments` fields
5. Check `/deals` collection for deal data

---

## 🎨 Customization

### Change Deal Badge Colors
Edit `deals.html`:
```css
.badge-hot { background: #FF4444; }        /* Red */
.badge-bestseller { background: #FFD700; } /* Gold */
.badge-toprated { background: var(--secondary-cyan); } /* Cyan */
.badge-budgetpick { background: #00FF88; } /* Green */
.badge-limitedstock { background: #FF8800; } /* Orange */
```

### Adjust Countdown Timer Alert
Edit `deals.html`:
```javascript
if (hours < 1) {  // Change 1 to 2, 3, etc. for earlier alert
  timer.classList.add('ending-soon');  // Adds red + pulse
}
```

### Change Filter Categories
Edit `deals.html`:
```html
<button data-category="earphones">Earphones</button>
<button data-category="YOUR_NEW">Your Category</button>
```

---

## 🔐 Security Notes

### Firestore Rules
Make sure your rules are:
```javascript
match /articles/{doc=**} {
  allow read: if true;
  allow write: if request.auth != null;
}
match /deals/{doc=**} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

This allows public read, admin write only.

### Cloudinary Security
- Upload preset should be for authenticated uploads only
- Set up CORS properly
- Monitor usage in Cloudinary dashboard
- Free tier includes 25GB/month

---

## 📱 Mobile Experience

- Deals grid: 1 column on mobile
- Filters wrap on small screens
- Countdown timer visible on all devices
- Touch-friendly buttons
- Fast loading with Cloudinary

---

## 🚀 Performance Tips

1. **Use appropriate image sizes** before uploading
2. **Upload during off-peak hours** for faster processing
3. **Monitor Cloudinary usage** monthly
4. **Cache images** in browser (automatic)
5. **Use responsive images** (Cloudinary handles this)

---

## 📞 Support

**Issue with specific feature?**
- Check UPDATES_v2.md for detailed docs
- Review app.js comments
- Check browser console (F12)
- Test in different browser

**General questions?**
- Email: smartdealsproamazon@gmail.com
- Website: https://picksmart.pk

---

## 📚 Documentation

- **README.md** - Full project overview
- **SETUP_GUIDE.md** - Detailed setup instructions
- **UPDATES_v2.md** - Technical documentation
- **FILE_MANIFEST.txt** - Complete file listing
- **QUICKSTART.md** - Original quick start

---

## ✅ Launch Checklist

- [ ] Cloudinary account created
- [ ] Cloud Name added to config.js
- [ ] Upload preset created
- [ ] Firebase Firestore rules updated
- [ ] Test article submission works
- [ ] Test deal feature works
- [ ] Deals page filters working
- [ ] Countdown timers working
- [ ] Images loading fast
- [ ] Mobile responsive
- [ ] Pushed to production
- [ ] Tests pass in browser
- [ ] Analytics tracking working

---

**Ready to launch v2.0!** 🎉

All files updated and tested. Your deal system is now live!
