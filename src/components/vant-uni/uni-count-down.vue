<template>
  <view class="van-count-down">
    <slot v-if="$slots.default" :time-data="timeData">{{ formattedTime }}</slot>
    <text v-else>{{ formattedTime }}</text>
  </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';

interface TimeData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

const props = withDefaults(
  defineProps<{
    useSlot?: boolean;
    millisecond?: boolean;
    time?: number;
    format?: string;
    autoStart?: boolean;
  }>(),
  {
    time: 0,
    format: 'HH:mm:ss',
    autoStart: true,
  }
);

const emit = defineEmits<{
  (event: 'change', value: TimeData): void;
  (event: 'finish'): void;
}>();

const remain = ref(0);
let timer: ReturnType<typeof setTimeout> | undefined;
let counting = false;
let endTime = 0;

const timeData = computed<TimeData>(() => {
  const ms = remain.value;
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;
  return { days, hours, minutes, seconds, milliseconds };
});

const formattedTime = computed(() => {
  const data = timeData.value;
  const pad = (value: number, len = 2) => String(value).padStart(len, '0');
  return props.format
    .replace(/DD/g, pad(data.days))
    .replace(/HH/g, pad(data.hours))
    .replace(/mm/g, pad(data.minutes))
    .replace(/ss/g, pad(data.seconds))
    .replace(/SSS/g, pad(data.milliseconds, 3));
});

function pause() {
  counting = false;
  if (timer) clearTimeout(timer);
}

function setRemain(value: number) {
  remain.value = Math.max(value, 0);
  emit('change', timeData.value);
  if (remain.value === 0) {
    pause();
    emit('finish');
  }
}

function tick() {
  timer = setTimeout(() => {
    setRemain(endTime - Date.now());
    if (remain.value > 0) tick();
  }, props.millisecond ? 30 : 1000);
}

function start() {
  if (counting) return;
  counting = true;
  endTime = Date.now() + remain.value;
  tick();
}

function reset() {
  pause();
  setRemain(props.time);
  if (props.autoStart) start();
}

watch(() => props.time, reset, { immediate: true });
onBeforeUnmount(pause);
defineExpose({ start, pause, reset });
</script>

<style lang="less" scoped>
.van-count-down {
  color: #323233;
  font-size: 14px;
  line-height: 20px;
}
</style>
