<template>
  <view class="van-swipe-cell">
    <view v-if="$slots.left" class="van-swipe-cell__left" @tap="open('left')">
      <slot name="left" />
    </view>
    <view
      class="van-swipe-cell__wrapper"
      :style="wrapperStyle"
      @touchstart="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @tap="handleClick('cell')"
    >
      <slot />
    </view>
    <view v-if="$slots.right" class="van-swipe-cell__right" @tap="open('right')">
      <slot name="right" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    leftWidth?: number;
    rightWidth?: number;
    asyncClose?: boolean;
    name?: Numeric;
  }>(),
  {
    leftWidth: 0,
    rightWidth: 0,
    name: '',
  }
);

const emit = defineEmits<{
  (event: 'open', value: { position: 'left' | 'right'; name: Numeric }): void;
  (event: 'close', value: { position: string; name: Numeric }): void;
  (event: 'click', value: string): void;
}>();

const offset = ref(0);
const startX = ref(0);
const startY = ref(0);
const startOffset = ref(0);
const dragging = ref(false);
const wrapperStyle = computed(() => `transform: translate3d(${offset.value}px, 0, 0)`);

function open(position: 'left' | 'right') {
  if (props.disabled) return;
  offset.value = position === 'left' ? props.leftWidth : -props.rightWidth;
  emit('open', { position, name: props.name });
}

function close(position = 'outside') {
  offset.value = 0;
  emit('close', { position, name: props.name });
}

function getTouch(event: TouchEvent) {
  return event.changedTouches?.[0] || event.touches?.[0];
}

function clampOffset(value: number) {
  return Math.max(-props.rightWidth, Math.min(props.leftWidth, value));
}

function onTouchStart(event: TouchEvent) {
  if (props.disabled) return;
  const touch = getTouch(event);
  if (!touch) return;
  startX.value = touch.clientX;
  startY.value = touch.clientY;
  startOffset.value = offset.value;
  dragging.value = true;
}

function onTouchMove(event: TouchEvent) {
  if (!dragging.value || props.disabled) return;
  const touch = getTouch(event);
  if (!touch) return;
  const deltaX = touch.clientX - startX.value;
  const deltaY = touch.clientY - startY.value;
  if (Math.abs(deltaY) > Math.abs(deltaX)) return;
  offset.value = clampOffset(startOffset.value + deltaX);
}

function onTouchEnd() {
  if (!dragging.value || props.disabled) return;
  dragging.value = false;

  if (offset.value > props.leftWidth / 2 && props.leftWidth > 0) {
    open('left');
  } else if (offset.value < -props.rightWidth / 2 && props.rightWidth > 0) {
    open('right');
  } else if (offset.value !== 0) {
    close('outside');
  }
}

function handleClick(position: string) {
  emit('click', position);
  if (offset.value) {
    close(position);
  }
}

defineExpose({ open, close });
</script>

<style lang="less" scoped>
.van-swipe-cell {
  position: relative;
  overflow: hidden;

  &__wrapper {
    position: relative;
    background: #fff;
    transition: transform 0.3s;
    z-index: 1;
  }

  &__left,
  &__right {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
  }

  &__left {
    left: 0;
  }

  &__right {
    right: 0;
  }
}
</style>
