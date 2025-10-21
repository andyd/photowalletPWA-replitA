import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArchiveDialog } from '../ArchiveDialog';
import { usePhotoStore } from '@/hooks/usePhotoStore';
import type { Photo } from '@shared/schema';

vi.mock('@/hooks/usePhotoStore');

describe('ArchiveDialog', () => {
  const mockLoadArchivedPhotos = vi.fn();
  const mockUnarchivePhoto = vi.fn();
  const mockDeleteArchivedPhoto = vi.fn();

  const mockArchivedPhoto: Photo = {
    id: 'archived-1',
    blob: new Blob(['test'], { type: 'image/jpeg' }),
    thumbnail: new Blob(['thumb'], { type: 'image/jpeg' }),
    filename: 'archived.jpg',
    order: 0,
    createdAt: new Date('2024-01-01'),
    archived: true,
    archivedAt: new Date('2024-01-15'),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    vi.mocked(usePhotoStore).mockReturnValue({
      photos: [],
      archivedPhotos: [],
      isLoading: false,
      currentPhotoIndex: null,
      isViewerOpen: false,
      loadPhotos: vi.fn(),
      loadArchivedPhotos: mockLoadArchivedPhotos,
      addPhoto: vi.fn(),
      deletePhoto: vi.fn(),
      unarchivePhoto: mockUnarchivePhoto,
      deleteArchivedPhoto: mockDeleteArchivedPhoto,
      reorderPhotos: vi.fn(),
      openViewer: vi.fn(),
      closeViewer: vi.fn(),
      setCurrentPhotoIndex: vi.fn(),
    } as any);
  });

  it('renders overflow folder title', () => {
    render(<ArchiveDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Overflow Folder')).toBeInTheDocument();
  });

  it('renders description about wallet capacity', () => {
    render(<ArchiveDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText(/Photos removed from your wallet are stored here/i)).toBeInTheDocument();
  });

  it('loads archived photos when opened', () => {
    render(<ArchiveDialog open={true} onOpenChange={vi.fn()} />);
    expect(mockLoadArchivedPhotos).toHaveBeenCalled();
  });

  it('does not load archived photos when closed', () => {
    render(<ArchiveDialog open={false} onOpenChange={vi.fn()} />);
    expect(mockLoadArchivedPhotos).not.toHaveBeenCalled();
  });

  it('shows empty state when no archived photos', () => {
    render(<ArchiveDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Overflow Folder is Empty')).toBeInTheDocument();
  });

  it('displays archived photos in grid', () => {
    vi.mocked(usePhotoStore).mockReturnValue({
      archivedPhotos: [mockArchivedPhoto],
      photos: [],
      loadArchivedPhotos: mockLoadArchivedPhotos,
      unarchivePhoto: mockUnarchivePhoto,
      deleteArchivedPhoto: mockDeleteArchivedPhoto,
    } as any);

    render(<ArchiveDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('archived.jpg')).toBeInTheDocument();
  });

  it('shows photo count in footer', () => {
    vi.mocked(usePhotoStore).mockReturnValue({
      archivedPhotos: [mockArchivedPhoto, { ...mockArchivedPhoto, id: 'archived-2' }],
      photos: [],
      loadArchivedPhotos: mockLoadArchivedPhotos,
      unarchivePhoto: mockUnarchivePhoto,
      deleteArchivedPhoto: mockDeleteArchivedPhoto,
    } as any);

    render(<ArchiveDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('2 overflow photos')).toBeInTheDocument();
  });

  it('uses singular form for one photo', () => {
    vi.mocked(usePhotoStore).mockReturnValue({
      archivedPhotos: [mockArchivedPhoto],
      photos: [],
      loadArchivedPhotos: mockLoadArchivedPhotos,
      unarchivePhoto: mockUnarchivePhoto,
      deleteArchivedPhoto: mockDeleteArchivedPhoto,
    } as any);

    render(<ArchiveDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('1 overflow photo')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(<ArchiveDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Close')).toBeInTheDocument();
  });
});

