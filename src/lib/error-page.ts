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
