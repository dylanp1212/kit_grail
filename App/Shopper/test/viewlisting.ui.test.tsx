import {it, vi, expect} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import {useSearchParams} from 'next/navigation'
import View from '../src/app/viewlisting/View'
import {backSpy} from './mockRouter'

const VALID_ID = 'aa0fccb7-06f8-4f29-ae65-b30c2adabce8'

const renderWithId = () => {
  vi.mocked(useSearchParams).mockReturnValue(new URLSearchParams(`id=${VALID_ID}`))
  render(<View />)
}

it('back button calls router.back in narrow mode', async () => {
  renderWithId()
  fireEvent.click(await screen.findByText('Back'))
  expect(backSpy).toHaveBeenCalled()
})

it('back button calls router.back in wide mode', async () => {
  const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 1040, height: 0, x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0, toJSON: () => ({})
  } as DOMRect)
  renderWithId()
  fireEvent.click(await screen.findByText('Back'))
  expect(backSpy).toHaveBeenCalled()
  spy.mockRestore()
})
