<script lang="ts" setup>
import { nextTick, onBeforeUnmount, ref } from "vue";
import Multiselect from "vue-multiselect";

import VIcon from "@/shared/ui/common/VIcon.vue";

type Option = {
  label: string
  value: string | number
  [key: string]: unknown
};

type Props = {
  modelValue?: Option | Option[] | null
  options?: Option[]
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
  searchable?: boolean
  clearOnSelect?: boolean
  closeOnSelect?: boolean
  label?: string
  trackBy?: string
  loading?: boolean
  taggable?: boolean
  maxHeight?: number
  optionsLimit?: number
  teleportToBody?: boolean
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  options: () => [],
  placeholder: "Select option",
  disabled: false,
  multiple: false,
  searchable: true,
  clearOnSelect: true,
  closeOnSelect: true,
  label: "label",
  trackBy: "value",
  loading: false,
  taggable: false,
  maxHeight: 300,
  optionsLimit: 1000,
  teleportToBody: true,
});

const emit = defineEmits<{
  "update:modelValue": [value: Option | Option[] | null]
  select: [option: Option]
  remove: [option: Option]
  "search-change": [query: string]
  open: []
  close: []
}>();

const handleInput = (value: Option | Option[] | null) => {
  emit("update:modelValue", value);
};

const handleSelect = (option: Option) => {
  emit("select", option);
};

const handleRemove = (option: Option) => {
  emit("remove", option);
};

const handleSearchChange = (query: string) => {
  emit("search-change", query);
};

// Floating dropdown logic (teleport to body)
const msRef = ref<InstanceType<typeof Multiselect> | null>(null);
let dropdownEl: HTMLElement | null = null;
// eslint-disable-next-line vue/no-dupe-keys
let placeholder: Comment | null = null;
let originalParent: HTMLElement | null = null;

const updatePosition = () => {
  if (!dropdownEl || !msRef.value) return;

  const trigger = msRef.value.$el?.querySelector(".multiselect__tags") as HTMLElement;
  if (!trigger) return;

  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const dropdownHeight = Math.min(dropdownEl.scrollHeight, props.maxHeight);
  const openAbove = spaceBelow < dropdownHeight && rect.top > spaceBelow;

  const top = openAbove
    ? Math.max(4, rect.top - dropdownHeight - 4)
    : Math.min(window.innerHeight - dropdownHeight - 4, rect.bottom + 4);

  Object.assign(dropdownEl.style, {
    position: "fixed",
    top: `${top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    maxHeight: `${props.maxHeight}px`,
    zIndex: "10000",
  });

  dropdownEl.classList.toggle("opened-above", openAbove);
};

const handleScroll = () => requestAnimationFrame(updatePosition);

const enableFloating = () => {
  if (!props.teleportToBody) return;

  nextTick(() => {
    dropdownEl = msRef.value?.$el?.querySelector(".multiselect__content-wrapper");
    if (!dropdownEl) return;

    // Teleport to body
    if (!placeholder) {
      originalParent = dropdownEl.parentElement;
      placeholder = document.createComment("v-multiselect-anchor");
      originalParent?.replaceChild(placeholder, dropdownEl);
      document.body.appendChild(dropdownEl);
    }

    dropdownEl.classList.add("v-ms-floating");
    updatePosition();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
  });
};

const disableFloating = () => {
  if (!dropdownEl) return;

  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleScroll);

  dropdownEl.classList.remove("v-ms-floating", "opened-above");
  dropdownEl.removeAttribute("style");

  // Return to original position
  if (placeholder && originalParent) {
    originalParent.replaceChild(dropdownEl, placeholder);
  }

  placeholder = null;
  originalParent = null;
  dropdownEl = null;
};

const handleOpen = () => {
  enableFloating();
  emit("open");
};

const handleClose = () => {
  disableFloating();
  emit("close");
};

onBeforeUnmount(() => disableFloating());
</script>

<template>
  <div class="v-multiselect-wrapper">
    <Multiselect
      ref="msRef"
      :clear-on-select="props.clearOnSelect"
      :close-on-select="props.closeOnSelect"
      :disabled="props.disabled"
      :label="props.label"
      :loading="props.loading"
      :max-height="props.maxHeight"
      :model-value="props.modelValue"
      :multiple="props.multiple"
      :options="props.options"
      :options-limit="props.optionsLimit"
      :placeholder="props.placeholder"
      :searchable="props.searchable"
      :show-labels="false"
      :taggable="props.taggable"
      :track-by="props.trackBy"
      v-bind="$attrs"
      @close="handleClose"
      @open="handleOpen"
      @remove="handleRemove"
      @select="handleSelect"
      @update:model-value="handleInput"
      @search-change="handleSearchChange"
    >
      <!-- Custom caret / loader -->
      <template #caret>
        <div class="multiselect__select">
          <VIcon
            :loading="props.loading"
            class="w-5 h-5 text-neutral/60 transition-transform duration-200"
            icon="mdi:chevron-down"
          />
        </div>
      </template>

      <!-- Forward any provided slots -->
      <template
        v-for="(slotName, index) in Object.keys($slots)"
        :key="index"
        #[slotName]="slotProps"
      >
        <slot
          :name="slotName"
          v-bind="slotProps"
        />
      </template>
    </Multiselect>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style lang="scss" scoped>
/* Scoped: input & internal (non-portal) styling */
.multiselect {
  @apply rounded-lg;
}

.v-multiselect-wrapper {
  @apply w-full;
  :deep(.multiselect) {
    @apply min-h-[44px] relative;
    border: none !important;
    box-shadow: none !important;

    .multiselect__tags {
      @apply bg-base-100 border border-base-300 rounded-lg shadow-sm
      text-neutral transition-all duration-200 min-h-[44px] px-3 py-2;
      &:hover {
        @apply border-primary;
      }

      &:focus-within {
        box-shadow: 0 0 0 3px hsl(var(--p) / 0.2);
      }
    }

    .multiselect__single {
      @apply bg-transparent text-neutral text-sm font-normal mb-0 leading-normal pt-1;
      border: none !important;
    }

    .multiselect__input {
      @apply bg-transparent text-neutral text-sm border-none outline-none ring-0 mb-0 py-1 px-0;
      &::placeholder {
        color: hsl(var(--n) / 0.5);
      }
    }

    .multiselect__placeholder {
      @apply text-sm font-normal mb-0 pt-1;
      color: hsl(var(--n) / 0.5);
    }

    .multiselect__content-wrapper {
      @apply bg-base-100 border border-base-300 rounded-lg shadow-lg mt-1
      overflow-y-auto overflow-x-hidden;
      border-top: none !important;
    }

    .multiselect__content {
      @apply bg-base-100;
    }

    .multiselect__option {
      @apply text-neutral text-sm font-normal px-4 py-2.5 transition-colors
      duration-150 cursor-pointer hover:bg-base-200;
    }

    .multiselect__option.multiselect__option--highlight {
      @apply bg-base-200 text-neutral;
    }

    .multiselect__option.multiselect__option--selected {
      @apply bg-primary text-white font-medium;
    }

    .multiselect__option.multiselect__option--selected.multiselect__option--highlight {
      background-color: #fca5a5;
      color: #991b1b;
    }

    .multiselect__option.multiselect__option--group {
      @apply bg-base-200 text-primary font-semibold cursor-pointer;
      padding: 8px 16px;

      &:hover {
        @apply bg-base-300;
      }

      &.multiselect__option--highlight {
        @apply bg-base-300 text-primary;
      }

      &.multiselect__option--selected {
        @apply bg-primary/10 text-primary;
      }
    }

    .multiselect__option.multiselect__option--disabled {
      @apply cursor-not-allowed bg-transparent;
      color: hsl(var(--n) / 0.3);
    }

    .multiselect__tag {
      @apply bg-primary text-white text-sm font-medium rounded-md mb-0 mr-2
      inline-flex items-center;
      padding: 4px 28px 4px 12px;
      gap: 8px;
      position: relative;
    }

    .multiselect__tag-icon {
      @apply cursor-pointer rounded-full transition-all duration-150;
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;

      &::after {
        @apply text-white;
        font-size: 16px;
        line-height: 1;
      }

      &:hover {
        background-color: hsl(var(--p) / 0.8);
        transform: translateY(-50%) scale(1.1);
      }
    }

    .multiselect__spinner {
      display: none !important;
    }

    .multiselect__select {
      @apply absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center
      justify-center cursor-pointer transition-all duration-200;
      &::before {
        display: none;
      }

      svg {
        color: hsl(var(--n) / 0.6);
      }
    }

    &.multiselect--active {
      .multiselect__tags {
        @apply border-primary;
        box-shadow: 0 0 0 3px hsl(var(--p) / 0.2);
      }

      .multiselect__select svg {
        @apply rotate-180;
      }
    }

    &.multiselect--above {
      .multiselect__content-wrapper {
        border: none !important;
        @apply border border-base-300 rounded-lg;
      }
    }

    &.multiselect--disabled {
      .multiselect__tags {
        @apply bg-base-200 cursor-not-allowed opacity-60;
      }

      .multiselect__select {
        @apply cursor-not-allowed opacity-60;
      }
    }
  }
}
</style>

<style lang="scss">
/* Global: portal dropdown & animation overrides */
.multiselect-enter-active, .multiselect-leave-active {
  transition: none !important;
}

.multiselect__content-wrapper.v-ms-floating {
  @apply bg-base-100 border border-base-300 rounded-lg shadow-lg box-border
  fixed m-0 overflow-y-auto overflow-x-hidden;
  /* Position set inline */
  border-top: none;
  z-index: 10000 !important;
}

.multiselect__content-wrapper.v-ms-floating.opened-above {
  @apply shadow-lg;
  border-bottom: none;
  border-top: 1px solid hsl(var(--b3));
}

.multiselect__content-wrapper.v-ms-floating .multiselect__content {
  list-style: none;
  padding: 0;
  margin: 0;
  min-width: 100%;
  background: transparent;
}

.multiselect__content-wrapper.v-ms-floating .multiselect__option {
  @apply px-4 py-2.5 text-sm text-neutral font-normal cursor-pointer transition-colors duration-150;
  background: transparent;
}

.multiselect__content-wrapper.v-ms-floating .multiselect__option.multiselect__option--highlight {
  @apply bg-base-200 text-neutral;
}

.multiselect__content-wrapper.v-ms-floating .multiselect__option:hover {
  @apply bg-base-200;
}

.multiselect__content-wrapper.v-ms-floating .multiselect__option.multiselect__option--selected {
  @apply bg-primary text-white font-medium;
}

.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--selected.multiselect__option--highlight {
  background-color: #fca5a5;
  color: #991b1b;
}

.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--group {
  @apply bg-base-200 text-primary font-semibold cursor-pointer;
  padding: 8px 16px;
}

.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--group:hover,
.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--group.multiselect__option--highlight {
  @apply bg-base-300 text-primary;
}

.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--group.multiselect__option--selected {
  @apply bg-primary/10 text-primary;
}

.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--disabled {
  @apply cursor-not-allowed;
  opacity: .4;
}

.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--highlight::after,
.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--selected::after {
  content: none !important;
}
</style>
