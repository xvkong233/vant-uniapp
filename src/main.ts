import { createSSRApp } from 'vue';
import Vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue';
import './styles/index.less';

export function createApp() {
  const app = createSSRApp(App);

  // Vant 4 仅用于 H5 渲染目标；小程序目标需要继续迁移为 uni-app SFC 组件。
  // #ifdef H5
  app.use(Vant);
  // #endif

  return {
    app,
  };
}
