<template>
  <view class="van-index-anchor-wrapper">
    <view class="van-index-anchor">
      <slot>{{ index }}</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Numeric } from './shared/types';

withDefaults(
  defineProps<{
    useSlot?: boolean;
    index?: Numeric;
  }>(),
  {
    index: '',
  }
);
</script>

<style lang="less" scoped>
.van-index-anchor {
  box-sizing: border-box;
  padding: 0 16px;
  color: #323233;
  font-weight: 500;
  font-size: 14px;
  line-height: 32px;
  background: #f7f8fa;
}
</style>
