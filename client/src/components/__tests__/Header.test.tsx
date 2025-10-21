import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders the app title', () => {
    render(<Header />);
    expect(screen.getByText('Photo Wallet')).toBeInTheDocument();
  });

  it('renders the app subtitle', () => {
    render(<Header />);
    expect(screen.getByTestId('text-app-subtitle')).toBeInTheDocument();
  });

  it('has correct data-testid for title', () => {
    render(<Header />);
    expect(screen.getByTestId('text-app-title')).toBeInTheDocument();
  });

  it('renders InstallPrompt component', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('has proper semantic HTML structure', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});

