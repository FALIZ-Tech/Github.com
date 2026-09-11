# Android Release Signing & Keystore Configuration 🔐
> **GameSiteOnline** (`com.gamesiteonline.app`)

This document outlines the standard production release procedure for generating signed Android Application Bundles (AAB) or signed APKs for GameSiteOnline.

---

## ⚠️ Critical Security Rules

1. **NEVER commit keystores to Git**: Keystore files (`.keystore`, `.jks`) and signing credentials must NEVER be checked into public or private version control.
2. **NEVER hardcode passwords**: Passwords must be supplied via environment variables or encrypted CI/CD secrets.
3. **Keep backup of upload key**: Store your release keystore in a secure password manager or offline encrypted storage.

---

## Step 1: Generate a Release Keystore

Run the following Java `keytool` command in a secure local terminal:

\`\`\`bash
keytool -genkey -v \\
  -keystore gamesiteonline-release.keystore \\
  -alias gamesiteonline-key \\
  -keyalg RSA \\
  -keysize 2048 \\
  -validity 10000
\`\`\`

You will be prompted to enter:
- Keystore password
- Full Name: `GameSiteOnline Release Team`
- Organization: `GameSiteOnline`
- City/Locality & Country Code
- Key password (or press Enter to reuse keystore password)

---

## Step 2: Configure Environment Variables

Set the following environment variables in your local environment or CI/CD pipeline (e.g., GitHub Actions Secrets, EAS Secrets):

\`\`\`bash
export ANDROID_KEYSTORE_PATH="/path/to/gamesiteonline-release.keystore"
export ANDROID_KEYSTORE_PASSWORD="<your-secure-keystore-password>"
export ANDROID_KEY_ALIAS="gamesiteonline-key"
export ANDROID_KEY_PASSWORD="<your-secure-key-password>"
\`\`\`

---

## Step 3: EAS Build (Cloud / Automated)

To build a signed Android App Bundle (AAB) for Google Play Store using EAS:

\`\`\`bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo Application Services
eas login

# Configure credentials securely
eas credentials

# Run production build
eas build --platform android --profile production
\`\`\`

To build a standalone signed APK for direct distribution / sideloading:

\`\`\`bash
eas build --platform android --profile production --type apk
\`\`\`

---

## Step 4: Local Gradle Release Build (Bare / Prebuild)

If using continuous local builds:

1. Create a `gradle.properties` file in your user home directory (`~/.gradle/gradle.properties`) or supply via CI environment:

\`\`\`properties
GAMESITEONLINE_RELEASE_STORE_FILE=/path/to/gamesiteonline-release.keystore
GAMESITEONLINE_RELEASE_KEY_ALIAS=gamesiteonline-key
GAMESITEONLINE_RELEASE_STORE_PASSWORD=your_store_password
GAMESITEONLINE_RELEASE_KEY_PASSWORD=your_key_password
\`\`\`

2. Run release build:
\`\`\`bash
cd android
./gradlew bundleRelease  # Generates AAB in android/app/build/outputs/bundle/release/
./gradlew assembleRelease # Generates APK in android/app/build/outputs/apk/release/
\`\`\`

---

## Step 5: Verification Checklist Before Release

- [x] Application ID matches `com.gamesiteonline.app` in `app.json`
- [x] Official GameSiteOnline logo configured for adaptive icon and foreground
- [x] Background color set to `#070B14`
- [x] Zero Personal Access Tokens or API secrets hardcoded in source
- [x] Android Keystore / SecureStore verified for runtime token encryption
- [x] HTTPS enforced on all network requests
- [x] Rate-limit quota monitor operational
- [x] Fallback offline datasets active when connection is interrupted
