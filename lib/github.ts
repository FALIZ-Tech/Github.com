import { AuthService } from './auth';
import { mockRepos, mockCommits, mockIssues, mockPRs, mockReleases, mockNotifications, mockActivity, mockUser } from './mockData';

const GITHUB_API = 'https://api.github.com';
type FetchOptions = RequestInit & { auth?: boolean };

class GitHubServiceClass {
  private async request(path: string, options: FetchOptions = {}): Promise<any> {
    const isDemo = await AuthService.isDemo();
    if (isDemo) {
      // Return mock data for demo mode
      await new Promise(r => setTimeout(r, 300));
      return this.getMockForPath(path);
    }

    const token = options.auth !== false ? await AuthService.getToken() : null;
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'GameSiteOnline-App',
      ...(options.headers as any || {}),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let res: Response;
    try {
      res = await fetch(`${GITHUB_API}${path}`, { ...options, headers });
    } catch {
      throw { status: 0, message: 'No internet. Showing cached/demo data.', type: 'network' };
    }

    const remaining = res.headers.get('x-ratelimit-remaining');
    const reset = res.headers.get('x-ratelimit-reset');
    if (remaining === '0' && reset) {
      throw { status: 429, message: `Rate limit exceeded. Resets in ${Math.ceil((parseInt(reset)*1000 - Date.now())/60000)}m`, type: 'ratelimit', resetAt: reset };
    }
    if (res.status === 401) throw { status: 401, message: 'Session expired. Please re-authenticate.', type: 'auth' };
    if (res.status === 403) {
      const body = await res.text();
      if (body.includes('rate limit')) throw { status: 403, message: 'GitHub rate limit reached.', type: 'ratelimit' };
      throw { status: 403, message: 'Access forbidden. Check permissions.', type: 'forbidden' };
    }
    if (!res.ok) {
      const txt = await res.text();
      let msg = `GitHub API error ${res.status}`;
      try { const j = JSON.parse(txt); msg = j.message || msg; } catch {}
      throw { status: res.status, message: msg, type: 'api' };
    }
    return res.json();
  }

  private getMockForPath(path: string) {
    if (path.startsWith('/user/repos') || path.startsWith('/orgs') || path.startsWith('/search/repositories')) {
      if (path.includes('search')) return { total_count: mockRepos.length, items: mockRepos };
      return mockRepos;
    }
    if (path.startsWith('/user')) return mockUser;
    if (path.includes('/commits')) return mockCommits;
    if (path.includes('/issues')) return mockIssues;
    if (path.includes('/pulls')) return mockPRs;
    if (path.includes('/releases')) return mockReleases;
    if (path.includes('/notifications')) return mockNotifications;
    if (path.includes('/repos/')) {
      const parts = path.split('/');
      const name = parts[3] || 'gamesite-core';
      const found = mockRepos.find(r => r.name === name) || mockRepos[0];
      if (path.includes('/branches')) return [{ name: 'main' }, { name: 'develop' }, { name: 'feature/neon-ui' }];
      if (path.includes('/contents')) return [{ name: 'src', type: 'dir', path: 'src' }, { name: 'README.md', type: 'file', path: 'README.md' }];
      return found;
    }
    return mockRepos;
  }

  async getAuthenticatedUser() {
    try { return await this.request('/user'); } catch { return mockUser; }
  }
  async getRepos(opts: { page?: number, per_page?: number, sort?: string, type?: string } = {}) {
    const { page=1, per_page=20, sort='updated', type='all' } = opts;
    try { return await this.request(`/user/repos?per_page=${per_page}&page=${page}&sort=${sort}&type=${type}`); } catch { return mockRepos; }
  }
  async searchRepos(q: string, page=1) {
    if (!q) return { total_count: mockRepos.length, items: mockRepos };
    try { return await this.request(`/search/repositories?q=${encodeURIComponent(q)}&per_page=20&page=${page}`, { auth: false }); } catch { const filtered = mockRepos.filter(r => r.name.includes(q) || r.description.toLowerCase().includes(q.toLowerCase())); return { total_count: filtered.length, items: filtered }; }
  }
  async getRepo(owner: string, repo: string) {
    try { return await this.request(`/repos/${owner}/${repo}`); } catch { return mockRepos.find(r => r.name===repo) || mockRepos[0]; }
  }
  async getBranches(owner: string, repo: string) {
    try { return await this.request(`/repos/${owner}/${repo}/branches`); } catch { return [{ name: 'main' }, { name: 'develop' }, { name: 'feature/neon' }]; }
  }
  async getCommits(owner: string, repo: string, branch='main') {
    try { return await this.request(`/repos/${owner}/${repo}/commits?sha=${branch}&per_page=20`); } catch { return mockCommits; }
  }
  async getContents(owner: string, repo: string, path='', branch='main') {
    try { return await this.request(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`); } catch {
      if (path === '') return [{ name: 'src', type: 'dir', path: 'src' }, { name: 'components', type: 'dir', path: 'src/components' }, { name: 'README.md', type: 'file', path: 'README.md', size: 4523 }, { name: 'package.json', type: 'file', path: 'package.json', size: 1234 }, { name: 'App.tsx', type: 'file', path: 'src/App.tsx', size: 8923 }];
      return [];
    }
  }
  async getFileContent(owner: string, repo: string, path: string, branch='main') {
    try {
      const data = await this.request(`/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
      if (data.content) {
        // decode base64
        try {
          const binary = atob(data.content.replace(/\n/g,''));
          return binary;
        } catch { return data.content; }
      }
      return JSON.stringify(data, null, 2);
    } catch { return `// Demo file content for ${path}\n// GameSiteOnline neon engine\nexport const neon = true;\n`; }
  }
  async getIssues(owner: string, repo: string, state='open') {
    try { return await this.request(`/repos/${owner}/${repo}/issues?state=${state}&per_page=20`); } catch { return mockIssues; }
  }
  async getPulls(owner: string, repo: string, state='open') {
    try { return await this.request(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=20`); } catch { return mockPRs; }
  }
  async getReleases(owner: string, repo: string) {
    try { return await this.request(`/repos/${owner}/${repo}/releases?per_page=20`); } catch { return mockReleases; }
  }
  async getNotifications() {
    try { return await this.request(`/notifications?per_page=20&all=false`); } catch { return mockNotifications; }
  }
  async searchUsers(q: string) {
    try { return await this.request(`/search/users?q=${encodeURIComponent(q)}&per_page=15`, { auth: false }); } catch { return { items: [{ login: 'gamesiteonline', avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4' }, { login: 'octocat', avatar_url: 'https://avatars.githubusercontent.com/u/583231?v=4' }] }; }
  }
  async searchIssues(q: string) {
    try { return await this.request(`/search/issues?q=${encodeURIComponent(q)}&per_page=15`); } catch { return { items: mockIssues }; }
  }
  async getRecentActivity() {
    return mockActivity;
  }
}

export const GitHubService = new GitHubServiceClass();
