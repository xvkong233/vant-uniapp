<template>
  <view :class="rootClass">
    <text
      v-for="item in count"
      :key="item"
      class="van-rate__icon"
      :style="iconStyle(item)"
      @tap="select(item)"
    >
      {{ item <= currentValue ? activeGlyph : voidGlyph }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    value?: number;
    modelValue?: number;
    readonly?: boolean;
    disabled?: boolean;
    allowHalf?: boolean;
    size?: Numeric;
    icon?: string;
    voidIcon?: string;
    color?: string;
    voidColor?: string;
    disabledColor?: string;
    count?: number;
    gutter?: Numeric;
    touchable?: boolean;
  }>(),
  {
    value: 0,
    icon: 'star',
    voidIcon: 'star-o',
    color: '#ee0a24',
    voidColor: '#c8c9cc',
    disabledColor: '#c8c9cc',
    count: 5,
    touchable: true,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void;
  (event: 'input', value: number): void;
  (event: 'change', value: number): void;
}>();

const currentValue = computed(() => props.modelValue ?? props.value);
const activeGlyph = computed(() => (props.icon === 'like' ? '♥' : '★'));
const voidGlyph = computed(() => (props.voidIcon === 'like-o' ? '♡' : '☆'));

const rootClass = computed(() => [
  'van-rate',
  {
    'van-rate--disabled': props.disabled,
    'van-rate--readonly': props.readonly,
  },
]);

function iconStyle(item: number) {
  const styles = [
    `color: ${props.disabled ? props.disabledColor : item <= currentValue.value ? props.color : props.voidColor}`,
  ];
  const size = addUnit(props.size);
  if (size) {
    styles.push(`font-size: ${size}`);
  }
  const gutter = addUnit(props.gutter);
  if (gutter && item !== props.count) {
    styles.push(`margin-right: ${gutter}`);
  }
  return styles.join(';');
}

function select(value: number) {
  if (props.disabled || props.readonly || !props.touchable) {
    return;
  }
  emit('update:modelValue', value);
  emit('input', value);
  emit('change', value);
}
</script>

<style lang="less" scoped>
.van-rate {
  display: inline-flex;
  align-items: center;

  &--disabled {
    opacity: 0.5;
  }

  &__icon {
    color: #ee0a24;
    font-size: 20px;
    line-height: 1;
  }
}
</style>
