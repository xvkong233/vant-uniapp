<template>
  <view :class="rootClass">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { checkboxGroupKey } from './shared/context';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    value?: Numeric[];
    modelValue?: Numeric[];
    disabled?: boolean;
    max?: number;
    direction?: 'horizontal' | 'vertical';
  }>(),
  {
    value: () => [],
    modelValue: undefined,
    direction: 'vertical',
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: Numeric[]): void;
  (event: 'input', value: Numeric[]): void;
  (event: 'change', value: Numeric[]): void;
}>();

const currentValue = computed(() => props.modelValue ?? props.value);

function update(value: Numeric[]) {
  emit('update:modelValue', value);
  emit('input', value);
  emit('change', value);
}

provide(checkboxGroupKey, {
  value: currentValue,
  disabled: toRef(props, 'disabled'),
  direction: toRef(props, 'direction'),
  max: toRef(props, 'max'),
  toggle(name, checked) {
    const next = currentValue.value.slice();
    const index = next.indexOf(name);

    if (checked && index === -1) {
      if (props.max && next.length >= props.max) {
        return;
      }
      next.push(name);
    } else if (!checked && index !== -1) {
      next.splice(index, 1);
    }

    update(next);
  },
});

const rootClass = computed(() => [
  'van-checkbox-group',
  `van-checkbox-group--${props.direction}`,
]);
</script>

<style lang="less" scoped>
.van-checkbox-group {
  display: flex;
  flex-direction: column;

  &--horizontal {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
