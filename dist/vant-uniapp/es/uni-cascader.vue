<template>
  <view class="van-cascader">
    <view v-if="showHeader" class="van-cascader__header">
      <slot name="title">
        <text>{{ title }}</text>
      </slot>
      <UniIcon v-if="closeable" :name="closeIcon" @click="emit('close')" />
    </view>
    <view class="van-cascader__tabs">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['van-cascader__tab', { 'van-cascader__tab--active': index === activeTab }]"
        :style="index === activeTab ? activeStyle : ''"
        @tap="clickTab(index)"
      >
        {{ tab.selected ? getText(tab.selected) : placeholder }}
      </view>
    </view>
    <view class="van-cascader__options">
      <view
        v-for="option in tabs[activeTab]?.options || []"
        :key="String(getValue(option))"
        :class="['van-cascader__option', { 'van-cascader__option--selected': tabs[activeTab]?.selected === option, 'van-cascader__option--disabled': option.disabled }]"
        :style="tabs[activeTab]?.selected === option ? activeStyle : ''"
        @tap="select(option)"
      >
        {{ getText(option) }}
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import UniIcon from './uni-icon.vue';
import type { OptionItem } from './shared/types';

interface CascaderTab {
  options: OptionItem[];
  selected: OptionItem | null;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    value?: string | number;
    modelValue?: string | number;
    placeholder?: string;
    activeColor?: string;
    options?: OptionItem[];
    swipeable?: boolean;
    closeable?: boolean;
    ellipsis?: boolean;
    showHeader?: boolean;
    closeIcon?: string;
    fieldNames?: { text?: string; value?: string; children?: string };
    useTitleSlot?: boolean;
  }>(),
  {
    title: '',
    placeholder: '请选择',
    activeColor: '#1989fa',
    options: () => [],
    swipeable: false,
    closeable: true,
    ellipsis: true,
    showHeader: true,
    closeIcon: 'cross',
    fieldNames: () => ({ text: 'text', value: 'value', children: 'children' }),
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number | undefined): void;
  (event: 'change', value: { value: unknown; tabIndex: number; selectedOptions: OptionItem[] }): void;
  (event: 'finish', value: { value: unknown; tabIndex: number; selectedOptions: OptionItem[] }): void;
  (event: 'close'): void;
  (event: 'click-tab', value: { tabIndex: number; title: string }): void;
}>();

const tabs = ref<CascaderTab[]>([]);
const activeTab = ref(0);
const activeStyle = computed(() => `color: ${props.activeColor}`);

function key(name: 'text' | 'value' | 'children') {
  return props.fieldNames?.[name] || name;
}

function getText(option: OptionItem) {
  return String(option[key('text')] ?? option.text ?? '');
}

function getValue(option: OptionItem) {
  return option[key('value')] ?? option.value;
}

function getChildren(option: OptionItem) {
  return (option[key('children')] ?? option.children) as OptionItem[] | undefined;
}

function resetTabs() {
  tabs.value = [{ options: props.options, selected: null }];
  activeTab.value = 0;
}

watch(() => [props.options, props.value, props.modelValue] as const, syncByValue, { immediate: true, deep: true });

function findPath(options: OptionItem[], value: unknown): OptionItem[] {
  for (const option of options) {
    if (getValue(option) === value) {
      return [option];
    }
    const children = getChildren(option);
    if (children?.length) {
      const childPath = findPath(children, value);
      if (childPath.length) {
        return [option, ...childPath];
      }
    }
  }
  return [];
}

function syncByValue() {
  const value = props.modelValue ?? props.value;
  if (value === undefined || value === null || value === '') {
    resetTabs();
    return;
  }

  const path = findPath(props.options, value);
  if (!path.length) {
    resetTabs();
    return;
  }

  const nextTabs: CascaderTab[] = [];
  let options = props.options;
  path.forEach((option) => {
    nextTabs.push({ options, selected: option });
    options = getChildren(option) || [];
  });

  if (options.length) {
    nextTabs.push({ options, selected: null });
  }
  tabs.value = nextTabs;
  activeTab.value = Math.max(0, nextTabs.length - 1);
}

function select(option: OptionItem) {
  if (option.disabled) return;
  tabs.value[activeTab.value].selected = option;
  tabs.value = tabs.value.slice(0, activeTab.value + 1);
  const children = getChildren(option);
  const selectedOptions = tabs.value.map((tab) => tab.selected).filter(Boolean) as OptionItem[];
  const value = getValue(option);
  emit('update:modelValue', value as string | number | undefined);
  emit('change', { value, tabIndex: activeTab.value, selectedOptions });
  if (children?.length) {
    tabs.value.push({ options: children, selected: null });
    activeTab.value += 1;
  } else {
    emit('finish', { value, tabIndex: activeTab.value, selectedOptions });
  }
}

function clickTab(index: number) {
  activeTab.value = index;
  emit('click-tab', {
    tabIndex: index,
    title: tabs.value[index]?.selected ? getText(tabs.value[index].selected) : props.placeholder,
  });
}
</script>

<style lang="less" scoped>
.van-cascader {
  background: #fff;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 0 16px;
    font-weight: 500;
  }

  &__tabs {
    display: flex;
    border-bottom: 1px solid #ebedf0;
  }

  &__tab {
    padding: 12px 16px;
    color: #646566;
  }

  &__tab--active {
    color: #1989fa;
  }

  &__option {
    padding: 12px 16px;
    font-size: 14px;
  }

  &__option--selected {
    color: #1989fa;
  }

  &__option--disabled {
    color: #c8c9cc;
  }
}
</style>
