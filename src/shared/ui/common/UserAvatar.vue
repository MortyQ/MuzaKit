<script setup lang="ts">
import { computed } from "vue";

interface Props {
  /** User name for initials fallback */
  name?: string
  /** Avatar image URL */
  avatar?: string
  /** Size preset */
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  /** Custom size in pixels */
  customSize?: number
  /** Show online status indicator */
  online?: boolean
  /** Alt text for avatar */
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: "",
  avatar: undefined,
  size: "md",
  customSize: undefined,
  online: false,
  alt: "User avatar",
});

// Size mappings
const sizeClasses = computed(() => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };
  return sizes[props.size];
});

const customSizeStyle = computed(() => {
  if (!props.customSize) return {};
  return {
    width: `${props.customSize}px`,
    height: `${props.customSize}px`,
    fontSize: `${props.customSize * 0.4}px`,
  };
});

// Generate initials from name
const initials = computed(() => {
  if (!props.name) return "?";

  const parts = props.name.trim().split(/\s+/);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return props.name.substring(0, 2).toUpperCase();
});

// Generate consistent color based on name
const avatarColor = computed(() => {
  if (!props.name) return "bg-base-200 text-secondaryText";

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use Tailwind-compatible colors
  const colors = [
    "bg-blue-500 text-white",
    "bg-purple-500 text-white",
    "bg-pink-500 text-white",
    "bg-green-500 text-white",
    "bg-orange-500 text-white",
    "bg-teal-500 text-white",
    "bg-indigo-500 text-white",
    "bg-cyan-500 text-white",
  ];

  return colors[Math.abs(hash) % colors.length];
});

const hasAvatar = computed(() => !!props.avatar);
</script>

<template>
  <div
    class="user-avatar relative inline-flex items-center justify-center
           rounded-full overflow-hidden flex-shrink-0 font-medium
           transition-all duration-200"
    :class="[sizeClasses, !hasAvatar && avatarColor]"
    :style="customSizeStyle"
  >
    <!-- Avatar Image -->
    <img
      v-if="hasAvatar"
      :src="avatar"
      :alt="alt"
      class="w-full h-full object-cover"
      @error="($event.target as HTMLImageElement).style.display = 'none'"
    >

    <!-- Initials Fallback -->
    <span
      v-if="!hasAvatar"
      class="select-none"
    >
      {{ initials }}
    </span>

    <!-- Online Status Indicator -->
    <span
      v-if="online"
      class="absolute bottom-0 right-0 block rounded-full bg-success
             ring-2 ring-base-100 transition-all"
      :class="{
        'w-1.5 h-1.5': size === 'xs',
        'w-2 h-2': size === 'sm',
        'w-2.5 h-2.5': size === 'md',
        'w-3 h-3': size === 'lg',
        'w-4 h-4': size === 'xl',
      }"
      aria-label="Online"
    />
  </div>
</template>

<style scoped>
.user-avatar {
  /* Ensure consistent rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
