<template>
  <view v-if="show" :class="rootClass" :style="customStyle" @tap="emit('click', $event)">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    name?: string;
    duration?: number;
    customStyle?: string;
  }>(),
  {
    name: 'fade',
    duration: 300,
    customStyle: '',
  }
);

const emit = defineEmits<{
  (event: 'click', value: unknown): void;
}>();

const rootClass = computed(() => ['van-transition', `van-transition--${props.name}`]);
</script>

<style lang="less" scoped>
.van-transition {
  transition: all 0.3s;

  &--fade {
    opacity: 1;
  }

  &--slide-down {
    animation: van-slide-down 0.3s;
  }
}

@keyframes van-slide-down {
  from {
    transform: translateY(-100%);
  }
}
</style>
