<template>
  <div
    class="d-flex flex-wrap"
    :class="`justify-${justify} ga-${gap}`"
  >
    <!-- Label -->
    <v-label
      class="me-auto text-caption"
      :text="label"
    />

    <!-- Content -->
    <slot>
      <template v-for="chip in chipItems">
        <slot
          name="chip"
          :chip
        >
          <!-- Item Chip -->
          <v-chip
            label
            size="x-small"
            :text="chip.text"
            v-bind="chip.props"
          >
            <!-- Prefix -->
            <template v-if="chip.prefix">
              <span class="prefix text-medium-emphasis">{{ chip.prefix }}</span>

              <v-divider
                v-if="divided"
                class="chip-divider prefix"
                opacity=".3"
                vertical
              />
            </template>

            <!-- Main Text -->
            <span class="font-weight-semibold">{{ chip.text }}</span>

            <!-- Suffix -->
            <template v-if="chip.suffix">
              <v-divider
                v-if="divided"
                class="chip-divider suffix"
                opacity=".3"
                vertical
              />

              <span class="suffix text-medium-emphasis">{{ chip.suffix }}</span>
            </template>
          </v-chip>
        </slot>
      </template>

      <span
        v-if="!chipItems.length"
        class="text-body-2"
      >
        Empty
      </span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ItemChip = {
  text: string;
  prefix?: string;
  suffix?: string;
  props?: Record<string, any>;
};

type ValueParser = string | ((arg0: any) => string | number | undefined);

// Props
const {
  divided,
  gap = 1,
  items,
  itemPrefix,
  itemProps,
  itemSuffix,
  itemText,
  justify = 'end',
  label
} = defineProps<{
  divided?: boolean;
  gap?: number;
  items?: any | Array<any>;
  itemPrefix?: ValueParser;
  itemProps?: Record<string, any> | ((arg0: any) => Record<string, any>);
  itemSuffix?: ValueParser;
  itemText?: ValueParser;
  justify?: string;
  label?: string;
}>();

const chipItems = computed(() => {
  if (!items) return [];

  return [items].flat().map((item) => {
    const chip = {
      text: parseChipElement(item, 'text', itemText),
      prefix: parseChipElement(item, 'prefix', itemPrefix),
      suffix: parseChipElement(item, 'suffix', itemSuffix)
    } as ItemChip;

    if (typeof itemProps === 'function') chip.props = itemProps(item);
    else chip.props = itemProps;

    return chip;
  });
});

function parseChipElement(item: any, element: 'text' | 'prefix' | 'suffix' = 'text', valueParser?: ValueParser) {
  switch (typeof valueParser) {
    case 'function':
      return valueParser(item);

    case 'string':
      return valueParser.split('.').reduce((obj, prop) => obj[prop], item);

    default:
      if (element === 'text') return item[element] ?? String(item);
      return item[element];
  }
}
</script>

<style scoped lang="scss">
.chip-divider {
  margin-bottom: 2px;
  margin-top: 2px;
}

.prefix {
  margin-right: 4px;

  &.chip-divider {
    margin-left: 2px;
    margin-right: 6px;
  }
}

.suffix {
  margin-left: 4px;

  &.chip-divider {
    margin-left: 6px;
    margin-right: 2px;
  }
}
</style>
