<template>
  <view :class="rootClass" :style="rootStyle">
    <scroll-view scroll-x class="van-tabs__wrap">
      <view class="van-tabs__nav">
        <view
          v-for="(tab, index) in tabs"
          :key="tab.id"
          :class="['van-tab', { 'van-tab--active': isActive(tab), 'van-tab--disabled': tab.disabled }]"
          :style="titleStyle(tab)"
          @tap="select(tab, index)"
        >
          <text>{{ tab.title }}</text>
          <text v-if="tab.dot" class="van-tab__dot" />
          <text v-else-if="tab.info !== null && tab.info !== undefined" class="van-tab__info">{{ tab.info }}</text>
        </view>
        <view v-if="type === 'line'" class="van-tabs__line" :style="lineStyle" />
      </view>
    </scroll-view>
    <view :class="['van-tabs__content', { 'van-tabs__content--animated': animated }]">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, provide, reactive, toRef } from 'vue';
import { tabsKey, type TabDescriptor } from './shared/context';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

type TabValue = Numeric | boolean;

const props = withDefaults(
  defineProps<{
    sticky?: boolean;
    border?: boolean;
    swipeable?: boolean;
    titleActiveColor?: string;
    titleInactiveColor?: string;
    color?: string;
    animated?: boolean;
    lineWidth?: Numeric;
    lineHeight?: Numeric;
    active?: TabValue;
    modelValue?: TabValue;
    type?: 'line' | 'card';
    ellipsis?: boolean;
    duration?: number;
    zIndex?: number;
    swipeThreshold?: number;
    offsetTop?: Numeric;
    lazyRender?: boolean;
    useBeforeChange?: boolean;
  }>(),
  {
    active: 0,
    type: 'line',
    ellipsis: true,
    duration: 0.3,
    zIndex: 1,
    swipeThreshold: 5,
    offsetTop: 0,
    lineWidth: 40,
    lineHeight: 3,
    lazyRender: true,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: TabValue): void;
  (event: 'input', value: TabValue): void;
  (event: 'change', value: { name: TabValue; title: string; index: number }): void;
  (event: 'click', value: { name: TabValue; title: string; index: number }): void;
  (event: 'disabled', value: { name: TabValue; title: string; index: number }): void;
  (event: 'before-change', value: { name: TabValue; title: string; index: number; callback: (status: boolean) => void }): void;
  (event: 'scroll', value: { scrollTop?: number; isFixed?: boolean }): void;
}>();

const tabs = reactive<TabDescriptor[]>([]);
const current = computed(() => props.modelValue ?? props.active);

provide(tabsKey, {
  active: current,
  color: toRef(props, 'color'),
  titleActiveColor: toRef(props, 'titleActiveColor'),
  titleInactiveColor: toRef(props, 'titleInactiveColor'),
  lazyRender: toRef(props, 'lazyRender'),
  register(tab) {
    if (!tabs.some((item) => item.id === tab.id)) {
      tabs.push(tab);
    }
    return tabs.findIndex((item) => item.id === tab.id);
  },
  unregister(id) {
    const index = tabs.findIndex((item) => item.id === id);
    if (index !== -1) {
      tabs.splice(index, 1);
    }
  },
  update(nextTab, index) {
    const tab = tabs[index];
    if (tab) {
      Object.assign(tab, nextTab);
    }
  },
});

const activeIndex = computed(() => {
  const index = tabs.findIndex((tab, fallback) => tab.name === current.value || fallback === current.value);
  return index === -1 ? 0 : index;
});

const rootClass = computed(() => [
  'van-tabs',
  `van-tabs--${props.type}`,
  {
    'van-tabs--border': props.border,
    'van-tabs--sticky': props.sticky,
  },
]);

const rootStyle = computed(() => [`z-index: ${props.zIndex}`, props.sticky ? `top: ${addUnit(props.offsetTop)}` : ''].filter(Boolean).join(';'));
const lineStyle = computed(() =>
  [
    `width: ${addUnit(props.lineWidth)}`,
    `height: ${addUnit(props.lineHeight)}`,
    `background: ${props.color || '#ee0a24'}`,
    `transform: translateX(${activeIndex.value * 100}%)`,
    `transition-duration: ${props.duration}s`,
  ].join(';')
);

function isActive(tab: TabDescriptor) {
  return tab.name === current.value || tabs.indexOf(tab) === current.value;
}

function titleStyle(tab: TabDescriptor) {
  const color = isActive(tab) ? props.titleActiveColor : props.titleInactiveColor;
  return [tab.titleStyle || '', color ? `color: ${color}` : ''].filter(Boolean).join(';');
}

function select(tab: TabDescriptor, index: number) {
  const detail = { name: tab.name, title: tab.title, index };
  if (tab.disabled) {
    emit('disabled', detail);
    return;
  }
  if (props.useBeforeChange) {
    emit('before-change', {
      ...detail,
      callback: (status: boolean) => {
        if (status) {
          updateActive(detail);
        }
      },
    });
    emit('click', detail);
    return;
  }
  updateActive(detail);
  emit('click', detail);
}

function updateActive(detail: { name: TabValue; title: string; index: number }) {
  emit('update:modelValue', detail.name);
  emit('input', detail.name);
  emit('change', detail);
}
</script>

<style lang="less" scoped>
.van-tabs {
  position: relative;
  background: #fff;

  &__wrap {
    height: 44px;
    overflow: hidden;
  }

  &__nav {
    position: relative;
    display: flex;
    min-width: 100%;
  }

  &__line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    border-radius: 3px;
    transition-property: transform;
  }
}

.van-tab {
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 88px;
  height: 44px;
  padding: 0 12px;
  color: #646566;
  font-size: 14px;

  &--active {
    color: #323233;
    font-weight: 500;
  }

  &--disabled {
    color: #c8c9cc;
  }

  &__dot {
    width: 8px;
    height: 8px;
    margin-left: 4px;
    background: #ee0a24;
    border-radius: 50%;
  }

  &__info {
    min-width: 16px;
    height: 16px;
    margin-left: 4px;
    padding: 0 3px;
    color: #fff;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
    background: #ee0a24;
    border-radius: 16px;
    box-sizing: border-box;
  }
}
</style>
