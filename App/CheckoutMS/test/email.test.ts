import {expect, it, vi} from 'vitest'
import {sendOrderConfirmation} from '../src/checkout/email'

it('POSTs to Mailgun with Basic auth and includes items + total in body', async () => {
  const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response('ok', {status: 200})
  )
  await sendOrderConfirmation('buyer@kg.test', [
    {title: 'Messi Jersey', price: 99.99},
    {title: 'Italy Jersey', price: 134},
  ])

  expect(fetchSpy).toHaveBeenCalledOnce()
  const [url, init] = fetchSpy.mock.calls[0]
  expect(url).toBe(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`)
  expect(init?.method).toBe('POST')
  const auth = (init?.headers as Record<string, string>).Authorization
  expect(auth.startsWith('Basic ')).toBe(true)

  const form = init?.body as FormData
  expect(form.get('to')).toBe('buyer@kg.test')
  expect(form.get('text')).toContain('Messi Jersey')
  expect(form.get('text')).toContain('Italy Jersey')
  expect(form.get('text')).toContain('233.99')
})

it('throws when Mailgun returns a non-2xx status', async () => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response('bad', {status: 401})
  )
  await expect(
    sendOrderConfirmation('buyer@kg.test', [{title: 'X', price: 10}])
  ).rejects.toThrow(/Mailgun error 401/)
})
