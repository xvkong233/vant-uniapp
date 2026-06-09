<template>
  <view :class="rootClass">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { radioGroupKey } from './shared/context';
import type { Numeric } from './shared/types';

type RadioValue = Numeric | boolean;

const props = withDefaults(
  defineProps<{
    value?: RadioValue;
    modelValue?: RadioValue;
    disabled?: boolean;
    direction?: 'horizontal' | 'vertical';
  }>(),
  {
    direction: 'vertical',
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: RadioValue): void;
  (event: 'input', value: RadioValue): void;
  (event: 'change', value: RadioValue): void;
}>();

const currentValue = computed(() => props.modelValue ?? props.value);

provide(radioGroupKey, {
  value: currentValue,
  disabled: toRef(props, 'disabled'),
  direction: toRef(props, 'direction'),
  update(name) {
    emit('update:modelValue', name);
    emit('input', name);
    emit('change', name);
  },
});

const rootClass = computed(() => ['van-radio-group', `van-radio-group--${props.direction}`]);
</script>

<style lang="less" scoped>
.van-radio-group {
  display: flex;
  flex-direction: column;

  &--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
