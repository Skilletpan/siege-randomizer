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
  if (!operatorKey) return null;
  return require(`@/assets/emblems/${setImageKey(operatorKey)}.png`);
}

export function loadMapPreview(mapKey) {
  if (!mapKey) return null;
  return require(`@/assets/maps/${mapKey}.jpg`);
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
  return require(`@/assets/squads/${squad.toUpperCase()}.png`);
}
