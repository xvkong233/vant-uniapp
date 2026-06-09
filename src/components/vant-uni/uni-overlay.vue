<template>
  <view v-if="show" class="van-overlay" :style="rootStyle" @tap="emit('click')">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { normalizeStyle } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    customStyle?: string | Record<string, string | number>;
    duration?: Numeric;
    zIndex?: number;
    lockScroll?: boolean;
    rootPortal?: boolean;
  }>(),
  {
    duration: 300,
    zIndex: 1,
    customStyle: '',
  }
);

const emit = defineEmits<{
  (event: 'click'): void;
}>();

const rootStyle = computed(() =>
  [
    `z-index: ${props.zIndex}`,
    `transition-duration: ${props.duration}ms`,
    normalizeStyle(props.customStyle),
  ]
    .filter(Boolean)
    .join(';')
);
</script>

<style lang="less" scoped>
.van-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
}
</style>
