import Env from './env';

/**
 * Builds an URL pointing to an image asset.
 * 
 * @param path The path to the asset.
 * 
 * @returns The URL pointing to the asset.
 */
export function buildAssetUrl(...path: string[]): URL {
  // Build URL
  const url = Env.URL.ASSETS ? new URL(Env.URL.ASSETS) : new URL('@/assets', import.meta.url);
  url.pathname += '/' + path.join('/');
  return url;
}

/**
 * Fetches data from the app data host.
 * 
 * @param path The path to the data file.
 * 
 * @returns The fetched data.
 */
export async function fetchData<T>(...path: string[]): Promise<T> {
  // Build URL
  const url = Env.URL.DATA ? new URL(Env.URL.DATA) : new URL('@/data', import.meta.url);
  url.pathname += '/' + path.join('/');
  console.debug(url);

  // Call URL
  const response = await fetch(url);
  console.debug(response);

  // Handle failed request
  if (!response.ok) throw new Error(
    `Couldn't fetch ${path.at(-1)}!`,
    { cause: `Request to ${url.href} failed with status ${response.status}: ${response.statusText}` }
  );

  // Return response body
  return response.json();
}
