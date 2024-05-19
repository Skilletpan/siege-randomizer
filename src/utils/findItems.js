/**
 * @typedef {Object} FilterObject An object that defines a filter parameter.
 * 
 * @property {*}                                             value      The value to compare to the item value.
 * @property {string}                                        [property] The item property to compare the value to.
 *                                                                      If omitted, the item itself is used.
 * @property {"equals"|"includes"|"included"|"some"|"every"} method     The method to compare the value with the item.
 * @property {boolean}                                       [negative] Whether the comparison result should be inverted.
 */

/**
 * Finds items that match certain properties from a pool.
 * 
 * @param {Object[]}         pool       The pool of items to find items in.
 * @param {FilterObject[][]} filterSets The sets of filters items are matched against.
 */
export default function findItems(pool, filterSets) {
  return pool.filter((item) => filterSets.some((filterSet) => filterSet.every((filter) => {
    // Split property path
    const propertyPath = filter.property?.split('.') || [];

    // Non-array checks
    if (filter.method === 'equals' || filter.method === 'includes', filter.method === 'included') {
      // Get item value
      const itemValue = getItemValue(item, propertyPath);

      // Match item value to filter value
      switch (filter.method) {
        // Simple comparison
        case 'equals':
          return (itemValue === filter.value) === !filter.negative;

        // Item Value includes Filter Value
        case 'includes':
          return (itemValue.includes(filter.value)) === !filter.negative;

        // Filter Value includes Item Value
        case 'included':
          return (filter.value.includes(itemValue)) === !filter.negative;
      }
    }

    // Array checks
    const { itemArray, itemPropertyPath } = getItemArray(item, propertyPath);

    // Match array item values to filter value
    const isMatch = itemArray[filter.method]((arrayItem) => {
      const itemValue = getItemValue(arrayItem, itemPropertyPath);
      return itemValue === filter.value;
    });

    // Return result
    return isMatch === !filter.negative;
  })));
}

/**
 * Walks the property path and returns the value at the end.
 * 
 * @param {*}        item         The item to get the value from.
 * @param {string[]} propertyPath The path to the property to get.
 * 
 * @returns {*} The found item value. 
 */
function getItemValue(item, propertyPath) {
  return propertyPath.reduce((previousValue, currentProperty) => previousValue?.[currentProperty], item);
}

/**
 * 
 * @param {*}        item         The item to find the array in.
 * @param {string[]} propertyPath The path of the array item to get.
 * 
 * @returns {{ itemArray: *, itemPropertyPath: string[] }} The item array and item property path.
 */
function getItemArray(item, propertyPath) {
  const results = { itemPropertyPath: null };

  results.itemArray = propertyPath.reduce((previousValue, currentProperty, index) => {
    // Skip if array has been found
    if (Array.isArray(previousValue)) return previousValue;

    // Get current item value
    const currentValue = previousValue?.[currentProperty];

    // Set item property path if array has been found
    if (Array.isArray(currentValue)) results.itemPropertyPath = propertyPath.slice(index + 1);

    // Return current item value
    return currentValue;
  }, item);

  return results;
}
