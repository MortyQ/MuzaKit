<script lang="ts" setup>
import { ref, nextTick, onBeforeUnmount } from "vue";
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
  teleportToBody: true, // enable floating by default to fix overlap issues
});

const emit = defineEmits<{
  "update:modelValue": [value: Option | Option[] | null]
  "select": [option: Option]
  "remove": [option: Option]
  "search-change": [query: string]
}>();

// Forward all events
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


const msRef = ref<any>(null);
let floatingEl: HTMLElement | null = null;
let placeholderNode: Comment | null = null;
let originalParent: HTMLElement | null = null;
let originalWidthPx: string | null = null;
let pendingFrame = false;

function updateWidth() {
  if (!floatingEl || !msRef.value) return;
  const rootEl: HTMLElement | null = msRef.value.$el.querySelector(".multiselect__tags") || msRef.value.$el;
  if (!rootEl) return;
  const rect = rootEl.getBoundingClientRect();
  originalWidthPx = `${rect.width}px`;
  floatingEl.style.width = originalWidthPx;
  floatingEl.style.minWidth = originalWidthPx;
}

function schedulePosition(recomputeWidth = false) {
  if (recomputeWidth && floatingEl) updateWidth();
  if (pendingFrame) return;
  pendingFrame = true;
  requestAnimationFrame(() => {
    pendingFrame = false;
    computeFloatingPosition();
  });
}

function onScroll() { schedulePosition(false); }
function onResize() { schedulePosition(true); }

function attachScrollListeners() {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}
function detachScrollListeners() {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
}

function computeFloatingPosition() {
  if (!floatingEl || !msRef.value) return;
  const rootEl: HTMLElement | null = msRef.value.$el.querySelector(".multiselect__tags") || msRef.value.$el;
  if (!rootEl) return;
  const rect = rootEl.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const gap = 4;
  const dropdownHeight = Math.min(floatingEl.scrollHeight, props.maxHeight);
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;
  const openAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
  const top = openAbove
    ? Math.max(4, rect.top - dropdownHeight - gap)
    : Math.min(viewportHeight - dropdownHeight - 4, rect.bottom + gap);
  // Only update position; width maintained unless resize triggers updateWidth().
  Object.assign(floatingEl.style, {
    position: "fixed",
    top: `${top}px`,
    left: `${rect.left}px`,
    maxHeight: `${props.maxHeight}px`,
    zIndex: "10000",
  });
  floatingEl.classList.toggle("opened-above", openAbove);
}

function enableFloating() {
  if (!props.teleportToBody) return;
  nextTick(() => {
    const rootEl: HTMLElement | null = msRef.value?.$el.querySelector(".multiselect__tags") || msRef.value?.$el;
    floatingEl = msRef.value?.$el.querySelector(".multiselect__content-wrapper");
    if (!floatingEl || !rootEl) return;
    const rect = rootEl.getBoundingClientRect();
    originalWidthPx = `${rect.width}px`;
    floatingEl.style.width = originalWidthPx;
    floatingEl.style.minWidth = originalWidthPx;
    floatingEl.style.visibility = "hidden";
    if (!placeholderNode) {
      originalParent = floatingEl.parentElement as HTMLElement;
      placeholderNode = document.createComment("multiselect-portal-anchor");
      originalParent?.replaceChild(placeholderNode, floatingEl);
      document.body.appendChild(floatingEl);
    }
    floatingEl.classList.add("v-ms-floating");
    computeFloatingPosition();
    attachScrollListeners();
    requestAnimationFrame(() => { floatingEl && (floatingEl.style.visibility = ""); });
  });
}

function disableFloating() {
  if (!floatingEl) return;
  detachScrollListeners();
  floatingEl.classList.remove("v-ms-floating", "opened-above");
  floatingEl.style.position = "";
  floatingEl.style.top = "";
  floatingEl.style.left = "";
  floatingEl.style.zIndex = "";
  floatingEl.style.maxHeight = "";
  floatingEl.style.visibility = "";
  if (placeholderNode && originalParent) {
    originalParent.replaceChild(floatingEl, placeholderNode);
  }
  placeholderNode = null;
  originalParent = null;
  floatingEl = null;
}

function handleOpen() { enableFloating(); }
function handleClose() { disableFloating(); }

onBeforeUnmount(() => disableFloating());
</script>

<template>
  <div class="v-multiselect-wrapper">
    <Multiselect
      ref="msRef"
      :model-value="props.modelValue"
      :options="props.options"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :multiple="props.multiple"
      :searchable="props.searchable"
      :clear-on-select="props.clearOnSelect"
      :close-on-select="props.closeOnSelect"
      :label="props.label"
      :track-by="props.trackBy"
      :loading="props.loading"
      :taggable="props.taggable"
      :max-height="props.maxHeight"
      :options-limit="props.optionsLimit"
      :show-labels="false"
      v-bind="$attrs"
      @update:model-value="handleInput"
      @select="handleSelect"
      @remove="handleRemove"
      @search-change="handleSearchChange"
      @open="handleOpen"
      @close="handleClose"
    >
      <!-- Custom caret / loader -->
      <template #caret>
        <div class="multiselect__select">
          <VIcon
            :loading="props.loading"
            icon="mdi:chevron-down"
            class="w-5 h-5 text-neutral/60 transition-transform duration-200"
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
      &:hover { @apply border-primary; }
      &:focus-within { box-shadow: 0 0 0 3px hsl(var(--p) / 0.2); }
    }

    .multiselect__single {
      @apply bg-transparent text-neutral text-sm font-normal mb-0 leading-normal pt-1;
      border: none !important;
    }

    .multiselect__input {
      @apply bg-transparent text-neutral text-sm border-none outline-none ring-0 mb-0 py-1 px-0;
      &::placeholder { color: hsl(var(--n) / 0.5); }
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

    .multiselect__content { @apply bg-base-100; }

    .multiselect__option {
      @apply text-neutral text-sm font-normal px-4 py-2.5 transition-colors
        duration-150 cursor-pointer hover:bg-base-200;
    }
    .multiselect__option.multiselect__option--highlight { @apply bg-base-200 text-neutral; }
    .multiselect__option.multiselect__option--selected { @apply bg-primary text-white font-medium; }
    .multiselect__option.multiselect__option--selected.multiselect__option--highlight {
      background-color: #fca5a5; color: #991b1b;
    }
    .multiselect__option.multiselect__option--group
    {
      @apply bg-base-200 text-primary font-semibold;
    }
    .multiselect__option.multiselect__option--disabled {
      @apply cursor-not-allowed bg-transparent; color: hsl(var(--n) / 0.3);
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
      &::after { @apply text-white; font-size: 16px; line-height: 1; }
      &:hover {
        background-color: hsl(var(--p) / 0.8);
        transform: translateY(-50%) scale(1.1);
      }
    }

    .multiselect__spinner { display: none !important; }

    .multiselect__select {
      @apply absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center
        justify-center cursor-pointer transition-all duration-200;
      &::before { display: none; }
      svg { color: hsl(var(--n) / 0.6); }
    }

    &.multiselect--active {
      .multiselect__tags { @apply border-primary; box-shadow: 0 0 0 3px hsl(var(--p) / 0.2); }
      .multiselect__select svg { @apply rotate-180; }
    }

    &.multiselect--above {
      .multiselect__content-wrapper
      {
        border: none !important;
        @apply border border-base-300 rounded-lg;
      }
    }

    &.multiselect--disabled {
      .multiselect__tags { @apply bg-base-200 cursor-not-allowed opacity-60; }
      .multiselect__select { @apply cursor-not-allowed opacity-60; }
    }
  }
}
</style>

<style lang="scss">
/* Global: portal dropdown & animation overrides */
.multiselect-enter-active, .multiselect-leave-active { transition: none !important; }

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
  background-color: #fca5a5; color: #991b1b;
}
.multiselect__content-wrapper.v-ms-floating .multiselect__option.multiselect__option--disabled {
  @apply cursor-not-allowed; opacity: .4;
}
.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--highlight::after,
.multiselect__content-wrapper.v-ms-floating
.multiselect__option.multiselect__option--selected::after { content: none !important; }
</style>
