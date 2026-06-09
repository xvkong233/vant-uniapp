<template>
  <view class="van-empty">
    <slot name="image">
      <view class="van-empty__image">{{ imageText }}</view>
    </slot>
    <slot name="description">
      <text v-if="description" class="van-empty__description">{{ description }}</text>
    </slot>
    <view v-if="$slots.default" class="van-empty__bottom">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    description?: string;
    image?: string;
  }>(),
  {
    description: '',
    image: 'default',
  }
);

const imageText = computed(() => {
  const map: Record<string, string> = {
    default: 'empty',
    error: 'error',
    network: 'network',
    search: 'search',
  };
  return map[props.image] || props.image;
});
</script>

<style lang="less" scoped>
.van-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 32px 0;

  &__image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
    color: #c8c9cc;
    font-size: 20px;
    background: #f7f8fa;
    border-radius: 8px;
  }

  &__description {
    margin-top: 16px;
    padding: 0 60px;
    color: #969799;
    font-size: 14px;
    line-height: 20px;
  }

  &__bottom {
    margin-top: 24px;
  }
}
</style>
