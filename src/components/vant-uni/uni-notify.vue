<template>
  <view v-if="show" :class="rootClass" :style="rootStyle" @tap="emit('click', $event)">
    <text>{{ message }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    message?: string;
    background?: string;
    type?: 'primary' | 'success' | 'danger' | 'warning';
    color?: string;
    duration?: number;
    zIndex?: number;
    safeAreaInsetTop?: boolean;
    top?: Numeric;
  }>(),
  {
    message: '',
    type: 'danger',
    color: '#fff',
    duration: 300,
    zIndex: 110,
  }
);

const emit = defineEmits<{
  (event: 'click', value: unknown): void;
}>();

const rootClass = computed(() => ['van-notify', `van-notify--${props.type}`, { 'van-notify--safe-top': props.safeAreaInsetTop }]);
const rootStyle = computed(() =>
  [
    `z-index: ${props.zIndex}`,
    `color: ${props.color}`,
    props.background ? `background: ${props.background}` : '',
    `transition-duration: ${props.duration}ms`,
    props.top !== undefined ? `top: ${addUnit(props.top)}` : '',
  ]
    .filter(Boolean)
    .join(';')
);
</script>

<style lang="less" scoped>
.van-notify {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  box-sizing: border-box;
  padding: 6px 16px;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  text-align: center;

  &--safe-top {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }

  &--danger {
    background: #ee0a24;
  }

  &--primary {
    background: #1989fa;
  }

  &--success {
    background: #07c160;
  }

  &--warning {
    background: #ff976a;
  }
}
</style>
