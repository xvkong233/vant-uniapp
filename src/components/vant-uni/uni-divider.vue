<template>
  <view :class="rootClass" :style="rootStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { addUnit, normalizeStyle } from './shared/utils';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    dashed?: boolean;
    hairline?: boolean;
    contentPosition?: 'left' | 'center' | 'right';
    fontSize?: Numeric;
    borderColor?: string;
    textColor?: string;
    customStyle?: string | Record<string, string | number>;
  }>(),
  {
    contentPosition: 'center',
    customStyle: '',
  }
);

const rootClass = computed(() => [
  'van-divider',
  `van-divider--${props.contentPosition}`,
  {
    'van-divider--dashed': props.dashed,
    'van-divider--hairline': props.hairline,
  },
]);

const rootStyle = computed(() => {
  const styles = [normalizeStyle(props.customStyle)];
  const fontSize = addUnit(props.fontSize);

  if (fontSize) {
    styles.push(`font-size: ${fontSize}`);
  }

  if (props.borderColor) {
    styles.push(`border-color: ${props.borderColor}`);
  }

  if (props.textColor) {
    styles.push(`color: ${props.textColor}`);
  }

  return styles.filter(Boolean).join(';');
});
</script>

<style lang="less" scoped>
.van-divider {
  display: flex;
  align-items: center;
  margin: 16px 0;
  color: #969799;
  font-size: 14px;
  line-height: 24px;
  border-color: #ebedf0;
  border-style: solid;
  border-width: 0;

  &::before,
  &::after {
    display: block;
    flex: 1;
    box-sizing: border-box;
    height: 1px;
    border-color: inherit;
    border-style: inherit;
    border-width: 1px 0 0;
    content: '';
  }

  &--hairline::before,
  &--hairline::after {
    transform: scaleY(0.5);
  }

  &--dashed {
    border-style: dashed;
  }

  &--center::before,
  &--left::before {
    margin-right: 16px;
  }

  &--center::after,
  &--right::after {
    margin-left: 16px;
  }

  &--left::before {
    max-width: 10%;
  }

  &--right::after {
    max-width: 10%;
  }
}
</style>
