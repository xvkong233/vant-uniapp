<template>
  <view class="van-col" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { rowKey } from './shared/context';

const props = withDefaults(
  defineProps<{
    span?: number;
    offset?: number;
  }>(),
  {
    span: 0,
    offset: 0,
  }
);

const row = inject(rowKey, undefined);

const rootStyle = computed(() => {
  const styles: string[] = [];
  const span = props.span ? (props.span / 24) * 100 : 100;
  styles.push(`width: ${span}%`);

  if (props.offset) {
    styles.push(`margin-left: ${(props.offset / 24) * 100}%`);
  }

  const gutter = row?.gutter.value || 0;
  if (gutter) {
    styles.push(`padding-left: ${gutter / 2}px`);
    styles.push(`padding-right: ${gutter / 2}px`);
  }

  return styles.join(';');
});
</script>

<style lang="less" scoped>
.van-col {
  box-sizing: border-box;
  min-height: 1px;
}
</style>
