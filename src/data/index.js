import OPERATORS from './operators.json';
import PLAYLISTS from './playlists.json';
import ROLES from './roles.json';
import SIDES from './sides.json';
import SQUADS from './squads.json';
import STRATS from './strats.json';

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

// Build additional PLAYLIST datasets
const playlists = {}, playlistList = [];
Object.entries((PLAYLISTS))
  .filter((entries) => !entries[1].disabled)
  .forEach(([key, playlist]) => {
    // Build and add playlist item
    const playlistItem = { key, ...playlist };
    playlists[key] = playlistItem;
    playlistList.push(playlistItem);
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

// Build STRAT dataset
const stratList = STRATS.map((strat) => {
  const stratItem = { ...strat, side: strat.side || sides.ALL.key };

  stratItem.rules = strat.rules.map((rule) => {
    const ruleItem = { side: null, value: null };

    // Set rule value
    if (typeof rule === 'string') ruleItem.value = rule;
    else ruleItem.value = rule.value;

    // Set rule side and operator
    if (rule.operator) ruleItem.operator = rule.operator, ruleItem.side = operators[rule.operator].side;
    else ruleItem.side = rule.side || strat.side || sides.ALL.key;

    return ruleItem;
  });

  return stratItem;
});

console.debug(stratList);

export {
  operators as OPERATORS,
  operatorList as OPERATOR_LIST,
  playlists as PLAYLISTS,
  playlistList as PLAYLIST_LIST,
  roles as ROLES,
  roleList as ROLE_LIST,
  sides as SIDES,
  sideList as SIDE_LIST,
  squads as SQUADS,
  squadList as SQUAD_LIST,
  stratList as STRATS
};
