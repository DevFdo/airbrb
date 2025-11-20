import { act ,render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ImageCarousel from '../components/ImageCarousel';

describe('ImageCarousel', () => {
  const images = [
    'https://example.com/img1.jpg',
    'https://example.com/img2.jpg',
    'https://example.com/img3.jpg',
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the first image initially', () => {
    render(<ImageCarousel images={images} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', images[0]);
    expect(img).toHaveAttribute('alt', 'Listing image 1');
  });

  it('renders placeholder when no images provided', () => {
    render(<ImageCarousel images={[]} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'placeholder');
  });

  it('navigates to next image when next button clicked', () => {
    render(<ImageCarousel images={images} />);
    const nextButton = screen.getByRole('button', { name: /next image/i });
    fireEvent.click(nextButton);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', images[1]);
    expect(img).toHaveAttribute('alt', 'Listing image 2');
  });

  it('navigates to previous image when prev button clicked', () => {
    render(<ImageCarousel images={images} />);
    const prevButton = screen.getByRole('button', { name: /prev image/i });
    fireEvent.click(prevButton);
    const img = screen.getByRole('img');
    // Wraps around to last image
    expect(img).toHaveAttribute('src', images[2]);
    expect(img).toHaveAttribute('alt', 'Listing image 3');
  });

  it('auto-advances images every 10 seconds', () => {
    render(<ImageCarousel images={images} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', images[0]);
  
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByRole('img')).toHaveAttribute('src', images[1]);
  
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.getByRole('img')).toHaveAttribute('src', images[2]);
  });
});
