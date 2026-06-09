<template>
  <view :class="rootClass">
    <view
      v-for="(step, index) in steps"
      :key="index"
      :class="['van-step', { 'van-step--active': index === active, 'van-step--finish': index < active }]"
      @tap="emit('click-step', index)"
    >
      <view class="van-step__circle" :style="circleStyle(index)">
        <UniIcon v-if="index === active && activeIcon" :name="activeIcon" />
        <UniIcon v-else-if="inactiveIcon" :name="inactiveIcon" />
      </view>
      <view class="van-step__content">
        <view class="van-step__title">{{ getText(step, 'text') || getText(step, 'title') }}</view>
        <view v-if="getText(step, 'desc')" class="van-step__desc">{{ getText(step, 'desc') }}</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';

type StepItem = string | Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    icon?: string;
    steps?: StepItem[];
    active?: number;
    direction?: 'horizontal' | 'vertical';
    activeColor?: string;
    inactiveColor?: string;
    activeIcon?: string;
    inactiveIcon?: string;
  }>(),
  {
    steps: () => [],
    active: 0,
    direction: 'horizontal',
    activeColor: '#07c160',
    inactiveColor: '#969799',
    activeIcon: 'checked',
    inactiveIcon: '',
  }
);

const emit = defineEmits<{
  (event: 'click-step', value: number): void;
}>();

const rootClass = computed(() => ['van-steps', `van-steps--${props.direction}`]);

function getText(step: StepItem, key: string) {
  return typeof step === 'string' ? (key === 'text' ? step : '') : String(step[key] || '');
}

function circleStyle(index: number) {
  return `color: ${index <= props.active ? props.activeColor : props.inactiveColor}`;
}
</script>

<style lang="less" scoped>
.van-steps {
  display: flex;
  background: #fff;

  &--vertical {
    flex-direction: column;
  }
}

.van-step {
  position: relative;
  display: flex;
  flex: 1;
  align-items: flex-start;
  color: #969799;
  font-size: 12px;

  &--active {
    color: #323233;
  }

  &__circle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }

  &__circle::before {
    display: block;
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: 100%;
    content: '';
  }

  &__title {
    line-height: 20px;
  }

  &__desc {
    margin-top: 4px;
    color: #969799;
  }
}
</style>
