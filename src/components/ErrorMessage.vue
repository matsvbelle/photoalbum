<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-vue-next'

const props = defineProps<{
  message: string
}>()

const emit = defineEmits<{
  retry: []
}>()

const showCorsHint = computed(() => props.message.includes('Failed to fetch'))
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-16 text-center">
    <AlertCircle class="h-12 w-12 text-destructive" />
    <p class="text-destructive max-w-md">{{ props.message }}</p>
    <div v-if="showCorsHint" class="max-w-md rounded-md border border-muted bg-muted/30 p-4 text-sm text-muted-foreground text-left">
      <strong class="block mb-1">CORS not configured?</strong>
      Enable CORS on your Azure Storage account: go to the Azure Portal → Storage Account → Settings -> Resource sharing (CORS), and add a rule with:
      <ul class="list-disc list-inside mt-1 space-y-0.5">
        <li>Allowed origins: <code>*</code></li>
        <li>Allowed methods: GET, OPTIONS</li>
        <li>Allowed headers: <code>*</code></li>
        <li>Max age: 86400</li>
      </ul>
    </div>
    <Button variant="outline" @click="emit('retry')">Try again</Button>
  </div>
</template>
