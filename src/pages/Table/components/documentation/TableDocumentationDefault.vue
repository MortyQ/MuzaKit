<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";

import GETTING_STARTED from "@/docs/table/ts/gettingStarted";
import VCard from "@/shared/ui/common/VCard.vue";
</script>

<template>
  <VCard class="documentation-page">
    <VueMarkdown
      :source="GETTING_STARTED"
      class="markdown-body"
    />
  </VCard>
</template>

<style scoped>
@import "./documentation-styles.scss";
</style>
