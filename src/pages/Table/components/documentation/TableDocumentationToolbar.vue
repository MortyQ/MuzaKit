<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";

import TOOLBAR from "@/docs/table/ts/toolbar";
import VCard from "@/shared/ui/common/VCard.vue";
</script>

<template>
  <VCard class="documentation-page">
    <VueMarkdown
      :source="TOOLBAR"
      class="markdown-body"
    />
  </VCard>
</template>

<style scoped lang="scss">
@import "./documentation-styles.scss";
</style>
