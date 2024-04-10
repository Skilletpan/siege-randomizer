import OPERATORS from './operators.json';

// Build additional OPERATOR datasets
const operators = {}, operatorList = [];
Object.keys(OPERATORS).forEach((side) => {
  Object.entries(OPERATORS[side])
    .filter((entries) => !entries[1].disabled)
    .forEach(([key, operator]) => {
      // Build and add operator item
      const operatorItem = { key, ...operator, side };
      operators[key] = operatorItem;
      operatorList.push(operatorItem);
    });
});

export {
  operators as OPERATORS,
  operatorList as OPERATOR_LIST
};
