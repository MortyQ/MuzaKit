<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";

import COLUMNS from "@/docs/table/ts/columns";
import VCard from "@/shared/ui/common/VCard.vue";
</script>

<template>
  <VCard class="documentation-page">
    <VueMarkdown
      :source="COLUMNS"
      class="markdown-body"
    />
  </VCard>
</template>

<style scoped lang="scss">
@import "./documentation-styles.scss";
</style>

