<script lang="ts" setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

import VIcon from "@/shared/ui/common/VIcon.vue";

const slots = defineSlots();

const props = withDefaults(
  defineProps<{
    text?: string;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loader?: boolean;
    icon?: string;
    variant?: "default" | "primary" | "positive" | "negative" | "warning" | "link";
    to?: string | object;
    replace?: boolean;
    activeClass?: string;
    exactActiveClass?: string;
  }>(),
  {
    type: "button",
    variant: "default",
    replace: false,
    icon: undefined,
    to: undefined,
    activeClass: undefined,
    exactActiveClass: undefined,
    text:"",
  },
);

const isIconOnly = computed(() => !props.text && !!props.icon && !slots.default);

const variantClass = computed(() => {
  switch (props.variant) {
    case "primary":
      return "primary-button";
    case "positive":
      return "positive-button";
    case "negative":
      return "negative-button";
    case "warning":
      return "warning-button";
    case "link":
      return "link-button";
    default:
      return "primary-button";
  }
});

const isRouterLink = computed(() => !!props.to);
</script>

<template>
  <component
    :is="isRouterLink ? RouterLink : 'button'"
    :class="[variantClass, { 'w-10 h-10 p-0 flex items-center justify-center': isIconOnly }]"
    class="button"
    v-bind="
      isRouterLink
        ? {
          to: props.to,
          replace: props.replace,
          activeClass: props.activeClass,
          exactActiveClass: props.exactActiveClass,
          ...$attrs,
        }
        : { type: props.type, disabled: props.disabled || props.loader, ...$attrs }
    "
  >
    <span
      v-if="$slots.iconLeft || props.loader || props.icon"
      class="flex items-center justify-center"
    >
      <VIcon
        v-if="props.loader"
        icon="mdi:loading"
        :size="32"
        :loading="props.loader"
      />
      <template v-else>
        <slot name="iconLeft">
          <VIcon
            v-if="props.icon"
            :icon="props.icon"
          />
        </slot>
      </template>
    </span>
    <div
      v-if="!isIconOnly"
      class="flex gap-[3px] justify-center items-center"
    >
      <span v-if="props.text">
        {{ props.text }}
      </span>
      <slot />
    </div>
    <span
      v-if="$slots.iconRight"
      class="flex items-center justify-center"
    >
      <slot name="iconRight" />
    </span>
  </component>
</template>
