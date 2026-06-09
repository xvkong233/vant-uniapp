<template>
  <view class="van-submit-bar">
    <slot name="top" />
    <view v-if="tip || tipIcon || $slots.tip" class="van-submit-bar__tip">
      <UniIcon v-if="tipIcon" :name="tipIcon" size="12" class="van-submit-bar__tip-icon" />
      <text v-if="tip" class="van-submit-bar__tip-text">{{ tip }}</text>
      <slot name="tip" />
    </view>
    <view class="van-submit-bar__bar">
      <slot />
      <view v-if="hasPrice" class="van-submit-bar__text">
        <text>{{ label || '合计：' }}</text>
        <text class="van-submit-bar__price">
          <text class="van-submit-bar__currency">{{ currency }} </text>
          <text class="van-submit-bar__price-integer">{{ priceParts.integer }}</text>
          <text>{{ priceParts.decimal }}</text>
        </text>
        <text class="van-submit-bar__suffix-label">{{ suffixLabel }}</text>
      </view>
      <UniButton
        round
        :type="buttonType"
        :loading="loading"
        :disabled="disabled"
        class="van-submit-bar__button"
        custom-style="width: 100%;"
        @click="emit('submit', $event)"
      >
        {{ loading ? '' : buttonText }}
      </UniButton>
    </view>
    <view v-if="safeAreaInsetBottom" class="van-submit-bar__safe" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniButton from './uni-button.vue';
import UniIcon from './uni-icon.vue';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    tip?: string;
    tipIcon?: string;
    type?: string;
    price?: number;
    label?: string;
    loading?: boolean;
    disabled?: boolean;
    buttonText?: string;
    currency?: string;
    buttonType?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    decimalLength?: number;
    suffixLabel?: string;
    safeAreaInsetBottom?: boolean;
  }>(),
  {
    tip: '',
    tipIcon: '',
    label: '',
    buttonText: '',
    currency: '¥',
    buttonType: 'danger',
    decimalLength: 2,
    suffixLabel: '',
    safeAreaInsetBottom: true,
  }
);

const emit = defineEmits<{
  (event: 'submit', value: unknown): void;
}>();

const hasPrice = computed(() => typeof props.price === 'number');
const priceParts = computed(() => {
  const value = hasPrice.value ? (Number(props.price) / 100).toFixed(props.decimalLength) : '';
  const [integer, decimal] = value.split('.');
  return { integer, decimal: decimal ? `.${decimal}` : '' };
});
</script>

<style lang="less" scoped>
.van-submit-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  background: #fff;

  &__tip {
    padding: 8px 12px;
    color: #f56723;
    font-size: 12px;
    line-height: 18px;
    background: #fff7cc;
  }

  &__tip-icon {
    margin-right: 4px;
  }

  &__bar {
    display: flex;
    align-items: center;
    min-height: 50px;
    padding: 0 16px;
  }

  &__text {
    flex: 1;
    padding-right: 12px;
    color: #323233;
    text-align: right;
  }

  &__price {
    color: #ee0a24;
  }

  &__price-integer {
    font-size: 20px;
  }

  &__button {
    width: 110px;
  }

  &__safe {
    height: constant(safe-area-inset-bottom);
    height: env(safe-area-inset-bottom);
  }
}
</style>
