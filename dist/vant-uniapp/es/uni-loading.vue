<template>
  <view :class="rootClass" :style="rootStyle">
    <view :class="spinnerClass" :style="spinnerStyle">
      <view
        v-if="type === 'spinner'"
        v-for="item in 12"
        :key="item"
        class="van-loading__dot"
      />
    </view>
    <text v-if="$slots.default" class="van-loading__text" :style="textStyle">
      <slot />
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    color?: string;
    vertical?: boolean;
    type?: 'circular' | 'spinner';
    size?: Numeric;
    textSize?: Numeric;
  }>(),
  {
    type: 'circular',
  }
);

const rootClass = computed(() => [
  'van-loading',
  {
    'van-loading--vertical': props.vertical,
  },
]);

const spinnerClass = computed(() => [
  'van-loading__spinner',
  `van-loading__spinner--${props.type}`,
]);

const rootStyle = computed(() => (props.color ? `color: ${props.color}` : ''));
const spinnerStyle = computed(() => {
  const size = addUnit(props.size);
  return size ? `width: ${size}; height: ${size}` : '';
});
const textStyle = computed(() => {
  const size = addUnit(props.textSize);
  return size ? `font-size: ${size}` : '';
});
</script>

<style lang="less" scoped>
.van-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #c8c9cc;
  font-size: 0;
  line-height: 1;

  &--vertical {
    flex-direction: column;
  }

  &__spinner {
    position: relative;
    box-sizing: border-box;
    width: 30px;
    height: 30px;
    color: currentColor;
    animation: van-rotate 0.8s linear infinite;

    &--circular {
      border: 1px solid transparent;
      border-top-color: currentColor;
      border-radius: 100%;
    }

    &--spinner {
      animation-timing-function: steps(12);
    }
  }

  &__text {
    margin-left: 8px;
    color: #969799;
    font-size: 14px;
    line-height: 20px;
  }

  &--vertical &__text {
    margin: 8px 0 0;
  }

  &__dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &::before {
      display: block;
      width: 2px;
      height: 25%;
      margin: 0 auto;
      background-color: currentColor;
      border-radius: 40%;
      content: '';
    }
  }

  each(range(12), {
    &__dot:nth-of-type(@{value}) {
      transform: rotate(@value * 30deg);
      opacity: 1 - (0.75 / 12) * (@value - 1);
    }
  });
}

@keyframes van-rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
