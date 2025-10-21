import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PhotoCard } from '../PhotoCard';
import type { Photo } from '@shared/schema';

describe('PhotoCard', () => {
  const mockPhoto: Photo = {
    id: 'test-1',
    blob: new Blob(['test'], { type: 'image/jpeg' }),
    thumbnail: new Blob(['thumb'], { type: 'image/jpeg' }),
    filename: 'test.jpg',
    order: 0,
    createdAt: new Date('2024-01-01'),
  };

  const mockOnPhotoClick = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders photo card with image', () => {
    render(
      <PhotoCard
        photo={mockPhoto}
        index={0}
        onPhotoClick={mockOnPhotoClick}
        onDelete={mockOnDelete}
      />
    );

    const img = screen.getByTestId('img-photo-test-1');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'test.jpg');
  });

  it('calls onPhotoClick when card is clicked', () => {
    render(
      <PhotoCard
        photo={mockPhoto}
        index={0}
        onPhotoClick={mockOnPhotoClick}
        onDelete={mockOnDelete}
      />
    );

    const card = screen.getByTestId('card-photo-test-1');
    fireEvent.click(card);

    expect(mockOnPhotoClick).toHaveBeenCalledWith(0);
  });

  it('shows delete button on hover', () => {
    render(
      <PhotoCard
        photo={mockPhoto}
        index={0}
        onPhotoClick={mockOnPhotoClick}
        onDelete={mockOnDelete}
      />
    );

    const card = screen.getByTestId('card-photo-test-1');
    fireEvent.mouseEnter(card);

    const deleteButton = screen.getByTestId('button-delete-test-1');
    expect(deleteButton).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <PhotoCard
        photo={mockPhoto}
        index={0}
        onPhotoClick={mockOnPhotoClick}
        onDelete={mockOnDelete}
      />
    );

    const card = screen.getByTestId('card-photo-test-1');
    fireEvent.mouseEnter(card);

    const deleteButton = screen.getByTestId('button-delete-test-1');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith('test-1');
    expect(mockOnPhotoClick).not.toHaveBeenCalled(); // Click should not propagate
  });
});
