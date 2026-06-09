<template>
  <UniPicker
    :title="title"
    :show-toolbar="showToolbar"
    :columns="columns"
    @confirm="onConfirm"
    @cancel="emit('cancel')"
    @change="onChange"
  />
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import UniPicker from './uni-picker.vue';

type DatetimeType = 'datetime' | 'date' | 'time' | 'year-month';
type DateColumnType = 'year' | 'month' | 'day' | 'hour' | 'minute';

interface PickerColumn {
  values: string[];
  defaultIndex: number;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    value?: number | string;
    modelValue?: number | string;
    type?: DatetimeType;
    showToolbar?: boolean;
    minDate?: number;
    maxDate?: number;
    minHour?: number;
    maxHour?: number;
    minMinute?: number;
    maxMinute?: number;
    formatter?: (type: DateColumnType, value: string) => string;
    filter?: (type: DateColumnType, values: string[]) => string[];
  }>(),
  {
    title: '',
    type: 'datetime',
    showToolbar: true,
    minDate: () => {
      const currentYear = new Date().getFullYear();
      return new Date(currentYear - 10, 0, 1).getTime();
    },
    maxDate: () => {
      const currentYear = new Date().getFullYear();
      return new Date(currentYear + 10, 11, 31, 23, 59).getTime();
    },
    minHour: 0,
    maxHour: 23,
    minMinute: 0,
    maxMinute: 59,
  }
);

const emit = defineEmits<{
  (event: 'update:modelValue', value: number | string): void;
  (event: 'input', value: number | string): void;
  (event: 'change', value: number | string): void;
  (event: 'confirm', value: number | string): void;
  (event: 'cancel'): void;
}>();

const selected = reactive({
  year: 0,
  month: 1,
  day: 1,
  hour: 0,
  minute: 0,
});

const pad = (value: number) => String(value).padStart(2, '0');
const toNumber = (value: string) => Number(String(value).replace(/\D/g, ''));

const minDateValue = computed(() => new Date(props.minDate));
const maxDateValue = computed(() => new Date(props.maxDate));
const columnTypes = computed<DateColumnType[]>(() => {
  if (props.type === 'time') return ['hour', 'minute'];
  if (props.type === 'date') return ['year', 'month', 'day'];
  if (props.type === 'year-month') return ['year', 'month'];
  return ['year', 'month', 'day', 'hour', 'minute'];
});

const columns = computed<PickerColumn[]>(() =>
  columnTypes.value.map((type) => {
    const values = formatValues(type, filterValues(type, getValues(type)));
    return {
      values,
      defaultIndex: Math.max(0, values.findIndex((item) => toNumber(item) === selected[type])),
    };
  })
);

watch(
  () => [props.value, props.modelValue, props.type, props.minDate, props.maxDate, props.minHour, props.maxHour, props.minMinute, props.maxMinute] as const,
  () => initSelected(),
  { immediate: true }
);

function getCurrentValue() {
  return props.modelValue ?? props.value;
}

function initSelected() {
  if (props.type === 'time') {
    const [hour, minute] = String(getCurrentValue() || `${pad(props.minHour)}:${pad(props.minMinute)}`).split(':').map(Number);
    selected.hour = clamp(Number.isFinite(hour) ? hour : props.minHour, props.minHour, props.maxHour);
    selected.minute = clamp(Number.isFinite(minute) ? minute : props.minMinute, props.minMinute, props.maxMinute);
    clampSelected();
    return;
  }

  const raw = getCurrentValue();
  const time = typeof raw === 'number' || /^\d+$/.test(String(raw || '')) ? Number(raw) : props.minDate;
  const date = new Date(clamp(Number.isFinite(time) ? time : props.minDate, props.minDate, props.maxDate));
  selected.year = date.getFullYear();
  selected.month = date.getMonth() + 1;
  selected.day = date.getDate();
  selected.hour = date.getHours();
  selected.minute = date.getMinutes();
  clampSelected();
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

function range(start: number, end: number, padded = true) {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, index) => (padded ? pad(start + index) : String(start + index)));
}

function sameYearAsMin() {
  return selected.year === minDateValue.value.getFullYear();
}

function sameYearAsMax() {
  return selected.year === maxDateValue.value.getFullYear();
}

function sameMonthAsMin() {
  return sameYearAsMin() && selected.month === minDateValue.value.getMonth() + 1;
}

function sameMonthAsMax() {
  return sameYearAsMax() && selected.month === maxDateValue.value.getMonth() + 1;
}

function sameDayAsMin() {
  return sameMonthAsMin() && selected.day === minDateValue.value.getDate();
}

function sameDayAsMax() {
  return sameMonthAsMax() && selected.day === maxDateValue.value.getDate();
}

function getValues(type: DateColumnType) {
  if (props.type === 'time') {
    if (type === 'hour') return range(props.minHour, props.maxHour);
    return range(props.minMinute, props.maxMinute);
  }

  if (type === 'year') {
    return range(minDateValue.value.getFullYear(), maxDateValue.value.getFullYear(), false);
  }

  if (type === 'month') {
    const min = sameYearAsMin() ? minDateValue.value.getMonth() + 1 : 1;
    const max = sameYearAsMax() ? maxDateValue.value.getMonth() + 1 : 12;
    return range(min, max);
  }

  if (type === 'day') {
    const min = sameMonthAsMin() ? minDateValue.value.getDate() : 1;
    const max = sameMonthAsMax() ? maxDateValue.value.getDate() : daysInMonth(selected.year, selected.month);
    return range(min, max);
  }

  if (type === 'hour') {
    const min = sameDayAsMin() ? minDateValue.value.getHours() : 0;
    const max = sameDayAsMax() ? maxDateValue.value.getHours() : 23;
    return range(min, max);
  }

  const min = sameDayAsMin() && selected.hour === minDateValue.value.getHours() ? minDateValue.value.getMinutes() : 0;
  const max = sameDayAsMax() && selected.hour === maxDateValue.value.getHours() ? maxDateValue.value.getMinutes() : 59;
  return range(min, max);
}

function filterValues(type: DateColumnType, values: string[]) {
  return props.filter ? props.filter(type, values) : values;
}

function formatValues(type: DateColumnType, values: string[]) {
  return props.formatter ? values.map((value) => props.formatter?.(type, value) || value) : values;
}

function clampSelected() {
  columnTypes.value.forEach((type) => {
    const values = getValues(type).map(toNumber);
    if (values.length) {
      selected[type] = clamp(selected[type], values[0], values[values.length - 1]);
    }
  });

  if (props.type !== 'time') {
    selected.day = Math.min(selected.day, daysInMonth(selected.year, selected.month));
  }
}

function applyPickerValues(values: unknown[]) {
  columnTypes.value.forEach((type, index) => {
    const raw = values[index];
    if (raw !== undefined) {
      selected[type] = toNumber(String(raw));
      clampSelected();
    }
  });
}

function getOutput(): number | string {
  if (props.type === 'time') {
    return `${pad(selected.hour)}:${pad(selected.minute)}`;
  }
  return new Date(selected.year, selected.month - 1, selected.day, selected.hour, selected.minute).getTime();
}

function emitValue(event: 'change' | 'confirm', value: number | string) {
  emit('update:modelValue', value);
  emit('input', value);
  if (event === 'change') {
    emit('change', value);
  } else {
    emit('confirm', value);
  }
}

function onConfirm(event: { value: unknown }) {
  applyPickerValues(Array.isArray(event.value) ? event.value : [event.value]);
  emitValue('confirm', getOutput());
}

function onChange(event: { value: unknown }) {
  applyPickerValues(Array.isArray(event.value) ? event.value : [event.value]);
  emitValue('change', getOutput());
}
</script>
