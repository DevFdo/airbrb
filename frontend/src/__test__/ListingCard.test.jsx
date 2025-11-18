import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ListingCard from '../components/ListingCard';

describe('ListingCard', () => {
  const title = 'Cozy Apartment';
  const userInitial = 'A';
  const thumbnail = 'https://example.com/thumb.jpg';
  const images = [
    'https://example.com/thumb.jpg',
    'https://example.com/img2.jpg',
    'https://example.com/img3.jpg',
  ];
  const onClick = vi.fn();

  it('renders title, avatar, and review text', () => {
    render(
      <ListingCard
        title={title}
        userInitial={userInitial}
        thumbnail={thumbnail}
        reviewNum={2}
        youtubeUrl=""
        images={images}
        onClick={onClick}
      />
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(userInitial)).toBeInTheDocument();
    expect(screen.getByText(/2 Reviews/i)).toBeInTheDocument();
  });

  it('renders YouTube iframe when youtubeUrl provided', () => {
    render(
      <ListingCard
        title={title}
        userInitial={userInitial}
        thumbnail={thumbnail}
        reviewNum={1}
        youtubeUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        images={images}
        onClick={onClick}
      />
    );

    const iframe = screen.getByTitle(title);
    expect(iframe).toHaveAttribute('src', expect.stringContaining('youtube.com/embed'));
  });

  it('renders placeholder when no real thumbnail', () => {
    render(
      <ListingCard
        title={title}
        userInitial={userInitial}
        thumbnail="https://media.cntraveler.com/photos/67f53f14f89653830ad19b2b/3:2/w_960,h_640,c_limit/Airbnb-05d669ab-3115-4fce-b5fd-0de123aaf780.jpg"
        reviewNum={0}
        youtubeUrl=""
        images={[]}
        onClick={onClick}
      />
    );

    const img = screen.getByAltText(/placeholder/i);
    expect(img).toBeInTheDocument();
  });

  it('navigates images with next/prev buttons', () => {
    render(
      <ListingCard
        title={title}
        userInitial={userInitial}
        thumbnail={thumbnail}
        reviewNum={3}
        youtubeUrl=""
        images={images}
        onClick={onClick}
      />
    );

    expect(screen.getByAltText(title)).toHaveAttribute('src', images[0]);

    fireEvent.click(screen.getByRole('button', { name: /next image/i }));
    expect(screen.getByAltText(title)).toHaveAttribute('src', images[1]);

    fireEvent.click(screen.getByRole('button', { name: /prev image/i }));
    expect(screen.getByAltText(title)).toHaveAttribute('src', images[0]);
  });

  it('calls onClick when card is clicked', () => {
    render(
      <ListingCard
        title={title}
        userInitial={userInitial}
        thumbnail={thumbnail}
        reviewNum={1}
        youtubeUrl=""
        images={images}
        onClick={onClick}
      />
    );

    fireEvent.click(screen.getByText(title));
    expect(onClick).toHaveBeenCalled();
  });
});
