import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: import.meta.env.VITE_PROJECT_ID, // Reemplaza con el ID de tu proyecto en Sanity
  dataset: import.meta.env.VITE_DATASET, // O el nombre de tu dataset público (ej: 'production')
  apiVersion: '2024-01-01',
  useCdn: true, // Usa CDN para respuestas ultrarrápidas
})