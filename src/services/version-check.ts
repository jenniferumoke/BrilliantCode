import axios from 'axios';
import { app, shell } from 'electron';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Version check service for update notifications.
// Configure an endpoint via `BRILLIANTCODE_VERSION_CHECK_URL` (leave unset to disable).
const VERSION_CHECK_URL = (process.env.BRILLIANTCODE_VERSION_CHECK_URL || '').trim();

export interface VersionInfo {
  latest_version: string;
  message: string;
  download_link: string;
}

export interface UpdateCheckResult {
  updateAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  message: string;
  downloadLink: string;
}

// Cache the version to avoid reading package.json multiple times
let cachedVersion: string | null = null;

/**
 * Compare two semantic version strings.
 */
function compareVersions(v1: string, v2: string): number {
  const normalize = (v: string): number[] => {
    return v.replace(/^v/i, '').split('.').map((n) => parseInt(n, 10) || 0);
  };
  const parts1 = normalize(v1);
  const parts2 = normalize(v2);
  const maxLen = Math.max(parts1.length, parts2.length);
  console.log('[version-check] Comparing versions:', { v1, v2, parts1, parts2 });
  for (let i = 0; i < maxLen; i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

/**
 * Get the current app version from package.json.
 */
export function getCurrentVersion(): string {
  if (cachedVersion) {
    console.log('[version-check] Using cached version:', cachedVersion);
    return cachedVersion!;
  }

  try {
    // Try multiple possible locations for package.json
    const possiblePaths = [
      path.join(process.cwd(), 'package.json'),
      path.join(app.getAppPath(), 'package.json'),
      path.join(path.dirname(app.getPath('exe')), 'resources', 'app', 'package.json'),
      path.join(path.dirname(app.getPath('exe')), '..', 'Resources', 'app', 'package.json'),
    ];

    console.log('[version-check] Searching for package.json in:', possiblePaths);

    for (const pkgPath of possiblePaths) {
      try {
        if (fs.existsSync(pkgPath)) {
          const pkgContent = fs.readFileSync(pkgPath, 'utf-8');
          const pkg = JSON.parse(pkgContent);
          if (pkg.version && pkg.name === 'brilliantcode') {
            cachedVersion = pkg.version;
            console.log('[version-check] Found BrilliantCode version in', pkgPath, ':', cachedVersion);
            return cachedVersion!;
          }
        }
      } catch (e) {
        console.log('[version-check] Could not read', pkgPath);
      }
    }

    console.error('[version-check] Could not find BrilliantCode package.json');
    cachedVersion = '0.0.0';
    return cachedVersion!;
  } catch (error) {
    console.error('[version-check] Failed to get current version:', error);
    return '0.0.0';
  }
}

/**
 * Fetch the latest version information from a configured endpoint.
 */
export async function fetchLatestVersion(): Promise<VersionInfo | null> {
  if (!VERSION_CHECK_URL) return null;
  console.log('[version-check] Fetching latest version from:', VERSION_CHECK_URL);
  
  try {
    const response = await axios.get<VersionInfo>(VERSION_CHECK_URL, {
      timeout: 10000,
      headers: { 'Accept': 'application/json' },
    });

    console.log('[version-check] API response status:', response.status);
    console.log('[version-check] API response data:', JSON.stringify(response.data, null, 2));

    if (response.status === 200 && response.data) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    console.error('[version-check] Failed to fetch latest version:', {
      message: error?.message,
      code: error?.code,
    });
    return null;
  }
}

/**
 * Check if an update is available.
 */
export async function checkForUpdate(): Promise<UpdateCheckResult> {
  console.log('[version-check] ========== Starting update check ==========');
  
  const currentVersion = getCurrentVersion();
  console.log('[version-check] Current version:', currentVersion);

  try {
    const latestInfo = await fetchLatestVersion();
    console.log('[version-check] Latest info received:', latestInfo);

    if (!latestInfo || !latestInfo.latest_version) {
      console.warn('[version-check] No valid version info received from API');
      return {
        updateAvailable: false,
        currentVersion,
        latestVersion: currentVersion,
        message: '',
        downloadLink: '',
      };
    }

    const comparison = compareVersions(latestInfo.latest_version, currentVersion);
    const updateAvailable = comparison > 0;
    
    console.log('[version-check] Version comparison result:', {
      latestVersion: latestInfo.latest_version,
      currentVersion,
      comparison,
      updateAvailable,
    });

    return {
      updateAvailable,
      currentVersion,
      latestVersion: latestInfo.latest_version,
      message: latestInfo.message || '',
      downloadLink: latestInfo.download_link || '',
    };
  } catch (error: any) {
    console.error('[version-check] Error during update check:', error?.message);
    return {
      updateAvailable: false,
      currentVersion,
      latestVersion: currentVersion,
      message: '',
      downloadLink: '',
    };
  }
}

/**
 * Open the download link in the default browser.
 */
export function openDownloadLink(url: string): void {
  console.log('[version-check] Opening download link:', url);
  if (!url) return;
  // The URL comes from the remote version manifest; only ever open web links.
  if (!/^https:\/\//i.test(url.trim())) {
    console.error('[version-check] Refusing to open non-https download link');
    return;
  }
  try {
    void shell.openExternal(url.trim());
  } catch (error: any) {
    console.error('[version-check] Failed to open download link:', error?.message);
  }
}
