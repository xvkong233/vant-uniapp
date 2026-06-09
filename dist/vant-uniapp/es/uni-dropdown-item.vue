<template>
  <view class="van-dropdown-item">
    <view class="van-dropdown-item__title" :style="titleStyle" @tap="toggle">
      <text>{{ displayTitle }}</text>
      <UniIcon name="arrow-down" class="van-dropdown-item__icon" />
    </view>
    <UniPopup
      :show="showPopup"
      position="top"
      :overlay="menu?.overlay.value"
      :z-index="menu?.zIndex.value"
      :custom-style="popupStyle"
      :close-on-click-overlay="menu?.closeOnClickOverlay.value"
      :root-portal="rootPortal"
      class="van-dropdown-item__popup"
      @close="menu?.close()"
    >
      <view class="van-dropdown-item__content">
        <UniCell
          v-for="option in options"
          :key="String(option.value)"
          :title="option.text"
          :value="option.value === currentValue ? '✓' : ''"
          :clickable="!option.disabled"
          :custom-style="option.value === currentValue && menu?.activeColor.value ? `color: ${menu.activeColor.value}` : ''"
          @click="select(option)"
        />
        <slot />
      </view>
    </UniPopup>
  </view>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, inject } from 'vue';
import UniCell from './uni-cell.vue';
import UniIcon from './uni-icon.vue';
import UniPopup from './uni-popup.vue';
import { dropdownMenuKey } from './shared/context';
import type { Numeric, OptionItem } from './shared/types';

const props = withDefaults(
  defineProps<{
    value?: Numeric | boolean;
    modelValue?: Numeric | boolean;
    title?: string;
    disabled?: boolean;
    titleClass?: string;
    options?: OptionItem[];
    popupStyle?: string;
    useBeforeToggle?: boolean;
    rootPortal?: boolean;
  }>(),
  {
    title: '',
    titleClass: '',
    popupStyle: '',
    options: () => [],
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: Numeric | boolean | undefined): void;
  (event: 'change', value: Numeric | boolean | undefined): void;
  (event: 'open'): void;
  (event: 'opened'): void;
  (event: 'close'): void;
  (event: 'closed'): void;
  (event: 'before-toggle', value: { status: boolean; callback: (status: boolean) => void }): void;
}>();

const menu = inject(dropdownMenuKey, undefined);
const instance = getCurrentInstance();
const itemName = computed(() => instance?.uid ?? 0);
const currentValue = computed(() => props.modelValue ?? props.value);
const showPopup = computed(() => menu?.openName.value === itemName.value);
const selectedOption = computed(() => props.options.find((item) => item.value === currentValue.value));
const displayTitle = computed(() => props.title || selectedOption.value?.text || '');
const titleStyle = computed(() =>
  selectedOption.value && menu?.activeColor.value ? `color: ${menu.activeColor.value}` : ''
);

function toggle() {
  if (props.disabled) return;
  const next = !showPopup.value;
  if (props.useBeforeToggle) {
    emit('before-toggle', {
      status: next,
      callback: (status: boolean) => {
        if (status) {
          updateShow(next);
        }
      },
    });
    return;
  }
  updateShow(next);
}

function updateShow(next: boolean) {
  menu?.toggle(itemName.value, next);
  if (next) {
    emit('open');
    emit('opened');
  } else {
    emit('close');
    emit('closed');
  }
}

function select(option: OptionItem) {
  if (option.disabled) return;
  emit('update:modelValue', option.value);
  emit('change', option.value);
  menu?.close();
  emit('close');
  emit('closed');
}
</script>

<style lang="less" scoped>
.van-dropdown-item {
  flex: 1;

  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    color: #323233;
    font-size: 15px;
  }

  &__icon {
    margin-left: 4px;
    font-size: 12px;
  }

  &__content {
    padding-top: 48px;
  }
}
</style>
