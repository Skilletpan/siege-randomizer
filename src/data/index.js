import MAPS from './maps.json';
import OPERATORS from './operators.json';
import STRATS from './strats.json';

const MAPS_MAP = {};
const PLAYLISTS = [];

MAPS.forEach((m) => {
  MAPS_MAP[m.key] = m;

  m.playlists.forEach((p) => {
    if (!PLAYLISTS.includes(p)) PLAYLISTS.push(p);
  })
});
PLAYLISTS.sort();

const OPERATORS_MAP = {};
const ROLES = [];
const SQUADS = [];

OPERATORS.forEach((o) => {
  OPERATORS_MAP[o.name] = o;

  o.roles.forEach((r) => {
    if (!ROLES.includes(r)) ROLES.push(r);
  })

  if (!SQUADS.includes(o.squad)) SQUADS.push(o.squad);
});
ROLES.sort();
SQUADS.sort();

const STRATS_MAP = {};
STRATS.forEach((s) => { STRATS_MAP[s.title] = s });

export {
  MAPS,
  MAPS_MAP,
  OPERATORS,
  OPERATORS_MAP,
  PLAYLISTS,
  ROLES,
  SQUADS,
  STRATS,
  STRATS_MAP
};
