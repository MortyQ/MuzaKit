<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";

import PAGINATION from "@/docs/table/ts/pagination";
import VCard from "@/shared/ui/common/VCard.vue";
</script>

<template>
  <VCard class="documentation-page">
    <VueMarkdown
      :source="PAGINATION"
      class="markdown-body"
    />
  </VCard>
</template>

<style scoped lang="scss">
@use "./documentation-styles.scss";
</style>
