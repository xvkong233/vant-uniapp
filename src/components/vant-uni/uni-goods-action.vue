<template>
  <view class="van-goods-action">
    <slot />
    <view v-if="safeAreaInsetBottom" class="van-goods-action__safe" />
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    safeAreaInsetBottom?: boolean;
  }>(),
  {
    safeAreaInsetBottom: true,
  }
);
</script>

<style lang="less" scoped>
.van-goods-action {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  box-sizing: content-box;
  min-height: 50px;
  background: #fff;

  &__safe {
    height: env(safe-area-inset-bottom);
  }
}
</style>
