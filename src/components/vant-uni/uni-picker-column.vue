<template>
  <view class="van-picker-column" :style="columnStyle">
    <view
      v-for="(option, index) in options"
      :key="index"
      :class="['van-picker-column__item', { 'van-picker-column__item--selected': index === currentIndex, 'van-picker-column__item--disabled': isDisabled(option) }]"
      :style="itemStyle"
      @tap="select(index)"
    >
      {{ getOptionText(option) }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    valueKey?: string;
    className?: string;
    itemHeight?: number;
    visibleItemCount?: number;
    initialOptions?: unknown[];
    defaultIndex?: number;
  }>(),
  {
    valueKey: 'text',
    itemHeight: 44,
    visibleItemCount: 6,
    initialOptions: () => [],
    defaultIndex: 0,
  }
);

const emit = defineEmits<{
  (event: 'change', value: number): void;
}>();

const currentIndex = ref(props.defaultIndex);
const options = computed(() => props.initialOptions);

watch(
  () => props.defaultIndex,
  (value) => {
    currentIndex.value = adjustIndex(value);
  }
);

const columnStyle = computed(() => `height: ${props.itemHeight * props.visibleItemCount}px`);
const itemStyle = computed(() => `height: ${props.itemHeight}px; line-height: ${props.itemHeight}px`);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDisabled(option: unknown) {
  return isRecord(option) && !!option.disabled;
}

function getOptionText(option: unknown) {
  return isRecord(option) && props.valueKey in option ? String(option[props.valueKey]) : String(option ?? '');
}

function adjustIndex(index: number) {
  const count = options.value.length;
  let next = Math.max(0, Math.min(index, count - 1));
  for (let i = next; i < count; i++) {
    if (!isDisabled(options.value[i])) return i;
  }
  for (let i = next - 1; i >= 0; i--) {
    if (!isDisabled(options.value[i])) return i;
  }
  return next;
}

function select(index: number) {
  if (isDisabled(options.value[index])) {
    return;
  }
  currentIndex.value = adjustIndex(index);
  emit('change', currentIndex.value);
}

defineExpose({
  getValue: () => options.value[currentIndex.value],
  getIndex: () => currentIndex.value,
  setIndex: (index: number) => {
    currentIndex.value = adjustIndex(index);
  },
});
</script>

<style lang="less" scoped>
.van-picker-column {
  flex: 1;
  overflow-y: auto;
  text-align: center;

  &__item {
    color: #969799;
    font-size: 16px;
  }

  &__item--selected {
    color: #323233;
    font-weight: 500;
  }

  &__item--disabled {
    color: #c8c9cc;
  }
}
</style>
