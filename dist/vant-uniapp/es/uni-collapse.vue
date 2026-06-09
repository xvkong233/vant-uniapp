<template>
  <view :class="rootClass">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { collapseKey } from './shared/context';
import type { Numeric } from './shared/types';

type CollapseValue = Numeric | Numeric[];

const props = withDefaults(
  defineProps<{
    value?: CollapseValue;
    modelValue?: CollapseValue;
    accordion?: boolean;
    border?: boolean;
  }>(),
  {
    border: true,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: CollapseValue | ''): void;
  (event: 'input', value: CollapseValue | ''): void;
  (event: 'change', value: CollapseValue | ''): void;
  (event: 'open', value: Numeric): void;
  (event: 'close', value: Numeric): void;
}>();

const current = computed(() => props.modelValue ?? props.value);

provide(collapseKey, {
  value: current,
  accordion: toRef(props, 'accordion'),
  border: toRef(props, 'border'),
  update(name, expanded) {
    let next: CollapseValue | '';
    if (props.accordion) {
      next = expanded ? name : '';
    } else {
      const list = Array.isArray(current.value) ? current.value.slice() : [];
      next = expanded ? list.concat(name) : list.filter((item) => item !== name);
    }
    if (expanded) {
      emit('open', name);
    } else {
      emit('close', name);
    }
    emit('update:modelValue', next);
    emit('input', next);
    emit('change', next);
  },
});

const rootClass = computed(() => ['van-collapse', { 'van-collapse--borderless': !props.border }]);
</script>

<style lang="less" scoped>
.van-collapse {
  background: #fff;
}
</style>
