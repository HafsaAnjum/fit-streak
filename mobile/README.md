
# FitStreak Mobile Companion

A React Native mobile app that collects health and fitness data from Google Health Connect and syncs it with the FitStreak web application.

## Features

- Authentication with Supabase (same account as the web app)
- Integration with Health Connect API
- Fitness data syncing to Supabase
- Real-time updates to keep the web app data current

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on Android device or emulator:
```bash
npm run android
```

## Health Connect

This app uses the Health Connect API to access health and fitness data on Android devices. Health Connect requires:

- Android API level 26 (Android 8.0) or higher
- Google Health Connect app installed from Play Store

## Data Syncing

The app syncs the following data types:
- Steps count
- Heart rate
- Calories burned
- Distance walked/run

The data is securely stored in your Supabase database and can be viewed in the FitStreak web application.
