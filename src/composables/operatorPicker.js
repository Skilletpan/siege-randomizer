import { OPERATORS } from "@/data";
import { pickRandom } from "./randomizer";

/**
 * Picks one or multiple random operators from the operator pool.
 * 
 * @param {Object}   [options]                 Additional options for the randomizer to consider while picking operators.
 * @param {Boolean}  [options.allowDuplicates] Allows duplicate picks of operators.
 * @param {Number}   [options.amount]          The amount of operators to pick (defaults to 1).
 * @param {String[]} [options.exclude]         Specific operators to exclude from the pick (banned, previous pick etc).
 * @param {String[]} [options.roles]           The roles the operator should have.
 * @param {String[]} [options.sides]           The sides to pick the operator from.
 * @param {Number[]} [options.speeds]          The speeds the operator has to be.
 * @param {String[]} [options.squads]          The squads the operator must be from.
 * 
 * @returns {Object[]} The picked operator(s).
 */
export function pickRandomOperators(options = {}) {
  // Build operator pool from provided filter options.
  const pool = OPERATORS.filter((o) => {
    // Apply specified filters
    if (options.sides && !options.sides.includes(o.side)) return false;
    if (options.exclude && options.exclude.includes(o.key)) return false;
    if (options.squads && !options.squads.includes(o.squad)) return false;
    if (options.roles && options.roles.some((r) => !o.roles.includes(r))) return false;
    if (options.speeds && !options.speeds.includes(o.speed)) return false;

    return true;
  });

  // Pick random operators from pool
  return pickRandom(pool, options.amount, options.allowDuplicates);
}
