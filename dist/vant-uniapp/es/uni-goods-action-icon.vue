<template>
  <view :class="rootClass" @tap="handleClick">
    <UniIcon :name="icon" :dot="dot" :info="info" :size="size" :color="color" />
    <text v-if="text" class="van-goods-action-icon__text">{{ text }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';

const props = withDefaults(
  defineProps<{
    text?: string;
    dot?: boolean;
    info?: string;
    icon?: string;
    size?: string;
    color?: string;
    classPrefix?: string;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    text: '',
    info: '',
    icon: '',
    size: '20px',
    color: '',
    classPrefix: 'van-icon',
  }
);

const emit = defineEmits<{
  (event: 'click', value: unknown): void;
}>();

const rootClass = computed(() => [
  'van-goods-action-icon',
  {
    'van-goods-action-icon--disabled': props.disabled,
  },
]);

function handleClick(event: unknown) {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
}
</script>

<style lang="less" scoped>
.van-goods-action-icon {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  color: #646566;
  font-size: 10px;

  &--disabled {
    opacity: 0.5;
  }

  &__text {
    margin-top: 4px;
  }
}
</style>
