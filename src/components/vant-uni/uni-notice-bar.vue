<template>
  <view v-if="visible" class="van-notice-bar" :style="rootStyle" @tap="handleClick">
    <UniIcon v-if="leftIcon" :name="leftIcon" class="van-notice-bar__left-icon" />
    <view class="van-notice-bar__wrap">
      <text :class="contentClass" :style="contentStyle">{{ text }}<slot /></text>
    </view>
    <UniIcon
      v-if="mode === 'closeable'"
      name="cross"
      class="van-notice-bar__right-icon"
      @click="close"
    />
    <UniIcon
      v-else-if="mode === 'link'"
      name="arrow"
      class="van-notice-bar__right-icon"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import UniIcon from './uni-icon.vue';

const props = withDefaults(
  defineProps<{
    text?: string;
    mode?: '' | 'closeable' | 'link';
    url?: string;
    openType?: 'navigate' | 'redirect' | 'switchTab' | 'reLaunch' | 'navigateBack' | string;
    delay?: number;
    speed?: number;
    leftIcon?: string;
    color?: string;
    backgroundColor?: string;
    background?: string;
    wrapable?: boolean;
    scrollable?: boolean;
  }>(),
  {
    text: '',
    mode: '',
    url: '',
    openType: 'navigate',
    delay: 1,
    speed: 60,
    leftIcon: '',
  }
);

const emit = defineEmits<{
  (event: 'click', value: unknown): void;
  (event: 'close', value: unknown): void;
}>();

const visible = ref(true);

const rootStyle = computed(() =>
  [
    props.color ? `color: ${props.color}` : '',
    props.backgroundColor || props.background ? `background: ${props.backgroundColor || props.background}` : '',
  ]
    .filter(Boolean)
    .join(';')
);

const contentClass = computed(() => [
  'van-notice-bar__content',
  {
    'van-notice-bar__content--wrap': props.wrapable,
    'van-notice-bar__content--scroll': props.scrollable,
  },
]);

const contentStyle = computed(() => {
  if (props.wrapable || props.scrollable === false) return '';
  const duration = Math.max(6, Math.round((props.text.length * 14) / Math.max(1, props.speed)));
  return `animation-delay: ${props.delay}s; animation-duration: ${duration}s`;
});

function close(event?: unknown) {
  visible.value = false;
  emit('close', event);
}

function handleClick(event: unknown) {
  emit('click', event);
  if (!props.url) return;

  const methodMap: Record<string, (options: { url: string }) => void> = {
    navigate: uni.navigateTo,
    redirect: uni.redirectTo,
    switchTab: uni.switchTab,
    reLaunch: uni.reLaunch,
    navigateBack: () => uni.navigateBack(),
  };
  const method = methodMap[props.openType] || uni.navigateTo;
  method({ url: props.url });
}
</script>

<style lang="less" scoped>
.van-notice-bar {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  color: #ed6a0c;
  font-size: 14px;
  line-height: 24px;
  background: #fffbe8;

  &__left-icon {
    margin-right: 4px;
  }

  &__right-icon {
    margin-left: 4px;
  }

  &__wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
  }

  &__content {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--wrap {
      white-space: normal;
    }

    &--scroll {
      display: inline-block;
      min-width: 100%;
      overflow: visible;
      animation-name: van-notice-bar-scroll;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    }
  }
}

@keyframes van-notice-bar-scroll {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(-100%);
  }
}
</style>
