<template>
  <v-list-subheader
    v-if="label"
    class="mb-n3 mt-n1 text-caption"
    :title="label"
  />
  <v-list-item v-bind="$attrs">
    <slot :disabled="disabled" />

    <template
      v-if="disabled && !!reason"
      #append
    >
      <v-expand-x-transition>
        <v-list-item-action
          v-show="disabled"
          end
        >
          <v-tooltip :text="reason">
            <template #activator="{ props: p }">
              <v-icon
                v-bind="p"
                :icon="reasonIcon"
              />
            </template>
          </v-tooltip>
        </v-list-item-action>
      </v-expand-x-transition>
    </template>
  </v-list-item>
</template>

<script setup>
// eslint-disable-next-line
const props = defineProps({
  disabled: {
    default: false,
    type: Boolean
  },

  label: {
    default: null,
    type: String
  },

  reason: {
    default: null,
    type: String
  },

  reasonIcon: {
    default: '$info',
    type: String
  }
});
</script>
