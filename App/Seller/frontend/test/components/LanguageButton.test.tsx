import {it, describe, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {LanguageButton} from '../../src/components/LanguageButton';
import i18n from '../../src/i18n';

const renderButton = () => render(<LanguageButton />);

describe('LanguageButton', () => {
  it('opens menu showing language options', async () => {
    renderButton();
    await userEvent.click(screen.getByText(/language/i));
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
  });

  it('shows checkmark next to current language', async () => {
    renderButton();
    await userEvent.click(screen.getByText(/language/i));
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
  });

  it('calls changeLanguage when selecting español', async () => {
    const spy = vi.spyOn(i18n, 'changeLanguage')
        .mockResolvedValue(undefined as any);
    renderButton();
    await userEvent.click(screen.getByText(/language/i));
    await userEvent.click(screen.getByText('Español'));
    expect(spy).toHaveBeenCalledWith('sp');
  });

  it('sets locale cookie when selecting español', async () => {
    renderButton();
    await userEvent.click(screen.getByText(/language/i));
    await userEvent.click(screen.getByText('Español'));
    expect(document.cookie).toContain('locale=sp');
  });

  it('closes menu after selecting a language', async () => {
    renderButton();
    await userEvent.click(screen.getByText(/language/i));
    await userEvent.click(screen.getByText('Español'));
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });

  it('closes menu when clicked', async () => {
    renderButton();
    await userEvent.click(screen.getByText(/language/i));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByText('English')).not.toBeInTheDocument();
  });
});
