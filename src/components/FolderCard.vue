<script setup lang="ts">
import type { BlobFolder } from '@/composables/useAzureBlobs'
import { Card } from '@/components/ui/card'
import { FolderOpen } from 'lucide-vue-next'

const props = defineProps<{
  folder: BlobFolder
}>()

const emit = defineEmits<{
  navigate: [prefix: string]
}>()
</script>

<template>
  <Card
    class="aspect-square cursor-pointer hover:bg-accent transition-colors p-0 gap-0"
    @click="emit('navigate', props.folder.prefix)"
  >
    <div class="flex flex-col items-center justify-center gap-2 w-full h-full p-4">
      <FolderOpen class="h-12 w-12 text-muted-foreground shrink-0" />
      <span class="text-sm text-center w-full truncate">{{ props.folder.name }}</span>
    </div>
  </Card>
</template>
