<template>
  <view v-if="loading" :class="rootClass">
    <view v-if="avatar" :class="avatarClass" :style="avatarStyle" />
    <view class="van-skeleton__content">
      <view v-if="title" class="van-skeleton__title" :style="`width: ${titleWidth}`" />
      <view
        v-for="(_, index) in rowArray"
        :key="index"
        class="van-skeleton__row"
        :style="rowStyle(index)"
      />
    </view>
  </view>
  <slot v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    row?: number;
    title?: boolean;
    avatar?: boolean;
    loading?: boolean;
    animate?: boolean;
    avatarSize?: string;
    avatarShape?: 'round' | 'square';
    titleWidth?: string;
    rowWidth?: string | string[];
  }>(),
  {
    row: 0,
    loading: true,
    animate: true,
    avatarSize: '32px',
    avatarShape: 'round',
    titleWidth: '40%',
    rowWidth: '100%',
  }
);

const rowArray = computed(() => Array.from({ length: props.row }));
const rootClass = computed(() => ['van-skeleton', { 'van-skeleton--animate': props.animate }]);
const avatarClass = computed(() => ['van-skeleton__avatar', `van-skeleton__avatar--${props.avatarShape}`]);
const avatarStyle = computed(() => `width: ${props.avatarSize}; height: ${props.avatarSize}`);

function rowStyle(index: number) {
  const width = Array.isArray(props.rowWidth) ? props.rowWidth[index] || '100%' : props.rowWidth;
  return `width: ${width}`;
}
</script>

<style lang="less" scoped>
.van-skeleton {
  display: flex;
  padding: 0 16px;

  &__avatar,
  &__title,
  &__row {
    background: #f2f3f5;
  }

  &--animate &__avatar,
  &--animate &__title,
  &--animate &__row {
    animation: van-skeleton-blink 1.2s ease-in-out infinite;
  }

  &__avatar {
    flex-shrink: 0;
    margin-right: 16px;
  }

  &__avatar--round {
    border-radius: 999px;
  }

  &__content {
    flex: 1;
  }

  &__title {
    height: 16px;
    margin: 0 0 16px;
  }

  &__row {
    height: 16px;
    margin-bottom: 12px;
  }
}

@keyframes van-skeleton-blink {
  50% {
    opacity: 0.6;
  }
}
</style>
