import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagesDir = path.join(root, 'packages');
const outputDir = path.join(root, 'src/components/vant-uni');

const excluded = new Set(['common', 'definitions', 'mixins', 'wxs']);

const dirs = fs
  .readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !excluded.has(name))
  .filter((name) => fs.existsSync(path.join(packagesDir, name, 'index.ts')))
  .sort();

const manual = new Set(['button']);

const componentName = (name) =>
  `Uni${name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')}`;

const titleCase = (name) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const genericComponent = (name) => {
  const className = `van-${name}`;
  const displayName = titleCase(name);

  return `<template>
  <view :class="rootClass" :style="mergedStyle" @tap="handleTap">
    <slot name="icon" />
    <text v-if="title || label" class="${className}__title">
      {{ title || label }}
    </text>
    <text v-if="text || valueText" class="${className}__value">
      {{ text || valueText }}
    </text>
    <slot />
    <slot name="right-icon" />
    <slot name="extra" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { createNamespace, normalizeStyle } from './shared/utils';
import type { Numeric, OptionItem } from './shared/types';

const props = withDefaults(
  defineProps<{
    title?: string;
    label?: string;
    text?: string;
    value?: Numeric | boolean | OptionItem | OptionItem[];
    modelValue?: Numeric | boolean | OptionItem | OptionItem[];
    disabled?: boolean;
    loading?: boolean;
    clickable?: boolean;
    border?: boolean;
    customClass?: string;
    customStyle?: string | Record<string, string | number>;
  }>(),
  {
    title: '',
    label: '',
    text: '',
    border: true,
    customClass: '',
    customStyle: '',
  }
);

const emit = defineEmits<{
  (event: 'click', value: unknown): void;
  (event: 'update:modelValue', value: unknown): void;
  (event: 'change', value: unknown): void;
}>();

const { bem } = createNamespace('${name}');

const valueText = computed(() => {
  const value = props.value ?? props.modelValue;

  if (value === undefined || value === null || Array.isArray(value) || typeof value === 'object') {
    return '';
  }

  return String(value);
});

const rootClass = computed(() => [
  ...bem(undefined, {
    disabled: props.disabled,
    loading: props.loading,
    clickable: props.clickable,
    borderless: !props.border,
  }),
  props.customClass,
]);

const mergedStyle = computed(() => normalizeStyle(props.customStyle));

function handleTap(event: unknown) {
  if (props.disabled || props.loading) {
    return;
  }

  emit('click', event);
}
</script>

<style lang="less" scoped>
.${className} {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  min-height: 44px;
  padding: 10px 16px;
  color: #323233;
  font-size: 14px;
  line-height: 20px;
  background: #fff;

  &--clickable {
    cursor: pointer;
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &__title {
    flex: 1;
    min-width: 0;
  }

  &__value {
    color: #969799;
    text-align: right;
  }
}
</style>
`;
};

for (const name of dirs) {
  if (manual.has(name)) {
    continue;
  }

  const target = path.join(outputDir, `uni-${name}.vue`);
  fs.writeFileSync(target, genericComponent(name));
}

const exports = dirs
  .map(
    (name) =>
      `export { default as ${componentName(name)} } from './uni-${name}.vue';`
  )
  .join('\n');

fs.writeFileSync(path.join(outputDir, 'index.ts'), `${exports}\n`);

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'packages',
  components: dirs.map((name) => ({
    source: `packages/${name}`,
    output: `src/components/vant-uni/uni-${name}.vue`,
    exportName: componentName(name),
    generated: !manual.has(name),
  })),
};

fs.writeFileSync(
  path.join(outputDir, 'migration-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`
);
