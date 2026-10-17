import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_PROJECT_ID,
  dataset: import.meta.env.VITE_DATASET,
  apiVersion: '2025-02-19',
  perspective: 'published',
  useCdn: true, // Usa CDN para respuestas ultrarrápidas
})
