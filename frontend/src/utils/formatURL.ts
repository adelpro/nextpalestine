export function formatURL(url: string | undefined): string | undefined {
  if (!url) return undefined;
  const formattedURL = url.match(/^https?:\/\//) ? url : `https://${url}`;
  return formattedURL;
}
