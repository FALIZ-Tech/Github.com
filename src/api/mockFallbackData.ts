import { GitHubUser, GitHubRepo, GitHubCommit, GitHubIssue, GitHubPullRequest, GitHubRelease, GitHubEvent, GitHubContentItem } from '../models/github';

export const FALLBACK_GAMESITEONLINE_USER: GitHubUser = {
  login: 'gamesiteonline',
  id: 269415120,
  avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
  html_url: 'https://github.com/gamesiteonline',
  name: 'GameSiteOnline',
  company: 'GameSite Studio',
  blog: 'https://gamesiteonline1.pythonanywhere.com',
  location: 'Tanzania',
  email: 'contact@gamesiteonline.dev',
  bio: 'Building futuristic web games, DOS emulation engines, and developer platforms powered by GitHub.',
  twitter_username: 'gamesiteonline',
  public_repos: 58,
  public_gists: 4,
  followers: 128,
  following: 16,
  created_at: '2026-03-19T08:49:16Z',
  updated_at: '2026-09-11T12:30:28Z',
};

export const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1297003122,
    name: 'SIGNO-GAME',
    full_name: 'gamesiteonline/SIGNO-GAME',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/SIGNO-GAME',
    description: 'Cyberpunk neon arcade runner engine with procedural obstacle generation and synthwave audio.',
    fork: false,
    stargazers_count: 42,
    watchers_count: 42,
    language: 'TypeScript',
    forks_count: 7,
    open_issues_count: 3,
    default_branch: 'main',
    topics: ['gaming', 'typescript', 'canvas-game', 'cyberpunk', 'neon-ui'],
    created_at: '2026-07-11T00:27:14Z',
    updated_at: '2026-09-11T12:30:28Z',
    pushed_at: '2026-09-11T12:20:00Z',
    size: 56551,
    clone_url: 'https://github.com/gamesiteonline/SIGNO-GAME.git',
    homepage: 'https://gamesiteonline1.pythonanywhere.com',
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
  },
  {
    id: 1299195305,
    name: 'mobile-games',
    full_name: 'gamesiteonline/mobile-games',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/mobile-games',
    description: 'Curated collection of touch-optimized high-performance mobile web games and game porting tools.',
    fork: false,
    stargazers_count: 38,
    watchers_count: 38,
    language: 'TypeScript',
    forks_count: 5,
    open_issues_count: 1,
    default_branch: 'main',
    topics: ['mobile-games', 'pwa', 'touch-controls', 'typescript', 'vite'],
    created_at: '2026-07-13T11:10:26Z',
    updated_at: '2026-09-11T12:30:19Z',
    pushed_at: '2026-09-10T18:40:11Z',
    size: 271,
    clone_url: 'https://github.com/gamesiteonline/mobile-games.git',
    homepage: 'https://mobile-games-delta.vercel.app',
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
  },
  {
    id: 1299195585,
    name: 'dos-games',
    full_name: 'gamesiteonline/dos-games',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/dos-games',
    description: 'WebAssembly DOSBox emulator frontend for retro MS-DOS arcade and strategy games in the browser.',
    fork: false,
    stargazers_count: 56,
    watchers_count: 56,
    language: 'TypeScript',
    forks_count: 12,
    open_issues_count: 2,
    default_branch: 'main',
    topics: ['dosbox', 'retro-gaming', 'webassembly', 'emulation', 'dos'],
    created_at: '2026-07-13T11:10:45Z',
    updated_at: '2026-09-11T12:30:21Z',
    pushed_at: '2026-09-08T09:12:00Z',
    size: 276,
    clone_url: 'https://github.com/gamesiteonline/dos-games.git',
    homepage: null,
    license: { key: 'gpl-3.0', name: 'GNU General Public License v3.0', spdx_id: 'GPL-3.0' },
  },
  {
    id: 1363475512,
    name: 'gamesiteonline',
    full_name: 'gamesiteonline/gamesiteonline',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/gamesiteonline',
    description: 'Official GameSiteOnline developer hub, API integrations, game metadata, and live tournament boards.',
    fork: false,
    stargazers_count: 89,
    watchers_count: 89,
    language: 'TypeScript',
    forks_count: 18,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['platform', 'gaming-hub', 'profile-readme', 'developer-api'],
    created_at: '2026-09-10T03:33:04Z',
    updated_at: '2026-09-11T15:19:57Z',
    pushed_at: '2026-09-11T15:19:53Z',
    size: 13,
    clone_url: 'https://github.com/gamesiteonline/gamesiteonline.git',
    homepage: 'https://gamesiteonline1.pythonanywhere.com',
    license: { key: 'apache-2.0', name: 'Apache License 2.0', spdx_id: 'Apache-2.0' },
  },
  {
    id: 1298202392,
    name: 'Try-game',
    full_name: 'gamesiteonline/Try-game',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/Try-game',
    description: 'Experimental game physics sandbox exploring collision detection, rigid body kinematics, and raycasting.',
    fork: false,
    stargazers_count: 19,
    watchers_count: 19,
    language: 'TypeScript',
    forks_count: 3,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['physics-engine', 'game-dev', 'sandbox', 'canvas'],
    created_at: '2026-07-12T10:56:36Z',
    updated_at: '2026-09-11T12:30:23Z',
    pushed_at: '2026-08-30T14:10:00Z',
    size: 78,
    clone_url: 'https://github.com/gamesiteonline/Try-game.git',
    homepage: null,
    license: null,
  },
  {
    id: 1297334411,
    name: 'fad-3d',
    full_name: 'gamesiteonline/fad-3d',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/fad-3d',
    description: 'Three.js 3D gaming scene manager with neon lighting, GLTF model loaders, and spatial audio.',
    fork: false,
    stargazers_count: 31,
    watchers_count: 31,
    language: 'JavaScript',
    forks_count: 6,
    open_issues_count: 1,
    default_branch: 'main',
    topics: ['threejs', '3d-gaming', 'webgl', 'graphics', 'shaders'],
    created_at: '2026-07-11T12:15:00Z',
    updated_at: '2026-09-09T18:22:15Z',
    pushed_at: '2026-09-09T18:20:00Z',
    size: 3420,
    clone_url: 'https://github.com/gamesiteonline/fad-3d.git',
    homepage: null,
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
  },
  {
    id: 1296554422,
    name: 'faliz-ai',
    full_name: 'gamesiteonline/faliz-ai',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/faliz-ai',
    description: 'Autonomous reinforcement learning agent for NPC decision trees and dynamic procedural level generation.',
    fork: false,
    stargazers_count: 64,
    watchers_count: 64,
    language: 'Python',
    forks_count: 14,
    open_issues_count: 4,
    default_branch: 'main',
    topics: ['ai-gaming', 'reinforcement-learning', 'python', 'neural-networks'],
    created_at: '2026-07-09T14:32:00Z',
    updated_at: '2026-09-10T11:45:00Z',
    pushed_at: '2026-09-10T11:40:00Z',
    size: 1450,
    clone_url: 'https://github.com/gamesiteonline/faliz-ai.git',
    homepage: null,
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
  },
  {
    id: 1295221100,
    name: 'eye-scan',
    full_name: 'gamesiteonline/eye-scan',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/eye-scan',
    description: 'Biometric cyberpunk retinal scanner simulation with canvas glitch shaders and particle effects.',
    fork: false,
    stargazers_count: 27,
    watchers_count: 27,
    language: 'JavaScript',
    forks_count: 4,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['cyberpunk', 'canvas-glitch', 'sci-fi-ui', 'retinal-scan'],
    created_at: '2026-07-06T19:04:12Z',
    updated_at: '2026-09-08T16:30:00Z',
    pushed_at: '2026-09-08T16:25:00Z',
    size: 890,
    clone_url: 'https://github.com/gamesiteonline/eye-scan.git',
    homepage: null,
    license: null,
  },
  {
    id: 1294119933,
    name: 'BITZO',
    full_name: 'gamesiteonline/BITZO',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/BITZO',
    description: 'Chiptune synthesizer and 8-bit audio tracker for browser-based retro video game soundtrack creation.',
    fork: false,
    stargazers_count: 33,
    watchers_count: 33,
    language: 'JavaScript',
    forks_count: 8,
    open_issues_count: 2,
    default_branch: 'main',
    topics: ['chiptune', 'audio-api', 'retro-synth', '8-bit', 'webaudio'],
    created_at: '2026-07-03T08:12:30Z',
    updated_at: '2026-09-07T12:00:00Z',
    pushed_at: '2026-09-07T11:55:00Z',
    size: 2100,
    clone_url: 'https://github.com/gamesiteonline/BITZO.git',
    homepage: null,
    license: { key: 'mit', name: 'MIT License', spdx_id: 'MIT' },
  },
  {
    id: 1293008822,
    name: 'fahad-tech-dashboard',
    full_name: 'gamesiteonline/fahad-tech-dashboard',
    private: false,
    owner: {
      login: 'gamesiteonline',
      avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4',
      html_url: 'https://github.com/gamesiteonline',
    },
    html_url: 'https://github.com/gamesiteonline/fahad-tech-dashboard',
    description: 'Real-time telemetry and developer analytics dashboard for GameSite online infrastructure.',
    fork: false,
    stargazers_count: 22,
    watchers_count: 22,
    language: 'TypeScript',
    forks_count: 2,
    open_issues_count: 0,
    default_branch: 'main',
    topics: ['dashboard', 'telemetry', 'analytics', 'react', 'nextjs'],
    created_at: '2026-06-29T16:45:00Z',
    updated_at: '2026-09-06T10:14:00Z',
    pushed_at: '2026-09-06T10:10:00Z',
    size: 1820,
    clone_url: 'https://github.com/gamesiteonline/fahad-tech-dashboard.git',
    homepage: null,
    license: null,
  },
];

export const FALLBACK_FILES: Record<string, GitHubContentItem[]> = {
  root: [
    { name: 'src', path: 'src', sha: 'a1b2c3d4', size: 0, type: 'dir', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'assets', path: 'assets', sha: 'b2c3d4e5', size: 0, type: 'dir', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'docs', path: 'docs', sha: 'c3d4e5f6', size: 0, type: 'dir', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'README.md', path: 'README.md', sha: 'd4e5f6a1', size: 2450, type: 'file', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'package.json', path: 'package.json', sha: 'e5f6a1b2', size: 1080, type: 'file', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'tsconfig.json', path: 'tsconfig.json', sha: 'f6a1b2c3', size: 420, type: 'file', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'LICENSE', path: 'LICENSE', sha: '1a2b3c4d', size: 1065, type: 'file', url: '', html_url: '', git_url: '', download_url: null },
  ],
  src: [
    { name: 'engine', path: 'src/engine', sha: '2b3c4d5e', size: 0, type: 'dir', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'components', path: 'src/components', sha: '3c4d5e6f', size: 0, type: 'dir', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'index.ts', path: 'src/index.ts', sha: '4d5e6f7a', size: 3200, type: 'file', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'GameLoop.ts', path: 'src/GameLoop.ts', sha: '5e6f7a8b', size: 4500, type: 'file', url: '', html_url: '', git_url: '', download_url: null },
    { name: 'AudioSynth.ts', path: 'src/AudioSynth.ts', sha: '6f7a8b9c', size: 2800, type: 'file', url: '', html_url: '', git_url: '', download_url: null },
  ],
};

export const FALLBACK_SAMPLE_CODE: Record<string, string> = {
  'README.md': `# GameSiteOnline Engine ⚡
> High-performance developer platform & gaming engine connected to **github.com/gamesiteonline**.

### ✨ Highlights
- **WebGL & Canvas 2D** hardware accelerated rendering
- **Touch-optimized input** with sub-16ms latency for mobile
- **Procedural Level Generator** with custom seed support
- **WebAudio Synthwave Synthesizer** (8-bit chiptune & modern synth)
- **DOSBox Emulation Bridge** for retro game preservation

### 🚀 Quick Start
\`\`\`bash
# Clone the repository
git clone https://github.com/gamesiteonline/SIGNO-GAME.git

# Install dependencies
npm install

# Launch developer engine
npm run dev
\`\`\`

### 🕹️ Live Demo
Visit our online gaming portal at [gamesiteonline1.pythonanywhere.com](https://gamesiteonline1.pythonanywhere.com).

### 📄 License
Licensed under the MIT License - see the LICENSE file for details.
`,
  'src/index.ts': `import { GameLoop } from './GameLoop';
import { AudioSynth } from './AudioSynth';

export interface GameConfig {
  fps: number;
  canvasId: string;
  debug: boolean;
  neonGlow: boolean;
}

export class GameEngine {
  private loop: GameLoop;
  private audio: AudioSynth;
  private isRunning: boolean = false;

  constructor(private config: GameConfig) {
    this.loop = new GameLoop(config.fps);
    this.audio = new AudioSynth();
    console.log('[GameSiteOnline] Engine initialized');
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.audio.playIntroTrack();
    this.loop.start((dt: number) => {
      this.update(dt);
      this.render();
    });
  }

  private update(dt: number): void {
    // Cyberpunk physics & particle updates
  }

  private render(): void {
    // 60FPS Glassmorphic canvas render
  }
}
`,
  'package.json': `{
  "name": "gamesiteonline-engine",
  "version": "1.0.0",
  "description": "Next-gen browser game engine by GameSiteOnline",
  "main": "dist/index.js",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest"
  },
  "dependencies": {
    "three": "^0.165.0",
    "howler": "^2.2.4"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
`,
};

export const FALLBACK_COMMITS: GitHubCommit[] = [
  {
    sha: '9f8b7e6d5c4b3a21',
    commit: {
      author: { name: 'gamesiteonline', email: 'gamesiteonline@users.noreply.github.com', date: '2026-09-11T15:19:53Z' },
      committer: { name: 'gamesiteonline', email: 'gamesiteonline@users.noreply.github.com', date: '2026-09-11T15:19:53Z' },
      message: 'feat: add neon glow shaders & touch gestures for mobile release',
    },
    html_url: 'https://github.com/gamesiteonline/gamesiteonline/commit/9f8b7e6d5c4b3a21',
    author: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    stats: { total: 4, additions: 142, deletions: 18 },
  },
  {
    sha: '8e7d6c5b4a3b2a10',
    commit: {
      author: { name: 'gamesiteonline', email: 'gamesiteonline@users.noreply.github.com', date: '2026-09-11T12:20:00Z' },
      committer: { name: 'gamesiteonline', email: 'gamesiteonline@users.noreply.github.com', date: '2026-09-11T12:20:00Z' },
      message: 'fix: optimize WebAssembly memory buffer allocation for retro DOS titles',
    },
    html_url: 'https://github.com/gamesiteonline/dos-games/commit/8e7d6c5b4a3b2a10',
    author: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    stats: { total: 2, additions: 45, deletions: 12 },
  },
  {
    sha: '7d6c5b4a3b2a19f8',
    commit: {
      author: { name: 'gamesiteonline', email: 'gamesiteonline@users.noreply.github.com', date: '2026-09-10T18:40:11Z' },
      committer: { name: 'gamesiteonline', email: 'gamesiteonline@users.noreply.github.com', date: '2026-09-10T18:40:11Z' },
      message: 'perf: upgrade canvas frame pipeline to requestVideoFrameCallback',
    },
    html_url: 'https://github.com/gamesiteonline/mobile-games/commit/7d6c5b4a3b2a19f8',
    author: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    stats: { total: 3, additions: 88, deletions: 31 },
  },
  {
    sha: '6c5b4a3b2a19f8e7',
    commit: {
      author: { name: 'gamesiteonline', email: 'gamesiteonline@users.noreply.github.com', date: '2026-09-08T09:12:00Z' },
      committer: { name: 'gamesiteonline', email: 'gamesiteonline@users.noreply.github.com', date: '2026-09-08T09:12:00Z' },
      message: 'chore: update GitHub Actions CI workflow for cross-platform Android & web',
    },
    html_url: 'https://github.com/gamesiteonline/SIGNO-GAME/commit/6c5b4a3b2a19f8e7',
    author: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    stats: { total: 1, additions: 24, deletions: 8 },
  },
];

export const FALLBACK_ISSUES: GitHubIssue[] = [
  {
    id: 101,
    number: 14,
    title: 'Support customizable keyboard & gamepad mappings on mobile controllers',
    user: { login: 'retrodev', avatar_url: 'https://avatars.githubusercontent.com/u/10240?v=4' },
    labels: [
      { id: 1, name: 'enhancement', color: 'a2eeef', description: 'New feature' },
      { id: 2, name: 'gameplay', color: '0075ca', description: 'Control mechanisms' },
    ],
    state: 'open',
    comments: 4,
    created_at: '2026-09-08T11:20:00Z',
    updated_at: '2026-09-10T14:15:00Z',
    closed_at: null,
    body: 'Would be awesome to bind Bluetooth gamepad buttons (A/B/X/Y) directly in mobile web view.\n\n### Suggested solution:\nUse HTML5 Gamepad API standard gamepad layout mapping.',
    html_url: 'https://github.com/gamesiteonline/SIGNO-GAME/issues/14',
  },
  {
    id: 102,
    number: 13,
    title: 'Touch screen joystick deadzone threshold tuning for smaller phones',
    user: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    labels: [
      { id: 3, name: 'bug', color: 'd73a4a', description: 'Something isn\'t working' },
      { id: 4, name: 'mobile', color: 'cfd3d7', description: 'Android / iOS touch' },
    ],
    state: 'open',
    comments: 2,
    created_at: '2026-09-05T09:30:00Z',
    updated_at: '2026-09-09T18:00:00Z',
    closed_at: null,
    body: 'The virtual joystick on high-DPI Android screens has a slight drag lag before registering analog movement.',
    html_url: 'https://github.com/gamesiteonline/SIGNO-GAME/issues/13',
  },
  {
    id: 103,
    number: 12,
    title: 'Synthwave chiptune audio distortion on Safari WebAudio engine fixed',
    user: { login: 'audiophile', avatar_url: 'https://avatars.githubusercontent.com/u/10245?v=4' },
    labels: [
      { id: 5, name: 'audio', color: 'e99695', description: 'Sound issues' },
      { id: 6, name: 'resolved', color: '0e8a16', description: 'Fixed' },
    ],
    state: 'closed',
    comments: 6,
    created_at: '2026-08-28T14:00:00Z',
    updated_at: '2026-09-04T12:00:00Z',
    closed_at: '2026-09-04T12:00:00Z',
    body: 'Safari requires user gesture activation before AudioContext unlocks sample rate converter.',
    html_url: 'https://github.com/gamesiteonline/SIGNO-GAME/issues/12',
  },
];

export const FALLBACK_PULL_REQUESTS: GitHubPullRequest[] = [
  {
    id: 201,
    number: 15,
    state: 'open',
    title: 'feat: add dynamic particle trail behind player ship in neon runner',
    user: { login: 'synthcoder', avatar_url: 'https://avatars.githubusercontent.com/u/10248?v=4' },
    body: 'Implements WebGL instanced geometry particle trail with cyan/magenta neon fade.',
    created_at: '2026-09-09T17:22:00Z',
    updated_at: '2026-09-10T19:40:00Z',
    closed_at: null,
    merged_at: null,
    html_url: 'https://github.com/gamesiteonline/SIGNO-GAME/pull/15',
    head: { ref: 'feat/particle-trail', sha: 'a1b2c3d4e5f6' },
    base: { ref: 'main' },
    draft: false,
  },
  {
    id: 202,
    number: 11,
    state: 'closed',
    title: 'perf: memory pool reuse for bullet objects to eliminate GC pauses',
    user: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    body: 'Reuses allocated TypedArrays for particle coordinates instead of garbage collected objects.',
    created_at: '2026-08-20T10:15:00Z',
    updated_at: '2026-08-22T14:30:00Z',
    closed_at: '2026-08-22T14:30:00Z',
    merged_at: '2026-08-22T14:30:00Z',
    html_url: 'https://github.com/gamesiteonline/SIGNO-GAME/pull/11',
    head: { ref: 'perf/object-pooling', sha: 'f1e2d3c4b5a6' },
    base: { ref: 'main' },
    draft: false,
  },
];

export const FALLBACK_RELEASES: GitHubRelease[] = [
  {
    id: 301,
    tag_name: 'v2.4.0-pro',
    target_commitish: 'main',
    name: 'GameSiteOnline v2.4.0: Cyberpunk Edition & Mobile Turbo',
    draft: false,
    prerelease: false,
    created_at: '2026-09-08T12:00:00Z',
    published_at: '2026-09-08T14:30:00Z',
    body: `### 🎮 GameSiteOnline v2.4.0 Release Notes

We are thrilled to launch v2.4.0 with major gaming enhancements!

#### ✨ What's New
- **Next-Gen Neon Shaders**: Up to 60% FPS boost on mobile GPUs.
- **DOSBox Emulation Engine**: Added support for 15+ retro classics directly in browser.
- **Offline Mode**: Cache whole game sessions for offline play.
- **GitHub Sync**: Auto-backup game high scores to GitHub Gists.

#### 📦 Download Assets
- \`GameSiteOnline-v2.4.0-arm64.apk\` (Production Android Package)
- \`gamesiteonline-web-dist.zip\` (Static web deployment)
- Source code (tar.gz & zip)
`,
    html_url: 'https://github.com/gamesiteonline/gamesiteonline/releases/tag/v2.4.0-pro',
    author: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    assets: [
      {
        id: 401,
        name: 'GameSiteOnline-v2.4.0-arm64.apk',
        size: 34500000,
        download_count: 1420,
        browser_download_url: 'https://github.com/gamesiteonline/gamesiteonline/releases/download/v2.4.0-pro/GameSiteOnline-v2.4.0-arm64.apk',
        content_type: 'application/vnd.android.package-archive',
      },
      {
        id: 402,
        name: 'gamesiteonline-web-dist.zip',
        size: 8900000,
        download_count: 890,
        browser_download_url: 'https://github.com/gamesiteonline/gamesiteonline/releases/download/v2.4.0-pro/gamesiteonline-web-dist.zip',
        content_type: 'application/zip',
      },
    ],
  },
  {
    id: 302,
    tag_name: 'v2.1.0',
    target_commitish: 'main',
    name: 'GameSiteOnline v2.1.0: Touch Control Overhaul',
    draft: false,
    prerelease: false,
    created_at: '2026-08-15T10:00:00Z',
    published_at: '2026-08-15T11:00:00Z',
    body: 'Complete overhaul of touch gestures, virtual joysticks, and haptic feedback triggers.',
    html_url: 'https://github.com/gamesiteonline/gamesiteonline/releases/tag/v2.1.0',
    author: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    assets: [
      {
        id: 403,
        name: 'GameSiteOnline-v2.1.0.apk',
        size: 31200000,
        download_count: 980,
        browser_download_url: 'https://github.com/gamesiteonline/gamesiteonline/releases/download/v2.1.0/GameSiteOnline-v2.1.0.apk',
        content_type: 'application/vnd.android.package-archive',
      },
    ],
  },
];

export const FALLBACK_NOTIFICATIONS: GitHubNotification[] = [
  {
    id: 'n1',
    unread: true,
    reason: 'mention',
    updated_at: '2026-09-11T14:10:00Z',
    repository: {
      id: 1297003122,
      name: 'SIGNO-GAME',
      full_name: 'gamesiteonline/SIGNO-GAME',
      owner: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    },
    subject: {
      title: '@gamesiteonline could you review PR #15 for particle trail integration?',
      url: 'https://api.github.com/repos/gamesiteonline/SIGNO-GAME/pulls/15',
      latest_comment_url: null,
      type: 'PullRequest',
    },
  },
  {
    id: 'n2',
    unread: true,
    reason: 'author',
    updated_at: '2026-09-11T12:00:00Z',
    repository: {
      id: 1299195585,
      name: 'dos-games',
      full_name: 'gamesiteonline/dos-games',
      owner: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    },
    subject: {
      title: 'New issue: Sound blaster 16 emulation sound stutter on 44.1kHz audio output',
      url: 'https://api.github.com/repos/gamesiteonline/dos-games/issues/8',
      latest_comment_url: null,
      type: 'Issue',
    },
  },
  {
    id: 'n3',
    unread: false,
    reason: 'subscribed',
    updated_at: '2026-09-10T16:20:00Z',
    repository: {
      id: 1299195305,
      name: 'mobile-games',
      full_name: 'gamesiteonline/mobile-games',
      owner: { login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    },
    subject: {
      title: 'Vercel Deployment Succeeded: mobile-games-delta.vercel.app',
      url: 'https://api.github.com/repos/gamesiteonline/mobile-games',
      latest_comment_url: null,
      type: 'Commit',
    },
  },
];

export const FALLBACK_EVENTS: GitHubEvent[] = [
  {
    id: 'e1',
    type: 'PushEvent',
    actor: { id: 269415120, login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    repo: { id: 1363475512, name: 'gamesiteonline/gamesiteonline', url: '' },
    payload: {
      commits: [
        { message: 'feat: add neon glow shaders & touch gestures for mobile release', sha: '9f8b7e6' },
      ],
      ref: 'refs/heads/main',
    },
    public: true,
    created_at: '2026-09-11T15:19:53Z',
  },
  {
    id: 'e2',
    type: 'PushEvent',
    actor: { id: 269415120, login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    repo: { id: 1299195585, name: 'gamesiteonline/dos-games', url: '' },
    payload: {
      commits: [
        { message: 'fix: optimize WebAssembly memory buffer allocation for retro DOS titles', sha: '8e7d6c5' },
      ],
      ref: 'refs/heads/main',
    },
    public: true,
    created_at: '2026-09-11T12:20:00Z',
  },
  {
    id: 'e3',
    type: 'ReleaseEvent',
    actor: { id: 269415120, login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    repo: { id: 1363475512, name: 'gamesiteonline/gamesiteonline', url: '' },
    payload: {
      release: { tag_name: 'v2.4.0-pro', name: 'GameSiteOnline v2.4.0 Cyberpunk Edition' },
    },
    public: true,
    created_at: '2026-09-08T14:30:00Z',
  },
  {
    id: 'e4',
    type: 'CreateEvent',
    actor: { id: 269415120, login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    repo: { id: 1297003122, name: 'gamesiteonline/SIGNO-GAME', url: '' },
    payload: { ref_type: 'branch', ref: 'feature/neon-audio-matrix' },
    public: true,
    created_at: '2026-09-07T08:14:00Z',
  },
  {
    id: 'e5',
    type: 'WatchEvent',
    actor: { id: 269415120, login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/269415120?v=4' },
    repo: { id: 1299195305, name: 'gamesiteonline/mobile-games', url: '' },
    payload: { action: 'started' },
    public: true,
    created_at: '2026-09-05T19:22:00Z',
  },
];
