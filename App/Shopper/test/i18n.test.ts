import { it, vi, expect, describe } from 'vitest'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

vi.mock('next-intl/server', () => ({
  getRequestConfig: (fn: (req: unknown) => unknown) => fn,
}))

describe('setLocale', () => {
  it('sets the locale cookie', async () => {
    const { cookies } = await import('next/headers')
    const setSpy = vi.fn()
    vi.mocked(cookies).mockResolvedValueOnce({ set: setSpy, get: vi.fn(), delete: vi.fn() } as any)
    const { setLocale } = await import('../src/i18n/actions')
    await setLocale('sp')
    expect(setSpy).toHaveBeenCalledWith('locale', 'sp', { path: '/' })
  })

  it('calls revalidatePath after setting locale', async () => {
    const { revalidatePath } = await import('next/cache')
    const { cookies } = await import('next/headers')
    vi.mocked(cookies).mockResolvedValueOnce({ set: vi.fn(), get: vi.fn(), delete: vi.fn() } as any)
    const { setLocale } = await import('../src/i18n/actions')
    await setLocale('en')
    expect(vi.mocked(revalidatePath)).toHaveBeenCalledWith('/', 'layout')
  })
})

describe('getRequestConfig', () => {
  it('uses locale from cookie when it is supported', async () => {
    const { cookies } = await import('next/headers')
    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn().mockReturnValue({ value: 'sp' }),
      set: vi.fn(), delete: vi.fn(),
    } as any)
    const getConfig = (await import('../src/i18n/request')).default as (req: unknown) => Promise<{ locale: string }>
    const result = await getConfig({})
    expect(result.locale).toBe('sp')
  })

  it('defaults to en when cookie locale is not supported', async () => {
    const { cookies } = await import('next/headers')
    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn().mockReturnValue({ value: 'fr' }),
      set: vi.fn(), delete: vi.fn(),
    } as any)
    const getConfig = (await import('../src/i18n/request')).default as (req: unknown) => Promise<{ locale: string }>
    const result = await getConfig({})
    expect(result.locale).toBe('en')
  })

  it('defaults to en when no locale cookie is set', async () => {
    const { cookies } = await import('next/headers')
    vi.mocked(cookies).mockResolvedValueOnce({
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(), delete: vi.fn(),
    } as any)
    const getConfig = (await import('../src/i18n/request')).default as (req: unknown) => Promise<{ locale: string }>
    const result = await getConfig({})
    expect(result.locale).toBe('en')
  })
})
