<template>
  <view :class="rootClass">
    <view class="van-radio__icon-wrap" @tap="select">
      <slot name="icon">
        <view class="van-radio__icon" :style="iconStyle">
          <text v-if="checked" class="van-radio__mark">✓</text>
        </view>
      </slot>
    </view>
    <text v-if="$slots.default" class="van-radio__label" @tap="onLabelTap">
      <slot />
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { radioGroupKey } from './shared/context';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

type RadioValue = Numeric | boolean;

const props = withDefaults(
  defineProps<{
    name?: RadioValue;
    value?: RadioValue;
    modelValue?: RadioValue;
    disabled?: boolean;
    useIconSlot?: boolean;
    checkedColor?: string;
    labelPosition?: 'left' | 'right';
    labelDisabled?: boolean;
    shape?: 'round' | 'square';
    iconSize?: Numeric;
  }>(),
  {
    labelPosition: 'right',
    shape: 'round',
    iconSize: 20,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: RadioValue): void;
  (event: 'input', value: RadioValue): void;
  (event: 'change', value: RadioValue): void;
}>();

const group = inject(radioGroupKey, undefined);
const currentValue = computed(() => group?.value.value ?? props.modelValue ?? props.value);
const checked = computed(() => currentValue.value === props.name);
const disabled = computed(() => props.disabled || group?.disabled.value);

const rootClass = computed(() => [
  'van-radio',
  `van-radio--${props.labelPosition}`,
  {
    'van-radio--checked': checked.value,
    'van-radio--disabled': disabled.value,
    'van-radio--horizontal': group?.direction.value === 'horizontal',
  },
]);

const iconStyle = computed(() => {
  const styles = [`width: ${addUnit(props.iconSize)}`, `height: ${addUnit(props.iconSize)}`];
  if (checked.value && props.checkedColor) {
    styles.push(`background-color: ${props.checkedColor}`);
    styles.push(`border-color: ${props.checkedColor}`);
  }
  return styles.join(';');
});

function select() {
  if (disabled.value) {
    return;
  }
  const value = props.name ?? '';
  if (group) {
    group.update(value);
  } else {
    emit('update:modelValue', value);
    emit('input', value);
    emit('change', value);
  }
}

function onLabelTap() {
  if (!props.labelDisabled) {
    select();
  }
}
</script>

<style lang="less" scoped>
.van-radio {
  display: flex;
  align-items: center;
  margin: 0 0 8px;
  color: #323233;
  font-size: 14px;

  &--horizontal {
    margin-right: 12px;
  }

  &--left {
    flex-direction: row-reverse;
    justify-content: flex-end;
  }

  &--disabled {
    opacity: 0.5;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 20px;
    height: 20px;
    color: #fff;
    border: 1px solid #c8c9cc;
    border-radius: 100%;
  }

  &--checked &__icon {
    background: #1989fa;
    border-color: #1989fa;
  }

  &__label {
    margin-left: 8px;
    line-height: 20px;
  }

  &--left &__label {
    margin-right: 8px;
    margin-left: 0;
  }
}
</style>
