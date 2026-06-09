<template>
  <view class="van-picker">
    <view v-if="showToolbar" :class="['van-picker__toolbar', `van-picker__toolbar--${toolbarPosition}`]">
      <button class="van-picker__cancel" @tap="emitCancel">{{ cancelButtonText }}</button>
      <view v-if="title" class="van-picker__title">{{ title }}</view>
      <button class="van-picker__confirm" @tap="emitConfirm">{{ confirmButtonText }}</button>
    </view>
    <view class="van-picker__columns" :style="columnsStyle">
      <view
        v-for="(column, columnIndex) in normalizedColumns"
        :key="columnIndex"
        class="van-picker__column"
      >
        <view
          v-for="(option, optionIndex) in column.values"
          :key="optionIndex"
          :class="['van-picker__option', { 'van-picker__option--selected': indexes[columnIndex] === optionIndex, 'van-picker__option--disabled': isDisabled(option) }]"
          :style="optionStyle"
          @tap="select(columnIndex, optionIndex)"
        >
          {{ getOptionText(option) }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';

interface PickerColumn {
  values: unknown[];
  defaultIndex?: number;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    loading?: boolean;
    showToolbar?: boolean;
    cancelButtonText?: string;
    confirmButtonText?: string;
    valueKey?: string;
    toolbarPosition?: 'top' | 'bottom';
    defaultIndex?: number;
    columns?: Array<unknown | PickerColumn>;
    itemHeight?: number;
    visibleItemCount?: number;
  }>(),
  {
    title: '',
    showToolbar: true,
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    valueKey: 'text',
    toolbarPosition: 'top',
    defaultIndex: 0,
    columns: () => [],
    itemHeight: 44,
    visibleItemCount: 6,
  }
);

const emit = defineEmits<{
  (event: 'confirm', value: { value: unknown; index: number | number[] }): void;
  (event: 'cancel', value: { value: unknown; index: number | number[] }): void;
  (event: 'change', value: { value: unknown; index: number | number[] }): void;
}>();

const indexes = reactive<number[]>([]);

const normalizedColumns = computed<PickerColumn[]>(() => {
  const columns = props.columns || [];
  if (columns.length && isColumn(columns[0])) {
    return columns as PickerColumn[];
  }
  return [{ values: columns, defaultIndex: props.defaultIndex }];
});

watch(
  normalizedColumns,
  (columns) => {
    columns.forEach((column, index) => {
      indexes[index] = adjustIndex(column.values, column.defaultIndex ?? props.defaultIndex);
    });
    indexes.splice(columns.length);
  },
  { immediate: true }
);

const columnsStyle = computed(() => `height: ${props.itemHeight * props.visibleItemCount}px`);
const optionStyle = computed(() => `height: ${props.itemHeight}px; line-height: ${props.itemHeight}px`);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isColumn(value: unknown): value is PickerColumn {
  return isRecord(value) && Array.isArray(value.values);
}

function isDisabled(option: unknown) {
  return isRecord(option) && !!option.disabled;
}

function getOptionText(option: unknown) {
  return isRecord(option) && props.valueKey in option ? String(option[props.valueKey]) : String(option ?? '');
}

function adjustIndex(options: unknown[], index: number) {
  let next = Math.max(0, Math.min(index, options.length - 1));
  for (let i = next; i < options.length; i++) {
    if (!isDisabled(options[i])) return i;
  }
  for (let i = next - 1; i >= 0; i--) {
    if (!isDisabled(options[i])) return i;
  }
  return next;
}

function select(columnIndex: number, optionIndex: number) {
  const column = normalizedColumns.value[columnIndex];
  if (!column || isDisabled(column.values[optionIndex])) {
    return;
  }
  indexes[columnIndex] = adjustIndex(column.values, optionIndex);
  emit('change', getPayload());
}

function getPayload() {
  const values = normalizedColumns.value.map((column, index) => column.values[indexes[index]]);
  const simple = normalizedColumns.value.length === 1 && !(props.columns.length && isColumn(props.columns[0]));
  return {
    value: simple ? values[0] : values,
    index: simple ? indexes[0] : indexes.slice(),
  };
}

function emitConfirm() {
  emit('confirm', getPayload());
}

function emitCancel() {
  emit('cancel', getPayload());
}
</script>

<style lang="less" scoped>
.van-picker {
  position: relative;
  background: #fff;
  user-select: none;

  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 44px;
  }

  &__title {
    max-width: 50%;
    color: #323233;
    font-weight: 500;
    font-size: 16px;
  }

  &__cancel,
  &__confirm {
    padding: 0 16px;
    color: #576b95;
    font-size: 14px;
    background: transparent;
    border: 0;
  }

  &__cancel::after,
  &__confirm::after {
    border: 0;
  }

  &__columns {
    display: flex;
    overflow: hidden;
  }

  &__column {
    flex: 1;
    overflow-y: auto;
    text-align: center;
  }

  &__option {
    color: #969799;
    font-size: 16px;
  }

  &__option--selected {
    color: #323233;
    font-weight: 500;
  }

  &__option--disabled {
    color: #c8c9cc;
  }
}
</style>
