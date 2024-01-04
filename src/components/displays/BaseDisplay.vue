<template>
  <v-row
    class="align-center"
    no-gutters
  >
    <!-- Prepend Slot -->
    <v-col
      v-if="$slots.prepend || displayPrependAvatar?.value || displayPrependIcon?.value"
      class="pa-0"
      cols="auto"
    >
      <slot name="prepend">
        <!-- Prepend Avatar -->
        <v-avatar
          v-if="displayPrependAvatar?.value"
          v-bind="displayPrependAvatar.props"
          :image="displayPrependAvatar.value"
          size="small"
          start
        />

        <!-- Prepend Icon -->
        <v-icon
          v-if="displayPrependIcon?.value"
          v-bind="displayPrependIcon.props"
          color="grey-lighten-1"
          :icon="displayPrependIcon.value"
          start
        />
      </slot>
    </v-col>

    <!-- Main Content -->
    <v-col class="pa-0">
      <!-- Field Label -->
      <v-label
        v-bind="displayLabel.props"
        class="d-block mt-n1 text-caption"
        :text="displayLabel.value"
      />

      <v-row
        no-gutters
        class="align-center"
      >
        <!-- Prepend Inner Slot -->
        <v-col
          v-if="$slots.prependInner || displayPrependInnerIcon?.value"
          class="pa-0"
          cols="auto"
        >
          <slot name="prependInner">
            <!-- Prepend Inner Icon -->
            <v-icon
              v-if="displayPrependInnerIcon?.value"
              v-bind="displayPrependInnerIcon.props"
              color="grey-lighten-1"
              :icon="displayPrependInnerIcon.value"
              start
            />
          </slot>
        </v-col>

        <!-- Content Slot -->
        <v-col class="pa-0">
          <slot />
        </v-col>

        <!-- Append Inner Slot -->
        <v-col
          v-if="$slots.appendInner || displayAppendInnerIcon?.value"
          class="pa-0"
          cols="auto"
        >
          <slot name="appendInner">
            <!-- Append Inner Icon -->
            <v-icon
              v-if="displayAppendInnerIcon?.value"
              v-bind="displayAppendInnerIcon.props"
              color="grey-lighten-1"
              end
              :icon="displayAppendInnerIcon.value"
            />
          </slot>
        </v-col>
      </v-row>
    </v-col>

    <!-- Append Slot -->
    <v-col
      v-if="$slots.append || displayAppendAvatar?.value || displayAppendIcon?.value"
      class="pa-0"
      cols="auto"
    >
      <slot name="append">
        <!-- Append Avatar -->
        <v-avatar
          v-if="displayAppendAvatar?.value"
          v-bind="displayAppendAvatar.props"
          end
          :image="displayAppendAvatar.value"
          size="small"
        />

        <!-- Append Icon -->
        <v-icon
          v-if="displayAppendIcon?.value"
          v-bind="displayAppendIcon.props"
          color="grey-lighten-1"
          end
          :icon="displayAppendIcon.value"
        />
      </slot>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';

// eslint-disable-next-line
const props = defineProps({
  /** The avatar to append after the content column. */
  appendAvatar: {
    default: null,
    type: [Object, String]
  },

  /** The icon to append after the content column. */
  appendIcon: {
    default: null,
    type: [Object, String]
  },

  /** The icon to append after the content value. */
  appendInnerIcon: {
    default: null,
    type: [Object, String]
  },

  /** The label to display above the content value. */
  label: {
    required: true,
    type: [Object, String]
  },

  /** The avatar to prepend before the content column. */
  prependAvatar: {
    default: null,
    type: [Object, String]
  },

  /** The icon to prepend before the content column. */
  prependIcon: {
    default: null,
    type: [Object, String]
  },

  /** The icon to prepend before the content value. */
  prependInnerIcon: {
    default: null,
    type: [Object, String]
  }
});

/** The avatar to append after the content column. */
const displayAppendAvatar = computed(() => parseProp(props.appendAvatar));

/** The icon to append after the content column. */
const displayAppendIcon = computed(() => parseProp(props.appendIcon));

/** The icon to append after the content value. */
const displayAppendInnerIcon = computed(() => parseProp(props.appendInnerIcon));

/** The label to display above the content value. */
const displayLabel = computed(() => parseProp(props.label));

/** The avatar to prepend before the content column. */
const displayPrependAvatar = computed(() => parseProp(props.prependAvatar));

/** The icon to prepend before the content column. */
const displayPrependIcon = computed(() => parseProp(props.prependIcon));

/** The icon to prepend before the content value. */
const displayPrependInnerIcon = computed(() => parseProp(props.prependInnerIcon));

/**
 * Parses a props to item props and value.
 * 
 * @param {Object|string} propValue The raw prop value.
 * 
 * @returns {{ value: string, props: Object }} The parsed prop values.
 */
function parseProp(propValue) {
  if (!propValue) return null;
  return {
    value: typeof propValue === 'object' ? propValue.value : propValue,
    props: typeof propValue === 'object' ? (propValue.props || {}) : {}
  }
}
</script>