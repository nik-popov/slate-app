# Production Deployment Configuration

## Environment Setup

### 1. Environment Variables

Create these files for different environments:

**`.env.production`:**
```env
# Production Firebase Configuration
VITE_API_KEY=your_production_firebase_api_key
VITE_AUTH_DOMAIN=your_production_project.firebaseapp.com
VITE_PROJECT_ID=your_production_project_id
VITE_STORAGE_BUCKET=your_production_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_production_messaging_sender_id
VITE_APP_ID=your_production_firebase_app_id
VITE_MEASUREMENT_ID=your_production_measurement_id
VITE_APP_ENV=production
```

**`.env.development`:**
```env
# Development Firebase Configuration
VITE_API_KEY=your_dev_firebase_api_key
VITE_AUTH_DOMAIN=your_dev_project.firebaseapp.com
VITE_PROJECT_ID=your_dev_project_id
VITE_STORAGE_BUCKET=your_dev_project.appspot.com
VITE_MESSAGING_SENDER_ID=your_dev_messaging_sender_id
VITE_APP_ID=your_dev_firebase_app_id
VITE_MEASUREMENT_ID=your_dev_measurement_id
VITE_APP_ENV=development
```

### 2. Firebase Security Rules (Production)

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to posts, authenticated write
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.user.uid;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.user.uid;
    }
    
    // User profiles - users can only access their own
    match /user_profiles/{profileId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Messages - only between involved parties
    match /messages/{messageId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId);
    }
    
    // Offers - only between buyer and seller
    match /offers/{offerId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.buyerId || 
         request.auth.uid == resource.data.sellerId);
    }
    
    // RSVPs - users can manage their own
    match /rsvps/{rsvpId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Job applications
    match /job_applications/{applicationId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.applicantId || 
         request.auth.uid == resource.data.employerId);
    }
    
    // Saved posts - users can manage their own
    match /saved_posts/{savedId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Reports - authenticated users can create, admins can manage
    match /reports/{reportId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null; // Add admin check here
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /post_images/{imageId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /user_avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment Options

### Option 1: Firebase Hosting

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize:**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure `firebase.json`:**
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ],
       "headers": [
         {
           "source": "**/*.@(js|css)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "max-age=31536000"
             }
           ]
         }
       ]
     }
   }
   ```

4. **Deploy:**
   ```bash
   npm run deploy:firebase
   ```

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Configure `vercel.json`:**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ],
     "env": {
       "VITE_API_KEY": "@vite_api_key",
       "VITE_AUTH_DOMAIN": "@vite_auth_domain",
       "VITE_PROJECT_ID": "@vite_project_id",
       "VITE_STORAGE_BUCKET": "@vite_storage_bucket",
       "VITE_MESSAGING_SENDER_ID": "@vite_messaging_sender_id",
       "VITE_APP_ID": "@vite_app_id",
       "VITE_MEASUREMENT_ID": "@vite_measurement_id"
     }
   }
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 3: Netlify

1. **Configure `netlify.toml`:**
   ```toml
   [build]
     command = "npm run build"
     publish = "dist"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Deploy:**
   ```bash
   npm run deploy:netlify
   ```

## Performance Optimization

### 1. Build Configuration

**`vite.config.ts` optimizations:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore', 'firebase/auth']
  }
})
```

### 2. Firebase Performance

- Use Firestore indexes for complex queries
- Implement pagination for large datasets
- Cache frequently accessed data
- Use Firebase Performance Monitoring

### 3. Image Optimization

- Implement lazy loading for images
- Use appropriate image formats (WebP when possible)
- Resize images before upload
- Consider using Firebase Storage with CDN

## Monitoring and Analytics

### 1. Firebase Analytics
- Track user engagement
- Monitor app performance
- Set up custom events

### 2. Error Tracking
- Implement error boundaries
- Log errors to Firebase Crashlytics
- Monitor API response times

### 3. Performance Monitoring
- Use Web Vitals
- Monitor bundle sizes
- Track loading times

## Security Checklist

- [ ] Environment variables are properly configured
- [ ] Firestore security rules are restrictive
- [ ] Authentication is properly implemented
- [ ] API keys are secured (client-side keys are public)
- [ ] Content Security Policy is configured
- [ ] HTTPS is enforced
- [ ] Input validation is implemented
- [ ] Rate limiting is considered

## Deployment Commands

```bash
# Check before deployment
npm run deploy:check

# Firebase Hosting
npm run deploy:firebase

# Vercel
npm run deploy:vercel

# Netlify
npm run deploy:netlify

# Build only
npm run build

# Preview build locally
npm run preview
```