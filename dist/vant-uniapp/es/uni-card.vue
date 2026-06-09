<template>
  <view class="van-card">
    <view :class="['van-card__header', { 'van-card__header--center': centered }]">
      <view class="van-card__thumb" @tap="clickThumb">
        <image v-if="thumb" :src="thumb" :mode="thumbMode" :lazy-load="lazyLoad" class="van-card__img" />
        <slot v-else name="thumb" />
        <UniTag v-if="tag" mark type="danger" class="van-card__tag">{{ tag }}</UniTag>
        <slot v-else name="tag" />
      </view>
      <view :class="['van-card__content', { 'van-card__content--center': centered }]">
        <view>
          <view v-if="title" class="van-card__title">{{ title }}</view>
          <slot v-else name="title" />
          <view v-if="desc" class="van-card__desc">{{ desc }}</view>
          <slot v-else name="desc" />
          <slot name="tags" />
        </view>
        <view class="van-card__bottom">
          <slot name="price-top" />
          <view v-if="price !== '' && price !== undefined" class="van-card__price">
            <text>{{ currency }}</text>
            <text class="van-card__price-integer">{{ priceParts.integer }}</text>
            <text>{{ priceParts.decimal }}</text>
          </view>
          <slot v-else name="price" />
          <view v-if="originPrice !== '' && originPrice !== undefined" class="van-card__origin-price">
            {{ currency }} {{ originPrice }}
          </view>
          <slot v-else name="origin-price" />
          <view v-if="num" class="van-card__num">x {{ num }}</view>
          <slot v-else name="num" />
          <slot name="bottom" />
        </view>
      </view>
    </view>
    <view class="van-card__footer">
      <slot name="footer" />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniTag from './uni-tag.vue';
import type { Numeric } from './shared/types';

const props = withDefaults(
  defineProps<{
    tag?: string;
    num?: string;
    desc?: string;
    thumb?: string;
    title?: string;
    price?: Numeric;
    centered?: boolean;
    lazyLoad?: boolean;
    thumbLink?: string;
    originPrice?: Numeric;
    thumbMode?: string;
    currency?: string;
  }>(),
  {
    tag: '',
    num: '',
    desc: '',
    thumb: '',
    title: '',
    price: '',
    thumbLink: '',
    originPrice: '',
    thumbMode: 'aspectFit',
    currency: '¥',
  }
);

const emit = defineEmits<{
  (event: 'click-thumb'): void;
}>();

const priceParts = computed(() => {
  const [integer, decimal] = String(props.price).split('.');
  return { integer, decimal: decimal ? `.${decimal}` : '' };
});

function clickThumb() {
  emit('click-thumb');
  if (props.thumbLink) {
    uni.navigateTo({ url: props.thumbLink });
  }
}
</script>

<style lang="less" scoped>
.van-card {
  position: relative;
  box-sizing: border-box;
  padding: 8px 16px;
  color: #323233;
  font-size: 12px;
  background: #fafafa;

  &__header {
    display: flex;
  }

  &__header--center,
  &__content--center {
    align-items: center;
  }

  &__thumb {
    position: relative;
    flex: none;
    width: 88px;
    height: 88px;
    margin-right: 8px;
  }

  &__img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }

  &__tag {
    position: absolute;
    top: 2px;
    left: 0;
  }

  &__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    min-width: 0;
    min-height: 88px;
  }

  &__title,
  &__desc {
    overflow: hidden;
    line-height: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__desc {
    margin-top: 4px;
    color: #646566;
  }

  &__bottom {
    position: relative;
    line-height: 20px;
  }

  &__price {
    display: inline-block;
    color: #ee0a24;
    font-weight: 500;
  }

  &__price-integer {
    font-size: 16px;
  }

  &__origin-price {
    display: inline-block;
    margin-left: 5px;
    color: #969799;
    text-decoration: line-through;
  }

  &__num {
    float: right;
    color: #969799;
  }

  &__footer {
    margin-top: 8px;
    text-align: right;
  }
}
</style>
