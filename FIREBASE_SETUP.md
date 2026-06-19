# Firebase Setup Guide for PickSmart.pk

## Step-by-Step Firebase Configuration

### **Step 1: Create Firebase Project**

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter project name: `PickSmart`
4. Click "Create project"
5. Wait for project to create (1-2 minutes)

### **Step 2: Enable Firestore Database**

1. From Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Select: **Start in production mode**
4. Choose region: **asia-south1** (for Pakistan)
5. Click "Create"
6. Wait for database to initialize

### **Step 3: Create Collections**

Your Firestore needs 3 collections. Copy-paste this data:

**Collection 1: articles**
- Click "Start collection"
- Collection ID: `articles`
- Add sample document (auto-generated ID):
```
{
  "title": "Best Earphones Under Rs. 2000",
  "category": "earphones",
  "description": "Top affordable earphones reviewed",
  "content": "<p>Full article content here...</p>",
  "heroImage": "https://via.placeholder.com/800x400",
  "images": [],
  "videoUrl": "",
  "pros": ["Good sound", "Comfortable", "Budget-friendly"],
  "cons": ["Battery life", "Build quality"],
  "darazLink": "https://www.daraz.pk",
  "price": 1999,
  "rating": 4,
  "views": 0,
  "likes": 0,
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

**Collection 2: comments**
- Collection ID: `comments`
- Add sample document:
```
{
  "articleId": "[paste-article-id-here]",
  "name": "Ali Raza",
  "text": "Great review! Very helpful.",
  "likes": 5,
  "createdAt": "2025-01-15T10:30:00Z",
  "timestamp": "2 hours ago"
}
```

**Collection 3: deals**
- Collection ID: `deals`
- Add sample document:
```
{
  "articleId": "[paste-article-id-here]",
  "productName": "Samsung Galaxy Buds",
  "heroImageURL": "https://via.placeholder.com/400x250",
  "originalPrice": 4999,
  "dealPrice": 2999,
  "dealBadge": "Hot Deal",
  "dealEndsAt": "2025-01-20T23:59:59Z",
  "darazLink": "https://www.daraz.pk",
  "starRating": 5,
  "category": "earphones",
  "views": 0,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### **Step 4: Get Firebase Credentials**

1. From Firebase Console, go to Project Settings (gear icon)
2. Go to "Service Accounts" tab
3. Click "Generate new private key" (download JSON)
4. Open the JSON file and copy these values:

```
apiKey: (from Web SDK setup below)
authDomain: YOUR_PROJECT_ID.firebaseapp.com
projectId: YOUR_PROJECT_ID
storageBucket: YOUR_PROJECT_ID.appspot.com
messagingSenderId: (from JSON)
appId: (from JSON)
```

### **Step 5: Get Web API Key**

1. From Firebase Console, go to "Settings" → "Web API Key"
2. Or go to Project Settings → "Your apps" → Click on Web app
3. Look for `apiKey` in the config

### **Step 6: Update config.js**

Replace the Firebase config in `/config.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### **Step 7: Firebase Security Rules (Important!)**

Go to Firestore → Rules tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Allow anyone to read articles
    match /articles/{document=**} {
      allow read;
      allow write: if false;
    }
    
    // Allow anyone to read comments
    match /comments/{document=**} {
      allow read;
      allow create;
      allow update, delete: if false;
    }
    
    // Allow anyone to read deals
    match /deals/{document=**} {
      allow read;
      allow write: if false;
    }
  }
}
```

Click "Publish" to save rules.

---

## Verification Checklist

- [ ] Firebase project created
- [ ] Firestore database initialized
- [ ] 3 collections created (articles, comments, deals)
- [ ] Sample data added to each collection
- [ ] Firebase credentials copied to config.js
- [ ] Security rules published

**Your Firebase is now ready!** 🎉

Next: Create Cloudinary upload preset (2 minutes)
