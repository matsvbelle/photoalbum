<script setup lang="ts">
import type { BlobPhoto } from '@/composables/useAzureBlobs'
import { Card } from '@/components/ui/card'
import { Expand } from 'lucide-vue-next'

const props = defineProps<{
  photo: BlobPhoto
}>()

const emit = defineEmits<{
  'open-photo': [photo: BlobPhoto]
}>()
</script>

<template>
  <Card
    class="relative aspect-square overflow-hidden cursor-pointer group p-0 gap-0"
    @click="emit('open-photo', props.photo)"
  >
    <img
      :src="props.photo.url"
      :alt="props.photo.name"
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
      <Expand class="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  </Card>
</template>
