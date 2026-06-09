<template>
  <view class="van-sidebar">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { sidebarKey } from './shared/context';

const props = withDefaults(
  defineProps<{
    activeKey?: number;
    modelValue?: number;
  }>(),
  {
    activeKey: 0,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'change', value: number): void;
}>();

const current = computed(() => props.modelValue ?? props.activeKey);

provide(sidebarKey, {
  activeKey: current,
  update(index) {
    emit('update:modelValue', index);
    emit('change', index);
  },
});
</script>

<style lang="less" scoped>
.van-sidebar {
  width: 80px;
  overflow-y: auto;
}
</style>
