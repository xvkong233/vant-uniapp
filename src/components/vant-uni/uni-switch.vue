<template>
  <view :class="rootClass" :style="rootStyle" @tap="toggle">
    <view class="van-switch__node">
      <UniLoading v-if="loading" size="16" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniLoading from './uni-loading.vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

type SwitchValue = Numeric | boolean;

const props = withDefaults(
  defineProps<{
    checked?: SwitchValue;
    modelValue?: SwitchValue;
    loading?: boolean;
    disabled?: boolean;
    activeColor?: string;
    inactiveColor?: string;
    size?: Numeric;
    activeValue?: SwitchValue;
    inactiveValue?: SwitchValue;
  }>(),
  {
    size: '30',
    activeValue: true,
    inactiveValue: false,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: SwitchValue): void;
  (event: 'input', value: SwitchValue): void;
  (event: 'change', value: SwitchValue): void;
}>();

const model = computed(() => props.modelValue ?? props.checked);
const isChecked = computed(() => model.value === props.activeValue);

const rootClass = computed(() => [
  'van-switch',
  {
    'van-switch--on': isChecked.value,
    'van-switch--disabled': props.disabled,
    'van-switch--loading': props.loading,
  },
]);

const rootStyle = computed(() => {
  const styles: string[] = [];
  const size = addUnit(props.size);

  if (size) {
    styles.push(`font-size: ${size}`);
  }

  const background = isChecked.value ? props.activeColor : props.inactiveColor;
  if (background) {
    styles.push(`background-color: ${background}`);
  }

  return styles.join(';');
});

function toggle() {
  if (props.disabled || props.loading) {
    return;
  }

  const value = isChecked.value ? props.inactiveValue : props.activeValue;
  emit('update:modelValue', value);
  emit('input', value);
  emit('change', value);
}
</script>

<style lang="less" scoped>
.van-switch {
  position: relative;
  display: inline-block;
  box-sizing: content-box;
  width: 2em;
  height: 1em;
  font-size: 30px;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1em;
  transition: background-color 0.3s;

  &--on {
    background-color: #07c160;
  }

  &--disabled {
    opacity: 0.5;
  }

  &__node {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    background-color: #fff;
    border-radius: 100%;
    box-shadow: 0 3px 1px 0 rgba(0, 0, 0, 0.05), 0 2px 2px 0 rgba(0, 0, 0, 0.1),
      0 3px 3px 0 rgba(0, 0, 0, 0.05);
    transition: transform 0.3s;
  }

  &--on &__node {
    transform: translateX(1em);
  }
}
</style>
