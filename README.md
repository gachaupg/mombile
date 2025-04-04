# Soccer Games App

A React Native mobile application for browsing upcoming soccer games from Major League Soccer (MLS). The app allows users to browse matches, search for teams, and save their favorite games.

## Features

- User authentication with Firebase Auth
- Browse upcoming MLS soccer games
- Search functionality for finding specific teams or matches
- User profile management (update profile, delete account)
- Favorite matches functionality with real-time Firestore integration
- Match details view with comprehensive information

## Tech Stack

- **Frontend**: React Native (Expo 50+)
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Firestore, Authentication)
- **API**: TheSportsDB API (free tier)
- **Navigation**: React Navigation with Stack and Bottom Tab navigators
- **UI Components**: GlueStack UI
- **Image Picker**: Expo Image Picker for profile photos

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/soccer-games-app.git
   cd soccer-games-app
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm start
   ```

4. Use the Expo Go app on your mobile device to scan the QR code, or press:
   - `a` to open on Android emulator
   - `i` to open on iOS simulator

## Project Structure

- `/app` - Main application code
  - `/components` - Reusable UI components
  - `/screens` - Application screens
  - `/navigation` - Navigation configuration
  - `/store` - Redux store configuration
    - `/slices` - Redux Toolkit slices
  - `/services` - API and Firebase services
  - `/utils` - Utility functions and helpers
  - `/hooks` - Custom React hooks
  - `/assets` - Static assets (images, fonts)

## API Usage

This app uses the free tier of [TheSportsDB API](https://www.thesportsdb.com/api.php) to fetch soccer match data:

- `/eventsnextleague.php?id=4346` - Fetch upcoming MLS games
- `/lookupevent.php?id={eventId}` - Fetch detailed information about a specific match
- `/lookupteam.php?id={teamId}` - Fetch detailed information about a team
- `/searchteams.php?t={teamName}` - Search for teams by name

## Firebase Configuration

The app uses Firebase for authentication and data storage:

- **Authentication**: Email/password authentication
- **Firestore**: User profiles and favorite games
- **Storage**: Profile images

## Application Flow

1. **Authentication**: Users first see the login/signup screen
2. **Home**: After logging in, users see a list of upcoming soccer games
3. **Search**: Users can search for specific teams or matches
4. **Favorites**: Users can mark games as favorites and view them in a dedicated tab
5. **Profile**: Users can manage their profile information and account

## License

This project is licensed under the MIT License - see the LICENSE file for details.
