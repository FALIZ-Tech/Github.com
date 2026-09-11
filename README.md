# GameSiteOnline ⚡🎮
> **Premium GitHub-Powered Gaming & Developer Platform**  
> Official Mobile Application connected to [github.com/gamesiteonline](https://github.com/gamesiteonline)  
> Application Package: `com.gamesiteonline.app`

---

## 🌟 Overview

**GameSiteOnline** is a high-performance, futuristic Android application designed for developers and gamers. Seamlessly connected to the `gamesiteonline` GitHub organization and personal developer hub, it bridges source code management, retro gaming engines, WebAssembly DOSBox emulators, and dynamic project releases into a unified glassmorphism dashboard.

---

## 🎨 Brand & Visual Design

- **Deep Black & Navy Canvas**: `#070B14`, `#0D1117`, `#0A0F1D`
- **Neon Cyan & Blue Glow**: `#00F0FF`, `#38BDF8`, `#2563EB`
- **Glassmorphic Paneling**: Frosted transparency with soft edge reflections and glowing borders
- **Performance-Tuned Particle Engine**: Floating light particles customizable in Settings
- **Official Branding**: The authentic GameSiteOnline chevron glyph is utilized throughout the launcher icon, splash screen, cinematic intro, navigation headers, loading screens, and about documentation.

---

## 🚀 Key Features

### 1. Cinematic Intro & Splash Screen
- Smooth multi-stage entrance animation
- Dark ambient backdrop with glowing cyan particle halos
- Glass reflection sweep across the GameSiteOnline emblem
- 3D parallax orientation tilt
- "GAMESITEONLINE" brand reveal with 1-tap skip support and local persistence

### 2. GitHub Authentication & Zero-Trust Security
- **Official RFC 8628 GitHub Device Flow**: Direct device code authorization (`XXXX-YYYY`) verified on `https://github.com/login/device`. No secrets entered into third-party proxies.
- **Hardware-Backed Encryption**: Tokens stored using Android Keystore via `expo-secure-store` (`SecureStorage`).
- **Least-Privilege Scopes**: Scoped to `repo`, `read:user`, and `notifications`.
- **Zero Embedded Secrets**: Absolutely no Personal Access Tokens or API keys baked into the APK binary.
- **Guest Explorer Mode**: Instant access to browse all 58+ repositories, commit histories, code files, and release artifacts without entering credentials.

### 3. Dashboard (Home)
- Real-time GitHub profile metrics: Avatar, bio, location, followers (128), following (16), repositories (58), total stars (240+)
- **Ecosystem Tech Stack**: Multi-segmented distribution chart highlighting TypeScript (48%), Python (26%), JavaScript (16%), and HTML/CSS (10%)
- **Featured Game Engines**: Quick access to flagship projects (`SIGNO-GAME`, `dos-games`, `mobile-games`, `fad-3d`)
- **Live Git Activity Stream**: Recent commit pushes, releases, and branch updates
- **Quick Launch Bar**: 1-tap shortcuts to all 58 repos, releases, stream, and notification center

### 4. Comprehensive Repository Explorer
- Full repository directory with public/private visibility badges
- GitHub language indicators with official color codes
- Debounced live search across names, descriptions, and topics
- Multi-criteria sorting (Recently Updated, Star Count, Forks, Alphabetical)
- Category filters (All, Games, TypeScript, JavaScript, Python, Starred)
- Star / favorite toggle with local offline persistence

### 5. Repository Details & GitHub-Style File Browser
- **Overview**: Description, stargazers, forks, watchers, license, default branch, one-tap clone URL copy, and live demo links
- **Markdown README Renderer**: Fenced code blocks with copy-to-clipboard, typography headers, blockquotes, and lists
- **File Explorer**: Drill down folder hierarchies with breadcrumb navigation and back stack
- **Source Code Viewer**: Line numbers, monospaced code layout, copy action, and in-file search
- **Branch Switcher**: Real-time branch selection (`main`, `dev`, `feature/neon-audio-matrix`)
- **Git Commits**: Commit messages, author avatars, timestamps, and commit SHA copy
- **Issue Tracker**: Search, filter open/closed issues, create new issues, add comments, and close/reopen
- **Pull Requests**: Pull request browser with head/base branch indicators and merge statuses
- **Releases Tab**: Direct links to download APKs and game distribution archives

### 6. Mobile Code Editor
- In-app file editing with syntax highlighting
- Undo & redo history stack
- In-file text find/search
- File path renaming and branch selection
- **Three-Step Safe Commit Pipeline**:  
  `Review Changes (Visual Diff) → Commit Message → Confirm & Push`

### 7. Notification & Release Centers
- **Notification Inbox**: Filter by unread, one-tap mark as read, mark all read, and categorical icons (Issues, PRs, Commits, Releases)
- **Release Distribution Hub**: Downloadable production `.apk` binaries and web bundles with file size badges and download tallies

### 8. Global GitHub Search
- Multi-category search spanning Repositories, Users, and Issues
- Real-time debounced queries with animated results

### 9. Settings & Developer Hub
- Live GitHub API rate-limit monitor with reset countdown timer
- Toggle background particle effects, haptic feedback, and auto-sync
- Android Keystore AES-256 encryption status check
- Safe local cache purge
- Replay cinematic intro anytime

---

## 🛡️ Architecture & Clean Layering

```
GameSiteOnline/
├── src/
│   ├── api/             # Official GitHub REST v3 client, Device Flow & fallback data
│   │   ├── githubApi.ts
│   │   └── mockFallbackData.ts
│   ├── services/        # Android Keystore SecureStorage & Authentication service
│   │   ├── authService.ts
│   │   └── storage.ts
│   ├── context/         # React Context for global Auth and App state
│   │   ├── AuthContext.tsx
│   │   └── AppContext.tsx
│   ├── models/          # Strict TypeScript interfaces for GitHub API entities
│   │   └── github.ts
│   ├── theme/           # Cyberpunk neon dark color palette & language colors
│   │   └── colors.ts
│   ├── components/      # Modular glassmorphism UI components
│   │   ├── Logo.tsx
│   │   ├── GlassCard.tsx
│   │   ├── NeonButton.tsx
│   │   ├── Header.tsx
│   │   ├── BottomNav.tsx
│   │   ├── ParticleBackground.tsx
│   │   ├── CodeViewer.tsx
│   │   ├── DiffViewer.tsx
│   │   ├── MarkdownViewer.tsx
│   │   ├── RateLimitBadge.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── ErrorState.tsx
│   └── screens/         # Complete application screen views
│       ├── IntroScreen.tsx
│       ├── AuthScreen.tsx
│       ├── HomeScreen.tsx
│       ├── RepositoriesScreen.tsx
│       ├── RepoDetailScreen.tsx
│       ├── CodeEditorScreen.tsx
│       ├── ReleasesScreen.tsx
│       ├── NotificationsScreen.tsx
│       ├── ActivityScreen.tsx
│       ├── GlobalSearchScreen.tsx
│       ├── ProfileScreen.tsx
│       ├── SettingsScreen.tsx
│       └── AboutScreen.tsx
├── assets/              # Authentic GameSiteOnline branding & icons
├── App.tsx              # Root coordinator & safe-area navigation
└── app.json             # Expo / Android production configuration
```

---

## 📦 Android Package Configuration

- **Package Name**: `com.gamesiteonline.app`
- **Application Name**: `GameSiteOnline`
- **Theme**: Dark Edge-to-Edge (`#070B14`)
- **Orientation**: Portrait with tablet responsiveness
- **Adaptive Icon**: Black background with official glowing chevron emblem

---

## 🛠️ Verification & Building

To export all bundles for production:
\`\`\`bash
npx expo export --platform all
\`\`\`

To build the signed release APK or Android App Bundle (AAB):
Refer to [SIGNING.md](./SIGNING.md) for step-by-step keystore generation and EAS / Gradle release workflows.
