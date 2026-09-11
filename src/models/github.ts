export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  clone_url: string;
  homepage: string | null;
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
  is_favorite?: boolean;
}

export interface GitHubContentItem {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: 'file' | 'dir';
  content?: string;
  encoding?: string;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  } | null;
  files?: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
  }>;
  stats?: {
    total: number;
    additions: number;
    deletions: number;
  };
}

export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description?: string;
  }>;
  state: 'open' | 'closed';
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  body: string | null;
  html_url: string;
  pull_request?: {
    url: string;
  };
}

export interface GitHubComment {
  id: number;
  user: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
  updated_at: string;
  body: string;
  html_url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  state: 'open' | 'closed';
  title: string;
  user: {
    login: string;
    avatar_url: string;
  };
  body: string | null;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  merged_at: string | null;
  html_url: string;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  draft?: boolean;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  body: string | null;
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
  };
  assets: Array<{
    id: number;
    name: string;
    size: number;
    download_count: number;
    browser_download_url: string;
    content_type: string;
  }>;
}

export interface GitHubNotification {
  id: string;
  unread: boolean;
  reason: string;
  updated_at: string;
  repository: {
    id: number;
    name: string;
    full_name: string;
    owner: {
      login: string;
      avatar_url: string;
    };
  };
  subject: {
    title: string;
    url: string;
    latest_comment_url: string | null;
    type: 'Issue' | 'PullRequest' | 'Commit' | 'Release' | 'Discussion';
  };
}

export interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: any;
  public: boolean;
  created_at: string;
}

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}
