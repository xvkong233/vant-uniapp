<template>
  <view :class="rootClass" :style="rootStyle">
    <slot />
    <UniIcon v-if="closeable" name="cross" class="van-tag__close" @click="emit('close')" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';

const props = withDefaults(
  defineProps<{
    size?: string;
    mark?: boolean;
    color?: string;
    plain?: boolean;
    round?: boolean;
    textColor?: string;
    type?: 'default' | 'primary' | 'success' | 'danger' | 'warning';
    closeable?: boolean;
    customClass?: string;
  }>(),
  {
    size: '',
    type: 'default',
    color: '',
    textColor: '',
    customClass: '',
  }
);

const emit = defineEmits<{
  (event: 'close'): void;
}>();

const rootClass = computed(() => [
  'van-tag',
  `van-tag--${props.type}`,
  props.size ? `van-tag--${props.size}` : '',
  props.customClass,
  {
    'van-tag--mark': props.mark,
    'van-tag--plain': props.plain,
    'van-tag--round': props.round,
  },
]);

const rootStyle = computed(() => {
  const styles: string[] = [];

  if (props.color) {
    styles.push(props.plain ? `color: ${props.color}` : `background-color: ${props.color}`);
    styles.push(`border-color: ${props.color}`);
  }

  if (props.textColor) {
    styles.push(`color: ${props.textColor}`);
  }

  return styles.join(';');
});
</script>

<style lang="less" scoped>
.van-tag {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  border-radius: 2px;

  &--default {
    background-color: #969799;
  }

  &--primary,
  &--success {
    background-color: #07c160;
  }

  &--danger {
    background-color: #ee0a24;
  }

  &--warning {
    background-color: #ff976a;
  }

  &--plain {
    background-color: #fff;
  }

  &--plain&--default {
    color: #969799;
  }

  &--plain&--primary,
  &--plain&--success {
    color: #07c160;
  }

  &--plain&--danger {
    color: #ee0a24;
  }

  &--plain&--warning {
    color: #ff976a;
  }

  &--plain::before {
    position: absolute;
    inset: 0;
    border: 1px solid currentColor;
    border-radius: inherit;
    content: '';
  }

  &--medium {
    padding: 2px 6px;
  }

  &--large {
    padding: 4px 8px;
    font-size: 14px;
    border-radius: 4px;
  }

  &--mark {
    border-radius: 0 999px 999px 0;
  }

  &--round {
    border-radius: 999px;
  }

  &__close {
    margin-left: 2px;
  }
}
</style>
