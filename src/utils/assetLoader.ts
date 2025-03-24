// Load data URL
const ASSET_BASE_URL = import.meta.env.VITE_HOST_ASSETS;
const DATA_BASE_URL = import.meta.env.VITE_HOST_DATA;

if (!ASSET_BASE_URL) throw new Error('VITE_HOST_ASSETS env is not set!');
if (!DATA_BASE_URL) throw new Error('VITE_HOST_DATA env is not set!');

/**
 * Creates a URL pointing to an image asset.
 * 
 * @param path The path elements of the URL.
 * 
 * @returns The URL pointing to the image asset.
 */
export function createAssetURL(...path: string[]): URL {
  return new URL(path.join('/'), ASSET_BASE_URL);
}

/**
 * Loads modal data from a remote location.
 * 
 * @param path The path elements of the source URL.
 * 
 * @returns The loaded data.
 */
export async function loadData<T>(...path: string[]): Promise<T> {
  const url = new URL(path.join('/'), DATA_BASE_URL);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load data from ${url.href}`);

  return response.json() as Promise<T>;
}
