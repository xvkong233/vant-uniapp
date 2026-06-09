<template>
  <text v-if="dot || info !== null" :class="rootClass" :style="customStyle">
    {{ dot ? '' : info }}
  </text>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    dot?: boolean;
    info?: Numeric | null;
    customStyle?: string;
  }>(),
  {
    info: null,
    customStyle: '',
  }
);

const rootClass = computed(() => ['van-info', { 'van-info--dot': props.dot }]);
</script>

<style lang="less" scoped>
.van-info {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 16px;
  padding: 0 3px;
  color: #fff;
  font-size: 10px;
  line-height: 14px;
  background: #ee0a24;
  border: 1px solid #fff;
  border-radius: 16px;

  &--dot {
    width: 8px;
    min-width: 0;
    height: 8px;
    padding: 0;
    border-radius: 100%;
  }
}
</style>
