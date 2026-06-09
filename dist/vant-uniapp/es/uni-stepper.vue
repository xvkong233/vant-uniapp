<template>
  <view :class="rootClass">
    <view
      v-if="showMinus"
      :class="minusClass"
      :style="buttonStyle"
      hover-class="van-stepper__minus--hover"
      @tap="change('minus')"
      @touchstart="onTouchStart('minus')"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot name="minus" />
    </view>
    <input
      :type="integer ? 'number' : 'digit'"
      :class="inputClass"
      :style="inputStyle"
      :value="currentValue"
      :disabled="disabled || disableInput"
      @input="onInput"
      @focus="emit('focus', $event.detail)"
      @blur="onBlur"
    />
    <view
      v-if="showPlus"
      :class="plusClass"
      :style="buttonStyle"
      hover-class="van-stepper__plus--hover"
      @tap="change('plus')"
      @touchstart="onTouchStart('plus')"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <slot name="plus" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

function add(num1: number, num2: number) {
  const cardinal = 10 ** 10;
  return Math.round((num1 + num2) * cardinal) / cardinal;
}

const props = withDefaults(
  defineProps<{
    value?: Numeric;
    modelValue?: Numeric;
    integer?: boolean;
    disabled?: boolean;
    inputWidth?: Numeric;
    buttonSize?: Numeric;
    asyncChange?: boolean;
    disableInput?: boolean;
    decimalLength?: number | null;
    min?: Numeric;
    max?: Numeric;
    step?: Numeric;
    showPlus?: boolean;
    showMinus?: boolean;
    disablePlus?: boolean;
    disableMinus?: boolean;
    longPress?: boolean;
    theme?: string;
    alwaysEmbed?: boolean;
  }>(),
  {
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
    step: 1,
    showPlus: true,
    showMinus: true,
    longPress: true,
    theme: '',
    decimalLength: null,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'change', value: number): void;
  (event: 'plus'): void;
  (event: 'minus'): void;
  (event: 'overlimit', value: 'plus' | 'minus'): void;
  (event: 'focus', value: unknown): void;
  (event: 'blur', value: unknown): void;
}>();

const currentValue = ref('');
let longPressTimer: ReturnType<typeof setTimeout> | undefined;
let longPressInterval: ReturnType<typeof setTimeout> | undefined;
const sourceValue = computed(() => props.modelValue ?? props.value ?? props.min);

watch(
  sourceValue,
  (value) => {
    currentValue.value = format(value).newValue;
  },
  { immediate: true }
);

const rootClass = computed(() => ['van-stepper', props.theme ? `van-stepper--${props.theme}` : '']);
const minusDisabled = computed(() => props.disabled || props.disableMinus || +currentValue.value <= +props.min);
const plusDisabled = computed(() => props.disabled || props.disablePlus || +currentValue.value >= +props.max);
const minusClass = computed(() => ['van-stepper__minus', { 'van-stepper__minus--disabled': minusDisabled.value }]);
const plusClass = computed(() => ['van-stepper__plus', { 'van-stepper__plus--disabled': plusDisabled.value }]);
const inputClass = computed(() => ['van-stepper__input', { 'van-stepper__input--disabled': props.disabled || props.disableInput }]);

const buttonStyle = computed(() => {
  const size = addUnit(props.buttonSize);
  return size ? `width: ${size}; height: ${size}` : '';
});

const inputStyle = computed(() => {
  const styles: string[] = [];
  const buttonSize = addUnit(props.buttonSize);
  const inputWidth = addUnit(props.inputWidth);
  if (buttonSize) {
    styles.push(`height: ${buttonSize}`);
  }
  if (inputWidth) {
    styles.push(`width: ${inputWidth}`);
  }
  return styles.join(';');
});

function filter(value: Numeric) {
  let next = String(value).replace(/[^0-9.-]/g, '');

  if (props.integer && next.includes('.')) {
    next = next.split('.')[0];
  }

  return next;
}

function format(value: Numeric) {
  const safeValue = filter(value);
  const rangeValue = Math.max(Math.min(+safeValue || +props.min, +props.max), +props.min);
  const newValue =
    props.decimalLength !== null
      ? rangeValue.toFixed(props.decimalLength)
      : String(rangeValue);

  return { value: String(value), newValue };
}

function emitChange(value: Numeric) {
  const formatted = format(value);
  const numericValue = +formatted.newValue;

  if (!props.asyncChange) {
    currentValue.value = formatted.newValue;
  }

  emit('update:modelValue', numericValue);
  emit('change', numericValue);
}

function change(type: 'plus' | 'minus') {
  if ((type === 'plus' && plusDisabled.value) || (type === 'minus' && minusDisabled.value)) {
    emit('overlimit', type);
    return;
  }

  const diff = type === 'minus' ? -Number(props.step) : Number(props.step);
  emitChange(add(+currentValue.value, diff));
  if (type === 'plus') {
    emit('plus');
  } else {
    emit('minus');
  }
}

function clearLongPress() {
  if (longPressTimer) clearTimeout(longPressTimer);
  if (longPressInterval) clearTimeout(longPressInterval);
}

function repeatChange(type: 'plus' | 'minus') {
  change(type);
  longPressInterval = setTimeout(() => repeatChange(type), 200);
}

function onTouchStart(type: 'plus' | 'minus') {
  if (!props.longPress) return;
  clearLongPress();
  longPressTimer = setTimeout(() => repeatChange(type), 600);
}

function onTouchEnd() {
  clearLongPress();
}

function onInput(event: any) {
  const value = event.detail?.value ?? '';
  currentValue.value = value;

  if (value !== '') {
    emitChange(value);
  }
}

function onBlur(event: any) {
  const value = event.detail?.value ?? currentValue.value;
  const formatted = format(value);
  currentValue.value = formatted.newValue;
  emitChange(formatted.newValue);
  emit('blur', { ...event.detail, value: +formatted.newValue });
}

onBeforeUnmount(clearLongPress);
</script>

<style lang="less" scoped>
.van-stepper {
  display: inline-flex;
  align-items: center;
  font-size: 0;

  &__minus,
  &__plus {
    position: relative;
    box-sizing: border-box;
    width: 28px;
    height: 28px;
    margin: 1px;
    color: #323233;
    background-color: #f2f3f5;
  }

  &__minus::before,
  &__plus::before,
  &__plus::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    background-color: currentColor;
    content: '';
  }

  &__minus::before,
  &__plus::before {
    width: 9px;
    height: 1px;
  }

  &__plus::after {
    width: 1px;
    height: 9px;
  }

  &__minus {
    border-radius: 4px 0 0 4px;
  }

  &__plus {
    border-radius: 0 4px 4px 0;
  }

  &__minus--disabled,
  &__plus--disabled {
    color: #c8c9cc;
    background-color: #f7f8fa;
  }

  &__input {
    box-sizing: border-box;
    width: 32px;
    height: 28px;
    min-height: 0;
    margin: 1px;
    padding: 1px;
    color: #323233;
    font-size: 14px;
    text-align: center;
    background-color: #f2f3f5;
    border: 0;
  }

  &__input--disabled {
    color: #c8c9cc;
    background-color: #f7f8fa;
  }

  &--round &__input {
    background-color: transparent;
  }

  &--round &__minus,
  &--round &__plus {
    border-radius: 100%;
  }
}
</style>
