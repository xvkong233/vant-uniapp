<template>
  <view :class="rootClass" :style="rootStyle" @tap="handleTap">
    <view :class="contentClass">
      <slot>
        <UniIcon
          v-if="icon"
          :name="icon"
          :color="iconColor"
          :size="grid?.iconSize.value"
          :dot="dot"
          :info="badge ?? info"
          class="van-grid-item__icon"
        />
        <text v-if="text" class="van-grid-item__text">{{ text }}</text>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import UniIcon from './uni-icon.vue';
import { gridKey } from './shared/context';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    icon?: string;
    iconColor?: string;
    iconPrefix?: string;
    dot?: boolean;
    info?: Numeric | null;
    badge?: Numeric | null;
    text?: string;
    useSlot?: boolean;
  }>(),
  {
    icon: '',
    iconPrefix: 'van-icon',
    text: '',
    info: null,
    badge: null,
  }
);

const emit = defineEmits<{
  (event: 'click'): void;
}>();

const grid = inject(gridKey, undefined);

const rootClass = computed(() => [
  'van-grid-item',
  {
    'van-grid-item--square': grid?.square.value,
  },
]);

const rootStyle = computed(() => {
  const columnNum = grid?.columnNum.value || 4;
  const styles = [`flex-basis: ${100 / columnNum}%`];
  const gutter = addUnit(grid?.gutter.value || 0);

  if (gutter) {
    styles.push(`padding-right: ${gutter}`);
    styles.push(`margin-bottom: ${gutter}`);
  }

  return styles.join(';');
});

const contentClass = computed(() => [
  'van-grid-item__content',
  grid?.direction.value ? `van-grid-item__content--${grid.direction.value}` : '',
  {
    'van-grid-item__content--center': grid?.center.value,
    'van-grid-item__content--clickable': grid?.clickable.value,
    'van-grid-item__content--border': grid?.border.value,
    'van-grid-item__content--reverse': grid?.reverse.value,
  },
]);

function handleTap() {
  emit('click');
}
</script>

<style lang="less" scoped>
.van-grid-item {
  position: relative;
  box-sizing: border-box;

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    padding: 16px 8px;
    background: #fff;

    &--center {
      align-items: center;
      justify-content: center;
    }

    &--horizontal {
      flex-direction: row;
    }

    &--reverse {
      flex-direction: column-reverse;
    }

    &--border::after {
      position: absolute;
      inset: 0;
      border: 1px solid #ebedf0;
      content: '';
      pointer-events: none;
    }

    &--clickable:active {
      background: #f2f3f5;
    }
  }

  &__icon {
    font-size: 28px;
  }

  &__text {
    margin-top: 8px;
    color: #646566;
    font-size: 12px;
    line-height: 18px;
  }
}
</style>
