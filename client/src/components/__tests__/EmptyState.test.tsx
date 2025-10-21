import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  const mockOnAddPhoto = vi.fn();

  it('renders empty state with heading', () => {
    render(<EmptyState onAddPhoto={mockOnAddPhoto} />);

    expect(screen.getByText('Your Photo Wallet is Empty')).toBeInTheDocument();
  });

  it('renders descriptive text', () => {
    render(<EmptyState onAddPhoto={mockOnAddPhoto} />);

    expect(
      screen.getByText(/Add up to 12 photos that matter most to you/i)
    ).toBeInTheDocument();
  });

  it('renders add photo button', () => {
    render(<EmptyState onAddPhoto={mockOnAddPhoto} />);

    expect(screen.getByText('Add Your First Photo')).toBeInTheDocument();
  });

  it('calls onAddPhoto when button is clicked', () => {
    render(<EmptyState onAddPhoto={mockOnAddPhoto} />);

    const button = screen.getByText('Add Your First Photo');
    fireEvent.click(button);

    expect(mockOnAddPhoto).toHaveBeenCalled();
  });

  it('displays wallet icon', () => {
    const { container } = render(<EmptyState onAddPhoto={mockOnAddPhoto} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has centered layout classes', () => {
    const { container } = render(<EmptyState onAddPhoto={mockOnAddPhoto} />);

    const emptyState = container.firstChild;
    expect(emptyState).toHaveClass('flex');
    expect(emptyState).toHaveClass('items-center');
    expect(emptyState).toHaveClass('justify-center');
  });
});

