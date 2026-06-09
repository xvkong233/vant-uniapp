<template>
  <UniPopup
    :show="show"
    position="bottom"
    :round="round"
    :z-index="zIndex"
    :overlay="overlay"
    :close-on-click-overlay="closeOnClickOverlay"
    :safe-area-inset-bottom="safeAreaInsetBottom"
    class="van-action-sheet"
    @close="handleOverlayClose"
  >
    <view v-if="title" class="van-action-sheet__header">
      <text>{{ title }}</text>
      <UniIcon name="cross" class="van-action-sheet__close" @click="emit('close')" />
    </view>
    <view v-if="description" class="van-action-sheet__description">
      {{ description }}
    </view>
    <view v-if="actions.length" class="van-action-sheet__list">
      <button
        v-for="(item, index) in actions"
        :key="index"
        :class="['van-action-sheet__item', item.className, { 'van-action-sheet__item--disabled': item.disabled || item.loading }]"
        :style="item.color ? `color: ${item.color}` : ''"
        :disabled="item.disabled || item.loading"
        hover-class="van-action-sheet__item--hover"
        @tap="select(item)"
      >
        <template v-if="!item.loading">
          <text>{{ item.name }}</text>
          <text v-if="item.subname" class="van-action-sheet__subname">{{ item.subname }}</text>
        </template>
        <UniLoading v-else size="22" />
      </button>
    </view>
    <slot />
    <template v-if="cancelText">
      <view class="van-action-sheet__gap" />
      <view class="van-action-sheet__cancel" hover-class="van-action-sheet__cancel--hover" @tap="cancel">
        {{ cancelText }}
      </view>
    </template>
  </UniPopup>
</template>

<script setup lang="ts">
import UniIcon from './uni-icon.vue';
import UniLoading from './uni-loading.vue';
import UniPopup from './uni-popup.vue';

export interface ActionSheetItem {
  name?: string;
  subname?: string;
  color?: string;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
    show?: boolean;
    title?: string;
    cancelText?: string;
    description?: string;
    round?: boolean;
    zIndex?: number;
    actions?: ActionSheetItem[];
    overlay?: boolean;
    closeOnClickOverlay?: boolean;
    closeOnClickAction?: boolean;
    safeAreaInsetBottom?: boolean;
    rootPortal?: boolean;
  }>(),
  {
    title: '',
    cancelText: '',
    description: '',
    round: true,
    zIndex: 100,
    actions: () => [],
    overlay: true,
    closeOnClickOverlay: true,
    closeOnClickAction: true,
    safeAreaInsetBottom: true,
  }
);

const emit = defineEmits<{
  (event: 'select', value: ActionSheetItem): void;
  (event: 'cancel'): void;
  (event: 'close'): void;
  (event: 'click-overlay'): void;
  (event: 'getuserinfo', value: unknown): void;
}>();

function select(item: ActionSheetItem) {
  if (item.disabled || item.loading) {
    return;
  }
  emit('select', item);
  if (props.closeOnClickAction) {
    emit('close');
  }
}

function cancel() {
  emit('cancel');
  emit('close');
}

function handleOverlayClose() {
  emit('click-overlay');
  emit('close');
}
</script>

<style lang="less" scoped>
.van-action-sheet {
  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    color: #323233;
    font-weight: 500;
    font-size: 16px;
  }

  &__close {
    position: absolute;
    right: 16px;
    color: #c8c9cc;
    font-size: 22px;
  }

  &__description {
    padding: 20px 16px;
    color: #969799;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
  }

  &__item,
  &__cancel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 50px;
    padding: 0;
    color: #323233;
    font-size: 16px;
    line-height: 22px;
    background: #fff;
    border: 0;
    border-radius: 0;
  }

  &__item::after {
    border: 0;
  }

  &__item--disabled {
    color: #c8c9cc;
  }

  &__item--hover,
  &__cancel--hover {
    background: #f2f3f5;
  }

  &__subname {
    margin-top: 4px;
    color: #969799;
    font-size: 12px;
    line-height: 18px;
  }

  &__gap {
    height: 8px;
    background: #f7f8fa;
  }
}
</style>
