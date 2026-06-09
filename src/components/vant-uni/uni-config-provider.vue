<template>
  <view class="van-config-provider" :style="themeStyle">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toKebabCase } from './shared/utils';

const props = withDefaults(
  defineProps<{
    themeVars?: Record<string, string | number>;
  }>(),
  {
    themeVars: () => ({}),
  }
);

const themeStyle = computed(() =>
  Object.entries(props.themeVars)
    .map(([key, value]) => `--van-${toKebabCase(key)}: ${value}`)
    .join(';')
);
</script>

<style lang="less" scoped>
.van-config-provider {
  display: contents;
}
</style>
