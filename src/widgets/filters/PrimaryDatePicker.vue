<script setup lang="ts">
import { ref } from "vue";

import { VDatepicker } from "@/shared/ui/date-picker";

const date = ref(null);
</script>

<template>
  <VDatepicker
    v-model="date"
    range
    size="md"
    :enable-time-picker="false"
    :time-config="{ enableTimePicker: false }"
  />
</template>

<style scoped lang="scss">

</style>
