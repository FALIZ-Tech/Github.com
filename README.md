# GameSiteOnline — Premium GitHub-Powered Gaming & Developer Platform

> **Package:** `com.gamesiteonline.app`  
> **Version:** 2.4.0 (build 240)  
> **Theme:** Deep black/navy • GitHub dark UI • Blue/cyan neon • Glassmorphism • Particle FX  
> **GitHub:** github.com/gamesiteonline

## ✨ Features Implemented

### Brand & Visual Design
- Deep black/navy gradients (#05070E → #0A1020 → #111A2E)
- Glassmorphism cards with BlurView (expo-blur) + border translucency
- Neon blue/cyan glow, soft reflections, 3D parallax via Reanimated
- Particle field background (18 floating neon dots, 60fps)
- GameSiteOnline logo used for launcher, splash, header, about, intro

### Intro / Splash
1. Dark background fade in
2. Logo scales with back-easing + rotateY parallax loop
3. Cyan particles orbiting
4. White reflection sweep across logo
5. Title "GAMESITEONLINE" with neon text shadow
6. Auto finishes 3.8s, skip on first launch only (AsyncStorage flag)

### Authentication & Security (CRITICAL)
- **NO hardcoded PAT** in source/apk/assets/logs
- SecureStore (Android Keystore / iOS Keychain) for token vault
- HTTPS only to api.github.com
- Least-privilege validation via GET /user before storing
- Token meta with expiry tracking
- Secure logout wipes SecureStore + AsyncStorage caches
- 401 session expiry handling, 403/429 rate-limit handling
- Demo mode uses `__demo_only...` placeholder, no real token
- Production recommendation: OAuth Device Flow `POST /login/device/code` with env `GITHUB_CLIENT_ID`

### Home Dashboard
- GitHub avatar with online dot, name, bio, location/company chips
- Animated counters for followers/following/repos/stars
- Neon stats: Uptime 98.7%, 60fps, Secure
- Recently updated repos, live activity feed

### Repositories
- Search, sort (updated/stars/name), filter (all/public/private/favorites)
- Pull-to-refresh, infinite scroll (page+1), favorites via AsyncStorage
- Beautiful animated cards with language dot, topics, private badge

### Repository Details
Tabs: Overview | Code | Commits | Branches | Issues | PRs | Releases
- **Overview:** desc, stars/forks/watchers/issues, license, language, topics
- **Code:** File browser with folder navigation, back/root, file size, type icons → FileViewer
- **Branches:** List, switch, current badge
- **Commits:** Message, author, date, SHA, filesChanged
- **Issues:** Number, title, author, comments, labels with colors
- **PRs:** Number, additions/deletions, state badge
- **Releases:** Version, notes, assets with download counts

### File Browser & Code Editor
- File viewing with line numbers, selectable text, copy/share
- Mobile editor with multiline TextInput, line count, branch edit, tools row (Copy/Select All/Find/Bracket/Save)
- **Commit flow:** Review Changes (diff preview) → Commit Message + Branch → Confirm Alert
- Notes production PUT /repos/{owner}/{repo}/contents/{path} logic

### GitHub Management
- Browsing repos via service layer, file create/edit/delete UI ready
- Branches, issues, comments, PRs, releases, notifications, profile, orgs placeholders with secure permission checks (never bypass)
- Destructive actions require confirmation

### Notifications
- Types: mention, PR, issue, star, commit
- Unread dots, glow cards, filter all/unread, mark all read, badge 3

### Global Search
- Debounced 500ms search for repositories/users/issues
- Type chips, suggestions, empty state with particles

### Navigation
- Bottom tabs: Home | Repositories | Activity | Notifications | Profile (animated icons, glow active)
- Stack: RepoDetails → FileViewer → CodeEditor, Search, Settings, About
- Edge-to-edge UI, dark theme, adaptive icon

### Loading & Error States
- Skeleton shimmer via Reanimated
- Custom ErrorView with icons for network/ratelimit/auth/api + Retry
- Empty results handled

### Offline & Performance
- Virtualized FlatLists, lazy loading, Image caching via expo-image (ready)
- Local caching of safe non-sensitive data via AsyncStorage
- Debounced search, efficient async, pagination
- Rate-limit handling

### Android Config
- `com.gamesiteonline.app`, versionCode 240, edgeToEdgeEnabled, navigationBar dark
- Adaptive icon foreground/background/monochrome from supplied logo
- Permissions only INTERNET + ACCESS_NETWORK_STATE, allowBackup false

### Architecture
```
lib/
  theme.ts       → colors, gradients, radii
  auth.ts        → SecureStore Keystore wrapper
  github.ts      → Dedicated service layer, mock fallback for demo/offline
  mockData.ts    → Rich mock repos/commits/issues/PRs/releases
  favorites.ts   → AsyncStorage favorites
components/
  GlassCard, ParticleBackground, Skeleton, GlowButton, AnimatedCounter, RepoCard, ErrorView
screens/
  IntroScreen, AuthScreen, HomeScreen, RepositoriesScreen, ActivityScreen,
  NotificationsScreen, ProfileScreen, RepoDetailsScreen, FileViewerScreen,
  CodeEditorScreen, SearchScreen, SettingsScreen, AboutScreen
App.tsx → Phase check (intro/auth/main) + NavigationContainer
```

No API logic inside UI components.

### Security Checklist (verified)
- ✅ No credentials in source/assets
- ✅ No logging tokens
- ✅ SecureStore
- ✅ HTTPS
- ✅ Least-privilege
- ✅ Secure logout
- ✅ Session expiry & revocation handling
- ✅ Rate-limit handling
- ✅ Network config secure

### Signing & Release
Debug: Expo Go works out of box.

Release production:
```bash
# Set env secrets (never commit)
export GAMESITE_KEYSTORE_PATH=/secure/release.keystore
export GAMESITE_KEYSTORE_PASSWORD=***
export GAMESITE_KEY_ALIAS=gamesiteonline
export GAMESITE_KEY_PASSWORD=***
export GITHUB_CLIENT_ID=Iv1.xxxxx

# EAS Build signed AAB
npx eas build --platform android --profile production
# Or local:
cd android && ./gradlew bundleRelease
```
Configure `android.adaptiveIcon` uses supplied logo. See SettingsScreen for full gradle snippet.

Store keystore outside repo, use EAS secrets or GitHub Actions secrets.

### Final Flow Tested
Intro → Auth (PAT/Demo) → Dashboard → Repositories → RepoDetails → Code → FileViewer → CodeEditor → Review→Commit → Notifications → Search → Profile → About → Secure Logout

### About Page
Includes version, GitHub link, security info, third-party notices, GitHub API attribution, tech stack, package info.

## Running
```bash
npm install
npx expo start
# scan QR in Expo Go or run web
```

## Logo Usage
Supplied icon.png used for:
- launcher icon (expo.icon + adaptive)
- splash-icon
- intro cinematic logo with reflection
- auth header
- home header
- profile header
- about page hero
Never redesigned, only neon glow wrapper.

---
© 2026 GameSiteOnline • Built with Reanimated, Blur, SecureStore, GitHub API
