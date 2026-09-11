export const mockUser = {
  login: 'gamesiteonline',
  name: 'GameSiteOnline',
  avatar_url: 'https://avatars.githubusercontent.com/u/99000000?v=4',
  bio: 'Premium GitHub-powered gaming & developer platform. Building the future of dev tools with glassmorphism & neon.',
  followers: 3842,
  following: 127,
  public_repos: 47,
  total_stars: 12493,
  location: 'San Francisco • Remote',
  company: '@gamesiteonline',
  blog: 'gamesiteonline.com',
  created_at: '2019-03-14T00:00:00Z',
};

export const mockRepos = [
  { id: 1, name: 'gamesite-core', full_name: 'gamesiteonline/gamesite-core', description: 'Core engine for GameSiteOnline platform. High-performance gaming backend with GitHub-native integrations.', private: false, language: 'TypeScript', stargazers_count: 3421, forks_count: 482, open_issues_count: 23, updated_at: new Date(Date.now() - 1000*60*12).toISOString(), topics: ['gaming','github-api','react-native','neon-ui'], license: { name: 'MIT' }, default_branch: 'main', watchers_count: 3421 },
  { id: 2, name: 'neon-glass-ui', full_name: 'gamesiteonline/neon-glass-ui', description: 'Futuristic glassmorphism component library. Blue/cyan neon, 3D depth, particle effects for premium dev dashboards.', private: false, language: 'TypeScript', stargazers_count: 2156, forks_count: 301, open_issues_count: 12, updated_at: new Date(Date.now() - 1000*60*60*3).toISOString(), topics: ['ui-library','glassmorphism','react-native','design-system'], license: { name: 'Apache-2.0' }, default_branch: 'main', watchers_count: 2156 },
  { id: 3, name: 'dev-hud', full_name: 'gamesiteonline/dev-hud', description: 'Real-time developer HUD overlay. GitHub stats, commit streams, CI status in a gaming-inspired overlay.', private: false, language: 'Rust', stargazers_count: 1872, forks_count: 156, open_issues_count: 8, updated_at: new Date(Date.now() - 1000*60*60*24).toISOString(), topics: ['rust','hud','developer-tools','gaming'], license: { name: 'MIT' }, default_branch: 'develop', watchers_count: 1872 },
  { id: 4, name: 'quest-board', full_name: 'gamesiteonline/quest-board', description: 'Turn GitHub issues into gaming quests. XP, levels, achievements for contributors and maintainers.', private: true, language: 'Go', stargazers_count: 945, forks_count: 89, open_issues_count: 42, updated_at: new Date(Date.now() - 1000*60*60*5).toISOString(), topics: ['gamification','github','productivity'], license: { name: 'Proprietary' }, default_branch: 'main', watchers_count: 945 },
  { id: 5, name: 'api-gateway', full_name: 'gamesiteonline/api-gateway', description: 'Edge-native API gateway for GitHub webhooks, rate-limit handling, secure token vault with Android Keystore.', private: false, language: 'Python', stargazers_count: 1203, forks_count: 210, open_issues_count: 15, updated_at: new Date(Date.now() - 1000*60*60*10).toISOString(), topics: ['api','gateway','security','keystore'], license: { name: 'MIT' }, default_branch: 'main', watchers_count: 1203 },
  { id: 6, name: 'particle-engine', full_name: 'gamesiteonline/particle-engine', description: 'GPU-accelerated particle system for React Native Reanimated. 60fps neon particles, glass reflections.', private: false, language: 'C++', stargazers_count: 876, forks_count: 67, open_issues_count: 3, updated_at: new Date(Date.now() - 1000*60*60*48).toISOString(), topics: ['particles','animation','reanimated','graphics'], license: { name: 'MIT' }, default_branch: 'main', watchers_count: 876 },
];

export const mockFiles = [
  { name: 'src', type: 'dir', path: 'src' },
  { name: 'components', type: 'dir', path: 'src/components' },
  { name: 'README.md', type: 'file', path: 'README.md', size: 4523 },
  { name: 'package.json', type: 'file', path: 'package.json', size: 1234 },
  { name: 'App.tsx', type: 'file', path: 'src/App.tsx', size: 8923 },
  { name: 'game.config.ts', type: 'file', path: 'src/game.config.ts', size: 342 },
  { name: '.github', type: 'dir', path: '.github' },
  { name: 'LICENSE', type: 'file', path: 'LICENSE', size: 1065 },
];

export const mockCommits = [
  { sha: 'a1b2c3d4e5f6g7h8i9j0', message: 'feat: implement neon glassmorphism engine with Reanimated 3', author: 'gamesiteonline', date: new Date(Date.now()-1000*60*30).toISOString(), filesChanged: 12 },
  { sha: 'b2c3d4e5f6g7h8i9j0k1', message: 'fix(auth): secure token vault using Android Keystore & SecureStore', author: 'gamesiteonline', date: new Date(Date.now()-1000*60*60*5).toISOString(), filesChanged: 4 },
  { sha: 'c3d4e5f6g7h8i9j0k1l2', message: 'perf: virtualized repo list, 60fps with 500+ repos', author: 'Alex Chen', date: new Date(Date.now()-1000*60*60*22).toISOString(), filesChanged: 8 },
  { sha: 'd4e5f6g7h8i9j0k1l2m3', message: 'feat(editor): mobile code editor with syntax highlight & offline draft', author: 'gamesiteonline', date: new Date(Date.now()-1000*60*60*30).toISOString(), filesChanged: 15 },
];

export const mockIssues = [
  { id: 101, number: 142, title: 'Add particle burst on repo star', state: 'open', author: 'neon-dev', comments: 8, created_at: new Date(Date.now()-1000*60*60*12).toISOString(), labels: [{ name: 'enhancement', color: '#00D1FF' }, { name: 'good first issue', color: '#00FFA3' }] },
  { id: 102, number: 141, title: 'Glass reflection not rendering on low-end devices', state: 'open', author: 'gamesiteonline', comments: 12, created_at: new Date(Date.now()-1000*60*60*36).toISOString(), labels: [{ name: 'bug', color: '#FF5A5F' }, { name: 'performance', color: '#FFC857' }] },
  { id: 103, number: 138, title: 'Secure OAuth Device Flow implementation', state: 'closed', author: 'security-team', comments: 23, created_at: new Date(Date.now()-1000*60*60*72).toISOString(), labels: [{ name: 'security', color: '#8B5CF6' }] },
];

export const mockPRs = [
  { id: 201, number: 89, title: 'feat: Edge-to-edge UI + adaptive icon', state: 'open', author: 'gamesiteonline', created_at: new Date(Date.now()-1000*60*60*6).toISOString(), additions: 342, deletions: 89, comments: 5 },
  { id: 202, number: 88, title: 'fix: Handle GitHub API rate limit with exponential backoff', state: 'open', author: 'Alex Chen', created_at: new Date(Date.now()-1000*60*60*18).toISOString(), additions: 128, deletions: 22, comments: 3 },
];

export const mockReleases = [
  { id: 1, tag_name: 'v2.4.0', name: 'Neon Horizon Release', body: '## Features\n- Cinematic splash with particle field\n- Android Keystore token vault\n- 60fps glassmorphism cards\n- Mobile code editor v2\n\n## Security\n- Least-privilege OAuth\n- No secrets in APK', published_at: new Date(Date.now()-1000*60*60*24*3).toISOString(), assets: [{ name: 'app-release.apk', size: 28472834, download_count: 1242 }] },
  { id: 2, tag_name: 'v2.3.1', name: 'Glass Fix', body: 'Bug fixes for blur on Android 14.', published_at: new Date(Date.now()-1000*60*60*24*12).toISOString(), assets: [{ name: 'app-release.apk', size: 27934212, download_count: 892 }] },
];

export const mockNotifications = [
  { id: '1', type: 'mention', title: 'You were mentioned in gamesiteonline/gamesite-core#142', repo: 'gamesite-core', unread: true, time: '12m ago' },
  { id: '2', type: 'pr', title: 'PR #89 review requested: Edge-to-edge UI', repo: 'neon-glass-ui', unread: true, time: '1h ago' },
  { id: '3', type: 'issue', title: 'New issue assigned: Particle burst animation', repo: 'dev-hud', unread: false, time: '3h ago' },
  { id: '4', type: 'star', title: 'Alex Chen starred your repository', repo: 'api-gateway', unread: false, time: '5h ago' },
  { id: '5', type: 'commit', title: 'Push to main: 3 commits', repo: 'gamesite-core', unread: true, time: '1d ago' },
];

export const mockActivity = [
  { type: 'PushEvent', repo: 'gamesiteonline/gamesite-core', time: '2h ago', description: 'Pushed 3 commits to main' },
  { type: 'StarEvent', repo: 'neon-glass-ui', time: '5h ago', description: 'Starred neon-glass-ui' },
  { type: 'CreateEvent', repo: 'quest-board', time: '1d ago', description: 'Created branch feature/xp-system' },
  { type: 'IssuesEvent', repo: 'api-gateway', time: '1d ago', description: 'Opened issue #142' },
  { type: 'PullRequestEvent', repo: 'dev-hud', time: '2d ago', description: 'Opened PR #89' },
];

export const readmeContent = `# GameSiteOnline\n\nPremium GitHub-powered gaming & developer platform.\n\n## ✨ Features\n\n- **Neon Glassmorphism UI** - Deep black/navy, blue/cyan neon, glass blur\n- **Secure Auth** - Android Keystore via SecureStore, OAuth Device Flow\n- **GitHub Native** - repos, files, commits, issues, PRs, releases\n- **Mobile Code Editor** - syntax highlight, line numbers, offline drafts\n- **Performance** - Virtualized lists, 60fps Reanimated, image caching\n\n## 🔒 Security\n\nNo secrets in APK. Least-privilege. HTTPS only. Token revocation handled.\n\n## 🚀 Quick Start\n\n\\\`\\\`\\\`bash\nnpm install\nexpo start\n\\\`\\\`\\\`\n`;
