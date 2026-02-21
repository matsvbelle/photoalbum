# Photo Album

A static Vue 3 photo browser that lists folders and photos from a publicly accessible Azure Blob Storage container. Click a folder to drill down, click a photo to open it in a full-screen lightbox. No backend required — everything runs in the browser.

## Tech stack

- [Vue 3](https://vuejs.org/) + TypeScript (Composition API / `<script setup>`)
- [Vite](https://vite.dev/) — dev server and bundler
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn-vue](https://www.shadcn-vue.com/) component library (reka-ui primitives)
- [Lucide](https://lucide.dev/) icons
- Azure Blob Storage REST API (XML listing endpoint, no SDK)

---

## Prerequisites

- [Bun](https://bun.sh/) — used as the package manager and script runner
- An Azure Storage account with a **public** blob container (or at least public read access on blobs)
- CORS configured on the storage account (see below)

---

## Local development

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Copy the example file and fill in your Azure Storage details:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_AZURE_STORAGE_ACCOUNT=your_storage_account_name
VITE_AZURE_STORAGE_CONTAINER=your_container_name
```

The values come from your Azure Blob Storage URL:
```
https://<VITE_AZURE_STORAGE_ACCOUNT>.blob.core.windows.net/<VITE_AZURE_STORAGE_CONTAINER>
```

### 3. Start the dev server

```bash
bun run dev
```

The app is available at `http://localhost:5173`.

---

## Production build

```bash
bun run build
```

This runs TypeScript type-checking (`vue-tsc`) followed by a Vite production build. Output is placed in `dist/`.

To preview the production build locally:

```bash
bun run preview
```

The `dist/` folder contains a fully static site — deploy it to any static host (Azure Static Web Apps, GitHub Pages, Netlify, etc.).

---

## Azure Storage setup

### Container access

The container must allow anonymous (public) blob reads. In the Azure Portal:

1. Go to your Storage account → **Containers**
2. Click the container → **Change access level**
3. Set to **Blob** (anonymous read access for blobs only)

### CORS

Browser requests to the Azure REST API require CORS to be enabled on the Blob service:

1. Go to your Storage account → **Resource sharing (CORS)**
2. Select the **Blob service** tab
3. Add a rule:

| Field | Value |
|---|---|
| Allowed origins | `*` |
| Allowed methods | GET, OPTIONS |
| Allowed headers | `*` |
| Exposed headers | `*` |
| Max age | `86400` |

4. Click **Save**

---

## Project structure

```
src/
├── composables/
│   └── useAzureBlobs.ts    # Fetches and parses the Azure Blob XML listing
├── components/
│   ├── AppHeader.vue        # Sticky header with breadcrumb navigation
│   ├── AlbumGrid.vue        # Responsive grid of folders and photos
│   ├── FolderCard.vue       # Clickable folder tile
│   ├── PhotoCard.vue        # Lazy-loaded photo tile with hover overlay
│   ├── PhotoLightbox.vue    # Full-screen photo dialog
│   ├── SkeletonGrid.vue     # Loading placeholder grid
│   ├── ErrorMessage.vue     # Error display with CORS hint
│   └── ui/                  # shadcn-vue components
└── App.vue                  # Root component
```

---

## Supported image formats

`jpg` · `jpeg` · `png` · `gif` · `webp` · `avif` · `bmp`

All other blob types (videos, documents, etc.) are silently ignored.
