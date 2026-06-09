# vant-uniapp

这是从 `@vant/weapp` 迁移到 uni-app Vue3 的发布级组件库版本，H5 目标兼容 Vant 4 生态。

## 技术栈

- uni-app Vue3
- Vite
- Vant 4
- TypeScript

## 运行

```bash
npm install
npm run dev:h5
```

## 构建

```bash
npm run build:h5
npm run build:mp-weixin
npm run build:package
npm run pack:check
```

## 使用

```ts
import { UniButton, UniCell } from 'vant-uniapp';
```

## 迁移说明

Vant 4 是 Vue 3 的移动端 DOM 组件库，当前主要用于 H5 目标。微信小程序等非 H5 目标不能直接复用 Vant 4 DOM 组件，需要把原 `packages` 中的 WXML/WXS/微信组件 API 逐个迁移为 uni-app Vue SFC。

当前已提供：

- `src/main.ts`：uni-app Vue3 入口。
- `src/pages.json`：uni-app 页面配置。
- `src/manifest.json`：uni-app 平台配置。
- `src/components/vant-uni`：68 个原 Vant Weapp 组件的 uni-app Vue3 SFC 迁移实现。
- `scripts/audit-uni-migration.mjs`：原组件 props 和事件到 uni-app 组件的覆盖审计脚本。
- `src/pages/index/index.vue`：H5 Vant 4 与 uni-app 组件示例页。
- `dist/vant-uniapp`：由 `npm run build:package` 生成的 npm 发布包目录。

更多迁移步骤见 [MIGRATION_UNI_APP.md](./MIGRATION_UNI_APP.md)。

## 发布

```bash
npm run prepublishOnly
cd dist/vant-uniapp
npm publish
```

当前 uni-app alpha 依赖链在 `npm audit` 中仍有上游安全告警，发布包将 uni-app、Vant 4 和 Vue 3 作为 peer dependency，避免把宿主框架打进组件包。
