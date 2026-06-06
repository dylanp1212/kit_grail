import {vi} from 'vitest'

export const mockRouter = {
  push: vi.fn(),
  back: vi.fn(),
}

export const routerSpy = vi.spyOn(mockRouter, 'push');
export const backSpy = vi.spyOn(mockRouter, 'back');
