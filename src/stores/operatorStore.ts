import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import { Operator, Season, Side, Squad } from '@/models';
import { useLoadoutStore, useSeasonStore } from '@/stores';
import { AssetLoader } from '@/utils';

type RawOperator = {
  name: string;
  speed: 1 | 2 | 3,
  roles: string[],
  release: string,
  biography: {
    name?: string;
    birthplace?: string;
    organization?: string;
    squad?: string
  },
  loadout: {
    shield?: string;
    primaries?: string[];
    secondaries?: string[];
    gadgets: string[];
  }
};

type OperatorResponse = {
  [sideKey in 'ATT' | 'DEF']: {
    [operatorKey: string]: RawOperator
  }
}

export default defineStore('operatorStore', () => {
  // Dependency stores
  const LoadoutStore = useLoadoutStore();
  const SeasonStore = useSeasonStore();

  /** Whether operator data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** The collection of operators. */
  const OPERATORS = ref<{ [key: string]: Operator }>({});

  /** A list of all operators. */
  const OPERATOR_LIST = computed<Operator[]>(() => Object.values(OPERATORS.value).map((operator) => toRaw(operator)));

  /** A list of all operator roles. */
  const ROLES = ref<string[]>([]);

  /** A list of all operator countries. */
  const COUNTRIES = ref<string[]>([]);

  /** A list of all operator organizations. */
  const ORGANIZATIONS = ref<string[]>([]);

  /** The collection of squads. */
  const SQUADS = ref<{ [key: string]: Squad }>({});

  /** A list of all operator squads. */
  const SQUAD_LIST = computed<Squad[]>(() => Object.values(SQUADS.value).map((squad) => toRaw(squad)));

  /** Fetches operator data from the data source. */
  async function fetchOperators() {
    // Skip if operator data has already been fetched
    if (isFetched.value) return;

    // Fetch dependency data
    await Promise.all([
      LoadoutStore.fetchLoadoutItems(),
      SeasonStore.fetchSeasons()
    ]);

    // Fetch operator and loadout data
    const rawData = await AssetLoader.loadData<OperatorResponse>('operators.json');

    function pickNextSide(nAttacker?: RawOperator, nDefender?: RawOperator): 'ATT' | 'DEF' {
      const [pOperator, ppOperator] = Array.from(OPERATOR_LIST.value).reverse();

      // No previous operator or only one side remains
      if (!pOperator || !nDefender) return 'ATT';
      if (!nAttacker) return 'DEF';

      // Pathfinder case
      if (pOperator?.release === SeasonStore.SEASON_LIST[0]) return ppOperator?.side === Side.DEF ? 'ATT' : 'DEF';

      // Map release seasons
      const aRelease = toRaw(SeasonStore.SEASONS[nAttacker.release]);
      const dRelease = toRaw(SeasonStore.SEASONS[nDefender.release]);

      // Same release season as previous
      if (aRelease === pOperator?.release) return 'ATT';
      if (dRelease === pOperator?.release) return 'DEF';

      // Earlier release
      return aRelease.value <= dRelease.value ? 'ATT' : 'DEF';
    }

    const indexes = { ATT: 0, DEF: 0 };
    for (let failsafe = 0; failsafe < 100; failsafe++) {
      // Get next raw attacker and defender
      const nAttacker = Object.values(rawData.ATT)[indexes.ATT];
      const nDefender = Object.values(rawData.DEF)[indexes.DEF];
      if (!nAttacker && !nDefender) break;

      // Pick next operator in order
      const nSide = pickNextSide(nAttacker, nDefender);
      const [operatorKey, operator] = Object.entries(rawData[nSide])[indexes[nSide]];
      indexes[nSide]++;

      // Extract operator data to map
      const { birthplace, organization, squad } = operator.biography;
      const { shield, primaries, secondaries, gadgets } = operator.loadout;

      // Add roles to list
      operator.roles.forEach((role) => { if (!ROLES.value.includes(role)) ROLES.value.push(role); });

      // Add country to list
      const country = birthplace?.split(', ').reverse()[0];
      if (country && !COUNTRIES.value.includes(country)) COUNTRIES.value.push(country);

      // Add organization to list
      if (organization && !ORGANIZATIONS.value.includes(organization)) ORGANIZATIONS.value.push(organization);

      // Add squad to list
      const squadKey = squad?.toLocaleUpperCase('en-US');
      if (squadKey && !SQUADS.value[squadKey]) SQUADS.value[squadKey] = new Squad(squad!);

      // Create biography
      const biography = {
        name: operator.biography.name,
        birthplace: operator.biography.birthplace,
        organization: operator.biography.organization,
        squad: squad ? toRaw(SQUADS.value[squadKey!]) : undefined
      };

      // Create loadout
      const loadout = {
        shield: shield ? toRaw(LoadoutStore.WEAPONS[shield]) : undefined,
        primaryWeapons: primaries?.map((weapon) => toRaw(LoadoutStore.WEAPONS[weapon])),
        secondaryWeapons: secondaries?.map((weapon) => toRaw(LoadoutStore.WEAPONS[weapon])),
        gadgets: gadgets.map((gadget) => toRaw(LoadoutStore.GADGETS[gadget]))
      };

      // Create operator
      OPERATORS.value[operatorKey] = new Operator(
        operatorKey,
        operator.name,
        Side[nSide],
        operator.speed,
        operator.roles,
        toRaw(SeasonStore.SEASONS[operator.release]),
        biography,
        loadout
      )
    }

    // Sort countries, organizations and roles arrays
    ROLES.value.sort();
    COUNTRIES.value.sort();
    ORGANIZATIONS.value.sort();

    isFetched.value = true;
    console.debug(OPERATOR_LIST.value);
    console.debug(toRaw(ROLES.value));
    console.debug(toRaw(COUNTRIES.value));
    console.debug(toRaw(ORGANIZATIONS.value));
    console.debug(SQUAD_LIST.value);
  }

  return {
    OPERATORS,
    OPERATOR_LIST,
    COUNTRIES,
    ORGANIZATIONS,
    SQUADS,
    SQUAD_LIST,
    ROLES,

    fetchOperators,
    isFetched
  };
});
