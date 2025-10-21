import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WelcomeScreen } from '../WelcomeScreen';

describe('WelcomeScreen', () => {
  const mockOnGetStarted = vi.fn();

  it('renders Photo Wallet title', () => {
    render(<WelcomeScreen onGetStarted={mockOnGetStarted} />);
    expect(screen.getByText('Photo Wallet')).toBeInTheDocument();
  });

  it('renders tagline', () => {
    render(<WelcomeScreen onGetStarted={mockOnGetStarted} />);
    expect(screen.getByText('The photos you want with you all the time')).toBeInTheDocument();
  });

  it('renders wallet icon', () => {
    const { container } = render(<WelcomeScreen onGetStarted={mockOnGetStarted} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders Get Started button', () => {
    render(<WelcomeScreen onGetStarted={mockOnGetStarted} />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('calls onGetStarted when button is clicked', () => {
    render(<WelcomeScreen onGetStarted={mockOnGetStarted} />);
    const button = screen.getByText('Get Started');
    fireEvent.click(button);
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
  });

  it('has fixed positioning to cover screen', () => {
    const { container } = render(<WelcomeScreen onGetStarted={mockOnGetStarted} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('fixed');
    expect(wrapper).toHaveClass('inset-0');
  });

  it('has high z-index for overlay', () => {
    const { container } = render(<WelcomeScreen onGetStarted={mockOnGetStarted} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('z-50');
  });

  it('centers content vertically and horizontally', () => {
    const { container } = render(<WelcomeScreen onGetStarted={mockOnGetStarted} />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('items-center');
    expect(wrapper).toHaveClass('justify-center');
  });
});

