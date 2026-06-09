<template>
  <view class="van-goods-action-button">
    <UniButton
      :type="type"
      :color="color"
      :loading="loading"
      :disabled="disabled"
      :plain="plain"
      :size="size === 'large' ? 'large' : 'normal'"
      round
      :custom-style="customStyle"
      @click="emit('click', $event)"
    >
      <slot>{{ text }}</slot>
    </UniButton>
  </view>
</template>

<script setup lang="ts">
import UniButton from './uni-button.vue';

withDefaults(
  defineProps<{
    text?: string;
    color?: string;
    size?: 'normal' | 'large';
    loading?: boolean;
    disabled?: boolean;
    plain?: boolean;
    type?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    customStyle?: string;
  }>(),
  {
    text: '',
    color: '',
    size: 'normal',
    type: 'danger',
    customStyle: '',
  }
);

const emit = defineEmits<{
  (event: 'click', value: unknown): void;
}>();
</script>

<style lang="less" scoped>
.van-goods-action-button {
  flex: 1;
  padding: 0 4px;
}
</style>
