<template>
  <view :class="rootClass">
    <UniCell
      :title="title"
      :value="value"
      :label="label"
      :icon="icon"
      :size="size"
      :border="border && collapse?.border.value"
      :is-link="isLink"
      :clickable="clickable || !disabled"
      :arrow-direction="expanded ? 'up' : 'down'"
      @click="toggle"
    />
    <view v-show="expanded" class="van-collapse-item__content">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject } from 'vue';
import UniCell from './uni-cell.vue';
import { collapseKey } from './shared/context';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    size?: string;
    name?: Numeric;
    title?: Numeric;
    value?: Numeric;
    icon?: string;
    label?: string;
    disabled?: boolean;
    clickable?: boolean;
    border?: boolean;
    isLink?: boolean;
  }>(),
  {
    icon: '',
    label: '',
    border: true,
    isLink: true,
  }
);

const collapse = inject(collapseKey, undefined);
const instance = getCurrentInstance();
const itemName = computed(() => props.name ?? instance?.uid ?? 0);
const expanded = computed(() => {
  const value = collapse?.value.value;
  return collapse?.accordion.value
    ? value === itemName.value
    : Array.isArray(value) && value.includes(itemName.value);
});

const rootClass = computed(() => [
  'van-collapse-item',
  {
    'van-collapse-item--expanded': expanded.value,
    'van-collapse-item--disabled': props.disabled,
  },
]);

function toggle() {
  if (!props.disabled) {
    collapse?.update(itemName.value, !expanded.value);
  }
}
</script>

<style lang="less" scoped>
.van-collapse-item {
  &__content {
    padding: 12px 16px;
    color: #969799;
    font-size: 14px;
    line-height: 20px;
    background: #fff;
  }

  &--disabled {
    opacity: 0.5;
  }
}
</style>
