/**
 * Picks a random item from the provided pool.
 * 
 * @param {any[]}   pool              The pool to pick a random item from.
 * @param {Number}  [amount]          The amount of items to pick. (defaults to 1)
 * @param {Boolean} [allowDuplicates] Allows for duplicates to be picked. (defaults to false)
 * 
 * @returns {any[]} The randomly picked item(s).
 */
export function pickRandom(pool, amount = 1, allowDuplicates = false) {
  // Return empty array if pool is empty
  if (pool.length === 0) return [];

  const remainingItems = [...pool];
  const pickedItems = [];
  const pickAmount = allowDuplicates ? amount : Math.min(amount, pool.length);

  // Randomly pick from remaining items
  while (pickedItems.length < pickAmount && pool.length >= 0) {
    const index = Math.floor(Math.random() * remainingItems.length);

    if (allowDuplicates) pickedItems.push(remainingItems[index]);
    else pickedItems.push(...remainingItems.splice(index, 1));
  }

  return pickedItems;
}