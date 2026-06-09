<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    @tap="handleTap"
    @touchstart="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <view class="van-slider__bar" :style="barStyle">
      <view class="van-slider__button-wrapper">
        <slot name="button">
          <view class="van-slider__button" />
        </slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    range?: boolean;
    value?: number | number[];
    modelValue?: number | number[];
    disabled?: boolean;
    useButtonSlot?: boolean;
    activeColor?: string;
    inactiveColor?: string;
    max?: number;
    min?: number;
    step?: number;
    vertical?: boolean;
    barHeight?: Numeric;
  }>(),
  {
    value: 0,
    max: 100,
    min: 0,
    step: 1,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: number | number[]): void;
  (event: 'change', value: number | number[]): void;
  (event: 'drag-start'): void;
  (event: 'drag', value: { value: number | number[] }): void;
  (event: 'drag-end'): void;
}>();

const current = computed(() => props.modelValue ?? props.value);
const dragging = ref(false);
const currentRange = computed<[number, number]>(() => {
  if (Array.isArray(current.value)) {
    return [Number(current.value[0] ?? props.min), Number(current.value[1] ?? props.min)];
  }
  return [props.min, Number(current.value)];
});
const startPercent = computed(() => (props.range ? ((currentRange.value[0] - props.min) / (props.max - props.min)) * 100 : 0));
const percent = computed(() => ((currentRange.value[1] - props.min) / (props.max - props.min)) * 100);

const rootClass = computed(() => [
  'van-slider',
  {
    'van-slider--disabled': props.disabled,
    'van-slider--vertical': props.vertical,
  },
]);

const rootStyle = computed(() =>
  [
    props.inactiveColor ? `background: ${props.inactiveColor}` : '',
    props.barHeight ? `${props.vertical ? 'width' : 'height'}: ${addUnit(props.barHeight)}` : '',
  ]
    .filter(Boolean)
    .join(';')
);

const barStyle = computed(() =>
  [
    props.vertical ? `height: ${percent.value - startPercent.value}%` : `width: ${percent.value - startPercent.value}%`,
    props.vertical ? `bottom: ${startPercent.value}%` : `left: ${startPercent.value}%`,
    props.activeColor ? `background: ${props.activeColor}` : '',
  ]
    .filter(Boolean)
    .join(';')
);

function format(value: number) {
  const raw = Math.max(props.min, Math.min(props.max, value));
  return props.min + Math.round((raw - props.min) / props.step) * props.step;
}

function handleTap() {
  if (props.disabled) {
    return;
  }
  const base = props.range ? currentRange.value[1] : Number(current.value);
  const next = format(base + props.step);
  const value = next > props.max ? props.min : next;
  const payload = props.range ? [currentRange.value[0], value].sort((a, b) => a - b) : value;
  emit('update:modelValue', payload);
  emit('change', payload);
}

function onTouchStart() {
  if (props.disabled) return;
  dragging.value = true;
  emit('drag-start');
}

function onTouchMove() {
  if (!dragging.value || props.disabled) return;
  emit('drag', { value: current.value });
}

function onTouchEnd() {
  if (!dragging.value || props.disabled) return;
  dragging.value = false;
  emit('drag-end');
}
</script>

<style lang="less" scoped>
.van-slider {
  position: relative;
  width: 100%;
  height: 2px;
  background: #ebedf0;
  border-radius: 999px;

  &--vertical {
    width: 2px;
    height: 100px;
  }

  &--disabled {
    opacity: 0.5;
  }

  &__bar {
    position: relative;
    width: 0;
    height: 100%;
    background: #1989fa;
    border-radius: inherit;
  }

  &--vertical &__bar {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 0;
  }

  &__button-wrapper {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate3d(50%, -50%, 0);
  }

  &__button {
    width: 24px;
    height: 24px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
}
</style>
