# Firebase Services

This directory contains services for interacting with Firebase backend.

## Firebase Configuration

The app uses the following Firebase services:

- **Authentication**: For user authentication (email/password)
- **Firestore**: For storing user profiles and favorite games
- **Storage**: For storing user profile images

## Files

- `firebase.js`: Firebase initialization and authentication services
- `api.js`: Services for interaction with TheSportsDB API

## Firebase Structure

The Firestore database has the following structure:

- **users/**: Collection of user profiles
  - **{userId}/**: Document for each user containing profile information
    - **favorites/**: Subcollection of favorite games
      - **{gameId}/**: Document for each favorite game

The Firebase Storage structure:

- **profile_images/{userId}**: User profile images

## Security Rules

Make sure to set up proper security rules in Firebase Console to secure your data:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write only their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Allow users to read and write only their own favorites
      match /favorites/{gameId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

For Firebase Storage:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile_images/{userId} {
      allow read: if true;  // Anyone can view profile pictures
      allow write: if request.auth != null && request.auth.uid == userId;  // Only the user can update their picture
    }
  }
}
```
