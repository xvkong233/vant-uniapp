<template>
  <UniPicker
    :title="title"
    :show-toolbar="showToolbar"
    :columns="columns"
    value-key="name"
    @confirm="confirm"
    @cancel="cancel"
    @change="change"
  />
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import UniPicker from './uni-picker.vue';

interface AreaItem {
  name: string;
  code: string;
}

interface AreaColumn {
  values: AreaItem[];
  defaultIndex: number;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    showToolbar?: boolean;
    value?: string;
    areaList?: Record<string, Record<string, string>>;
    columnsNum?: number;
    columnsPlaceholder?: string[];
  }>(),
  {
    title: '',
    showToolbar: true,
    value: '',
    areaList: () => ({}),
    columnsNum: 3,
    columnsPlaceholder: () => [],
  }
);

const emit = defineEmits<{
  (event: 'confirm', value: { values: AreaItem[]; index: number | number[] }): void;
  (event: 'cancel', value: { values: AreaItem[]; index: number | number[] }): void;
  (event: 'change', value: { values: AreaItem[]; index: number | number[]; columnIndex: number }): void;
}>();

const selectedCodes = reactive(['', '', '']);

function list(type: 'province' | 'city' | 'county'): AreaItem[] {
  const source = props.areaList[`${type}_list`] || {};
  return Object.entries(source).map(([code, name]) => ({ code, name }));
}

const provinces = computed(() => list('province'));
const cities = computed(() => {
  const province = selectedCodes[0];
  const values = list('city');
  return province ? values.filter((item) => item.code.slice(0, 2) === province.slice(0, 2)) : values;
});
const counties = computed(() => {
  const city = selectedCodes[1];
  const values = list('county');
  return city ? values.filter((item) => item.code.slice(0, 4) === city.slice(0, 4)) : values;
});

const rawColumns = computed(() => [provinces.value, cities.value, counties.value].slice(0, normalizedColumnsNum.value));
const normalizedColumnsNum = computed(() => Math.max(1, Math.min(3, Number(props.columnsNum) || 3)));

const columns = computed<AreaColumn[]>(() =>
  rawColumns.value.map((values, columnIndex) => {
    const nextValues = withPlaceholder(values, columnIndex);
    return {
      values: nextValues,
      defaultIndex: getIndex(nextValues, selectedCodes[columnIndex]),
    };
  })
);

watch(
  () => [props.value, props.areaList, props.columnsNum] as const,
  () => reset(props.value),
  { immediate: true, deep: true }
);

function withPlaceholder(values: AreaItem[], columnIndex: number) {
  const placeholder = props.columnsPlaceholder[columnIndex];
  return placeholder ? [{ name: placeholder, code: '' }, ...values] : values;
}

function getIndex(values: AreaItem[], code: string) {
  const index = values.findIndex((item) => item.code === code);
  return index === -1 ? 0 : index;
}

function firstCode(values: AreaItem[]) {
  return values[0]?.code || '';
}

function findByCode(values: AreaItem[], code: string) {
  return values.find((item) => item.code === code);
}

function syncChildren() {
  const cityValues = cities.value;
  if (normalizedColumnsNum.value > 1 && !findByCode(cityValues, selectedCodes[1])) {
    selectedCodes[1] = firstCode(cityValues);
  }

  const countyValues = counties.value;
  if (normalizedColumnsNum.value > 2 && !findByCode(countyValues, selectedCodes[2])) {
    selectedCodes[2] = firstCode(countyValues);
  }
}

function reset(code = '') {
  const provinceValues = provinces.value;
  const cityValues = list('city');
  const countyValues = list('county');

  const county = code ? findByCode(countyValues, code) : undefined;
  const city = code
    ? findByCode(cityValues, code)
      || (county ? cityValues.find((item) => item.code.slice(0, 4) === county.code.slice(0, 4)) : undefined)
    : undefined;
  const province = code
    ? findByCode(provinceValues, code)
      || (city ? provinceValues.find((item) => item.code.slice(0, 2) === city.code.slice(0, 2)) : undefined)
      || (county ? provinceValues.find((item) => item.code.slice(0, 2) === county.code.slice(0, 2)) : undefined)
    : undefined;

  selectedCodes[0] = province?.code || firstCode(provinceValues);
  selectedCodes[1] = city?.code || '';
  selectedCodes[2] = county?.code || '';
  syncChildren();
}

function normalize(value: unknown) {
  return (Array.isArray(value) ? value : [value]).filter(Boolean) as AreaItem[];
}

function updateSelected(values: AreaItem[], index: number | number[]) {
  values.slice(0, normalizedColumnsNum.value).forEach((item, columnIndex) => {
    selectedCodes[columnIndex] = item?.code || '';
  });

  const changedColumn = Array.isArray(index) ? index.findIndex((item, columnIndex) => item !== columns.value[columnIndex]?.defaultIndex) : 0;
  if (changedColumn <= 0) {
    selectedCodes[1] = '';
    selectedCodes[2] = '';
  } else if (changedColumn === 1) {
    selectedCodes[2] = '';
  }
  syncChildren();
  return changedColumn === -1 ? 0 : changedColumn;
}

function getValues() {
  return rawColumns.value.map((values, columnIndex) => findByCode(values, selectedCodes[columnIndex]) || { name: '', code: '' });
}

function getIndexes() {
  const indexes = rawColumns.value.map((values, columnIndex) => getIndex(withPlaceholder(values, columnIndex), selectedCodes[columnIndex]));
  return indexes.length === 1 ? indexes[0] : indexes;
}

function getDetail() {
  const values = getValues();
  const area = values[2] || values[1] || values[0];
  return {
    code: area?.code || '',
    country: '',
    province: values[0]?.name || '',
    city: values[1]?.name || '',
    county: values[2]?.name || '',
  };
}

function confirm(event: { value: unknown; index: number | number[] }) {
  const values = normalize(event.value);
  updateSelected(values, event.index);
  emit('confirm', { values: getValues(), index: getIndexes() });
}

function cancel(event: { value: unknown; index: number | number[] }) {
  const values = normalize(event.value);
  updateSelected(values, event.index);
  emit('cancel', { values: getValues(), index: getIndexes() });
}

function change(event: { value: unknown; index: number | number[] }) {
  const values = normalize(event.value);
  const columnIndex = updateSelected(values, event.index);
  emit('change', { values: getValues(), index: getIndexes(), columnIndex });
}

defineExpose({
  reset,
  getValues,
  getDetail,
});
</script>
