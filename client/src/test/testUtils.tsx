import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import type { Photo } from '@shared/schema';
import { vi } from 'vitest';

/**
 * Custom render function that wraps components with necessary providers
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Creates a mock Photo object for testing
 */
export const createMockPhoto = (overrides?: Partial<Photo>): Photo => {
  return {
    id: 'test-photo-id',
    blob: new Blob(['test-image-data'], { type: 'image/jpeg' }),
    thumbnail: new Blob(['test-thumbnail-data'], { type: 'image/jpeg' }),
    filename: 'test-photo.jpg',
    order: 0,
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    ...overrides,
  };
};

/**
 * Creates multiple mock photos for testing
 */
export const createMockPhotos = (count: number): Photo[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockPhoto({
      id: `photo-${index}`,
      filename: `photo-${index}.jpg`,
      order: index,
    })
  );
};

/**
 * Creates a mock File object for testing file uploads
 */
export const createMockFile = (
  name = 'test.jpg',
  type = 'image/jpeg',
  size = 1024
): File => {
  const blob = new Blob(['x'.repeat(size)], { type });
  const file = new File([blob], name, { type });
  
  // Add arrayBuffer method for compatibility with modern File API
  if (!file.arrayBuffer) {
    (file as any).arrayBuffer = () => blob.arrayBuffer();
  }
  
  return file;
};

/**
 * Creates multiple mock files for testing batch uploads
 */
export const createMockFiles = (count: number): File[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockFile(`test-${index}.jpg`)
  );
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = (ms = 0): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Mock implementation of URL.createObjectURL
 */
export const mockCreateObjectURL = (url = 'mock-blob-url') => {
  return vi.fn(() => url);
};

/**
 * Mock implementation of URL.revokeObjectURL
 */
export const mockRevokeObjectURL = () => {
  return vi.fn();
};

/**
 * Create a mock canvas context for testing image operations
 */
export const createMockCanvasContext = () => {
  return {
    canvas: document.createElement('canvas'),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    drawImage: vi.fn(),
    getImageData: vi.fn(),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    translate: vi.fn(),
    transform: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    quadraticCurveTo: vi.fn(),
    arc: vi.fn(),
    arcTo: vi.fn(),
    ellipse: vi.fn(),
    rect: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    clip: vi.fn(),
    isPointInPath: vi.fn(),
    isPointInStroke: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  };
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

