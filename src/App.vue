<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.info('Vant uni-app launched');
});

onShow(() => {
  console.info('Vant uni-app shown');
});

onHide(() => {
  console.info('Vant uni-app hidden');
});
</script>

<style lang="less">
page {
  min-height: 100%;
  background: #f7f8fa;
  color: #323233;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    Segoe UI, Arial, Roboto, 'PingFang SC', 'Microsoft Yahei', sans-serif;
}
</style>
