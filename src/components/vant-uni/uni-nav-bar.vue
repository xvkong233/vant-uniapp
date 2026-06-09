<template>
  <view v-if="fixed && placeholder" :style="placeholderStyle" />
  <view :class="rootClass" :style="rootStyle">
    <view class="van-nav-bar__left" @tap="emit('click-left')">
      <slot name="left">
        <UniIcon v-if="leftArrow" name="arrow-left" class="van-nav-bar__arrow" />
        <text v-if="leftText">{{ leftText }}</text>
      </slot>
    </view>
    <view class="van-nav-bar__title">
      <slot name="title">{{ title }}</slot>
    </view>
    <view class="van-nav-bar__right" @tap="emit('click-right')">
      <slot name="right">{{ rightText }}</slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    fixed?: boolean;
    placeholder?: boolean;
    leftText?: string;
    rightText?: string;
    customStyle?: string;
    leftArrow?: boolean;
    border?: boolean;
    zIndex?: number;
    safeAreaInsetTop?: boolean;
  }>(),
  {
    title: '',
    leftText: '',
    rightText: '',
    customStyle: '',
    border: true,
    zIndex: 1,
  }
);

const emit = defineEmits<{
  (event: 'click-left'): void;
  (event: 'click-right'): void;
}>();

const rootClass = computed(() => [
  'van-nav-bar',
  {
    'van-nav-bar--fixed': props.fixed,
    'van-nav-bar--borderless': !props.border,
    'van-nav-bar--safe-top': props.safeAreaInsetTop,
  },
]);

const rootStyle = computed(() =>
  [`z-index: ${props.zIndex}`, props.customStyle].filter(Boolean).join(';')
);

const placeholderStyle = 'height: 46px';
</script>

<style lang="less" scoped>
.van-nav-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 46px;
  line-height: 22px;
  text-align: center;
  background: #fff;
  user-select: none;

  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background: #ebedf0;
    transform: scaleY(0.5);
    content: '';
  }

  &--borderless::after {
    display: none;
  }

  &--fixed {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
  }

  &--safe-top {
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
  }

  &__left,
  &__right {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 16px;
    color: #1989fa;
    font-size: 14px;
  }

  &__left {
    left: 0;
  }

  &__right {
    right: 0;
  }

  &__title {
    max-width: 60%;
    margin: 0 auto;
    overflow: hidden;
    color: #323233;
    font-weight: 500;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__arrow {
    margin-right: 4px;
  }
}
</style>
