<script setup lang="ts">
import type { BlobPhoto } from '@/composables/useAzureBlobs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const props = defineProps<{
  photo: BlobPhoto | null
}>()

const emit = defineEmits<{
  close: []
}>()

function onOpenChange(open: boolean) {
  if (!open) emit('close')
}
</script>

<template>
  <Dialog :open="!!props.photo" @update:open="onOpenChange">
    <DialogContent :show-close-button="false" class="flex flex-col items-center w-fit max-w-[95vw] sm:max-w-[95vw] max-h-[calc(100vh-7rem)] gap-3 p-4">
      <DialogHeader class="w-full">
        <DialogTitle class="text-base font-semibold break-all">{{ props.photo?.name }}</DialogTitle>
      </DialogHeader>
      <img
        v-if="props.photo"
        :src="props.photo.url"
        :alt="props.photo.name"
        class="max-w-[calc(95vw-2rem)] max-h-[calc(100vh-12rem)] w-auto h-auto block"
      />
    </DialogContent>
  </Dialog>
</template>
