<script setup lang="ts">
import { VueDatePicker, type ModelValue } from "@vuepic/vue-datepicker";
import { useSlots } from "vue";

import "@vuepic/vue-datepicker/dist/main.css";

import VIcon from "@/shared/ui/common/VIcon.vue";

defineOptions({
  inheritAttrs: false,
});

const model = defineModel<ModelValue>();
const slots = useSlots();

// List of slots that have custom default implementation
const excludedSlots = [
  "input-icon",
  "clear-icon",
  "arrow-left",
  "arrow-right",
  "arrow-up",
  "arrow-down",
  "clock-icon",
  "calendar-icon",
];

/**
 * Wrapper-specific props only
 * All datepicker library props are passed via $attrs
 */
type Props = {
  /** Label for the datepicker (wrapper UI) */
  name?: string;
  /** Helper text below input (wrapper UI) */
  helperText?: string;
  /** Validation object (Vuelidate compatible) - wrapper UI */
  validation?: {
    $error?: boolean;
    $errors?: Array<{ $message: string }>;
  };
  /** Size variant (wrapper UI: sm/md/lg) */
  size?: "sm" | "md" | "lg";
  /** Icon to display (wrapper UI) */
  icon?: string;
  /** Auto apply selection (no confirm button) */
  autoApply?: boolean;
  clearable?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  name: "",
  helperText: "",
  validation: undefined,
  size: "md",
  icon: "lucide:calendar",
  autoApply: true,
  clearable: false,
});
</script>


<template>
  <div
    class="v-datepicker-wrapper"
    :class="`v-datepicker--${size}`"
  >
    <!-- Label -->
    <label
      v-if="props.name"
      class="v-datepicker-label"
    >
      {{ props.name }}
    </label>

    <!-- Datepicker - All library props via $attrs -->
    <VueDatePicker
      v-model="model"
      v-bind="$attrs"
      :auto-apply="props.autoApply"
      :timezone="'UTC'"
      :week-start="0"
      :class="[
        'v-datepicker',
        {
          'v-datepicker-error': validation?.$error,
          'v-datepicker-no-clear': !props.clearable,
        },
      ]"
      :input-class-name="[
        'v-datepicker-input',
        {
          'v-datepicker-input-error': validation?.$error,
        },
      ]"
      :menu-class-name="'v-datepicker-menu'"
      :calendar-class-name="'v-datepicker-calendar'"
    >
      <!-- Calendar Icon Slot - Parent can override -->
      <template
        v-if="slots['input-icon']"
        #input-icon
      >
        <slot name="input-icon" />
      </template>
      <template
        v-else
        #input-icon
      >
        <div class="flex items-center ml-2">
          <VIcon
            :icon="icon"
            class="v-datepicker-icon"
          />
        </div>
      </template>

      <!-- Clear Icon Slot - Parent can override, only shown when clearable -->
      <template
        v-if="props.clearable && slots['clear-icon']"
        #clear-icon="slotProps"
      >
        <slot
          name="clear-icon"
          v-bind="slotProps"
        />
      </template>
      <template
        v-else-if="props.clearable"
        #clear-icon="{ clear }"
      >
        <div class="flex items-center mr-2">
          <VIcon
            icon="lucide:x"
            class="v-datepicker-clear-icon"
            @click="clear"
          />
        </div>
      </template>

      <!-- Arrow Left - Parent can override -->
      <template
        v-if="slots['arrow-left']"
        #arrow-left
      >
        <slot name="arrow-left" />
      </template>
      <template
        v-else
        #arrow-left
      >
        <VIcon
          icon="lucide:chevron-left"
          class="v-datepicker-arrow-icon"
        />
      </template>

      <!-- Arrow Right - Parent can override -->
      <template
        v-if="slots['arrow-right']"
        #arrow-right
      >
        <slot name="arrow-right" />
      </template>
      <template
        v-else
        #arrow-right
      >
        <VIcon
          icon="lucide:chevron-right"
          class="v-datepicker-arrow-icon"
        />
      </template>

      <!-- Arrow Up - Parent can override -->
      <template
        v-if="slots['arrow-up']"
        #arrow-up
      >
        <slot name="arrow-up" />
      </template>
      <template
        v-else
        #arrow-up
      >
        <VIcon
          icon="lucide:chevron-up"
          class="v-datepicker-arrow-icon"
        />
      </template>

      <!-- Arrow Down - Parent can override -->
      <template
        v-if="slots['arrow-down']"
        #arrow-down
      >
        <slot name="arrow-down" />
      </template>
      <template
        v-else
        #arrow-down
      >
        <VIcon
          icon="lucide:chevron-down"
          class="v-datepicker-arrow-icon"
        />
      </template>

      <!-- Clock Icon - Parent can override -->
      <template
        v-if="slots['clock-icon']"
        #clock-icon
      >
        <slot name="clock-icon" />
      </template>
      <template
        v-else
        #clock-icon
      >
        <VIcon
          icon="lucide:clock"
          class="v-datepicker-clock-icon"
        />
      </template>

      <!-- Calendar Icon - Parent can override -->
      <template
        v-if="slots['calendar-icon']"
        #calendar-icon
      >
        <slot name="calendar-icon" />
      </template>
      <template
        v-else
        #calendar-icon
      >
        <VIcon
          :icon="icon"
          class="v-datepicker-calendar-icon"
        />
      </template>

      <!-- Pass through any other slots from parent -->
      <template
        v-for="(_, slotName) in slots"
        :key="slotName"
        #[slotName]="slotProps"
      >
        <slot
          v-if="!excludedSlots.includes(slotName as string)"
          :name="slotName"
          v-bind="slotProps"
        />
      </template>
    </VueDatePicker>

    <!-- Helper Text -->
    <p
      v-if="helperText && !validation?.$error"
      class="v-datepicker-helper-text"
    >
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <transition
      name="error-slide"
      mode="out-in"
    >
      <p
        v-if="validation?.$error"
        class="v-datepicker-error-message"
      >
        {{ validation?.$errors[0]?.$message }}
      </p>
    </transition>
  </div>
</template>





