<template>
  <UniPopup
    :show="show"
    position="bottom"
    round
    :overlay="overlay"
    :close-on-click-overlay="closeOnClickOverlay"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    :root-portal="rootPortal"
    @click-overlay="emit('click-overlay')"
    @close="emit('close')"
  >
    <view class="van-share-sheet">
      <view v-if="title" class="van-share-sheet__title">{{ title }}</view>
      <view v-if="description" class="van-share-sheet__description">{{ description }}</view>
      <view class="van-share-sheet__options">
        <view v-for="(option, index) in options" :key="index" class="van-share-sheet__option" @tap="select(option, index)">
          <UniIcon :name="option.icon || 'share'" class="van-share-sheet__icon" />
          <text>{{ option.name }}</text>
          <text v-if="option.description" class="van-share-sheet__option-description">{{ option.description }}</text>
        </view>
      </view>
      <view v-if="cancelText" class="van-share-sheet__cancel" @tap="cancel">{{ cancelText }}</view>
    </view>
  </UniPopup>
</template>

<script setup lang="ts">
import UniIcon from './uni-icon.vue';
import UniPopup from './uni-popup.vue';
import type { OptionItem } from './shared/types';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    title?: string;
    cancelText?: string;
    description?: string;
    options?: OptionItem[];
    overlay?: boolean;
    safeAreaInsetBottom?: boolean;
    closeOnClickOverlay?: boolean;
    duration?: number;
    rootPortal?: boolean;
  }>(),
  {
    title: '',
    cancelText: '取消',
    description: '',
    options: () => [],
    overlay: true,
    safeAreaInsetBottom: true,
    closeOnClickOverlay: true,
    duration: 300,
  }
);

const emit = defineEmits<{
  (event: 'select', value: { option: OptionItem; index: number }): void;
  (event: 'cancel'): void;
  (event: 'close'): void;
  (event: 'click-overlay'): void;
}>();

function select(option: OptionItem, index: number) {
  emit('select', { option, index });
}

function cancel() {
  emit('cancel');
  emit('close');
}
</script>

<style lang="less" scoped>
.van-share-sheet {
  background: #fff;

  &__title {
    padding-top: 16px;
    text-align: center;
    font-weight: 500;
  }

  &__description {
    margin-top: 8px;
    color: #969799;
    font-size: 12px;
    text-align: center;
  }

  &__options {
    display: flex;
    padding: 16px;
    overflow-x: auto;
  }

  &__option {
    display: flex;
    flex: 0 0 80px;
    flex-direction: column;
    align-items: center;
    color: #323233;
    font-size: 12px;
  }

  &__icon {
    margin-bottom: 8px;
    font-size: 32px;
  }

  &__option-description {
    margin-top: 4px;
    color: #969799;
  }

  &__cancel {
    padding: 14px;
    text-align: center;
    border-top: 8px solid #f7f8fa;
  }
}
</style>
