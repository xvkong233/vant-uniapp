<template>
  <view class="van-panel">
    <view v-if="title || desc || status || $slots.header" class="van-panel__header">
      <slot name="header">
        <view class="van-panel__title">{{ title }}</view>
        <view v-if="desc" class="van-panel__desc">{{ desc }}</view>
        <view v-if="status" class="van-panel__status">{{ status }}</view>
      </slot>
    </view>
    <view class="van-panel__content">
      <slot />
    </view>
    <view v-if="$slots.footer" class="van-panel__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    desc?: string;
    title?: string;
    status?: string;
  }>(),
  {
    desc: '',
    title: '',
    status: '',
  }
);
</script>

<style lang="less" scoped>
.van-panel {
  background: #fff;

  &__header,
  &__footer {
    position: relative;
    padding: 12px 16px;
  }

  &__title {
    color: #323233;
    font-size: 14px;
    line-height: 20px;
  }

  &__desc {
    margin-top: 4px;
    color: #969799;
    font-size: 12px;
  }

  &__status {
    position: absolute;
    top: 12px;
    right: 16px;
    color: #ee0a24;
  }

  &__content {
    padding: 16px;
  }
}
</style>
