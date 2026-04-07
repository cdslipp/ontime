import type { Request, Response } from 'express';

/**
 * Maps view paths to human-readable titles
 */
const viewTitles: Record<string, string> = {
  timer: 'Timer',
  backstage: 'Backstage',
  timeline: 'Timeline',
  studio: 'Studio Clock',
  countdown: 'Countdown',
  info: 'Project Info',
  editor: 'Editor',
  cuesheet: 'Cuesheet',
  op: 'Operator',
  public: 'Public',
  lower: 'Lower Thirds',
  pip: 'PiP',
};

/**
 * Generates a dynamic web app manifest based on the current route
 * This allows PWAs installed from different views (e.g., /timer, /backstage)
 * to have the correct start_url and title
 */
export function dynamicManifestHandler(prefix: string) {
  return (req: Request, res: Response) => {
    // Get the referer to determine which view the user is on
    const referer = req.get('Referer') || '';

    // Parse the referer URL to get the path
    let currentPath = '/';
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        // Remove the prefix from the pathname if present
        let pathname = refererUrl.pathname;
        if (prefix && pathname.startsWith(prefix)) {
          pathname = pathname.slice(prefix.length) || '/';
        }
        currentPath = pathname;
      } catch {
        // If parsing fails, default to root
        currentPath = '/';
      }
    }

    // Get the view name from the path (first segment after removing leading slash)
    const pathSegments = currentPath.replace(/^\/+/, '').split('/');
    const viewName = pathSegments[0] || '';

    // Get the appropriate title
    const viewTitle = viewTitles[viewName] || 'Ontime';
    const displayName = viewName ? `Ontime - ${viewTitle}` : 'Ontime';
    const shortName = viewTitle;

    // Build the manifest
    const manifest = {
      name: displayName,
      short_name: shortName,
      description: 'Time keeping for live events',
      start_url: currentPath,
      display: 'standalone',
      background_color: '#101010',
      theme_color: '#101010',
      lang: 'en',
      scope: prefix || '/',
      orientation: 'any',
      icons: [
        {
          src: `${prefix}/ontime-logo.png`,
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: `${prefix}/ontime-logo.png`,
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    };

    res.setHeader('Content-Type', 'application/manifest+json');
    res.json(manifest);
  };
}
