# Lapor Parkir - Bad Parking Reporter App

A React Native mobile-first web app for reporting and tracking parking violations. Built with Expo for cross-platform compatibility and designed with a modular frontend/backend architecture.

## Project Structure

This project is organized into separate frontend and backend directories:

```
lapor-parkir/
├── frontend/          # React Native/Expo mobile app
│   ├── src/
│   ├── App.js
│   ├── package.json
│   └── ...
├── backend/           # Backend API (planned)
├── README.md          # Project documentation
├── .env.example       # Environment variables template
└── deploy.sh          # Deployment script
```

## Features

### 📱 Report Tab

- **License Plate Input**: Enter the offending vehicle's plate number
- **Violation Checklist**: Select from 8 common parking violations:
  - Double Parking
  - No Parking Zone
  - Illegal Handicap Parking
  - Blocking Fire Hydrant
  - Blocking Crosswalk
  - Expired Meter
  - Blocking Driveway
  - No Stopping Zone
- **Automatic Location**: GPS location with reverse geocoding for address
- **Additional Notes**: Optional field for extra details
- **Form Validation**: Ensures all required fields are filled

### 🔍 Search Tab

- **View All Reports**: Browse all submitted parking violations
- **Real-time Search**: Filter by plate number, location, violation type, or notes
- **Report Details**: View complete information for each violation
- **Delete Reports**: Remove reports with confirmation
- **Pull-to-Refresh**: Update the list of reports
- **Empty State**: Helpful messages when no reports exist

### 💾 Data Storage

- **Local Storage**: All data saved locally using AsyncStorage
- **Offline First**: Works without internet connection
- **Data Persistence**: Reports saved between app sessions

## Tech Stack

### Frontend

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build system
- **React Navigation**: Tab-based navigation
- **AsyncStorage**: Local data persistence
- **Expo Location**: GPS and geocoding services
- **Expo Vector Icons**: Beautiful icons

### Backend

- **Fastify**: Ultra-fast and lightweight Node.js framework
- **@fastify/cors**: Cross-origin resource sharing
- **@fastify/env**: Environment configuration

## Installation & Setup

### Frontend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lapor-parkir
   ```

2. **Navigate to frontend directory and install dependencies**

   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run web    # For web development
   npm run ios    # For iOS (requires macOS)
   npm run android # For Android
   npm start      # For Expo development tools
   ```

### Backend Setup

1. **Navigate to backend directory and install dependencies**

   ```bash
   cd backend
   npm install
   ```

2. **Start the backend server**

   ```bash
   npm run dev    # Development with auto-reload
   npm start      # Production mode
   ```

   The API will be available at `http://localhost:3000`

3. **Test the API**
   ```bash
   curl http://localhost:3000/
   # Should return: {"message":"Lapor Parkir API is running!"}
   ```

## Usage

### Reporting a Violation

1. Open the app and ensure you're on the "Report" tab
2. Enter the license plate number
3. Select one or more violation types from the checklist
4. Allow location access for automatic address detection
5. Optionally add notes with additional details
6. Tap "Submit Report" to save

### Searching Reports

1. Switch to the "Search" tab
2. View all submitted reports in chronological order
3. Use the search bar to filter by:
   - License plate number
   - Location/address
   - Violation type
   - Notes content
4. Tap the trash icon to delete individual reports

## Permissions

The app requests the following permissions:

- **Location**: To automatically detect and record the location of parking violations
- **Storage**: To save reports locally on the device

## Development

### Frontend Structure

```
frontend/src/
├── screens/
│   ├── ReportScreen.js    # Main reporting interface
│   └── SearchScreen.js    # Search and view reports
├── components/            # Reusable components
├── utils/                 # Utility functions
├── hooks/                 # Custom React hooks
├── constants/             # App constants
├── config/                # Configuration files
├── i18n/                  # Internationalization
└── styles/                # Styling files
```

### Key Components

- **App.js**: Main navigation and tab setup
- **ReportScreen**: Form for submitting new violations
- **SearchScreen**: List and search existing reports

## Deployment

Run the deployment script from the root directory:

```bash
./deploy.sh
```

This will build the frontend and deploy it to GitHub Pages.

## Future Enhancements

- **Backend API**: RESTful API for data management
- **Photo Capture**: Add camera integration for evidence photos
- **Export Data**: Export reports as PDF or CSV
- **Location Map**: Interactive map view of violations
- **Statistics**: Analytics dashboard for violation trends
- **Cloud Sync**: Synchronization across devices via backend
- **User Authentication**: User accounts and report ownership
- **Admin Dashboard**: Management interface for violations
- **Real-time Updates**: WebSocket connections for live updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This app is designed for mobile-first use but works on web browsers. For the best experience, use it on a mobile device with GPS capabilities.
