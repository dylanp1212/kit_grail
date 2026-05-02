import {vi} from 'vitest'

export const mockRouter = {
  push: vi.fn(),
}

export const routerSpy = vi.spyOn(mockRouter, 'push');
