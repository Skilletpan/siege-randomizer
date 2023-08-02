/**
 * Picks a random item from the provided pool.
 * 
 * @param {any[]}  pool     The pool to pick a random item from.
 * @param {number} [amount] The amount of items to pick. (defaults to 1)
 * 
 * @returns {any[]} The randomly picked item(s).
 */
export function pickRandom(pool, amount = 1) {
  const remainingItems = [...pool];
  const pickedItems = [];

  while (pickedItems.length < amount && pool.length >= 0) {
    const index = Math.floor(Math.random() * remainingItems.length);
    pickedItems.push(...remainingItems.splice(index, 1));
  }

  return pickedItems;
}