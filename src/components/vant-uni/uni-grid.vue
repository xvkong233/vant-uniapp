<template>
  <view :class="rootClass" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { gridKey } from './shared/context';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    square?: boolean;
    gutter?: Numeric;
    clickable?: boolean;
    columnNum?: number;
    center?: boolean;
    border?: boolean;
    direction?: string;
    iconSize?: Numeric;
    reverse?: boolean;
  }>(),
  {
    gutter: 0,
    columnNum: 4,
    center: true,
    border: true,
    direction: 'vertical',
  }
);

provide(gridKey, {
  square: toRef(props, 'square'),
  gutter: toRef(props, 'gutter'),
  clickable: toRef(props, 'clickable'),
  columnNum: toRef(props, 'columnNum'),
  center: toRef(props, 'center'),
  border: toRef(props, 'border'),
  direction: toRef(props, 'direction'),
  iconSize: toRef(props, 'iconSize'),
  reverse: toRef(props, 'reverse'),
});

const rootClass = computed(() => [
  'van-grid',
  {
    'van-grid--border': props.border,
  },
]);

const rootStyle = computed(() => {
  const gutter = addUnit(props.gutter);
  return gutter ? `padding-left: ${gutter}` : '';
});
</script>

<style lang="less" scoped>
.van-grid {
  display: flex;
  flex-wrap: wrap;
}
</style>
