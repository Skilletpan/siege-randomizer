import MAPS from './maps.json';
import OPERATORS from './operators.json';
import STRATS from './strats.json';

// Build additional datasets
const PLAYLISTS = [...new Set([].concat(...MAPS.map((m) => m.playlists)))];
const ARCADE_PLAYLISTS = [...new Set([].concat(...MAPS.map((m) => m.arcadePlaylists)))];
const ROLES = [...new Set([].concat(...OPERATORS.map((o) => o.roles)))].sort();
const SQUADS = [...new Set(OPERATORS.map((o) => o.squad))].filter((s) => !!s).sort();

export {
  ARCADE_PLAYLISTS,
  MAPS,
  OPERATORS,
  PLAYLISTS,
  ROLES,
  SQUADS,
  STRATS
};
