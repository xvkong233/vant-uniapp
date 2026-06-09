<template>
  <view class="van-tree-select" :style="`height: ${addUnit(height)}`">
    <scroll-view scroll-y class="van-tree-select__nav">
      <view
        v-for="(item, index) in items"
        :key="index"
        :class="['van-tree-select__nav-item', { 'van-tree-select__nav-item--active': index === mainActiveIndex, 'van-tree-select__nav-item--disabled': item.disabled }]"
        @tap="clickNav(item, index)"
      >
        {{ item.text }}
      </view>
    </scroll-view>
    <scroll-view scroll-y class="van-tree-select__content">
      <view
        v-for="item in subItems"
        :key="String(item.id ?? item.value ?? item.text)"
        :class="['van-tree-select__item', { 'van-tree-select__item--active': isSelected(item), 'van-tree-select__item--disabled': item.disabled }]"
        @tap="clickItem(item)"
      >
        <text>{{ item.text }}</text>
        <UniIcon v-if="isSelected(item)" :name="selectedIcon" class="van-tree-select__selected" />
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';
import { addUnit } from './shared/utils';
import type { Numeric, OptionItem } from './shared/types';

const props = withDefaults(
  defineProps<{
    items?: OptionItem[];
    activeId?: Numeric | Numeric[];
    mainActiveIndex?: number;
    height?: Numeric;
    max?: number;
    selectedIcon?: string;
  }>(),
  {
    items: () => [],
    mainActiveIndex: 0,
    height: 300,
    max: Infinity,
    selectedIcon: 'success',
  }
);

const emit = defineEmits<{
  (event: 'click-item', value: OptionItem): void;
  (event: 'click-nav', value: { index: number }): void;
}>();

const subItems = computed(() => props.items[props.mainActiveIndex]?.children || []);

function isSelected(item: OptionItem) {
  const id = (item.id ?? item.value) as Numeric;
  return Array.isArray(props.activeId) ? props.activeId.includes(id) : props.activeId === id;
}

function clickItem(item: OptionItem) {
  if (!item.disabled) emit('click-item', item);
}

function clickNav(item: OptionItem, index: number) {
  if (!item.disabled) emit('click-nav', { index });
}
</script>

<style lang="less" scoped>
.van-tree-select {
  display: flex;
  background: #fff;

  &__nav {
    width: 86px;
    background: #f7f8fa;
  }

  &__nav-item {
    padding: 14px 12px;
    color: #323233;
    font-size: 14px;
  }

  &__nav-item--active {
    background: #fff;
    font-weight: 500;
  }

  &__content {
    flex: 1;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    font-size: 14px;
  }

  &__item--active {
    color: #ee0a24;
  }

  &__item--disabled,
  &__nav-item--disabled {
    color: #c8c9cc;
  }
}
</style>
