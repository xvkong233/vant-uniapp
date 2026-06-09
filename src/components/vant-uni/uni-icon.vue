<template>
  <view :class="rootClass" :style="rootStyle" @tap="emit('click')">
    <image v-if="isImage" :src="name" mode="aspectFit" class="van-icon__image" />
    <text v-else class="van-icon__glyph">{{ glyph }}</text>
    <text v-if="dot || info !== null" :class="['van-icon__info', { 'van-icon__info--dot': dot }]">
      {{ dot ? '' : info }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { addUnit, normalizeStyle } from './shared/utils';
import type { Numeric } from './shared/types';

const iconMap: Record<string, string> = {
  success: '✓',
  cross: '×',
  plus: '+',
  minus: '−',
  arrow: '›',
  'arrow-left': '‹',
  'arrow-up': '⌃',
  'arrow-down': '⌄',
  search: '⌕',
  close: '×',
  checked: '✓',
  warning: '!',
  info: 'i',
};

const props = withDefaults(
  defineProps<{
    name?: string;
    dot?: boolean;
    info?: Numeric | null;
    size?: Numeric;
    color?: string;
    customStyle?: string | Record<string, string | number>;
    classPrefix?: string;
  }>(),
  {
    name: '',
    info: null,
    classPrefix: 'van-icon',
    customStyle: '',
  }
);

const emit = defineEmits<{
  (event: 'click'): void;
}>();

const isImage = computed(() => /^https?:|^data:image|^\//.test(props.name));
const glyph = computed(() => iconMap[props.name] || props.name || '');

const rootClass = computed(() => [
  props.classPrefix,
  `${props.classPrefix}-${props.name}`,
  {
    'van-icon--image': isImage.value,
    'van-icon--custom': !isImage.value,
  },
]);

const rootStyle = computed(() => {
  const styles = [normalizeStyle(props.customStyle)];
  const size = addUnit(props.size);

  if (size) {
    styles.push(`font-size: ${size}`);
  }

  if (props.color) {
    styles.push(`color: ${props.color}`);
  }

  return styles.filter(Boolean).join(';');
});
</script>

<style lang="less" scoped>
.van-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  color: inherit;
  font-size: inherit;
  line-height: 1;
  vertical-align: middle;

  &__glyph {
    display: block;
    line-height: 1;
  }

  &__image {
    width: 100%;
    height: 100%;
  }

  &__info {
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    min-width: 16px;
    padding: 0 3px;
    color: #fff;
    font-size: 10px;
    line-height: 14px;
    text-align: center;
    background: #ee0a24;
    border: 1px solid #fff;
    border-radius: 16px;
    transform: translate(50%, -50%);

    &--dot {
      width: 8px;
      min-width: 0;
      height: 8px;
      padding: 0;
      border-radius: 100%;
    }
  }
}
</style>
