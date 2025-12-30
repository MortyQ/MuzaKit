<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";

import ROW_STYLING from "@/docs/table/ts/rowStyling";
import VCard from "@/shared/ui/common/VCard.vue";
</script>

<template>
  <VCard class="documentation-page">
    <VueMarkdown
      :source="ROW_STYLING"
      class="markdown-body"
    />
  </VCard>
</template>

<style scoped lang="scss">
@use "./documentation-styles.scss";
</style>
