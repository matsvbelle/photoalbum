import { ref, computed, watch, readonly } from 'vue'

export interface BlobFolder {
  type: 'folder'
  name: string
  prefix: string
}

export interface BlobPhoto {
  type: 'photo'
  name: string
  blobName: string
  url: string
}

export type BlobItem = BlobFolder | BlobPhoto

export interface BreadcrumbSegment {
  label: string
  path: string
}

const ACCOUNT = import.meta.env.VITE_AZURE_STORAGE_ACCOUNT as string | undefined
const CONTAINER = import.meta.env.VITE_AZURE_STORAGE_CONTAINER as string | undefined
const BASE_URL = `https://${ACCOUNT}.blob.core.windows.net/${CONTAINER}`
const PHOTO_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp'])

function buildBreadcrumbs(path: string): BreadcrumbSegment[] {
  const crumbs: BreadcrumbSegment[] = [{ label: 'Home', path: '' }]
  if (!path) return crumbs

  const segments = path.split('/').filter(Boolean)
  let accumulated = ''
  for (const segment of segments) {
    accumulated += segment + '/'
    crumbs.push({ label: segment, path: accumulated })
  }
  return crumbs
}

function parseXml(xml: string): BlobItem[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')

  const folders: BlobFolder[] = []
  const photos: BlobPhoto[] = []

  // Parse BlobPrefix elements → folders
  const prefixEls = doc.querySelectorAll('BlobPrefix')
  for (const el of prefixEls) {
    const prefix = el.querySelector('Name')?.textContent ?? ''
    const segments = prefix.split('/').filter(Boolean)
    const name = segments[segments.length - 1] ?? prefix
    folders.push({ type: 'folder', name, prefix })
  }

  // Parse Blob elements → photos
  const blobEls = doc.querySelectorAll('Blob')
  for (const el of blobEls) {
    const blobName = el.querySelector('Name')?.textContent ?? ''
    const ext = blobName.split('.').pop()?.toLowerCase() ?? ''
    if (!PHOTO_EXT.has(ext)) continue
    const segments = blobName.split('/').filter(Boolean)
    const name = segments[segments.length - 1] ?? blobName
    const url = `${BASE_URL}/${blobName}`
    photos.push({ type: 'photo', name, blobName, url })
  }

  return [...folders, ...photos]
}

export function useAzureBlobs() {
  const items = ref<BlobItem[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const currentPath = ref('')

  const breadcrumbs = computed(() => buildBreadcrumbs(currentPath.value))

  if (!ACCOUNT || !CONTAINER) {
    error.value =
      'Missing Azure Storage configuration. Set VITE_AZURE_STORAGE_ACCOUNT and VITE_AZURE_STORAGE_CONTAINER in your .env file.'
  }

  async function fetchBlobs(path: string) {
    if (!ACCOUNT || !CONTAINER) return

    isLoading.value = true
    error.value = null

    try {
      let url = `${BASE_URL}?restype=container&comp=list&delimiter=/`
      if (path) {
        url += `&prefix=${encodeURIComponent(path)}`
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const xml = await response.text()
      items.value = parseXml(xml)
    } catch (e) {
      if (e instanceof Error) {
        error.value = e.message
      } else {
        error.value = String(e)
      }
      items.value = []
    } finally {
      isLoading.value = false
    }
  }

  function navigateTo(path: string) {
    currentPath.value = path
  }

  function navigateUp() {
    const segments = currentPath.value.split('/').filter(Boolean)
    segments.pop()
    currentPath.value = segments.length ? segments.join('/') + '/' : ''
  }

  function refresh() {
    fetchBlobs(currentPath.value)
  }

  watch(currentPath, fetchBlobs, { immediate: true })

  return {
    items: readonly(items),
    isLoading: readonly(isLoading),
    error: readonly(error),
    currentPath,
    breadcrumbs,
    navigateTo,
    navigateUp,
    refresh,
  }
}
