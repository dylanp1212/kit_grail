import {it, expect, vi} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import Login from '../src/app/login/Login'
import {routerSpy} from './mockRouter'


it('renders the login page', () => {
    render(<Login />)
    const title = screen.getByText('Sign in')
    expect(title).not.toBeNull();
});

it('has a google sign in button', () => {
    render(<Login />)
    const button = screen.getByRole('link', { name: /sign in with google/i })
    expect(button).not.toBeNull();
});
    
it('google sign in button has correct link', () => {
    render(<Login />)
    const button = screen.getByRole('link', { name: /sign in with google/i })
    expect(button.getAttribute('href')).toBe('/api/auth/start/google');
});

it('google sign in button appends encoded returnTo when prop is passed', () => {
    render(<Login returnTo="/wishlist" />)
    const button = screen.getByRole('link', { name: /sign in with google/i })
    expect(button.getAttribute('href')).toBe('/api/auth/start/google?returnTo=%2Fwishlist');
});

it('has back to shop button', async () => {
    render(<Login />)
    const back = screen.getByText('Back to shop')
    expect(back).not.toBeNull();
});

it('goes to shop on press back to shop', async () => {
    render(<Login />)
    const back = screen.getByText('Back to shop')
    fireEvent.click(back)
    await vi.waitFor(() => {
        expect(routerSpy).toHaveBeenCalledWith(`/listings`)
    })
});
