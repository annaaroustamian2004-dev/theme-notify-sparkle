export interface ErrorPageInfo {
  title: string;
  description: string;
  action?: string;
}

export function getErrorPageInfo(statusCode?: number): ErrorPageInfo {
  switch (statusCode) {
    case 404:
      return {
        title: 'Page Not Found',
        description: "The page you're looking for doesn't exist.",
        action: 'Go Home',
      };
    case 403:
      return {
        title: 'Access Denied',
        description: "You don't have permission to view this page.",
        action: 'Go Back',
      };
    case 500:
      return {
        title: 'Server Error',
        description: 'Something went wrong on our end. Please try again later.',
        action: 'Refresh',
      };
    default:
      return {
        title: 'Something Went Wrong',
        description: 'An unexpected error occurred.',
        action: 'Try Again',
      };
  }
}

export function renderErrorPage(): string {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Server Error</title><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{height:100%;margin:0;font-family:Inter,system-ui,sans-serif;background:#0b1220;color:#e6edf7;display:flex;align-items:center;justify-content:center}.box{max-width:520px;text-align:center;padding:24px}</style></head><body><div class="box"><h1 style="font-size:28px;margin:0 0 8px">Something went wrong</h1><p style="color:#9aa6b2;margin:0 0 16px">An unexpected error occurred on the server.</p><a href="/" style="color:#60a5fa">Go home</a></div></body></html>`;
}
