# PickSmart.pk - Final Deployment Steps

## Your Current Status

✅ Website built (100%)  
✅ Cloudinary configured (Cloud Name: dpeh316e0)  
⏳ Firebase setup needed (follow FIREBASE_SETUP.md)  
⏳ Cloudinary preset needed (follow CLOUDINARY_PRESET_SETUP.md)  
⏳ Deploy to hosting  

---

## Complete Checklist (20 minutes)

### Phase 1: Firebase Setup (5 minutes)
- [ ] Go to https://console.firebase.google.com
- [ ] Create new project "PickSmart"
- [ ] Create Firestore database (region: asia-south1)
- [ ] Create 3 collections: articles, comments, deals
- [ ] Add sample data to each collection
- [ ] Get Firebase credentials
- [ ] Update `/config.js` with credentials
- [ ] Set security rules in Firestore
- [ ] **Firebase is ready!**

Reference: Read `FIREBASE_SETUP.md` for exact steps

---

### Phase 2: Cloudinary Preset (2 minutes)
- [ ] Go to https://cloudinary.com/console
- [ ] Go to Settings → Upload tab
- [ ] Click "Add upload preset"
- [ ] Name: `picksmart_uploads`
- [ ] Toggle "Unsigned" ON
- [ ] Save preset
- [ ] **Cloudinary is ready!**

Reference: Read `CLOUDINARY_PRESET_SETUP.md` for exact steps

---

### Phase 3: Deploy to Vercel (3 minutes)

**Option A: Deploy from GitHub (Recommended)**

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "PickSmart.pk v2.0"
git remote add origin https://github.com/YOUR_USERNAME/picksmart
git push -u origin main
```

2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"
6. Done! Your site is live

**Option B: Deploy Manually**

1. Go to https://vercel.com
2. Click "Upload"
3. Drag and drop your project folder
4. Click "Deploy"
5. Done!

---

### Phase 4: Add Environment Variables (if needed)

If using API keys in environment variables:

1. Go to Vercel project settings
2. Click "Environment Variables"
3. Add:
   - `API_KEY` = your cloudinary API key
   - `API_KEY_2` = your cloudinary API secret
4. Redeploy

---

### Phase 5: Test Your Website (5 minutes)

Test on your live domain:

- [ ] Homepage loads fast
- [ ] All pages accessible
- [ ] Reviews page filters work
- [ ] Article detail page loads
- [ ] Deals page shows countdown timers
- [ ] Submit form accepts password
- [ ] Can upload image (test with small image)
- [ ] Comments section works
- [ ] Like button increments
- [ ] Share buttons work

---

### Phase 6: Google Search Console (2 minutes)

1. Go to https://search.google.com/search-console
2. Click "URL prefix"
3. Enter: `https://yourdomain.com`
4. Download verification file from Vercel
5. Verify
6. Submit sitemap: `/sitemap.xml`
7. Done!

---

### Phase 7: Google AdSense (1 hour)

1. Go to https://adsense.google.com
2. Sign in
3. Click "Get started"
4. Enter your website URL
5. Google will check your site
6. Wait for approval (24-48 hours)
7. Once approved, add ad code to pages

---

## Final Status

| Task | Status | Time |
|------|--------|------|
| Firebase Setup | ⏳ Do this first | 5 min |
| Cloudinary Preset | ⏳ Do this second | 2 min |
| Deploy | ⏳ Do this third | 3 min |
| Test | ⏳ Do this fourth | 5 min |
| **Total** | **Ready!** | **~15 min** |

---

## Your Website Features

✅ 9 full pages  
✅ Real-time Firestore database  
✅ Cloudinary image CDN  
✅ Advanced deals marketplace  
✅ Admin dashboard (2 tabs)  
✅ Article submissions  
✅ Auto-generated comments  
✅ Live countdown timers  
✅ Category filters  
✅ Real-time likes & comments  
✅ Mobile responsive  
✅ SEO optimized  
✅ Bilingual (EN + Urdu)  
✅ Google AdSense ready  

---

## Support

If you get stuck:
1. Read `FIREBASE_SETUP.md` for Firebase help
2. Read `CLOUDINARY_PRESET_SETUP.md` for Cloudinary help
3. Check console.log in browser (F12 → Console)
4. Email: smartdealsproamazon@gmail.com

---

## Next Steps

1. **NOW:** Follow FIREBASE_SETUP.md (do this first)
2. **THEN:** Follow CLOUDINARY_PRESET_SETUP.md
3. **THEN:** Download this project and deploy to Vercel

**You're 15 minutes away from launching!** 🚀
