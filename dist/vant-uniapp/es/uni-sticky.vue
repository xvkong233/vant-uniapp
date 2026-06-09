<template>
  <view class="van-sticky">
    <view :class="contentClass" :style="contentStyle">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    zIndex?: number;
    offsetTop?: number;
    disabled?: boolean;
    container?: unknown;
    scrollTop?: number;
  }>(),
  {
    zIndex: 99,
    offsetTop: 0,
  }
);

const emit = defineEmits<{
  (event: 'scroll', value: { scrollTop?: number; isFixed: boolean }): void;
}>();

const contentClass = computed(() => ['van-sticky__content', { 'van-sticky__content--fixed': !props.disabled }]);
const contentStyle = computed(() =>
  props.disabled ? '' : `top: ${props.offsetTop}px; z-index: ${props.zIndex}`
);

watch(
  () => props.scrollTop,
  (scrollTop) => {
    emit('scroll', { scrollTop, isFixed: !props.disabled });
  }
);
</script>

<style lang="less" scoped>
.van-sticky__content--fixed {
  position: sticky;
}
</style>
