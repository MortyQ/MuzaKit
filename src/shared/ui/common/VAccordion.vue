<script lang="ts" setup>
import { computed, useId } from "vue";

import VIcon from "@/shared/ui/common/VIcon.vue";

export type AccordionVariant = "default" | "outlined" | "inset" | "popout";

export type AccordionItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  content?: string;
  disabled?: boolean;
  icon?: string;
};

type AccordionProps = {
  items?: AccordionItem[];
  modelValue?: (string | number)[];
  multiple?: boolean;
  variant?: AccordionVariant;
  disabled?: boolean;
  flat?: boolean;
  accordion?: boolean; // true = only one can be open at a time
};

type AccordionEmits = {
  "update:modelValue": [value: (string | number)[]];
  change: [openItems: (string | number)[]];
};

const props = withDefaults(defineProps<AccordionProps>(), {
  items: () => [],
  modelValue: () => [],
  multiple: false,
  variant: "default",
  disabled: false,
  flat: false,
  accordion: false,
});

const emit = defineEmits<AccordionEmits>();

// Generate unique ID for accessibility
const accordionId = useId();

// Track open items
const openItems = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
    emit("change", value);
  },
});

// Check if item is open
const isOpen = (itemId: string | number): boolean => {
  return openItems.value.includes(itemId);
};

// Toggle item
const toggleItem = (itemId: string | number, disabled?: boolean) => {
  if (props.disabled || disabled) return;

  const isCurrentlyOpen = isOpen(itemId);

  if (props.accordion || !props.multiple) {
    // Accordion mode: only one item open at a time
    if (isCurrentlyOpen) {
      // Close this item
      openItems.value = [];
    }
    else {
      // Open this item and close others
      openItems.value = [itemId];
    }
  }
  else {
    // Multiple mode: can open multiple items
    if (isCurrentlyOpen) {
      // Close this item
      openItems.value = openItems.value.filter(id => id !== itemId);
    }
    else {
      // Open this item
      openItems.value = [...openItems.value, itemId];
    }
  }
};
</script>

<template>
  <div
    :id="accordionId"
    class="v-expansion-panels"
    :class="[
      `v-expansion-panels--${variant}`,
      {
        'v-expansion-panels--flat': flat,
        'v-expansion-panels--disabled': disabled,
      },
    ]"
  >
    <div
      v-for="(item, index) in items"
      :key="item.id"
      class="v-expansion-panel"
      :class="{
        'v-expansion-panel--active': isOpen(item.id),
        'v-expansion-panel--disabled': item.disabled || disabled,
      }"
    >
      <!-- Panel Header -->
      <button
        :id="`${accordionId}-header-${item.id}`"
        type="button"
        class="v-expansion-panel-header"
        :aria-expanded="isOpen(item.id)"
        :aria-controls="`${accordionId}-content-${item.id}`"
        :disabled="item.disabled || disabled"
        @click="toggleItem(item.id, item.disabled)"
      >
        <!-- Try specific slot for this item's header first -->
        <!-- eslint-disable-next-line vue/attribute-hyphenation -->
        <slot
          :name="`header-${item.id}`"
          :item="item"
          :index="index"
          :is-open="isOpen(item.id)"
        >
          <!-- Fall back to generic header slot -->
          <!-- eslint-disable-next-line vue/attribute-hyphenation -->
          <slot
            name="header"
            :item="item"
            :index="index"
            :is-open="isOpen(item.id)"
          >
            <!-- Default header template -->
            <!-- Icon (optional) -->
            <VIcon
              v-if="item.icon"
              :icon="item.icon"
              class="v-expansion-panel-header__icon"
            />

            <!-- Title & Subtitle -->
            <div class="v-expansion-panel-header__content">
              <div class="v-expansion-panel-title">
                {{ item.title }}
              </div>
              <div
                v-if="item.subtitle"
                class="v-expansion-panel-subtitle"
              >
                {{ item.subtitle }}
              </div>
            </div>

            <!-- Expand Icon -->
            <div class="v-expansion-panel-header__icon-wrapper">
              <VIcon
                icon="mdi:chevron-down"
                :class="
                  isOpen(item.id)
                    ? 'v-expansion-panel-header__expand-icon ' +
                      'v-expansion-panel-header__expand-icon--active'
                    : 'v-expansion-panel-header__expand-icon'
                "
              />
            </div>
          </slot>
        </slot>
      </button>

      <!-- Panel Content with smooth height transition -->
      <div
        :id="`${accordionId}-content-${item.id}`"
        class="v-expansion-panel-content"
        :aria-labelledby="`${accordionId}-header-${item.id}`"
        :aria-hidden="!isOpen(item.id)"
        role="region"
      >
        <div class="v-expansion-panel-content__wrap">
          <!-- Try specific slot for this item first (e.g., #content-1, #content-profile) -->
          <slot
            :name="`content-${item.id}`"
            :item="item"
            :index="index"
          >
            <!-- Fall back to generic content slot -->
            <slot
              name="content"
              :item="item"
              :index="index"
            >
              <!-- Default: render item.content as text -->
              <div class="v-expansion-panel-text">
                {{ item.content }}
              </div>
            </slot>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use "@/shared/assets/styles/components/vaccordion";
</style>
