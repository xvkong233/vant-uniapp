<template>
  <view class="van-row" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { rowKey } from './shared/context';

const props = withDefaults(
  defineProps<{
    gutter?: number;
  }>(),
  {
    gutter: 0,
  }
);

provide(rowKey, {
  gutter: toRef(props, 'gutter'),
});

const rootStyle = computed(() =>
  props.gutter ? `margin-left: -${props.gutter / 2}px; margin-right: -${props.gutter / 2}px` : ''
);
</script>

<style lang="less" scoped>
.van-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
