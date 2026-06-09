<template>
  <UniPopup
    :show="show"
    position="center"
    :z-index="zIndex"
    :overlay="overlay"
    :custom-style="dialogStyle"
    :overlay-style="overlayStyle"
    :close-on-click-overlay="closeOnClickOverlay"
    class="van-dialog"
    @close="handleOverlay"
  >
    <view v-if="title || $slots.title" class="van-dialog__header">
      <slot name="title">{{ title }}</slot>
    </view>
    <view v-if="$slots.default" class="van-dialog__content">
      <slot />
    </view>
    <view v-else-if="message" :class="messageClass">
      <text>{{ message }}</text>
    </view>
    <view v-if="showCancelButton || showConfirmButton" class="van-dialog__footer">
      <UniButton
        v-if="showCancelButton"
        size="large"
        class="van-dialog__button"
        :loading="loading.cancel"
        :custom-style="`color: ${cancelButtonColor}`"
        @click="handleAction('cancel')"
      >
        <slot name="cancel-button">{{ cancelButtonText }}</slot>
      </UniButton>
      <UniButton
        v-if="showConfirmButton"
        size="large"
        class="van-dialog__button"
        :loading="loading.confirm"
        :custom-style="`color: ${confirmButtonColor}`"
        @click="handleAction('confirm')"
      >
        <slot name="confirm-button">{{ confirmButtonText }}</slot>
      </UniButton>
    </view>
  </UniPopup>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import UniButton from './uni-button.vue';
import UniPopup from './uni-popup.vue';
import { addUnit, normalizeStyle } from './shared/utils';
import type { Numeric } from './shared/types';

type DialogAction = 'confirm' | 'cancel' | 'overlay';

const props = withDefaults(
  defineProps<{
    show?: boolean;
    title?: string;
    message?: string;
    theme?: string;
    confirmButtonId?: string;
    className?: string;
    customStyle?: string | Record<string, string | number>;
    asyncClose?: boolean;
    messageAlign?: string;
    beforeClose?: (action: DialogAction) => boolean | Promise<boolean>;
    overlayStyle?: string | Record<string, string | number>;
    useSlot?: boolean;
    useTitleSlot?: boolean;
    useConfirmButtonSlot?: boolean;
    useCancelButtonSlot?: boolean;
    showCancelButton?: boolean;
    closeOnClickOverlay?: boolean;
    confirmButtonOpenType?: string;
    width?: Numeric;
    zIndex?: number;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonColor?: string;
    cancelButtonColor?: string;
    showConfirmButton?: boolean;
    overlay?: boolean;
    transition?: string;
    rootPortal?: boolean;
  }>(),
  {
    title: '',
    message: '',
    theme: 'default',
    customStyle: '',
    messageAlign: '',
    overlayStyle: '',
    zIndex: 2000,
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    confirmButtonColor: '#ee0a24',
    cancelButtonColor: '#646566',
    showConfirmButton: true,
    overlay: true,
  }
);

const emit = defineEmits<{
  (event: 'update:show', value: boolean): void;
  (event: 'confirm', value: { dialog: unknown }): void;
  (event: 'cancel', value: { dialog: unknown }): void;
  (event: 'close', value: DialogAction): void;
}>();

const loading = reactive({ confirm: false, cancel: false });

const dialogStyle = computed(() =>
  [
    props.width ? `width: ${addUnit(props.width)}` : 'width: 320px',
    normalizeStyle(props.customStyle),
  ]
    .filter(Boolean)
    .join(';')
);

const messageClass = computed(() => [
  'van-dialog__message',
  props.messageAlign ? `van-dialog__message--${props.messageAlign}` : '',
  {
    'van-dialog__message--has-title': !!props.title,
  },
]);

function stopLoading() {
  loading.confirm = false;
  loading.cancel = false;
}

async function close(action: DialogAction) {
  emit('update:show', false);
  emit('close', action);
  stopLoading();
}

async function handleAction(action: 'confirm' | 'cancel') {
  if (action === 'confirm') {
    emit('confirm', { dialog: null });
  } else {
    emit('cancel', { dialog: null });
  }
  if (!props.asyncClose && !props.beforeClose) {
    close(action);
    return;
  }
  loading[action] = true;
  if (props.beforeClose) {
    const canClose = await props.beforeClose(action);
    if (canClose) {
      close(action);
    } else {
      stopLoading();
    }
  }
}

function handleOverlay() {
  if (props.closeOnClickOverlay) {
    close('overlay');
  }
}
</script>

<style lang="less" scoped>
.van-dialog {
  overflow: hidden;
  border-radius: 16px;

  &__header {
    padding-top: 26px;
    color: #323233;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }

  &__content {
    padding: 24px;
  }

  &__message {
    max-height: 60vh;
    padding: 26px 24px;
    overflow-y: auto;
    color: #646566;
    font-size: 14px;
    line-height: 20px;
    text-align: center;

    &--has-title {
      padding-top: 8px;
    }

    &--left {
      text-align: left;
    }

    &--right {
      text-align: right;
    }
  }

  &__footer {
    display: flex;
    border-top: 1px solid #ebedf0;
  }

  &__button {
    flex: 1;
  }
}
</style>
