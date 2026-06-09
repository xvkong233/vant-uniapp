<template>
  <view class="van-dropdown-menu">
    <view class="van-dropdown-menu__bar">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { provide, ref, toRef } from 'vue';
import { dropdownMenuKey } from './shared/context';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    activeColor?: string;
    overlay?: boolean;
    zIndex?: number;
    duration?: number;
    direction?: 'down' | 'up';
    safeAreaTabBar?: boolean;
    closeOnClickOverlay?: boolean;
    closeOnClickOutside?: boolean;
  }>(),
  {
    overlay: true,
    zIndex: 10,
    duration: 200,
    direction: 'down',
    closeOnClickOverlay: true,
    closeOnClickOutside: true,
  }
);

const openName = ref<Numeric | undefined>();

provide(dropdownMenuKey, {
  activeColor: toRef(props, 'activeColor'),
  overlay: toRef(props, 'overlay'),
  zIndex: toRef(props, 'zIndex'),
  closeOnClickOverlay: toRef(props, 'closeOnClickOverlay'),
  openName,
  toggle(name, show) {
    openName.value = show === undefined ? (openName.value === name ? undefined : name) : show ? name : undefined;
  },
  close() {
    openName.value = undefined;
  },
});
</script>

<style lang="less" scoped>
.van-dropdown-menu {
  position: relative;
  background: #fff;

  &__bar {
    display: flex;
    height: 48px;
    box-shadow: 0 2px 12px rgba(100, 101, 102, 0.12);
  }
}
</style>
