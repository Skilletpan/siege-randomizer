/**
 * Normalizes the key for image loading.
 * 
 * Makes sure that the proper portrait and emblem is loaded for Recruits.
 * 
 * @param {String} operatorKey The operator key to load the image for.
 * 
 * @returns {String} The key to load the image with. 
 */
function setImageKey(operatorKey) {
  if (operatorKey.startsWith('RECRUIT')) return 'RECRUIT';
  return operatorKey;
}

/**
 * Loads the operator portrait.
 * 
 * Also has a 1 in 50 chance to load an alternate easter egg portrait.
 * 
 * @param {String}  operatorKey        The operator key to load the portrait for.
 * @param {Boolean} [disableEasterEgg] Whether to disable easter egg portraits.
 * 
 * @returns The operator portrait.
 */
export function loadPortrait(operatorKey, disableEasterEgg = false) {
  if (!operatorKey) return null;

  // Build image key
  const imageKey = setImageKey(operatorKey);

  // Try to return easter egg portrait
  if (!disableEasterEgg && Math.floor(Math.random() * 50) === 0) {
    const url = new URL(`/src/assets/portraits/${imageKey}_2.png`, import.meta.url).href;
    if (!url.endsWith('undefined')) return url;
  }

  // Return default portrait
  return new URL(`/src/assets/portraits/${imageKey}.png`, import.meta.url).href;
}

/**
 * Loads the operator emblem.
 * 
 * @param {String} operatorKey The operator key to load the emblem for.
 * 
 * @returns The operator emblem.
 */
export function loadEmblem(operatorKey) {
  if (!operatorKey) return null;
  return new URL(`/src/assets/emblems/${setImageKey(operatorKey)}.png`, import.meta.url).href;
}

export function loadMapPreview(mapKey) {
  if (!mapKey) return null;
  return new URL(`/src/assets/maps/${mapKey}.jpg`, import.meta.url).href;
}

/**
 * Loads a squad emblem.
 * 
 * @param {String} squad The squad to load the emblem for.
 * 
 * @returns The squad emblem.
 */
export function loadSquadEmblem(squad) {
  if (!squad) return null;
  return new URL(`/src/assets/squads/${squad.toUpperCase()}.png`, import.meta.url).href;
}
