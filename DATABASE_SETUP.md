# Database Configuration Guide

## Quick Setup Summary

Your Slate app is showing "Your Feed is Empty" because it needs to be connected to a Firebase database. Here are your options:

### Option 1: Use In-App Configuration (Recommended for Quick Testing)

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open the app** in your browser (usually http://localhost:5173)

3. **Click "Configure Firebase Database"** on the empty state screen

4. **Follow the setup instructions** in the modal to create a Firebase project and get your config values

5. **The app will download a .env file** for you - place it in your project root

6. **Restart your dev server** and seed sample data

### Option 2: Manual Configuration

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project or select existing one
   - Click "Add app" and select "Web app" (</> icon)
   - Register your app with any name

2. **Get Configuration Values:**
   Copy the config object from Firebase and update your `.env` file:
   ```env
   VITE_API_KEY=your_firebase_api_key_here
   VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_PROJECT_ID=your_firebase_project_id
   VITE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_APP_ID=your_firebase_app_id
   VITE_MEASUREMENT_ID=your_measurement_id
   ```

3. **Enable Firestore Database:**
   - In Firebase Console, go to "Firestore Database"
   - Click "Create database"
   - Choose "Start in test mode" for development

4. **Set Firestore Security Rules** (for testing):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   ⚠️ **These rules allow all access - use more restrictive rules in production!**

5. **Restart Development Server:**
   ```bash
   npm run dev
   ```

6. **Seed Sample Data:**
   - Open the app and click "Seed Sample Data"
   - Or manually create posts through the app

## Production Deployment

### For Production, Update Security Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read all posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Messages require authentication
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Other collections require auth
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Environment Variables for Production:

Create environment-specific configurations:

- `.env.development` - for local development
- `.env.staging` - for staging environment  
- `.env.production` - for production deployment

## Troubleshooting

### "Permission denied" errors:
- Check your Firestore security rules
- Ensure authentication is working if rules require it
- Verify your Firebase project settings

### "Firebase not configured" errors:
- Check that all required environment variables are set
- Verify your Firebase project is active
- Ensure Firestore is enabled in your Firebase project

### Empty feed after configuration:
- Use the "Seed Sample Data" button to add test posts
- Check browser console for any error messages
- Verify network connectivity to Firebase

### Development vs Production:
- Development: Use test rules for easier debugging
- Production: Implement proper security rules
- Use different Firebase projects for dev/staging/prod

## Available Scripts

```bash
npm run setup          # Run development setup script
npm run dev           # Start development server
npm run build         # Build for production
npm run deploy:check  # Check build before deployment
npm run preview       # Preview production build locally
```

## Need Help?

1. Check the browser console for error messages
2. Verify your Firebase project configuration
3. Ensure Firestore database is enabled and accessible
4. Test with sample data first before adding real content

## Security Best Practices

1. **Never commit sensitive config to version control**
2. **Use environment variables for all config**
3. **Implement proper Firestore security rules**
4. **Use different projects for dev/staging/production**
5. **Regularly review and update security rules**
6. **Monitor Firebase usage and costs**