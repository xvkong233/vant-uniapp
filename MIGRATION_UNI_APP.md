# Vant Weapp 到 uni-app Vue3 迁移说明

当前仓库已经加入 uni-app Vue3/Vite 工程入口，并将 H5 侧依赖升级到 Vant 4。

## 当前状态

- `src/main.ts` 使用 uni-app Vue3 的 `createSSRApp` 入口。
- `vite.config.ts` 按 uni-app Vue3 官方要求加载 `@dcloudio/vite-plugin-uni`。
- `src/pages.json`、`src/manifest.json` 提供 uni-app 页面与平台配置。
- `src/components/vant-uni` 已为原 `packages` 下 68 个组件建立 uni-app Vue3 SFC 入口。
- `src/components/vant-uni/migration-manifest.json` 记录原组件目录到 uni-app 组件文件的映射。
- `button`、`icon`、`loading`、`cell`、`tag`、`divider`、`switch`、`progress`、`image`、`stepper` 已从通用壳层深化为带主要 props、事件、样式和交互逻辑的 SFC。
- `row`、`col`、`grid`、`grid-item` 已迁移父子布局上下文和主要布局 props。
- `overlay`、`popup`、`empty`、`nav-bar`、`notice-bar` 已迁移主要展示、关闭和点击事件逻辑。
- `field`、`checkbox`、`checkbox-group`、`radio`、`radio-group`、`slider`、`rate` 已迁移主要表单交互和 `modelValue`/`input`/`change` 事件。
- `action-sheet`、`dialog`、`toast`、`notify` 已迁移主要反馈展示、遮罩、关闭和动作事件。
- `tabbar`、`tabbar-item`、`sidebar`、`sidebar-item` 已迁移父子导航上下文、选中态和变更事件。
- `tabs`、`tab`、`collapse`、`collapse-item`、`dropdown-menu`、`dropdown-item` 已迁移父子上下文、选中/展开/开合状态和主要事件；`tabs/tab` 已补齐懒渲染、标题样式、徽标和红点。
- `search`、`picker`、`picker-column` 已迁移主要输入、选择、确认、取消和变更事件。
- `card`、`panel`、`submit-bar`、`goods-action`、`goods-action-button`、`goods-action-icon`、`info` 已迁移主要业务展示、价格、按钮和点击事件。
- `skeleton`、`steps`、`sticky`、`transition`、`swipe-cell` 已迁移主要展示状态、步骤点击、粘性定位、过渡显示和滑动单元格事件；`swipe-cell` 已补齐横向触摸拖拽打开/关闭。
- `count-down`、`circle`、`cell-group`、`config-provider`、`index-bar`、`index-anchor`、`uploader` 已迁移主要工具、展示、主题变量、索引和文件选择事件；`uploader` 已补齐 `accept` 分流、`before-read`/`after-read` 流程、图片预览、文件删除和超限事件。
- `tree-select`、`cascader`、`area`、`datetime-picker`、`calendar`、`share-sheet` 已迁移主要选择、确认、取消、关闭和完成事件；`cascader` 已补齐受控值路径回显和主题色，`area` 已按省市县 code 前缀联动，`datetime-picker` 已按年月和 min/max 动态约束列，`calendar` 已补齐范围选择、禁用态、确认禁用和 `formatter` 主流程。

## 完成度审计

- `src/components/vant-uni` 当前包含 68 个 `.vue` 组件文件。
- `src/components/vant-uni/index.ts` 当前导出 68 个组件。
- `src/components/vant-uni/migration-manifest.json` 当前记录 68 个原组件到 uni-app 组件的映射。
- 通用壳层模板特征 `title || label`、`valueText` 当前无残留。
- `scripts/audit-uni-migration.mjs` 对比原 `packages/*/index.ts` 与 `src/components/vant-uni/uni-*.vue` 的 props 和 `$emit` 事件覆盖，当前 `incomplete: []`。
- `src/pages/index/index.vue` 提供 uni-app 组件入口清单与 H5 Vant 4 的基础示例。

## 重要边界

Vant 4 是 Vue 3 的移动端 DOM 组件库，适合 uni-app 的 H5 目标；它不能直接替换微信小程序原生组件文件。原 `packages/**/*.wxml`、`packages/**/*.wxs`、`packages/**/*.json` 和 `VantComponent(...)` 写法需要逐个迁移为 uni-app 支持的 `.vue` 单文件组件。

## 迁移审计口径

- 原组件目录、uni-app SFC 文件、导出入口和迁移 manifest 数量一致，均覆盖 68 个组件。
- 原组件 `props` 和 `$emit` 事件已机械对比到 uni-app SFC `defineProps`/`defineEmits`，当前没有缺失项。
- WXML/WXS/小程序 `VantComponent(...)` 实现已迁移为 uni-app Vue3 SFC、`defineProps`、`defineEmits`、组合式 API 和插槽。
- H5 目标保留 `vant@^4.9.0` 作为 Vue3 DOM 组件库依赖；小程序目标使用 `src/components/vant-uni` 的 uni-app SFC 实现。

## 当前验证

```bash
npm run audit:migration
npm run typecheck
npm run build:h5
npm run build:mp-weixin
npm run build:package
npm run pack:check
```

以上命令已在当前迁移状态下通过。

## 发布包

- 包名：`vant-uniapp`
- 发布目录：`dist/vant-uniapp`
- 发布入口：`dist/vant-uniapp/es/index.js`
- 类型入口：`dist/vant-uniapp/es/index.d.ts`
- 发布前门禁：`npm run prepublishOnly`
- `npm audit --omit=dev` 当前仍会报告来自 uni-app alpha 依赖链的已知安全告警，其中部分 advisory 暂无上游修复；发布包本身将 uni-app、Vant 4 和 Vue 3 声明为 peer dependency，避免把宿主框架打入组件包依赖。

## 常用命令

```bash
npm run dev:h5
npm run build:h5
npm run build:mp-weixin
npm run typecheck
npm run audit:migration
npm run build:package
npm run pack:check
```
