import {it, expect} from 'vitest'
import {render, screen} from '@testing-library/react'
import Login from '../src/app/login/Login'

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