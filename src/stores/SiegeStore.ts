import { merge, unset } from 'lodash';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef, toRaw } from 'vue';

import {
  Gadget, type RawGadget,
  Level, type RawLevel,
  Operator, type RawOperator,
  Playlist, type RawPlaylistCategory,
  Season,
  Side,
  type Weapon
} from '@/models';
import { WEAPON_CLASSES } from '@/models/siege/Weapon';
import { useLoadingStore } from '@/stores';
import { DataFetcher, Env } from '@/utils';

export default defineStore('siege', () => {
  const LoadingStore = useLoadingStore();

  /** The collection of gadgets. */
  const GADGETS = ref<Record<string, Gadget>>({});

  /** The list of gadgets. */
  const GADGET_LIST = computed(() => Object.values(GADGETS.value));

  /** The collection of levels. */
  const LEVELS = ref<Record<string, Level>>({});

  /** The list of levels. */
  const LEVEL_LIST = computed(() => Object.values(LEVELS.value));

  /** The list of level locations. */
  const LEVEL_LOCATIONS = computed(() => LEVEL_LIST.value.reduce<string[]>((locations, level) => {
    // Get level locations
    const location = level.location.split(', ').at(-1)!;

    // Add level location to list if not present
    if (!locations.includes(location)) locations.push(location);
    return locations;
  }, []).sort());

  /** The collection of operators. */
  const OPERATORS = ref<Record<string, Operator>>({});

  /** The list of operators. */
  const OPERATOR_LIST = computed(() => Object.values(OPERATORS.value));

  /** The list of operator birthplaces. */
  const OPERATOR_BIRTHPLACES = computed(() => OPERATOR_LIST.value.reduce<string[]>((birthplaces, operator) => {
    // Skip operators without birthplace
    if (!operator.biography.birthplace) return birthplaces;

    // Get operator birthplace
    const birthplace = operator.biography.birthplace.split(', ').at(-1)!;

    // Add operator birthplace to list if not present
    if (!birthplaces.includes(birthplace)) birthplaces.push(birthplace);
    return birthplaces;
  }, []).sort());

  /** The list of operator roles. */
  const OPERATOR_ROLES = computed(() => {
    const roles = OPERATOR_LIST.value.map((operator) => operator.roles).flat().sort();
    return Array.from(new Set(roles));
  });

  /** The collection of playlists. */
  const PLAYLISTS = ref<Record<string, Playlist>>({});

  /** The list of playlists. */
  const PLAYLIST_LIST = computed(() => Object.values(PLAYLISTS.value));

  /** The collection of seasons. */
  const SEASONS = ref<Record<string, Season>>({});

  /** The list of seasons. */
  const SEASON_LIST = computed(() => Object.values(SEASONS.value));

  /** The collection of sides. */
  const SIDES = ref<Record<string, Side>>({
    ATT: new Side('ATT', 'Attack', 'Attacker', 'mdi-sword-cross', 'blue'),
    DEF: new Side('DEF', 'Defense', 'Defender', 'mdi-chess-rook', 'orange-darken-1')
  });

  /** The list of sides. */
  const SIDE_LIST = computed(() => Object.values(SIDES.value));

  /** The collection of weapons. */
  const WEAPONS = ref<Record<string, Weapon>>({});

  /** The list of weapons. */
  const WEAPON_LIST = computed(() => Object.values(WEAPONS.value));

  /** Whether Siege data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** Fetches the Siege related data from the data source. */
  async function fetchSiegeData() {
    // Cancel if already fetched
    if (isFetched.value) return;

    // Show loading dialog
    await LoadingStore.run(
      async () => {
        // Fetch data
        const [
          rawGadgets,
          rawLevels,
          rawOperators,
          rawPlaylistCategories,
          rawSeasons,
          rawWeapons
        ] = await Promise.all([
          DataFetcher.fetchData<Record<string, RawGadget>>('gadgets.json'),
          DataFetcher.fetchData<Record<string, RawLevel>>('levels.json'),
          DataFetcher.fetchData<Record<string, RawOperator>>('operators.json'),
          DataFetcher.fetchData<Array<RawPlaylistCategory>>('playlists.json'),
          DataFetcher.fetchData<Record<string, string>>('seasons.json'),
          DataFetcher.fetchData<Record<string, Record<string, string>>>('weapons.json')
        ]);

        // Mapping seasons
        LoadingStore.dialogStep = 'Mapping Seasons…';
        Object.entries(rawSeasons).forEach(([key, name], id) => SEASONS.value[key] = new Season(id, key, name));
        console.debug(toRaw(SEASONS.value));

        // Mapping levels
        LoadingStore.dialogStep = 'Mapping Levels…';
        Object.entries(rawLevels).forEach(([key, rawLevel]) => {
          // Map level metadata
          const { released, reworked, modernized } = rawLevel.metadata;
          const metadata: Level['metadata'] = { released: SEASONS.value[released] };
          if (reworked) metadata.reworked = SEASONS.value[reworked];
          if (modernized) metadata.modernized = SEASONS.value[modernized];

          // Create level instance
          LEVELS.value[key] = new Level(key, rawLevel.name, rawLevel.location, metadata);
        });
        console.debug(toRaw(LEVELS.value));
        console.debug(LEVEL_LOCATIONS.value);

        // Mapping weapons
        LoadingStore.dialogStep = 'Mapping Weapons…';
        Object.entries(rawWeapons).forEach(([weaponTypeKey, rawCategoryWeapons]) => {
          Object.entries(rawCategoryWeapons).forEach(([key, name]) => {
            const weapon = new WEAPON_CLASSES[weaponTypeKey](key, name);
            WEAPONS.value[weapon.key] = weapon;
          });
        });
        console.debug(toRaw(WEAPONS.value));

        // Mapping gadgets
        LoadingStore.dialogStep = 'Mapping Gadgets…';
        Object.entries(rawGadgets).forEach(([key, rawGadget]) => GADGETS.value[key] = new Gadget(
          key,
          rawGadget.name,
          rawGadget.amount,
          rawGadget.features
        ));
        console.debug(toRaw(GADGETS.value));

        // Mapping operators
        LoadingStore.dialogStep = 'Mapping Operators…';
        Object.entries(rawOperators).forEach(([key, rawOperator]) => {
          // Map operator side
          const side = SIDES.value[rawOperator.side];

          // Map operator loadout
          const { shield, primaries, secondaries, gadgets } = rawOperator.loadout;
          const loadout: Operator['loadout'] = { gadgets: gadgets.map((key) => GADGETS.value[key]) };
          if (shield) loadout.shield = WEAPONS.value[shield];
          if (primaries) loadout.primaries = primaries.map((key) => WEAPONS.value[key]);
          if (secondaries) loadout.secondaries = secondaries.map((key) => WEAPONS.value[key]);

          // Map operator metadata
          const { released, reworked } = rawOperator.metadata;
          const metadata: Operator['metadata'] = { released: SEASONS.value[released] };
          if (reworked) metadata.reworked = SEASONS.value[reworked];

          // Create operator instance
          OPERATORS.value[key] = new Operator(
            key,
            rawOperator.alias,
            side,
            rawOperator.speed,
            rawOperator.roles,
            rawOperator.biography,
            loadout,
            metadata
          )
        });
        console.debug(toRaw(OPERATORS.value));
        console.debug(OPERATOR_BIRTHPLACES.value);
        console.debug(OPERATOR_ROLES.value);

        // Mapping playlists
        LoadingStore.dialogStep = 'Mapping Playlists…';

        function mapPlaylistCategory(rawCategory: RawPlaylistCategory, parent?: RawPlaylistCategory) {
          // Skip disabled categories
          if (rawCategory.settings?.disabled) return;

          // Map playlists
          if (rawCategory.playlists) {
            Object.entries(rawCategory.playlists).forEach(([key, rawPlaylist]) => {
              // Skip disabled playlists
              if (rawPlaylist.settings?.disabled) return;

              // Merge parent category, category and playlist settings
              const settings = merge(
                {},
                parent?.settings,
                rawCategory.settings,
                rawPlaylist.settings
              );

              // Map playlist levels
              if (settings.levels?.enabled || settings.levels?.disabled) {
                const { disabled, enabled } = settings.levels;

                const levels = enabled
                  ? enabled.map((key) => LEVELS.value[key])
                  : LEVEL_LIST.value.filter((level) => !disabled!.includes(level.key));

                merge(settings, { levels: { list: levels } });
                unset(settings, 'levels.disabled');
                unset(settings, 'levels.enabled');
              }

              // Map playlist operators
              if (settings.operators?.disabled || settings.operators?.enabled) {
                const { disabled, enabled } = settings.operators;

                const operators = enabled
                  ? enabled.map((key) => OPERATORS.value[key])
                  : OPERATOR_LIST.value.filter((operator) => !disabled!.includes(operator.key));

                merge(settings, { operators: { list: operators } });
                unset(settings, 'operators.disabled');
                unset(settings, 'operators.enabled');
              }

              // Create playlist instance
              PLAYLISTS.value[key] = new Playlist(
                key,
                rawPlaylist.name,
                parent ? `${parent.name} - ${rawCategory.name}` : rawCategory.name,
                settings
              );
            });
          }

          // Map subcategories
          if (rawCategory.subcategories) {
            rawCategory.subcategories.forEach((subcategory) => mapPlaylistCategory(subcategory, rawCategory));
          }
        }

        // Map playlist categories
        rawPlaylistCategories.forEach((category) => mapPlaylistCategory(category));
        console.debug(toRaw(PLAYLISTS.value));
      },
      `Preparing ${Env.APP.NAME}…`,
      'Fetching Data…'
    );

    // Set fetched status
    isFetched.value = true;
  }

  return {
    GADGETS,
    GADGET_LIST,

    LEVELS,
    LEVEL_LIST,
    LEVEL_LOCATIONS,

    OPERATORS,
    OPERATOR_LIST,
    OPERATOR_ROLES,
    OPERATOR_BIRTHPLACES,

    PLAYLISTS,
    PLAYLIST_LIST,

    SEASONS,
    SEASON_LIST,

    SIDES,
    SIDE_LIST,

    WEAPONS,
    WEAPON_LIST,

    isFetched,
    fetchSiegeData
  };
});
