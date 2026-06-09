<template>
  <view v-if="shouldRender" v-show="active || !tabs" class="van-tab__pane">
    <slot />
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { tabsKey } from './shared/context';
import type { Numeric } from './shared/types';

type TabValue = Numeric | boolean;

const props = withDefaults(
  defineProps<{
    dot?: boolean;
    info?: Numeric | null;
    title?: string;
    disabled?: boolean;
    titleStyle?: string;
    name?: TabValue;
  }>(),
  {
    title: '',
    info: null,
  }
);

const tabs = inject(tabsKey, undefined);
const instance = getCurrentInstance();
const id = instance?.uid || Math.random();
const registeredIndex = ref(0);
const computedName = computed(() => props.name ?? registeredIndex.value);
const active = computed(() => tabs?.active.value === computedName.value);
const inited = ref(false);
const shouldRender = computed(() => !tabs || !tabs.lazyRender.value || active.value || inited.value);

watch(active, (value) => {
  if (value) {
    inited.value = true;
  }
}, { immediate: true });

function sync() {
  if (!tabs) return;
  const nextIndex = tabs.register({
    id,
    name: props.name ?? registeredIndex.value,
    title: props.title,
    disabled: props.disabled,
    dot: props.dot,
    info: props.info,
    titleStyle: props.titleStyle,
  });
  registeredIndex.value = nextIndex;
  tabs.update({
    name: props.name ?? registeredIndex.value,
    title: props.title,
    disabled: props.disabled,
    dot: props.dot,
    info: props.info,
    titleStyle: props.titleStyle,
  }, registeredIndex.value);
}

onMounted(sync);
onUnmounted(() => tabs?.unregister(id));
watch(() => [props.title, props.name, props.disabled, props.dot, props.info, props.titleStyle], sync);
</script>

<style lang="less" scoped>
.van-tab__pane {
  box-sizing: border-box;
  width: 100%;
}
</style>
