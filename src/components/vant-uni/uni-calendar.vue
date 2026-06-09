<template>
  <UniPopup
    v-if="poppable"
    :show="show"
    :position="position"
    :round="round"
    :close-on-click-overlay="closeOnClickOverlay"
    @close="emit('close')"
  >
    <view class="van-calendar">
      <CalendarContent />
    </view>
  </UniPopup>
  <view v-else class="van-calendar">
    <CalendarContent />
  </view>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, ref, watch } from 'vue';
import UniButton from './uni-button.vue';
import UniPopup from './uni-popup.vue';

interface CalendarDay {
  date: number;
  text: string;
  type?: string;
  topInfo?: string;
  bottomInfo?: string;
  className?: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    color?: string;
    show?: boolean;
    confirmText?: string;
    confirmDisabledText?: string;
    defaultDate?: number | number[] | null;
    type?: 'single' | 'multiple' | 'range';
    minDate?: number;
    maxDate?: number;
    maxRange?: number;
    minRange?: number;
    rangePrompt?: string;
    showRangePrompt?: boolean;
    allowSameDay?: boolean;
    position?: 'bottom' | 'top' | 'center';
    rowHeight?: number;
    round?: boolean;
    poppable?: boolean;
    showMark?: boolean;
    showTitle?: boolean;
    showSubtitle?: boolean;
    showConfirm?: boolean;
    safeAreaInsetBottom?: boolean;
    closeOnClickOverlay?: boolean;
    firstDayOfWeek?: number;
    readonly?: boolean;
    rootPortal?: boolean;
    formatter?: (day: CalendarDay) => CalendarDay;
  }>(),
  {
    title: '日期选择',
    confirmText: '确定',
    confirmDisabledText: '确定',
    defaultDate: null,
    type: 'single',
    minDate: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    },
    maxDate: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()).getTime();
    },
    maxRange: 0,
    minRange: 0,
    rangePrompt: '',
    showRangePrompt: true,
    allowSameDay: false,
    position: 'bottom',
    rowHeight: 64,
    round: true,
    poppable: true,
    showMark: true,
    showTitle: true,
    showSubtitle: true,
    showConfirm: true,
    safeAreaInsetBottom: true,
    closeOnClickOverlay: true,
    firstDayOfWeek: 0,
  }
);

const emit = defineEmits<{
  (event: 'select', value: number | number[]): void;
  (event: 'confirm', value: number | number[]): void;
  (event: 'close'): void;
  (event: 'open'): void;
  (event: 'opened'): void;
  (event: 'closed'): void;
  (event: 'click-subtitle', value: unknown): void;
  (event: 'over-range'): void;
  (event: 'unselect', value: number): void;
}>();

const current = ref<number | number[]>(getDefaultDate());

watch(() => props.defaultDate, () => {
  current.value = getDefaultDate();
});

watch(
  () => props.show,
  (show) => {
    if (show) {
      emit('open');
      emit('opened');
    } else {
      emit('closed');
    }
  }
);

const days = computed(() => {
  const result: CalendarDay[] = [];
  const start = startOfDay(props.minDate);
  const end = startOfDay(props.maxDate);
  for (let date = new Date(start); date.getTime() <= end && result.length < 370; date.setDate(date.getDate() + 1)) {
    const time = date.getTime();
    const day: CalendarDay = {
      date: time,
      text: String(date.getDate()),
      disabled: time < start || time > end,
      type: getDayType(time),
    };
    result.push(props.formatter ? props.formatter(day) : day);
  }
  return result;
});

const weekdays = computed(() => {
  const source = ['日', '一', '二', '三', '四', '五', '六'];
  const start = Math.max(0, Math.min(6, props.firstDayOfWeek));
  return source.slice(start).concat(source.slice(0, start));
});
const confirmDisabled = computed(() => {
  if (props.type !== 'range') return false;
  return !Array.isArray(current.value) || current.value.length !== 2;
});

const subtitle = computed(() => {
  const first = days.value[0]?.date || props.minDate;
  const date = new Date(first);
  return `${date.getFullYear()}年${date.getMonth() + 1}月`;
});

function getDefaultDate() {
  if (props.defaultDate) {
    return props.defaultDate;
  }
  if (props.type === 'multiple' || props.type === 'range') {
    return [];
  }
  return startOfDay(props.minDate);
}

function startOfDay(value: number) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function sameDay(a: number, b: number) {
  return startOfDay(a) === startOfDay(b);
}

function compareDay(a: number, b: number) {
  return startOfDay(a) - startOfDay(b);
}

function getRangeDays(start: number, end: number) {
  return Math.floor(Math.abs(compareDay(end, start)) / 86400000) + 1;
}

function selected(day: number) {
  return Array.isArray(current.value) ? current.value.some((item) => sameDay(item, day)) : sameDay(current.value, day);
}

function inRange(day: number) {
  if (!Array.isArray(current.value) || current.value.length !== 2) return false;
  const [start, end] = current.value;
  return compareDay(day, start) > 0 && compareDay(end, day) > 0;
}

function getDayType(day: number) {
  if (props.type === 'range' && Array.isArray(current.value)) {
    const [start, end] = current.value;
    if (start && sameDay(day, start)) return 'start';
    if (end && sameDay(day, end)) return 'end';
    if (start && end && inRange(day)) return 'middle';
  }
  return selected(day) ? 'selected' : '';
}

function isDisabled(day: CalendarDay) {
  return !!day.disabled || startOfDay(day.date) < startOfDay(props.minDate) || startOfDay(day.date) > startOfDay(props.maxDate);
}

function select(day: CalendarDay) {
  if (isDisabled(day) || props.readonly) return;
  const date = startOfDay(day.date);

  if (props.type === 'multiple') {
    const list = Array.isArray(current.value) ? current.value.slice() : [];
    const index = list.findIndex((item) => sameDay(item, date));
    if (index === -1) {
      list.push(date);
    } else {
      list.splice(index, 1);
      emit('unselect', date);
    }
    current.value = list;
  } else if (props.type === 'range') {
    selectRange(date);
  } else {
    current.value = date;
  }

  emit('select', current.value);
}

function selectRange(day: number) {
  const list = Array.isArray(current.value) ? current.value.slice(0, 2) : [];
  if (!list.length || list.length === 2) {
    current.value = [day];
    return;
  }

  const start = list[0];
  if (!props.allowSameDay && sameDay(start, day)) {
    current.value = [day];
    return;
  }

  const range = getRangeDays(start, day);
  if ((props.maxRange && range > props.maxRange) || (props.minRange && range < props.minRange)) {
    if (props.showRangePrompt) {
      emit('over-range');
    }
    current.value = [day];
    return;
  }

  current.value = [start, day].sort((a, b) => a - b);
}

function dayClasses(day: CalendarDay) {
  return [
    'van-calendar__day',
    day.className || '',
    selected(day.date) ? 'van-calendar__day--selected' : '',
    inRange(day.date) ? 'van-calendar__day--middle' : '',
    isDisabled(day) ? 'van-calendar__day--disabled' : '',
  ];
}

function dayStyle(day: CalendarDay) {
  return selected(day.date) && props.color ? `background: ${props.color}` : '';
}

function confirm() {
  if (!confirmDisabled.value) {
    emit('confirm', current.value);
  }
}

const CalendarContent = defineComponent(() => () =>
  h('view', { class: 'van-calendar__content' }, [
    props.showTitle ? h('view', { class: 'van-calendar__header' }, props.title) : null,
    props.showSubtitle ? h('view', { class: 'van-calendar__subtitle', onClick: (event: unknown) => emit('click-subtitle', event) }, subtitle.value) : null,
    h('view', { class: 'van-calendar__weekdays' }, weekdays.value.map((item) => h('view', { class: 'van-calendar__weekday' }, item))),
    h('view', { class: 'van-calendar__days' }, days.value.map((day) =>
      h('view', {
        class: dayClasses(day),
        style: [dayStyle(day), `min-height: ${props.rowHeight}px`].filter(Boolean).join(';'),
        onClick: () => select(day),
      }, [
        day.topInfo ? h('view', { class: 'van-calendar__top-info' }, day.topInfo) : null,
        h('view', { class: 'van-calendar__day-text' }, day.text),
        day.bottomInfo ? h('view', { class: 'van-calendar__bottom-info' }, day.bottomInfo) : null,
      ])
    )),
    props.showConfirm ? h(UniButton, {
      type: 'danger',
      block: true,
      disabled: confirmDisabled.value,
      customStyle: props.color && !confirmDisabled.value ? `background: ${props.color}; border-color: ${props.color}` : '',
      onClick: confirm,
    }, () => (confirmDisabled.value ? props.confirmDisabledText : props.confirmText)) : null,
  ])
);
</script>

<style lang="less" scoped>
.van-calendar {
  background: #fff;

  &__content {
    padding: 16px;
  }

  &__header,
  &__subtitle {
    margin-bottom: 12px;
    text-align: center;
    font-weight: 500;
  }

  &__subtitle {
    font-size: 14px;
  }

  &__weekdays,
  &__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  &__weekdays {
    margin-bottom: 8px;
    color: #646566;
    font-size: 12px;
    text-align: center;
  }

  &__days {
    gap: 6px;
    max-height: 420px;
    margin-bottom: 12px;
    overflow-y: auto;
  }

  &__day {
    min-height: 44px;
    padding: 6px 0;
    color: #323233;
    text-align: center;
    border-radius: 4px;
    box-sizing: border-box;
  }

  &__day--selected {
    color: #fff;
    background: #ee0a24;
  }

  &__day--middle {
    color: #ee0a24;
    background: #fff1f2;
  }

  &__day--disabled {
    color: #c8c9cc;
  }

  &__top-info,
  &__bottom-info {
    font-size: 10px;
    line-height: 14px;
  }
}
</style>
