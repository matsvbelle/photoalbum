<script setup lang="ts">
import type { BreadcrumbSegment } from '@/composables/useAzureBlobs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const props = defineProps<{
  breadcrumbs: BreadcrumbSegment[]
}>()

const emit = defineEmits<{
  navigate: [path: string]
}>()
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container mx-auto flex h-14 items-center gap-4 px-4">
      <Breadcrumb>
        <BreadcrumbList>
          <template v-for="(crumb, index) in props.breadcrumbs" :key="crumb.path">
            <BreadcrumbSeparator v-if="index > 0" />
            <BreadcrumbItem>
              <BreadcrumbPage v-if="index === props.breadcrumbs.length - 1">
                {{ crumb.label }}
              </BreadcrumbPage>
              <BreadcrumbLink
                v-else
                class="cursor-pointer"
                @click="emit('navigate', crumb.path)"
              >
                {{ crumb.label }}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
</template>
