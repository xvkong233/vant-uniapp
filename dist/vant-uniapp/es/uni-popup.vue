<template>
  <UniOverlay
    v-if="overlay"
    :show="show"
    :z-index="zIndex"
    :custom-style="overlayStyle"
    @click="handleOverlayClick"
  />
  <view v-if="show" :class="rootClass" :style="rootStyle">
    <slot />
    <UniIcon
      v-if="closeable"
      :name="closeIcon"
      :class="closeClass"
      @click="emit('close')"
    />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';
import UniOverlay from './uni-overlay.vue';
import { normalizeStyle } from './shared/utils';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    round?: boolean;
    closeable?: boolean;
    customStyle?: string | Record<string, string | number>;
    overlayStyle?: string | Record<string, string | number>;
    transition?: string;
    zIndex?: number;
    overlay?: boolean;
    closeIcon?: string;
    closeIconPosition?: string;
    closeOnClickOverlay?: boolean;
    position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    safeAreaInsetBottom?: boolean;
    safeAreaInsetTop?: boolean;
    safeAreaTabBar?: boolean;
    lockScroll?: boolean;
    rootPortal?: boolean;
  }>(),
  {
    zIndex: 100,
    overlay: true,
    closeIcon: 'cross',
    closeIconPosition: 'top-right',
    closeOnClickOverlay: true,
    position: 'center',
    customStyle: '',
    overlayStyle: '',
  }
);

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'click-overlay'): void;
}>();

const rootClass = computed(() => [
  'van-popup',
  `van-popup--${props.position}`,
  {
    'van-popup--round': props.round,
    'van-popup--safe-bottom': props.safeAreaInsetBottom,
    'van-popup--safe-top': props.safeAreaInsetTop,
  },
]);

const closeClass = computed(() => [
  'van-popup__close-icon',
  `van-popup__close-icon--${props.closeIconPosition}`,
]);

const rootStyle = computed(() =>
  [`z-index: ${props.zIndex + 1}`, normalizeStyle(props.customStyle)]
    .filter(Boolean)
    .join(';')
);

function handleOverlayClick() {
  emit('click-overlay');
  if (props.closeOnClickOverlay) {
    emit('close');
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  position: fixed;
  max-height: 100%;
  overflow-y: auto;
  background: #fff;
  transition: transform 0.3s;

  &--center {
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  &--top {
    top: 0;
    left: 0;
    width: 100%;
  }

  &--bottom {
    bottom: 0;
    left: 0;
    width: 100%;
  }

  &--left {
    top: 0;
    bottom: 0;
    left: 0;
  }

  &--right {
    top: 0;
    right: 0;
    bottom: 0;
  }

  &--round&--bottom {
    border-radius: 16px 16px 0 0;
  }

  &--round&--top {
    border-radius: 0 0 16px 16px;
  }

  &__close-icon {
    position: absolute;
    color: #969799;
    font-size: 22px;

    &--top-right {
      top: 16px;
      right: 16px;
    }

    &--top-left {
      top: 16px;
      left: 16px;
    }
  }
}
</style>
