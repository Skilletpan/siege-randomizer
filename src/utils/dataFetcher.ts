import Env from './env';

// Builds the data host URL
const LOCAL_URL = new URL(import.meta.url).origin + import.meta.env.BASE_URL + 'src';
console.debug(LOCAL_URL);

/**
 * Builds an URL pointing to an image asset.
 * 
 * @param path The path to the asset.
 * 
 * @returns The URL pointing to the asset.
 */
export function buildAssetUrl(...path: string[]): URL {
  // Build URL
  const base = Env.URL.ASSETS ?? (LOCAL_URL + '/assets/');
  return new URL(path.join('/'), base);
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
  const base = Env.URL.DATA ?? (LOCAL_URL + '/data/');
  const url = new URL(path.join('/'), base);
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
