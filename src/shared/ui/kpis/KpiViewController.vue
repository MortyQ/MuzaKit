<script setup lang="ts">
import { computed } from "vue";

import VSwitch from "@/shared/ui/common/VSwitch.vue";

interface Props {
  modelValue?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const showDetailed = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <div
    class="flex items-center gap-3 bg-white dark:bg-cardBg rounded-lg
    border border-slate-200 dark:border-cardBorder px-4 py-2.5 shadow-sm"
  >
    <span class="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
      View Density
    </span>
    <div class="flex items-center gap-3">
      <VSwitch v-model="showDetailed" />
      <span class="text-sm font-medium text-mainText w-[70px]">
        {{ showDetailed ? 'Detailed' : 'Compact' }}
      </span>
    </div>
  </div>
</template>

