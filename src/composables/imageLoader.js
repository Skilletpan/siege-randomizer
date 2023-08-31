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
 * @param {String} operatorKey The operator key to load the portrait for.
 * 
 * @returns The operator portrait.
 */
export function loadPortrait(operatorKey) {
  // Build image key
  const imageKey = setImageKey(operatorKey);

  // Try to return easter egg portrait
  if (Math.floor(Math.random() * 50) === 0) {
    try { return require(`@/assets/portraits/${imageKey}_2.png`); }
    catch (e) { console.debug(`${imageKey} does not have an easter egg portrait.`); }
  }

  // Return default portrait
  return require(`@/assets/portraits/${imageKey}.png`);
}

/**
 * Loads the operator emblem.
 * 
 * @param {String} operatorKey The operator key to load the emblem for.
 * 
 * @returns The operator emblem.
 */
export function loadEmblem(operatorKey) {
  return require(`@/assets/emblems/${setImageKey(operatorKey)}.png`);
}