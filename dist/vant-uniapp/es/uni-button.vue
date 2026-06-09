<template>
  <button
    :class="classes"
    :style="buttonStyle"
    :disabled="disabled || loading"
    :form-type="formType"
    :open-type="normalizedOpenType"
    hover-class="van-button--active"
    @tap="handleTap"
  >
    <view v-if="loading" class="van-button__loading">
      <view class="van-button__spinner" :style="loadingStyle" />
      <text v-if="loadingText" class="van-button__loading-text">
        {{ loadingText }}
      </text>
    </view>
    <view v-else class="van-button__content">
      <text v-if="icon" class="van-button__icon">{{ icon }}</text>
      <text class="van-button__text"><slot /></text>
    </view>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type ButtonSize = 'large' | 'normal' | 'small' | 'mini';

const props = withDefaults(
  defineProps<{
    type?: ButtonType;
    size?: ButtonSize;
    formType?: string;
    openType?: string;
    icon?: string;
    classPrefix?: string;
    plain?: boolean;
    block?: boolean;
    round?: boolean;
    square?: boolean;
    loading?: boolean;
    hairline?: boolean;
    disabled?: boolean;
    loadingText?: string;
    loadingType?: string;
    dataset?: Record<string, unknown>;
    loadingSize?: Numeric;
    color?: string;
    customStyle?: string;
  }>(),
  {
    type: 'default',
    size: 'normal',
    formType: '',
    openType: '',
    icon: '',
    classPrefix: 'van-icon',
    loadingText: '',
    loadingType: 'circular',
    color: '',
    customStyle: '',
  }
);

const emit = defineEmits<{
  (event: 'click', value: unknown): void;
  (event: 'getuserinfo', value: unknown): void;
}>();

const classes = computed(() => [
  'van-button',
  `van-button--${props.type}`,
  `van-button--${props.size}`,
  {
    'van-button--plain': props.plain,
    'van-button--block': props.block,
    'van-button--round': props.round,
    'van-button--square': props.square,
    'van-button--loading': props.loading,
    'van-button--hairline': props.hairline,
    'van-button--disabled': props.disabled,
    'van-button--unclickable': props.disabled || props.loading,
  },
]);

const buttonStyle = computed(() => {
  const styles: string[] = [];

  if (props.color) {
    styles.push(`color: ${props.plain ? props.color : '#fff'}`);
    styles.push(`background: ${props.plain ? '#fff' : props.color}`);
    styles.push(`border-color: ${props.color}`);
  }

  if (props.customStyle) {
    styles.push(props.customStyle);
  }

  return styles.join(';');
});

const normalizedOpenType = computed(() =>
  props.disabled || props.loading ? '' : props.openType
);

const loadingStyle = computed(() => {
  const size = addUnit(props.loadingSize);
  return size ? `width: ${size}; height: ${size}` : '';
});

function handleTap(event: unknown) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}
</script>

<style lang="less" scoped>
.van-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--van-button-default-height, 44px);
  margin: 0;
  padding: 0 15px;
  color: var(--van-button-default-color, #323233);
  font-size: var(--van-button-normal-font-size, 14px);
  line-height: 20px;
  text-align: center;
  background: var(--van-button-default-background, #fff);
  border: 1px solid var(--van-button-default-border-color, #ebedf0);
  border-radius: var(--van-button-border-radius, 2px);

  &::after {
    border: 0;
  }

  &--active {
    opacity: 0.7;
  }

  &--primary,
  &--success {
    color: #fff;
    background: #07c160;
    border-color: #07c160;
  }

  &--danger {
    color: #fff;
    background: #ee0a24;
    border-color: #ee0a24;
  }

  &--warning {
    color: #fff;
    background: #ff976a;
    border-color: #ff976a;
  }

  &--plain {
    background: #fff;
  }

  &--plain&--primary,
  &--plain&--success {
    color: #07c160;
  }

  &--plain&--danger {
    color: #ee0a24;
  }

  &--plain&--warning {
    color: #ff976a;
  }

  &--large {
    width: 100%;
    height: 50px;
  }

  &--small {
    min-width: 60px;
    height: 30px;
    padding: 0 8px;
    font-size: 12px;
  }

  &--mini {
    min-width: 50px;
    height: 22px;
    padding: 0 4px;
    font-size: 10px;
  }

  &--block {
    display: flex;
    width: 100%;
  }

  &--round {
    border-radius: 999px;
  }

  &--square {
    border-radius: 0;
  }

  &--disabled {
    opacity: 0.5;
  }

  &__content,
  &__loading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__icon + &__text,
  &__spinner + &__loading-text {
    margin-left: 4px;
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: van-button-spin 0.8s linear infinite;
  }
}

@keyframes van-button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
