<template>
  <view :class="rootClass">
    <view v-if="title" class="van-cell-group__title">{{ title }}</view>
    <view class="van-cell-group__content">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    border?: boolean;
    inset?: boolean;
  }>(),
  {
    title: '',
    border: true,
  }
);

const rootClass = computed(() => [
  'van-cell-group',
  {
    'van-cell-group--inset': props.inset,
    'van-cell-group--borderless': !props.border,
  },
]);
</script>

<style lang="less" scoped>
.van-cell-group {
  background: #fff;

  &--inset {
    margin: 0 16px;
    overflow: hidden;
    border-radius: 8px;
  }

  &__title {
    padding: 16px 16px 8px;
    color: #969799;
    font-size: 14px;
    line-height: 16px;
    background: #f7f8fa;
  }
}
</style>
