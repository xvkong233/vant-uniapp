<template>
  <view class="van-tabbar-item" :style="itemStyle" @tap="handleClick">
    <view class="van-tabbar-item__icon">
      <slot name="icon">
        <UniIcon v-if="icon" :name="icon" :dot="dot" :info="badge ?? info" />
      </slot>
    </view>
    <view class="van-tabbar-item__text">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, getCurrentInstance } from 'vue';
import UniIcon from './uni-icon.vue';
import { tabbarKey } from './shared/context';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    info?: Numeric | null;
    badge?: Numeric | null;
    name?: Numeric | boolean;
    icon?: string;
    dot?: boolean;
    url?: string;
    linkType?: 'navigateTo' | 'redirectTo' | 'switchTab' | 'reLaunch' | string;
    iconPrefix?: string;
  }>(),
  {
    info: null,
    badge: null,
    icon: '',
    url: '',
    linkType: 'navigateTo',
    iconPrefix: 'van-icon',
  }
);

const emit = defineEmits<{
  (event: 'click'): void;
  (event: 'change', value: Numeric | boolean): void;
}>();

const tabbar = inject(tabbarKey, undefined);
const instance = getCurrentInstance();
const fallbackName = computed(() => instance?.uid ?? 0);
const itemName = computed(() => props.name ?? fallbackName.value);
const active = computed(() => tabbar?.active.value === itemName.value);
const itemStyle = computed(() => {
  const color = active.value ? tabbar?.activeColor.value : tabbar?.inactiveColor.value;
  return color ? `color: ${color}` : '';
});

function handleClick() {
  tabbar?.update(itemName.value);
  emit('click');
  emit('change', itemName.value);
  if (props.url) {
    const methodMap: Record<string, (options: { url: string }) => void> = {
      navigateTo: uni.navigateTo,
      redirectTo: uni.redirectTo,
      switchTab: uni.switchTab,
      reLaunch: uni.reLaunch,
    };
    const method = methodMap[props.linkType] || uni.navigateTo;
    method({ url: props.url });
  }
}
</script>

<style lang="less" scoped>
.van-tabbar-item {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #646566;
  font-size: 12px;
  line-height: 1;

  &__icon {
    margin-bottom: 4px;
    font-size: 22px;
  }
}
</style>
