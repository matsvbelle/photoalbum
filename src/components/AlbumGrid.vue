<script setup lang="ts">
import { computed } from 'vue'
import type { BlobItem, BlobFolder, BlobPhoto } from '@/composables/useAzureBlobs'
import FolderCard from './FolderCard.vue'
import PhotoCard from './PhotoCard.vue'

const props = defineProps<{
  items: ReadonlyArray<BlobItem>
  currentPath: string
}>()

const emit = defineEmits<{
  navigate: [path: string]
  'open-photo': [photo: BlobPhoto]
}>()

const folders = computed(() => props.items.filter((i): i is BlobFolder => i.type === 'folder'))
const photos = computed(() => props.items.filter((i): i is BlobPhoto => i.type === 'photo'))
</script>

<template>
  <div v-if="folders.length === 0 && photos.length === 0" class="flex items-center justify-center py-16">
    <p class="text-muted-foreground">This folder is empty.</p>
  </div>
  <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    <FolderCard
      v-for="folder in folders"
      :key="folder.prefix"
      :folder
      @navigate="emit('navigate', $event)"
    />
    <PhotoCard
      v-for="photo in photos"
      :key="photo.blobName"
      :photo
      @open-photo="emit('open-photo', $event)"
    />
  </div>
</template>
