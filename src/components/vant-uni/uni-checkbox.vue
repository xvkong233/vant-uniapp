<template>
  <view :class="rootClass">
    <view class="van-checkbox__icon-wrap" @tap="toggle">
      <slot name="icon">
        <view class="van-checkbox__icon" :style="iconStyle">
          <text v-if="checked" class="van-checkbox__mark">✓</text>
        </view>
      </slot>
    </view>
    <text v-if="$slots.default" class="van-checkbox__label" @tap="onLabelTap">
      <slot />
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { checkboxGroupKey } from './shared/context';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    name?: Numeric;
    value?: boolean;
    modelValue?: boolean;
    disabled?: boolean;
    useIconSlot?: boolean;
    checkedColor?: string;
    labelPosition?: 'left' | 'right';
    labelDisabled?: boolean;
    shape?: 'round' | 'square';
    iconSize?: Numeric;
  }>(),
  {
    value: false,
    labelPosition: 'right',
    shape: 'round',
    iconSize: 20,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'input', value: boolean): void;
  (event: 'change', value: boolean): void;
}>();

const group = inject(checkboxGroupKey, undefined);

const checked = computed(() =>
  group ? group.value.value.includes(props.name ?? '') : props.modelValue ?? props.value
);

const disabled = computed(() => props.disabled || group?.disabled.value);

const rootClass = computed(() => [
  'van-checkbox',
  `van-checkbox--${props.labelPosition}`,
  {
    'van-checkbox--checked': checked.value,
    'van-checkbox--disabled': disabled.value,
    'van-checkbox--horizontal': group?.direction.value === 'horizontal',
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

function update(value: boolean) {
  if (group) {
    group.toggle(props.name ?? '', value);
  } else {
    emit('update:modelValue', value);
    emit('input', value);
    emit('change', value);
  }
}

function toggle() {
  if (!disabled.value) {
    update(!checked.value);
  }
}

function onLabelTap() {
  if (!props.labelDisabled) {
    toggle();
  }
}
</script>

<style lang="less" scoped>
.van-checkbox {
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
