<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  value?: unknown
  align?: "left" | "center" | "right" | string
  depth?: number
  isFirstColumn?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  align: "left",
  depth: 0,
  isFirstColumn: false,
  value: undefined,
});

// Calculate padding for indent of nested rows
const computedPaddingLeft = computed(() => {
  if (props.isFirstColumn && props.depth > 0) {
    return `${props.depth * 24 + 16}px`;
  }
  return undefined;
});
</script>

<template>
  <div
    :class="{
      'table-cell--left': align === 'left',
      'table-cell--center': align === 'center',
      'table-cell--right': align === 'right',
      'table-cell--indented': isFirstColumn && depth > 0
    }"
    :style="{ paddingLeft: computedPaddingLeft }"
    class="table-cell"
  >
    <slot />
  </div>
</template>
