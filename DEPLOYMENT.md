# Slate App - Local Development & Production Guide

## Environment Setup

### 1. Environment Variables
Copy the example environment file and configure your Firebase credentials:
```bash
cp .env.example .env
```

Edit `.env` and replace the placeholder values with your actual Firebase configuration from your Firebase Console.

### 2. Install Dependencies
```bash
npm install
```

## Development

### Start Development Server
```bash
npm run dev
```
- Server runs on `http://localhost:3000`
- Hot reload enabled
- Development build with source maps

### Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Enable Authentication (Email/Password and Google)
5. Configure Firestore security rules
6. Get your config from Project Settings > General > Your apps
7. Update your `.env` file with the actual values

### Firestore Security Rules (Development)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents for authenticated users
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Production Build

### Build for Production
```bash
npm run build
```
- Creates optimized build in `dist/` directory
- Minified and bundled for production
- Tree-shaken to remove unused code

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing before deployment

## Deployment Options

### Option 1: Firebase Hosting (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### Option 2: Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 3: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --dir=dist --prod
```

## Environment-Specific Configuration

### Development
- Uses `.env` file for local Firebase config
- Development server with hot reload
- Source maps enabled
- Detailed error logging

### Production
- Environment variables from hosting platform
- Optimized bundle
- Error tracking recommended (Sentry, etc.)
- Analytics enabled

## Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_KEY` | Firebase API Key | Yes |
| `VITE_AUTH_DOMAIN` | Firebase Auth Domain | Yes |
| `VITE_PROJECT_ID` | Firebase Project ID | Yes |
| `VITE_STORAGE_BUCKET` | Firebase Storage Bucket | Yes |
| `VITE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID | Yes |
| `VITE_APP_ID` | Firebase App ID | Yes |
| `VITE_MEASUREMENT_ID` | Firebase Analytics Measurement ID | Optional |

## Database Seeding

The app automatically seeds the database with sample data on first load if no posts exist. This helps with development and testing.

## Features Ready for Deployment

✅ **Authentication**
- Email/Password authentication
- Google OAuth
- User profile management

✅ **Core Functionality**
- Post creation, viewing, editing
- Category filtering
- Search functionality
- Image upload support

✅ **Advanced Features**
- Messaging system
- Offer/negotiation system
- Event RSVP system
- Job application system
- Save/bookmark posts
- Reporting system

✅ **UI/UX**
- Responsive design
- Dark theme
- Modal interfaces
- Loading states
- Error handling

## Security Considerations

### Firestore Security Rules (Production)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts: Read by all, write by authenticated users
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // User data: Only accessible by the user
    match /user_profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Messages: Only between sender and receiver
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Other collections: Authenticated users only
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Monitoring and Analytics

- Firebase Analytics automatically enabled
- Console logging for debugging
- Error boundaries for React components
- Performance monitoring recommended

## Troubleshooting

### Common Issues

1. **Firebase Configuration Errors**
   - Verify `.env` file exists and has correct values
   - Check Firebase project settings match environment variables

2. **Build Errors**
   - Run `npm install` to ensure dependencies are installed
   - Check TypeScript errors: `npx tsc --noEmit`

3. **Authentication Issues**
   - Verify Firebase Authentication is enabled
   - Check authorized domains in Firebase Console

4. **Deployment Issues**
   - Ensure build completes successfully
   - Verify environment variables are set on hosting platform
   - Check hosting platform specific configuration

### Getting Help

- Check browser console for detailed error messages
- Review Firebase Console for backend errors
- Verify network connectivity and CORS settings