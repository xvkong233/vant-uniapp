<template>
  <view class="van-circle" :style="rootStyle">
    <view class="van-circle__layer" :style="layerStyle" />
    <view class="van-circle__progress" :style="progressStyle" />
    <view class="van-circle__text">
      <slot>{{ text || `${normalizedValue}%` }}</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    text?: string;
    lineCap?: 'round' | 'butt' | 'square';
    value?: number;
    speed?: number;
    size?: number;
    fill?: string;
    layerColor?: string;
    color?: string;
    type?: '2d' | '';
    strokeWidth?: number;
    clockwise?: boolean;
  }>(),
  {
    text: '',
    lineCap: 'round',
    value: 0,
    speed: 0,
    size: 100,
    layerColor: '#fff',
    color: '#1989fa',
    type: '',
    strokeWidth: 4,
    clockwise: true,
  }
);

const animatedValue = ref(props.value);
let timer: ReturnType<typeof setTimeout> | undefined;

watch(
  () => props.value,
  (value) => {
    if (!props.speed) {
      animatedValue.value = value;
      return;
    }

    if (timer) clearTimeout(timer);
    const start = animatedValue.value;
    const diff = value - start;
    const started = Date.now();
    const duration = Math.abs(diff / props.speed) * 1000;
    const tick = () => {
      const progress = duration ? Math.min(1, (Date.now() - started) / duration) : 1;
      animatedValue.value = start + diff * progress;
      if (progress < 1) {
        timer = setTimeout(tick, 16);
      }
    };
    tick();
  },
  { immediate: true }
);

const normalizedValue = computed(() => Math.max(0, Math.min(100, animatedValue.value)));
const rootStyle = computed(() => `width: ${props.size}px; height: ${props.size}px; background: ${props.fill || 'transparent'}`);
const layerStyle = computed(() => `border-width: ${props.strokeWidth}px; border-color: ${props.layerColor}`);
const progressStyle = computed(() => {
  const angle = normalizedValue.value * 3.6;
  const direction = props.clockwise ? '' : 'transform: scaleX(-1)';
  return `background: conic-gradient(${props.color} ${angle}deg, transparent 0deg); padding: ${props.strokeWidth}px; ${direction}`;
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style lang="less" scoped>
.van-circle {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &__layer,
  &__progress {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    border-radius: 50%;
  }

  &__layer {
    border-style: solid;
  }

  &__text {
    position: relative;
    color: #323233;
    font-size: 14px;
  }
}
</style>
