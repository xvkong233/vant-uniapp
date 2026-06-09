<template>
  <view class="page home-page">
    <view class="home-page__header">
      <text class="home-page__title">Vant UniApp</text>
      <text class="home-page__subtitle">uni-app Vue3 迁移入口</text>
    </view>

    <view class="home-page__section">
      <text class="home-page__section-title">uni-app 组件适配</text>
      <view class="home-page__actions">
        <UniButton type="primary" @click="showToast('primary')">主要按钮</UniButton>
        <UniButton plain type="danger" @click="showToast('danger')">
          朴素按钮
        </UniButton>
        <UniButton loading loading-text="加载中" />
      </view>
    </view>

    <view class="home-page__section">
      <text class="home-page__section-title">已迁移组件入口</text>
      <view class="home-page__grid">
        <view
          v-for="component in migratedComponents"
          :key="component.name"
          class="home-page__grid-item"
        >
          <text class="home-page__component-name">{{ component.name }}</text>
        </view>
      </view>
    </view>

    <!-- #ifdef H5 -->
    <view class="home-page__section">
      <text class="home-page__section-title">Vant 4 H5 示例</text>
      <van-cell-group inset>
        <van-cell title="Vant 版本" value="4.x" />
        <van-cell title="渲染目标" value="H5" />
      </van-cell-group>
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import * as VantUni from '../../components/vant-uni';
import { computed } from 'vue';

const { UniButton } = VantUni;

const migratedComponents = computed(() =>
  Object.entries(VantUni)
    .filter(([name]) => name !== 'UniButton')
    .map(([name]) => ({
      name,
    }))
);

function showToast(type: string) {
  uni.showToast({
    title: `click: ${type}`,
    icon: 'none',
  });
}
</script>

<style lang="less" scoped>
.home-page {
  padding: 20px 16px 32px;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 24px;
  }

  &__title {
    color: #323233;
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
  }

  &__subtitle {
    color: #646566;
    font-size: 14px;
    line-height: 20px;
  }

  &__section {
    margin-bottom: 20px;
  }

  &__section-title {
    display: block;
    margin-bottom: 12px;
    color: #646566;
    font-size: 13px;
    line-height: 18px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  &__grid-item {
    min-width: 0;
    overflow: hidden;
    padding: 10px 12px;
    background: #fff;
    border-radius: 4px;
  }

  &__component-name {
    display: block;
    overflow: hidden;
    color: #323233;
    font-size: 13px;
    line-height: 18px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
