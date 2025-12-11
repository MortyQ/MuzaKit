<script setup lang="ts">
import VDrawer from "@/shared/ui/common/VDrawer.vue";
import GlobalFilterSidebarHeader from "@/widgets/filters/components/GlobalFilterSidebarHeader.vue";
</script>

<template>
  <div>
    <VDrawer id="global-filter">
      <template #header>
        <GlobalFilterSidebarHeader />
      </template>

      <!-- Content -->
      <div class="p-6">
        GlobalFilterFeature
      </div>
    </VDrawer>
  </div>
</template>
