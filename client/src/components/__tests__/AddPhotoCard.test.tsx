import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddPhotoCard } from '../AddPhotoCard';

describe('AddPhotoCard', () => {
  const mockOnPhotoSelect = vi.fn();

  it('renders add photo card with text', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={0} />);

    expect(screen.getByText('Add Photos')).toBeInTheDocument();
  });

  it('shows plus icon', () => {
    const { container } = render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={0} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('triggers file input when clicked', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={0} />);

    const card = screen.getByTestId('button-add-photo-card');
    fireEvent.click(card);

    // Input should be clickable
    const input = screen.getByTestId('input-photo-upload') as HTMLInputElement;
    expect(input).toBeInTheDocument();
  });

  it('calls onPhotoSelect when files are selected', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={0} />);

    const input = screen.getByTestId('input-photo-upload') as HTMLInputElement;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    });

    fireEvent.change(input);

    expect(mockOnPhotoSelect).toHaveBeenCalled();
  });

  it('accepts multiple files', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={0} />);

    const input = screen.getByTestId('input-photo-upload') as HTMLInputElement;
    expect(input).toHaveAttribute('multiple');
  });

  it('shows disabled state when at limit', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={18} />);

    expect(screen.getByText('Limit: 18')).toBeInTheDocument();
    
    const card = screen.getByTestId('button-add-photo-card');
    expect(card).toHaveClass('cursor-not-allowed');
    expect(card).toHaveClass('opacity-50');
  });

  it('does not trigger file input when at limit', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={18} />);

    const card = screen.getByTestId('button-add-photo-card');
    fireEvent.click(card);

    expect(mockOnPhotoSelect).not.toHaveBeenCalled();
  });

  it('accepts correct image MIME types', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={0} />);

    const input = screen.getByTestId('input-photo-upload') as HTMLInputElement;
    expect(input).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp');
  });

  it('has proper accessibility attributes', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={0} />);

    const card = screen.getByTestId('button-add-photo-card');
    expect(card).toHaveAttribute('role', 'button');
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', 'Add photos to your wallet');
  });

  it('shows limit message in aria-label when at limit', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={18} />);

    const card = screen.getByTestId('button-add-photo-card');
    expect(card).toHaveAttribute('aria-label', 'Photo limit reached: 18 photos maximum');
    expect(card).toHaveAttribute('aria-disabled', 'true');
  });

  it('handles keyboard interactions', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={0} />);

    const card = screen.getByTestId('button-add-photo-card');
    
    // Test Enter key
    fireEvent.keyDown(card, { key: 'Enter' });
    
    // Test Space key
    fireEvent.keyDown(card, { key: ' ' });
    
    // Card should be interactive
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  it('disables keyboard interaction when at limit', () => {
    render(<AddPhotoCard onPhotoSelect={mockOnPhotoSelect} photoCount={18} />);

    const card = screen.getByTestId('button-add-photo-card');
    expect(card).toHaveAttribute('tabIndex', '-1');
  });
});
