import OPERATORS from './operators.json';
import ROLES from './roles.json';
import SIDES from './sides.json';
import SQUADS from './squads.json';

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

// Build additional ROLE datasets
const roles = {}, roleList = [];
Object.entries(ROLES)
  .forEach(([key, role]) => {
    // Build and add role item
    const roleItem = { key, ...role };
    roles[key] = roleItem;
    roleList.push(roleItem);
  });

// Build additional SIDE datasets
const sides = {}, sideList = [];
Object.entries(SIDES)
  .forEach(([key, side]) => {
    // Build and add side item
    const sideItem = { key, ...side };
    if (key !== 'ALL') sideItem.sideKey = key;

    sides[key] = sideItem;
    sideList.push(sideItem);
  });

// Build additional SQUAD datasets
const squads = {}, squadList = [];
Object.entries(SQUADS)
  .forEach(([key, squad]) => {
    // Build and add squad item
    const squadItem = { key, ...squad };
    squads[key] = squadItem;
    squadList.push(squadItem);
  });

export {
  operators as OPERATORS,
  operatorList as OPERATOR_LIST,
  roles as ROLES,
  roleList as ROLE_LIST,
  sides as SIDES,
  sideList as SIDE_LIST,
  squads as SQUADS,
  squadList as SQUAD_LIST
};
