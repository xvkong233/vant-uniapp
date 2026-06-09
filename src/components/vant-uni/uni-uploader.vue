<template>
  <view class="van-uploader">
    <view class="van-uploader__preview-list">
      <view v-for="(file, index) in fileList" :key="index" class="van-uploader__preview" :style="previewStyle" @tap="clickPreview(file, index)">
        <image v-if="previewImage && isImageFile(file) && getUrl(file)" :src="getUrl(file)" :mode="imageFit" class="van-uploader__preview-image" />
        <view v-else class="van-uploader__file">
          <UniIcon :name="isVideoFile(file) ? 'play-circle-o' : 'description'" class="van-uploader__file-icon" />
          <text class="van-uploader__file-name">{{ getFileName(file) }}</text>
        </view>
        <UniIcon v-if="canDelete(file)" name="cross" class="van-uploader__delete" @tap.stop="deleteFile(file, index)" />
      </view>
      <view v-if="showUpload && fileList.length < maxCount" class="van-uploader__upload" :style="previewStyle" @tap="startUpload">
        <UniIcon :name="uploadIcon" class="van-uploader__upload-icon" />
        <text v-if="uploadText" class="van-uploader__upload-text">{{ uploadText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UniIcon from './uni-icon.vue';
import { addUnit } from './shared/utils';
import type { Numeric } from './shared/types';

interface UploadFile {
  url?: string;
  path?: string;
  tempFilePath?: string;
  thumb?: string;
  name?: string;
  size?: number;
  type?: string;
  fileType?: string;
  deletable?: boolean;
  [key: string]: unknown;
}

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    multiple?: boolean;
    uploadText?: string;
    name?: Numeric;
    accept?: 'image' | 'media' | 'video' | 'file' | string;
    fileList?: UploadFile[];
    maxSize?: number;
    maxCount?: number;
    previewSize?: Numeric;
    deletable?: boolean;
    showUpload?: boolean;
    previewImage?: boolean;
    previewFullImage?: boolean;
    previewFile?: boolean;
    previewVideo?: boolean;
    imageFit?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | string;
    videoFit?: 'contain' | 'fill' | 'cover' | string;
    uploadIcon?: string;
    beforeRead?: (file: UploadFile | UploadFile[], detail: { name: Numeric; index: number }) => boolean | Promise<boolean>;
    useBeforeRead?: boolean;
    afterRead?: (file: UploadFile | UploadFile[], detail: { name: Numeric; index: number }) => void;
  }>(),
  {
    uploadText: '',
    name: '',
    accept: 'image',
    fileList: () => [],
    maxSize: Number.MAX_VALUE,
    maxCount: 100,
    previewSize: 80,
    deletable: true,
    showUpload: true,
    previewImage: true,
    previewFullImage: true,
    previewFile: true,
    previewVideo: true,
    imageFit: 'scaleToFill',
    videoFit: 'contain',
    uploadIcon: 'plus',
  }
);

const emit = defineEmits<{
  (event: 'after-read', value: { file: UploadFile | UploadFile[]; name: Numeric; index: number }): void;
  (event: 'before-read', value: { file: UploadFile | UploadFile[]; name: Numeric; index: number; callback: (status: boolean) => void }): void;
  (event: 'oversize', value: { file: UploadFile | UploadFile[]; name: Numeric; index: number }): void;
  (event: 'delete', value: { file: UploadFile; name: Numeric; index: number }): void;
  (event: 'click-preview', value: { file: UploadFile; name: Numeric; index: number }): void;
  (event: 'error', value: unknown): void;
}>();

const previewStyle = computed(() => {
  const size = addUnit(props.previewSize);
  return size ? `width: ${size}; height: ${size}` : '';
});

function getUrl(file: UploadFile) {
  return String(file.url || file.path || file.thumb || file.tempFilePath || '');
}

function getFileName(file: UploadFile) {
  return String(file.name || getUrl(file).split('/').pop() || 'file');
}

function getFileType(file: UploadFile) {
  return String(file.type || file.fileType || '').toLowerCase();
}

function isImageFile(file: UploadFile) {
  const url = getUrl(file).toLowerCase();
  const type = getFileType(file);
  return type === 'image' || type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|heic|heif)$/.test(url);
}

function isVideoFile(file: UploadFile) {
  const url = getUrl(file).toLowerCase();
  const type = getFileType(file);
  return type === 'video' || type.startsWith('video/') || /\.(mp4|mov|m4v|webm|avi)$/.test(url);
}

function canDelete(file: UploadFile) {
  return props.deletable && file.deletable !== false && !props.disabled;
}

function normalizeFiles(tempFiles: unknown[], type?: string): UploadFile[] {
  return tempFiles.map((raw) => {
    const file = raw as Record<string, unknown>;
    const path = String(file.path || file.tempFilePath || file.url || '');
    return {
      ...file,
      url: String(file.url || path),
      path,
      name: typeof file.name === 'string' ? file.name : path.split('/').pop(),
      size: typeof file.size === 'number' ? file.size : Number(file.size || 0),
      type: String(file.fileType || file.type || type || props.accept),
    };
  });
}

function normalizePayload(files: UploadFile[]) {
  return props.multiple ? files : files[0];
}

function getDetail(file: UploadFile | UploadFile[]) {
  return {
    file,
    name: props.name,
    index: props.fileList.length,
  };
}

function runAfterRead(file: UploadFile | UploadFile[]) {
  const detail = getDetail(file);
  props.afterRead?.(file, { name: detail.name, index: detail.index });
  emit('after-read', detail);
}

function runBeforeRead(file: UploadFile | UploadFile[]) {
  const detail = getDetail(file);

  if (props.useBeforeRead) {
    emit('before-read', {
      ...detail,
      callback: (status: boolean) => {
        if (status) {
          runAfterRead(file);
        }
      },
    });
    return;
  }

  const result = props.beforeRead?.(file, { name: detail.name, index: detail.index });
  if (result && typeof (result as Promise<boolean>).then === 'function') {
    (result as Promise<boolean>)
      .then((status) => {
        if (status !== false) {
          runAfterRead(file);
        }
      })
      .catch((error) => emit('error', error));
    return;
  }

  if (result !== false) {
    runAfterRead(file);
  }
}

function handleChosen(files: UploadFile[]) {
  const count = Math.max(0, props.maxCount - props.fileList.length);
  const nextFiles = files.slice(0, props.multiple ? count : Math.min(count, 1));
  if (!nextFiles.length) {
    return;
  }

  const payload = normalizePayload(nextFiles);
  const oversize = nextFiles.some((file) => Number(file.size || 0) > props.maxSize);
  if (oversize) {
    emit('oversize', getDetail(payload));
    return;
  }

  runBeforeRead(payload);
}

function chooseImage(count: number) {
  uni.chooseImage({
    count,
    success(res) {
      handleChosen(normalizeFiles(Array.isArray(res.tempFiles) ? res.tempFiles : [res.tempFiles], 'image'));
    },
    fail(error) {
      emit('error', error);
    },
  });
}

function chooseVideo() {
  uni.chooseVideo({
    success(res) {
      handleChosen(normalizeFiles([res], 'video'));
    },
    fail(error) {
      emit('error', error);
    },
  });
}

function chooseMedia(count: number) {
  const chooseMediaApi = (uni as unknown as {
    chooseMedia?: (options: {
      count: number;
      mediaType?: string[];
      success: (res: { tempFiles?: unknown[] }) => void;
      fail: (error: unknown) => void;
    }) => void;
  }).chooseMedia;

  if (!chooseMediaApi) {
    chooseImage(count);
    return;
  }

  chooseMediaApi({
    count,
    mediaType: ['image', 'video'],
    success(res) {
      handleChosen(normalizeFiles(Array.isArray(res.tempFiles) ? res.tempFiles : [], 'media'));
    },
    fail(error) {
      emit('error', error);
    },
  });
}

function chooseFile(count: number) {
  const chooseFileApi = (uni as unknown as {
    chooseFile?: (options: {
      count: number;
      success: (res: { tempFiles?: unknown[] }) => void;
      fail: (error: unknown) => void;
    }) => void;
  }).chooseFile;

  if (!chooseFileApi) {
    chooseImage(count);
    return;
  }

  chooseFileApi({
    count,
    success(res) {
      handleChosen(normalizeFiles(Array.isArray(res.tempFiles) ? res.tempFiles : [], 'file'));
    },
    fail(error) {
      emit('error', error);
    },
  });
}

function startUpload() {
  if (props.disabled) return;
  const count = Math.max(0, props.maxCount - props.fileList.length);
  if (count <= 0) return;

  if (props.accept === 'video') {
    chooseVideo();
  } else if (props.accept === 'media') {
    chooseMedia(count);
  } else if (props.accept === 'file') {
    chooseFile(count);
  } else {
    chooseImage(props.multiple ? count : 1);
  }
}

function deleteFile(file: UploadFile, index: number) {
  emit('delete', { file, index, name: props.name });
}

function clickPreview(file: UploadFile, index: number) {
  emit('click-preview', { file, index, name: props.name });
  const url = getUrl(file);
  if (!url) return;

  if (isImageFile(file) && props.previewFullImage) {
    const urls = props.fileList.filter(isImageFile).map(getUrl).filter(Boolean);
    uni.previewImage({ urls, current: url });
  } else if (isVideoFile(file) && props.previewVideo) {
    return;
  } else if (props.previewFile) {
    const openDocument = (uni as unknown as { openDocument?: (options: { filePath: string; fail?: (error: unknown) => void }) => void }).openDocument;
    openDocument?.({ filePath: url, fail: (error) => emit('error', error) });
  }
}
</script>

<style lang="less" scoped>
.van-uploader {
  &__preview-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__preview,
  &__upload {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: #f7f8fa;
  }

  &__preview-image {
    width: 100%;
    height: 100%;
  }

  &__file {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 8px;
    color: #646566;
    font-size: 12px;
    box-sizing: border-box;
  }

  &__file-icon {
    margin-bottom: 4px;
    color: #969799;
    font-size: 24px;
  }

  &__file-name {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__delete {
    position: absolute;
    top: -6px;
    right: -6px;
    color: #fff;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
  }

  &__upload {
    flex-direction: column;
    color: #969799;
  }
}
</style>
