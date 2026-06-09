<template>
  <view :class="rootClass" :style="customStyle" @tap="onClick">
    <view v-if="label || $slots.label" class="van-field__label" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </view>
    <view class="van-field__body">
      <UniIcon v-if="leftIcon || icon" :name="leftIcon || icon" :class="['van-field__left-icon', iconClass]" />
      <textarea
        v-if="type === 'textarea'"
        class="van-field__control van-field__control--textarea"
        :style="controlStyle"
        :value="innerValue"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :placeholder-class="placeholderClass"
        :disabled="disabled || readonly"
        :maxlength="maxlength"
        :auto-height="autoHeight"
        :focus="focus"
        :cursor-spacing="cursorSpacing"
        :cursor="cursor"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :adjust-position="adjustPosition"
        :hold-keyboard="holdKeyboard"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        @linechange="emit('linechange', $event.detail)"
        @keyboardheightchange="emit('keyboardheightchange', $event.detail)"
      />
      <input
        v-else
        class="van-field__control"
        :style="controlStyle"
        :type="inputType"
        :value="innerValue"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :placeholder-class="placeholderClass"
        :disabled="disabled || readonly"
        :maxlength="maxlength"
        :focus="focus"
        :cursor-spacing="cursorSpacing"
        :cursor="cursor"
        :selection-start="selectionStart"
        :selection-end="selectionEnd"
        :adjust-position="adjustPosition"
        :hold-keyboard="holdKeyboard"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @confirm="onConfirm"
        @keyboardheightchange="emit('keyboardheightchange', $event.detail)"
      />
      <UniIcon v-if="showClear" :name="clearIcon" class="van-field__clear" @click="clear" />
      <UniIcon v-if="rightIcon" :name="rightIcon" class="van-field__right-icon" @click="emit('click-icon')" />
      <slot name="right-icon" />
      <UniIcon v-if="isLink" :name="arrowIcon" class="van-field__right-icon" />
    </view>
    <view v-if="errorMessage" class="van-field__error-message" :style="errorMessageStyle">{{ errorMessage }}</view>
    <view v-if="showWordLimit && maxlength > 0" class="van-field__word-limit">
      {{ String(innerValue).length }}/{{ maxlength }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UniIcon from './uni-icon.vue';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    value?: Numeric;
    modelValue?: Numeric;
    type?: string;
    size?: string;
    icon?: string;
    label?: string;
    placeholder?: string;
    placeholderStyle?: string;
    placeholderClass?: string;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    clearTrigger?: 'always' | 'focus';
    clearIcon?: string;
    maxlength?: number;
    cursorSpacing?: number;
    autoFocus?: boolean;
    focus?: boolean;
    cursor?: number;
    selectionStart?: number;
    selectionEnd?: number;
    adjustPosition?: boolean;
    holdKeyboard?: boolean;
    error?: boolean;
    center?: boolean;
    isLink?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    autosize?: boolean | { minHeight?: number; maxHeight?: number };
    required?: boolean;
    iconClass?: string;
    clickable?: boolean;
    inputAlign?: 'left' | 'center' | 'right';
    customStyle?: string;
    errorMessage?: string;
    arrowDirection?: 'left' | 'up' | 'down' | 'right';
    showWordLimit?: boolean;
    errorMessageAlign?: 'left' | 'center' | 'right';
    border?: boolean;
    titleWidth?: string;
    extraEventParams?: boolean;
  }>(),
  {
    type: 'text',
    size: '',
    icon: '',
    label: '',
    placeholder: '',
    placeholderStyle: '',
    placeholderClass: '',
    clearTrigger: 'focus',
    clearIcon: 'cross',
    maxlength: -1,
    cursorSpacing: 50,
    cursor: -1,
    selectionStart: -1,
    selectionEnd: -1,
    adjustPosition: true,
    inputAlign: 'left',
    customStyle: '',
    errorMessage: '',
    arrowDirection: 'right',
    errorMessageAlign: 'left',
    border: true,
    titleWidth: '6.2em',
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'input', value: string): void;
  (event: 'change', value: string): void;
  (event: 'focus', value: unknown): void;
  (event: 'blur', value: unknown): void;
  (event: 'confirm', value: string): void;
  (event: 'clear', value: string): void;
  (event: 'click-icon'): void;
  (event: 'click-input', value: unknown): void;
  (event: 'linechange', value: unknown): void;
  (event: 'keyboardheightchange', value: unknown): void;
  (event: 'nicknamereview', value: unknown): void;
}>();

const focused = ref(false);
const innerValue = ref('');

watch(
  () => props.modelValue ?? props.value ?? '',
  (value) => {
    innerValue.value = String(value);
  },
  { immediate: true }
);

const inputType = computed(() => (props.type === 'digit' ? 'digit' : props.type));
const autoHeight = computed(() => props.autosize === true || typeof props.autosize === 'object');
const arrowIcon = computed(() => (props.arrowDirection && props.arrowDirection !== 'right' ? `arrow-${props.arrowDirection}` : 'arrow'));

const rootClass = computed(() => [
  'van-field',
  {
    'van-field--error': props.error,
    'van-field--center': props.center,
    'van-field--clickable': props.clickable || props.isLink,
    [`van-field--${props.size}`]: !!props.size,
    'van-field--borderless': !props.border,
  },
]);

const labelStyle = computed(() => `width: ${props.titleWidth}`);
const controlStyle = computed(() => `text-align: ${props.inputAlign}`);
const errorMessageStyle = computed(() => `text-align: ${props.errorMessageAlign}`);

const showClear = computed(() => {
  if (!props.clearable || props.readonly || !innerValue.value) {
    return false;
  }
  return props.clearTrigger === 'always' || focused.value;
});

function formatValue(value: string) {
  if (props.maxlength !== -1 && value.length > props.maxlength) {
    return value.slice(0, props.maxlength);
  }
  return value;
}

function update(value: string) {
  const next = formatValue(value);
  innerValue.value = next;
  emit('update:modelValue', next);
  if (props.extraEventParams) {
    const detail = { value: next };
    emit('input', detail as unknown as string);
    emit('change', detail as unknown as string);
  } else {
    emit('input', next);
    emit('change', next);
  }
}

function onInput(event: any) {
  update(event.detail?.value ?? '');
}

function onFocus(event: any) {
  focused.value = true;
  emit('focus', event.detail);
}

function onBlur(event: any) {
  focused.value = false;
  emit('blur', event.detail);
}

function onConfirm(event: any) {
  emit('confirm', event.detail?.value ?? innerValue.value);
}

function onClick(event: unknown) {
  if (props.clickable || props.isLink) {
    emit('click-input', event);
  }
}

function clear() {
  update('');
  emit('clear', '');
}
</script>

<style lang="less" scoped>
.van-field {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background: #fff;

  &::after {
    position: absolute;
    right: 16px;
    bottom: 0;
    left: 16px;
    height: 1px;
    background: #ebedf0;
    transform: scaleY(0.5);
    content: '';
  }

  &--borderless::after {
    display: none;
  }

  &--center {
    align-items: center;
  }

  &--clickable {
    cursor: pointer;
  }

  &--large {
    padding-top: 12px;
    padding-bottom: 12px;
  }

  &__label {
    flex: none;
    margin-right: 12px;
    color: #646566;
  }

  &__body {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
  }

  &__control {
    flex: 1;
    min-width: 0;
    height: 24px;
    min-height: 24px;
    padding: 0;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background: transparent;
    border: 0;
  }

  &__control--textarea {
    height: 72px;
  }

  &__left-icon,
  &__right-icon,
  &__clear {
    margin-left: 8px;
    color: #969799;
  }

  &__left-icon {
    margin-right: 4px;
    margin-left: 0;
  }

  &__error-message,
  &__word-limit {
    position: absolute;
    right: 16px;
    bottom: -18px;
    color: #ee0a24;
    font-size: 12px;
    line-height: 18px;
  }

  &__word-limit {
    color: #969799;
  }
}
</style>
