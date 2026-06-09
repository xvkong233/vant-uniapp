<template>
  <view v-if="fixed && placeholder" class="van-tabbar__placeholder" />
  <view :class="rootClass" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide, toRef } from 'vue';
import { tabbarKey } from './shared/context';
import type { Numeric } from './shared/types';

type TabbarValue = Numeric | boolean;

const props = withDefaults(
  defineProps<{
    active?: TabbarValue;
    modelValue?: TabbarValue;
    activeColor?: string;
    inactiveColor?: string;
    fixed?: boolean;
    placeholder?: boolean;
    border?: boolean;
    zIndex?: number;
    safeAreaInsetBottom?: boolean;
  }>(),
  {
    fixed: true,
    border: true,
    zIndex: 1,
    safeAreaInsetBottom: true,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: TabbarValue): void;
  (event: 'change', value: TabbarValue): void;
}>();

const currentActive = computed(() => props.modelValue ?? props.active);

provide(tabbarKey, {
  active: currentActive,
  activeColor: toRef(props, 'activeColor'),
  inactiveColor: toRef(props, 'inactiveColor'),
  update(value) {
    emit('update:modelValue', value);
    emit('change', value);
  },
});

const rootClass = computed(() => [
  'van-tabbar',
  {
    'van-tabbar--fixed': props.fixed,
    'van-tabbar--borderless': !props.border,
    'van-tabbar--safe': props.safeAreaInsetBottom,
  },
]);

const rootStyle = computed(() => `z-index: ${props.zIndex}`);
</script>

<style lang="less" scoped>
.van-tabbar {
  display: flex;
  box-sizing: content-box;
  width: 100%;
  height: 50px;
  background: #fff;

  &::before {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    height: 1px;
    background: #ebedf0;
    transform: scaleY(0.5);
    content: '';
  }

  &--fixed {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &--borderless::before {
    display: none;
  }

  &__placeholder {
    height: 50px;
  }
}
</style>
