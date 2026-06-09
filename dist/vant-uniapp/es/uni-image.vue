<template>
  <view :class="rootClass" :style="rootStyle" @tap="emit('click', $event)">
    <image
      v-if="!error"
      :src="src"
      :mode="imageMode"
      :lazy-load="lazyLoad"
      :webp="webp"
      :show-menu-by-longpress="showMenuByLongpress"
      class="van-image__img"
      @load="handleLoad"
      @error="handleError"
    />
    <view v-if="loading && showLoading" class="van-image__loading">
      <slot name="loading">
        <UniIcon name="photo" class="van-image__loading-icon" />
      </slot>
    </view>
    <view v-if="error && showError" class="van-image__error">
      <slot name="error">
        <UniIcon name="photo-fail" class="van-image__error-icon" />
      </slot>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UniIcon from './uni-icon.vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

const fitModeMap: Record<string, string> = {
  contain: 'aspectFit',
  cover: 'aspectFill',
  fill: 'scaleToFill',
  none: 'center',
  'scale-down': 'aspectFit',
};

const props = withDefaults(
  defineProps<{
    src?: string;
    round?: boolean;
    width?: Numeric;
    height?: Numeric;
    radius?: Numeric;
    lazyLoad?: boolean;
    useErrorSlot?: boolean;
    useLoadingSlot?: boolean;
    showMenuByLongpress?: boolean;
    fit?: string;
    webp?: boolean;
    showError?: boolean;
    showLoading?: boolean;
  }>(),
  {
    src: '',
    fit: 'fill',
    showError: true,
    showLoading: true,
  }
);

const emit = defineEmits<{
  (event: 'load', value: unknown): void;
  (event: 'error', value: unknown): void;
  (event: 'click', value: unknown): void;
}>();

const loading = ref(true);
const error = ref(false);

watch(
  () => props.src,
  () => {
    loading.value = true;
    error.value = false;
  },
  { immediate: true }
);

const rootClass = computed(() => [
  'van-image',
  {
    'van-image--round': props.round,
  },
]);

const rootStyle = computed(() => {
  const styles: string[] = [];

  if (props.width) {
    styles.push(`width: ${addUnit(props.width)}`);
  }

  if (props.height) {
    styles.push(`height: ${addUnit(props.height)}`);
  }

  if (props.radius) {
    styles.push(`border-radius: ${addUnit(props.radius)}`);
  }

  return styles.join(';');
});

const imageMode = computed(() => fitModeMap[props.fit] || props.fit);

function handleLoad(event: any) {
  loading.value = false;
  emit('load', event.detail);
}

function handleError(event: any) {
  loading.value = false;
  error.value = true;
  emit('error', event.detail);
}
</script>

<style lang="less" scoped>
.van-image {
  position: relative;
  display: inline-block;
  overflow: hidden;
  vertical-align: top;

  &--round {
    border-radius: 50%;
  }

  &__img,
  &__error,
  &__loading {
    display: block;
    width: 100%;
    height: 100%;
  }

  &__error,
  &__loading {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #969799;
    font-size: 14px;
    background-color: #f7f8fa;
  }

  &__loading-icon,
  &__error-icon {
    color: #dcdee0;
    font-size: 32px;
  }
}
</style>
