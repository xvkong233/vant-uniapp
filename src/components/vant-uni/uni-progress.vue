<template>
  <view class="van-progress" :style="rootStyle">
    <view class="van-progress__portion" :style="portionStyle">
      <view v-if="showPivot && displayText" class="van-progress__pivot" :style="pivotStyle">
        {{ displayText }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    inactive?: boolean;
    percentage?: number;
    pivotText?: string;
    pivotColor?: string;
    trackColor?: string;
    showPivot?: boolean;
    color?: string;
    textColor?: string;
    strokeWidth?: Numeric;
  }>(),
  {
    percentage: 0,
    showPivot: true,
    color: '#1989fa',
    textColor: '#fff',
    strokeWidth: 4,
    pivotText: '',
    pivotColor: '',
    trackColor: '',
  }
);

const normalizedPercentage = computed(() =>
  Math.max(0, Math.min(100, props.percentage))
);

const displayText = computed(() =>
  props.pivotText || `${normalizedPercentage.value}%`
);

const activeColor = computed(() => (props.inactive ? '#cacaca' : props.color));

const rootStyle = computed(() => {
  const styles = [`height: ${addUnit(props.strokeWidth)}`];
  if (props.trackColor) {
    styles.push(`background: ${props.trackColor}`);
  }
  return styles.join(';');
});

const portionStyle = computed(() => [
  `width: ${normalizedPercentage.value}%`,
  `background: ${activeColor.value}`,
].join(';'));

const pivotStyle = computed(() => [
  `color: ${props.textColor}`,
  `background: ${props.pivotColor || activeColor.value}`,
].join(';'));
</script>

<style lang="less" scoped>
.van-progress {
  position: relative;
  height: 4px;
  background: #ebedf0;
  border-radius: 4px;

  &__portion {
    position: absolute;
    left: 0;
    height: 100%;
    border-radius: inherit;
  }

  &__pivot {
    position: absolute;
    top: 50%;
    right: 0;
    box-sizing: border-box;
    min-width: 3.6em;
    padding: 0 5px;
    color: #fff;
    font-size: 10px;
    line-height: 1.6;
    text-align: center;
    word-break: keep-all;
    border-radius: 1em;
    transform: translate(50%, -50%);
  }
}
</style>
