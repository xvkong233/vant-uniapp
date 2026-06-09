<template>
  <view class="van-index-bar">
    <slot />
    <view class="van-index-bar__sidebar">
      <text
        v-for="item in indexList"
        :key="String(item)"
        class="van-index-bar__index"
        :style="item === active ? `color: ${highlightColor}` : ''"
        @tap="select(item)"
      >
        {{ item }}
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    sticky?: boolean;
    zIndex?: number;
    highlightColor?: string;
    stickyOffsetTop?: number;
    indexList?: Numeric[];
  }>(),
  {
    sticky: true,
    zIndex: 1,
    highlightColor: '#07c160',
    stickyOffsetTop: 0,
    indexList: () => Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index)),
  }
);

const emit = defineEmits<{
  (event: 'select', value: Numeric): void;
}>();

const active = ref<Numeric>();

function select(value: Numeric) {
  active.value = value;
  emit('select', value);
}
</script>

<style lang="less" scoped>
.van-index-bar {
  position: relative;

  &__sidebar {
    position: fixed;
    top: 50%;
    right: 8px;
    display: flex;
    flex-direction: column;
    transform: translateY(-50%);
  }

  &__index {
    padding: 0 4px;
    color: #323233;
    font-size: 10px;
    line-height: 14px;
    text-align: center;
  }
}
</style>
