<template>
  <view :class="rootClass" @tap="handleClick">
    <text>{{ title }}</text>
    <UniIcon v-if="dot || badge || info" :dot="dot" :info="badge ?? info" class="van-sidebar-item__info" />
  </view>
</template>

<script setup lang="ts">
import { computed, inject, getCurrentInstance } from 'vue';
import UniIcon from './uni-icon.vue';
import { sidebarKey } from './shared/context';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    dot?: boolean;
    badge?: Numeric | null;
    info?: Numeric | null;
    title?: string;
    disabled?: boolean;
  }>(),
  {
    badge: null,
    info: null,
    title: '',
  }
);

const emit = defineEmits<{
  (event: 'click', value: number): void;
  (event: 'change', value: number): void;
}>();

const sidebar = inject(sidebarKey, undefined);
const instance = getCurrentInstance();
const index = computed(() => Math.max((instance?.uid || 1) - 1, 0));
const selected = computed(() => sidebar?.activeKey.value === index.value);

const rootClass = computed(() => [
  'van-sidebar-item',
  {
    'van-sidebar-item--select': selected.value,
    'van-sidebar-item--disabled': props.disabled,
  },
]);

function handleClick() {
  if (props.disabled) {
    return;
  }
  sidebar?.update(index.value);
  emit('click', index.value);
  emit('change', index.value);
}
</script>

<style lang="less" scoped>
.van-sidebar-item {
  position: relative;
  display: block;
  box-sizing: border-box;
  padding: 20px 12px;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 20px;
  background: #f7f8fa;

  &--select {
    color: #323233;
    font-weight: 500;
    background: #fff;
  }

  &--select::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 4px;
    height: 16px;
    background: #ee0a24;
    transform: translateY(-50%);
    content: '';
  }

  &--disabled {
    color: #c8c9cc;
  }

  &__info {
    position: absolute;
    top: 16px;
    right: 8px;
  }
}
</style>
