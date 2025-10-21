import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhotoGrid } from '../PhotoGrid';
import type { Photo } from '@shared/schema';

describe('PhotoGrid', () => {
  const mockPhotos: Photo[] = [
    {
      id: 'photo-1',
      blob: new Blob(['test1'], { type: 'image/jpeg' }),
      thumbnail: new Blob(['thumb1'], { type: 'image/jpeg' }),
      filename: 'test1.jpg',
      order: 0,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'photo-2',
      blob: new Blob(['test2'], { type: 'image/jpeg' }),
      thumbnail: new Blob(['thumb2'], { type: 'image/jpeg' }),
      filename: 'test2.jpg',
      order: 1,
      createdAt: new Date('2024-01-02'),
    },
  ];

  const mockOnPhotoClick = vi.fn();
  const mockOnAddPhotos = vi.fn();
  const mockOnDelete = vi.fn();

  it('renders photo grid with photos', () => {
    render(
      <PhotoGrid
        photos={mockPhotos}
        onPhotoClick={mockOnPhotoClick}
        onAddPhotos={mockOnAddPhotos}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('img-photo-photo-1')).toBeInTheDocument();
    expect(screen.getByTestId('img-photo-photo-2')).toBeInTheDocument();
  });

  it('renders photos in correct order', () => {
    const { container } = render(
      <PhotoGrid
        photos={mockPhotos}
        onPhotoClick={mockOnPhotoClick}
        onAddPhotos={mockOnAddPhotos}
        onDelete={mockOnDelete}
      />
    );

    const photoCards = container.querySelectorAll('[data-testid^="card-photo-"]');
    expect(photoCards).toHaveLength(2);
  });

  it('renders add photo card when under limit', () => {
    render(
      <PhotoGrid
        photos={mockPhotos}
        onPhotoClick={mockOnPhotoClick}
        onAddPhotos={mockOnAddPhotos}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Add Photos')).toBeInTheDocument();
    expect(screen.getByTestId('button-add-photo-card')).not.toHaveClass('cursor-not-allowed');
  });

  it('renders disabled add photo card when at limit', () => {
    const maxPhotos: Photo[] = Array.from({ length: 18 }, (_, i) => ({
      id: `photo-${i}`,
      blob: new Blob([`test${i}`], { type: 'image/jpeg' }),
      thumbnail: new Blob([`thumb${i}`], { type: 'image/jpeg' }),
      filename: `test${i}.jpg`,
      order: i,
      createdAt: new Date(),
    }));

    render(
      <PhotoGrid
        photos={maxPhotos}
        onPhotoClick={mockOnPhotoClick}
        onAddPhotos={mockOnAddPhotos}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Limit: 18')).toBeInTheDocument();
    expect(screen.getByTestId('button-add-photo-card')).toHaveClass('cursor-not-allowed');
  });

  it('applies correct grid classes for 3-column layout', () => {
    const { container } = render(
      <PhotoGrid
        photos={mockPhotos}
        onPhotoClick={mockOnPhotoClick}
        onAddPhotos={mockOnAddPhotos}
        onDelete={mockOnDelete}
      />
    );

    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-3');
    expect(grid).toHaveClass('gap-2');
  });

  it('handles empty photos array', () => {
    render(
      <PhotoGrid
        photos={[]}
        onPhotoClick={mockOnPhotoClick}
        onAddPhotos={mockOnAddPhotos}
        onDelete={mockOnDelete}
      />
    );

    // Should still show add photo card
    expect(screen.getByText('Add Photos')).toBeInTheDocument();
  });

  it('renders correct data-testid for grid container', () => {
    render(
      <PhotoGrid
        photos={mockPhotos}
        onPhotoClick={mockOnPhotoClick}
        onAddPhotos={mockOnAddPhotos}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('container-photo-grid')).toBeInTheDocument();
  });
});
