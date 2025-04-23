import { defineStore } from 'pinia';
import { ref, shallowRef, toRaw } from 'vue';

import { Side, Strategy } from '@/models';
import { useOperatorStore } from '@/stores';
import { AssetLoader } from '@/utils';

type RawRule = string | {
  text: string;
  operator?: string;
  side?: 'ATT' | 'DEF';
};

type StrategyResponse = {
  title: string;
  tagline: string;
  rules: RawRule[];
  tags: string[];
  settings?: {
    side?: 'ATT' | 'DEF';
    requiredOperators?: string[];
    enabledOperators?: string[];
    disabledOperators?: string[];
  }
}[];

export default defineStore('strategyStore', () => {
  // Dependency stores
  const OperatorStore = useOperatorStore();

  /** Whether strategy data has been fetched. */
  const isFetched = shallowRef<boolean>(false);

  /** The list of strategies. */
  const STRATEGIES = ref<Strategy[]>([]);

  /** The list of strategy tags. */
  const TAGS = ref<string[]>([]);

  /** Fetches strategy data from the data source. */
  async function fetchStrats() {
    // Skip if strategy data has already been fetched
    if (isFetched.value) return;

    // Fetch dependency data
    await OperatorStore.fetchOperators();

    // Fetch strategy data
    const rawData = await AssetLoader.loadData<StrategyResponse>('strategies.json');

    rawData.forEach((strategy) => {
      const rules = strategy.rules.map((rule) => {
        if (typeof rule === 'string') return { text: rule };

        const operator = rule.operator ? OperatorStore.OPERATORS[rule.operator] : undefined;
        const side = operator?.side ?? rule.side ? Side[rule.side!] : undefined;

        return {
          text: rule.text,
          operator,
          side
        };
      });

      strategy.tags.forEach((tag) => { if (!TAGS.value.includes(tag)) TAGS.value.push(tag) });

      let settings = undefined;
      if (strategy.settings) {
        const { enabledOperators, disabledOperators, requiredOperators, side } = strategy.settings;

        settings = {
          side: side ? Side[side] : undefined,
          requiredOperators: requiredOperators?.map((operator) => toRaw(OperatorStore.OPERATORS[operator])),
          enabledOperators: enabledOperators?.map((operator) => toRaw(OperatorStore.OPERATORS[operator])),
          disabledOperators: disabledOperators?.map((operator) => toRaw(OperatorStore.OPERATORS[operator]))
        };
      }

      STRATEGIES.value.push(new Strategy(strategy.title, strategy.tagline, rules, settings));
    });

    STRATEGIES.value.sort((s1, s2) => s1.title.localeCompare(s2.title));
    TAGS.value.sort();

    isFetched.value = true;
  }

  return {
    STRATEGIES,
    
    isFetched,
    fetchStrats
  };
});
