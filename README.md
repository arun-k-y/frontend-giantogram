# Giantogram 📱

A modern React Native mobile application built with Expo, featuring comprehensive user authentication, profile management, and social media integration capabilities.

## 🚀 Features

### Authentication & Security
- **Multi-factor Authentication**: Email and SMS verification
- **Flexible Login**: Support for email, phone number, or username login
- **Secure Password Management**: Password reset and recovery options
- **Account Management**: Account deactivation/reactivation capabilities
- **Remember Me**: Persistent login sessions

### User Profile & Settings
- **Profile Management**: Complete user profile setup and editing
- **Profile Pictures**: Camera and gallery integration for profile photos
- **Date of Birth**: Age validation with minimum age requirements
- **Gender Selection**: Inclusive gender options
- **Country Code Support**: International phone number support with 200+ countries

### User Experience
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS styling
- **Cross-Platform**: Works on iOS, Android, and Web
- **Toast Notifications**: User-friendly feedback messages
- **Error Handling**: Comprehensive error management and validation
- **Loading States**: Smooth loading indicators throughout the app

### Technical Features
- **TypeScript**: Full TypeScript support for better development experience
- **File-based Routing**: Expo Router for intuitive navigation
- **State Management**: React Context for authentication state
- **Async Storage**: Local data persistence
- **Camera Integration**: Native camera functionality
- **Image Picker**: Gallery access for profile pictures

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: Tailwind CSS (NativeWind)
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Storage**: AsyncStorage
- **UI Components**: Custom components with Lucide React Native icons
- **Backend**: RESTful API integration

## 📱 Screenshots

The app includes the following main screens:
- Login/Signup
- Email/Phone verification
- Profile setup
- Home dashboard
- Account management
- Recovery methods

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on your preferred platform**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🔧 Configuration

### Environment Setup

The app connects to a backend API. Update the base URL in `app/config/config.js`:

```javascript
export const baseUrl = "https://your-backend-url.com";
```

### API Endpoints

The app expects the following API endpoints:
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/protected` - Protected user data
- `PATCH /api/auth/deactivate` - Account deactivation
- `PATCH /api/auth/reactivate` - Account reactivation

## 📁 Project Structure

```
frontend/
├── app/                    # Main application code
│   ├── components/         # Reusable UI components
│   ├── config/            # Configuration files
│   ├── constants/         # App constants and data
│   ├── hooks/             # Custom React hooks
│   ├── providers/         # Context providers
│   ├── svgs/              # SVG components
│   ├── utils/             # Utility functions
│   └── *.tsx              # Screen components
├── assets/                # Static assets
│   ├── fonts/             # Custom fonts
│   └── images/            # App images and icons
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🎯 Key Components

- **EmailOrPhoneInput**: Flexible input component for email/phone
- **CustomCamera**: Native camera integration
- **CustomGallery**: Image picker from gallery
- **CountryPickerModal**: Country code selection
- **ConfirmationModal**: Reusable confirmation dialogs
- **ErrorPopup**: Error message display

## 🔐 Authentication Flow

1. **Login/Signup**: User enters credentials
2. **Verification**: Email or SMS verification code
3. **Profile Setup**: Complete profile information
4. **Home**: Access to main app features

## 📱 Platform Support

- ✅ iOS (iPhone & iPad)
- ✅ Android
- ✅ Web (React Native Web)

## 🚀 Deployment

### Building for Production

```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android

# Build for Web
npx expo build:web
```

### EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for platforms
eas build --platform ios
eas build --platform android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review the [React Native documentation](https://reactnative.dev/)
3. Open an issue in this repository

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide React Native](https://lucide.dev/)
- Toast notifications with [react-native-toast-message](https://github.com/calintamas/react-native-toast-message)

---

**Giantogram** - Modern mobile app development with React Native and Expo 🚀
