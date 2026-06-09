<template>
  <view :class="rootClass" :style="customStyle" hover-class="van-cell--hover" @tap="handleTap">
    <slot name="icon">
      <UniIcon v-if="icon" :name="icon" class="van-cell__left-icon" />
    </slot>

    <view class="van-cell__title" :style="computedTitleStyle">
      <slot name="title">
        <text v-if="title !== undefined && title !== null">{{ title }}</text>
      </slot>
      <view v-if="label || $slots.label" class="van-cell__label">
        <slot name="label">{{ label }}</slot>
      </view>
    </view>

    <view class="van-cell__value">
      <slot>{{ value }}</slot>
    </view>

    <slot name="right-icon">
      <UniIcon
        v-if="isLink"
        :name="arrowDirection ? `arrow-${arrowDirection}` : 'arrow'"
        class="van-cell__right-icon"
      />
    </slot>
    <slot name="extra" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    title?: Numeric;
    value?: Numeric;
    icon?: string;
    size?: string;
    label?: string;
    center?: boolean;
    isLink?: boolean;
    required?: boolean;
    clickable?: boolean;
    titleWidth?: string;
    customStyle?: string;
    arrowDirection?: string;
    border?: boolean;
    titleStyle?: string;
    useLabelSlot?: boolean;
  }>(),
  {
    icon: '',
    label: '',
    customStyle: '',
    arrowDirection: '',
    border: true,
    titleStyle: '',
  }
);

const emit = defineEmits<{
  (event: 'click', value: unknown): void;
}>();

const rootClass = computed(() => [
  'van-cell',
  props.size ? `van-cell--${props.size}` : '',
  {
    'van-cell--center': props.center,
    'van-cell--required': props.required,
    'van-cell--clickable': props.clickable || props.isLink,
    'van-cell--borderless': !props.border,
  },
]);

const computedTitleStyle = computed(() =>
  [props.titleWidth ? `flex: none; width: ${props.titleWidth}` : '', props.titleStyle]
    .filter(Boolean)
    .join(';')
);

function handleTap(event: unknown) {
  emit('click', event);
}
</script>

<style lang="less" scoped>
.van-cell {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;

  &::after {
    position: absolute;
    right: 16px;
    bottom: 0;
    left: 16px;
    height: 1px;
    background-color: #ebedf0;
    transform: scaleY(0.5);
    content: '';
  }

  &--borderless::after {
    display: none;
  }

  &--center {
    align-items: center;
  }

  &--large {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  &--hover {
    background-color: #f2f3f5;
  }

  &--required::before {
    position: absolute;
    left: 8px;
    color: #ee0a24;
    font-size: 14px;
    content: '*';
  }

  &__title,
  &__value {
    flex: 1;
    min-width: 0;
  }

  &__value {
    overflow: hidden;
    color: #969799;
    text-align: right;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__label {
    margin-top: 4px;
    color: #969799;
    font-size: 12px;
    line-height: 18px;
  }

  &__left-icon {
    margin-right: 4px;
    line-height: 24px;
  }

  &__right-icon {
    margin-left: 4px;
    color: #969799;
    line-height: 24px;
  }
}
</style>
