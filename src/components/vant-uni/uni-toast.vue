<template>
  <UniOverlay
    v-if="mask || forbidClick"
    :show="show"
    :z-index="zIndex"
    :custom-style="mask ? '' : 'background-color: transparent'"
  />
  <view v-if="show" class="van-toast__container" :style="`z-index: ${zIndex}`">
    <view :class="rootClass">
      <text v-if="type === 'text' || type === 'html'">{{ message }}</text>
      <template v-else>
        <UniLoading v-if="type === 'loading'" color="white" :type="loadingType" class="van-toast__loading" />
        <UniIcon v-else :name="type" class="van-toast__icon" />
        <text v-if="message" class="van-toast__text">{{ message }}</text>
      </template>
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';
import UniLoading from './uni-loading.vue';
import UniOverlay from './uni-overlay.vue';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    mask?: boolean;
    message?: string;
    forbidClick?: boolean;
    zIndex?: number;
    type?: string;
    loadingType?: 'circular' | 'spinner';
    position?: 'top' | 'middle' | 'bottom';
  }>(),
  {
    message: '',
    zIndex: 1000,
    type: 'text',
    loadingType: 'circular',
    position: 'middle',
  }
);

const rootClass = computed(() => [
  'van-toast',
  props.type === 'text' || props.type === 'html' ? 'van-toast--text' : 'van-toast--icon',
  `van-toast--${props.position}`,
]);
</script>

<style lang="less" scoped>
.van-toast__container {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.van-toast {
  position: fixed;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  max-width: 70%;
  color: #fff;
  font-size: 14px;
  line-height: 20px;
  white-space: pre-wrap;
  text-align: center;
  word-break: break-all;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;
  transform: translateX(-50%);

  &--middle {
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  &--top {
    top: 20%;
  }

  &--bottom {
    bottom: 20%;
  }

  &--text {
    min-width: 96px;
    padding: 8px 12px;
  }

  &--icon {
    width: 88px;
    min-height: 88px;
    padding: 16px;
  }

  &__icon,
  &__loading {
    margin-bottom: 8px;
    font-size: 36px;
  }
}
</style>
