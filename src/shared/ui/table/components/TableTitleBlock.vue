<script lang="ts" setup>
/**
 * TableTitleBlock Component
 *
 * A header block for table sections with title and actions.
 * Used for toggle controls above tables.
 *
 * @example
 * ```vue
 * <TableTitleBlock title="Intraday Analytics">
 *   <VToggleGroup v-model="activeView" :options="viewOptions" />
 * </TableTitleBlock>
 * ```
 */
import VIcon from "@/shared/ui/common/VIcon.vue";

interface Props {
  /** Block title */
  title?: string
  /** Optional icon (lucide icon name) */
  icon?: string
}

withDefaults(defineProps<Props>(), {
  title: "",
  icon: "",
});
</script>

<template>
  <div class="table-title-block">
    <div class="table-title-block__title-section">
      <VIcon
        v-if="icon"
        :icon="icon"
        :size="20"
        class="table-title-block__icon"
      />
      <h3
        v-if="title"
        class="table-title-block__title"
      >
        {{ title }}
      </h3>
      <!-- Separator -->
      <span
        v-if="title && $slots.default"
        class="table-title-block__separator"
      />
    </div>

    <!-- Default slot for actions (VToggleGroup, etc.) -->
    <div
      v-if="$slots.default"
      class="table-title-block__actions"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-title-block {
  @apply w-full flex items-center gap-3;

  &__title-section {
    @apply flex items-center gap-2.5;
  }

  &__icon {
    @apply text-primary;
  }

  &__title {
    @apply text-lg font-semibold text-mainText m-0;
  }

  &__separator {
    @apply w-px h-5 bg-base-300 mx-1;
  }

  &__actions {
    @apply flex items-center gap-2;
  }
}
</style>
