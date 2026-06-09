<template>
  <view :class="rootClass" :style="`background: ${background}`">
    <view :class="['van-search__content', `van-search__content--${shape}`]">
      <view v-if="label || $slots.label" class="van-search__label">
        <slot name="label">{{ label }}</slot>
      </view>
      <UniField
        type="search"
        :left-icon="leftIcon"
        :right-icon="rightIcon"
        :value="innerValue"
        :focus="focus"
        :disabled="disabled"
        :readonly="readonly"
        :clearable="clearable"
        :clear-trigger="clearTrigger"
        :clear-icon="clearIcon"
        :maxlength="maxlength"
        :input-align="inputAlign"
        :placeholder="placeholder"
        :placeholder-style="placeholderStyle"
        :cursor-spacing="cursorSpacing"
        :border="false"
        custom-style="padding: 5px 10px 5px 0; background-color: transparent;"
        @change="onChange"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
        @confirm="emit('search', $event)"
        @clear="emit('clear', $event)"
        @click-input="emit('click-input', $event)"
      />
    </view>
    <view v-if="showAction || $slots.action" class="van-search__action">
      <slot name="action">
        <view class="van-search__action-button" @tap="cancel">{{ actionText }}</view>
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UniField from './uni-field.vue';

const props = withDefaults(
  defineProps<{
    value?: string;
    modelValue?: string;
    label?: string;
    focus?: boolean;
    error?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    inputAlign?: 'left' | 'center' | 'right';
    showAction?: boolean;
    useActionSlot?: boolean;
    useLeftIconSlot?: boolean;
    useRightIconSlot?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    placeholder?: string;
    placeholderStyle?: string;
    actionText?: string;
    background?: string;
    maxlength?: number;
    shape?: 'square' | 'round';
    clearable?: boolean;
    clearTrigger?: 'always' | 'focus';
    clearIcon?: string;
    cursorSpacing?: number;
  }>(),
  {
    value: '',
    label: '',
    leftIcon: 'search',
    rightIcon: '',
    placeholder: '',
    placeholderStyle: '',
    actionText: '取消',
    background: '#fff',
    maxlength: -1,
    shape: 'square',
    clearable: true,
    clearTrigger: 'focus',
    clearIcon: 'cross',
    cursorSpacing: 0,
    inputAlign: 'left',
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'change', value: string): void;
  (event: 'cancel'): void;
  (event: 'search', value: unknown): void;
  (event: 'focus', value: unknown): void;
  (event: 'blur', value: unknown): void;
  (event: 'clear', value: unknown): void;
  (event: 'click-input', value: unknown): void;
}>();

const innerValue = ref('');
watch(
  () => props.modelValue ?? props.value,
  (value) => {
    innerValue.value = value || '';
  },
  { immediate: true }
);

const rootClass = computed(() => [
  'van-search',
  {
    'van-search--withaction': props.showAction,
  },
]);

function onChange(value: string) {
  innerValue.value = value;
  emit('update:modelValue', value);
  emit('change', value);
}

function cancel() {
  innerValue.value = '';
  emit('update:modelValue', '');
  emit('change', '');
  emit('cancel');
}
</script>

<style lang="less" scoped>
.van-search {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 12px;

  &__content {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
    background: #f7f8fa;

    &--round {
      border-radius: 999px;
    }
  }

  &__label {
    padding-left: 8px;
    color: #323233;
    font-size: 14px;
  }

  &__action {
    padding-left: 8px;
    color: #323233;
    font-size: 14px;
    line-height: 34px;
  }
}
</style>
