<script setup lang="ts">
import { ref } from 'vue'
import { useAzureBlobs } from '@/composables/useAzureBlobs'
import type { BlobPhoto } from '@/composables/useAzureBlobs'
import AppHeader from '@/components/AppHeader.vue'
import AlbumGrid from '@/components/AlbumGrid.vue'
import SkeletonGrid from '@/components/SkeletonGrid.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import PhotoLightbox from '@/components/PhotoLightbox.vue'

const { items, isLoading, error, breadcrumbs, navigateTo, refresh } = useAzureBlobs()

const selectedPhoto = ref<BlobPhoto | null>(null)
</script>

<template>
  <div class="min-h-screen bg-background">
    <AppHeader :breadcrumbs="breadcrumbs" @navigate="navigateTo" />
    <main class="container mx-auto px-4 py-6">
      <SkeletonGrid v-if="isLoading" />
      <ErrorMessage v-else-if="error" :message="error" @retry="refresh" />
      <AlbumGrid
        v-else
        :items="items"
        :current-path="''"
        @navigate="navigateTo"
        @open-photo="selectedPhoto = $event"
      />
    </main>
    <PhotoLightbox :photo="selectedPhoto" @close="selectedPhoto = null" />
  </div>
</template>
