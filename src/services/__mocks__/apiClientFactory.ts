import { vi } from 'vitest'

export const mockGet = vi.fn()
export const mockPost = vi.fn()
export const mockDelete = vi.fn()

const mockApiClient = {
  get: mockGet,
  post: mockPost,
  delete: mockDelete,
}

export default vi.fn(() => mockApiClient)
