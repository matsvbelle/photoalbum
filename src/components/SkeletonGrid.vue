<script setup lang="ts">
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
    <Card v-for="i in 12" :key="i" class="aspect-square p-0 gap-0 overflow-hidden">
      <Skeleton class="w-full h-full" />
    </Card>
  </div>
</template>
