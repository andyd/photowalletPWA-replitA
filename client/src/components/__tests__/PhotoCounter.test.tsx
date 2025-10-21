import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PhotoCounter } from '../PhotoCounter';

describe('PhotoCounter', () => {
  it('displays photo count correctly', () => {
    render(<PhotoCounter count={5} />);

    expect(screen.getByText('5 photos')).toBeInTheDocument();
  });

  it('displays zero count', () => {
    render(<PhotoCounter count={0} />);

    expect(screen.getByText('0 photos')).toBeInTheDocument();
  });

  it('displays single photo count', () => {
    render(<PhotoCounter count={1} />);

    expect(screen.getByText('1 photo')).toBeInTheDocument();
  });

  it('displays count at maximum', () => {
    render(<PhotoCounter count={12} />);

    expect(screen.getByText('12 photos')).toBeInTheDocument();
  });

  it('has badge styling', () => {
    const { container } = render(<PhotoCounter count={5} />);

    const badge = container.querySelector('.inline-flex');
    expect(badge).toBeInTheDocument();
  });

  it('renders with correct text formatting for multiple photos', () => {
    render(<PhotoCounter count={7} />);

    const counterText = screen.getByText('7 photos');
    expect(counterText).toBeInTheDocument();
  });

  it('has correct data-testid', () => {
    render(<PhotoCounter count={5} />);

    expect(screen.getByTestId('text-photo-count')).toBeInTheDocument();
  });
});
