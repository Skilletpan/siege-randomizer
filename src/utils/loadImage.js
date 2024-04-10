/**
 * Loads an image from the assets.
 * 
 * @param {string} directory The directory to search.
 * @param {string} fileName  The file name and extension to load.
 * 
 * @returns {string} The URL of the loaded image.
 */
export default function loadImage(directory, fileName) {
  // Build URL
  const url = new URL(`/src/assets/${directory}/${fileName}`, import.meta.url);

  // Return found URL or undefined
  if (url.pathname.endsWith('undefined')) return undefined;
  return url.href;
}
