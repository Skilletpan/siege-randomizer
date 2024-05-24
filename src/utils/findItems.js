/**
 * @typedef {Object} FilterObject An object that defines a filter parameter.
 * 
 * @property {*}                   value             The value to compare to the item value.
 * @property {string}              [property]        The path to the item property to compare the value to.
 * @property {"equals"|"included"} [method="equals"] The method to compare the value with the item.
 * @property {boolean}             [negative]        Whether the comparison result should be inverted.
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

    // Check if the item matches the filter
    const isMatch = matchItemValue(item, propertyPath, filter.value, filter.method);

    // DEBUG: Log result
    console.debug(
      'Item:', item,
      '\nFilter:', filter.property || 'this', filter.method || 'equals', filter.value,
      '\nMatches:', isMatch,
      '\nNegative Check:', Boolean(filter.negative)
    );

    // Return result
    return filter.negative ? !isMatch : isMatch;
  })));
}

/**
 * Recursively walks the property path and returns whether the value(s) at the end matches the filter.
 * 
 * @param {*}                   item                    The item to check.
 * @param {string[]}            propertyPath            The property path to walk.
 * @param {*}                   filterValue             The value to checek against.
 * @param {"equals"|"included"} [filterMethod="equals"] How the comparison is made.
 * 
 * @returns {boolean} Whether the item matches the filter.
 */
function matchItemValue(item, propertyPath, filterValue, filterMethod = 'equals') {
  // Match item value against filter value at the end of the property path
  if (propertyPath.length === 0 || !item) {
    switch (filterMethod) {
      // Item Value is equal to Filter Value
      case 'equals':
        return item === filterValue;

      // Filter Value includes Item Value
      case 'included':
        return filterValue.includes(item);
    }
  }

  // Check for array properties
  const arrayMethod = /(?<=\[)some|every(?=\])/.exec(propertyPath[0])?.[0];
  if (arrayMethod) {
    // Parse property name
    const propertyName = propertyPath[0].replace(`[${arrayMethod}]`, '');

    // Check remaining property path on array items
    return item[propertyName][arrayMethod]((arrayItem) => matchItemValue(arrayItem, propertyPath.slice(1), filterValue, filterMethod));
  }

  // Check next step in property path
  return matchItemValue(item[propertyPath[0]], propertyPath.slice(1), filterValue, filterMethod);
}
