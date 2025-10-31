# Slate - Community Marketplace App

A modern React-based community marketplace application built with Firebase, TypeScript, and Tailwind CSS. Post items for sale, announce events, offer services, and find jobs in your local community.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
You have two options to configure Firebase:

**Option A: In-App Configuration (Recommended)**
1. Run `npm run dev`
2. Open http://localhost:3001 (or the port shown)
3. Click "Configure Firebase Database" 
4. Follow the setup wizard to connect your Firebase project
5. Configuration persists automatically - no need to re-enter!

**Option B: Manual Configuration**
1. Copy `.env.example` to `.env`
2. Fill in your Firebase configuration values
3. Restart the dev server

### 3. Start Development
```bash
npm run dev
```

## 🔧 Database Setup

The app shows "Your Feed is Empty" until you configure Firebase. Here's how:

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Add a web app (</> icon)
4. Copy the configuration values

### Enable Firestore
1. In Firebase Console → Firestore Database
2. Create database in test mode
3. Use these security rules for development:

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

⚠️ **Use proper security rules in production!**

### Configuration Persistence
- Once configured through the app, settings persist automatically
- No need to re-enter configuration on browser restart
- Configuration stored securely in localStorage

## 📱 Features

- **Posts**: Create and browse community posts
- **Categories**: For Sale, Events, Services, Jobs
- **Authentication**: Sign in with Google/email
- **Real-time Updates**: Live feed updates
- **Search**: Find posts by keywords
- **Responsive Design**: Works on all devices

### Advanced Features
- **Messaging**: Contact post authors
- **Offers**: Make/receive offers on items
- **RSVPs**: Event attendance tracking  
- **Job Applications**: Apply to job postings
- **Saved Posts**: Bookmark interesting posts
- **User Profiles**: Manage your information
- **Reporting**: Report inappropriate content

## 🛠 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # Run TypeScript checking
npm run setup        # Run development setup script
npm run deploy:check # Validate build before deployment
```

### Project Structure
```
src/
├── components/          # React components
├── types.ts            # TypeScript type definitions
├── firebaseConfig.ts   # Firebase configuration
├── authService.ts      # Authentication logic
├── backendService.ts   # Database operations
└── App.tsx            # Main application component
```

### Development Workflow
1. Configure Firebase (one-time setup)
2. Add sample data using the "Add Sample Data" button
3. Start creating posts and testing features
4. Use browser dev tools to debug

## 🚀 Deployment

### Firebase Hosting
```bash
npm run deploy:firebase
```

### Vercel
```bash
npm run deploy:vercel  
```

### Netlify
```bash
npm run deploy:netlify
```

See [PRODUCTION_DEPLOY.md](./PRODUCTION_DEPLOY.md) for detailed deployment instructions.

## 🔒 Security

### Development
- Uses test security rules for easy development
- All data operations logged for debugging
- Configuration persists locally

### Production
- Implement proper Firestore security rules
- Use environment variables for sensitive config
- Enable Firebase App Check for additional security
- Regular security rule audits

## 📚 Documentation

- [Database Setup Guide](./DATABASE_SETUP.md) - Detailed configuration instructions
- [Production Deployment](./PRODUCTION_DEPLOY.md) - Complete deployment guide
- [Development Setup](./dev-setup.sh) - Automated setup script

## 🐛 Troubleshooting

### "Your Feed is Empty"
- **Cause**: Firebase not configured or database empty
- **Solution**: Use in-app configuration or add sample data

### Firebase Errors
- Check browser console for specific error messages
- Verify Firebase project is active and Firestore is enabled
- Ensure security rules allow your operations

### Build Issues
- Run `npm run type-check` to identify TypeScript errors
- Clear `node_modules` and reinstall if needed
- Check that all environment variables are set

### Port Already in Use
- Development server will automatically try the next available port
- Check terminal output for the actual port being used

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🎯 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Firebase Firestore, Firebase Auth
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting, Vercel, Netlify

## 🔄 Status

✅ **Ready for Development**: All core features implemented
✅ **Database Integration**: Firebase Firestore configured  
✅ **Authentication**: Google & email sign-in
✅ **Responsive Design**: Mobile-first approach
✅ **Type Safety**: Full TypeScript coverage
✅ **Production Ready**: Deployment configurations included

---

**Need Help?** Check the documentation files or open an issue on GitHub.