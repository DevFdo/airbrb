import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BookingPicker from '../components/BookingPicker';
import * as api from '../utils/api';

vi.mock('../utils/api', () => ({
  makeBooking: vi.fn(),
}));

describe('BookingPicker', () => {
  const availability = ['2025-11-20', '2025-11-21', '2025-11-22'];
  const pricePerNight = 100;
  const listingId = 'listing-123';
  const onClose = vi.fn();
  const onConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders start and end date fields', () => {
    render(
      <BookingPicker
        listingId={listingId}
        availability={availability}
        pricePerNight={pricePerNight}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
  });

  it('shows booking length and total price when valid dates selected', async () => {
    render(
      <BookingPicker
        listingId={listingId}
        availability={availability}
        pricePerNight={pricePerNight}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: '2025-11-20' },
    });
    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: '2025-11-22' },
    });

    expect(await screen.findByText(/2 nights · Total: \$200/i)).toBeVisible();
  });

  it('calls api.makeBooking, onConfirm, and onClose when Confirm Booking clicked', async () => {
    api.makeBooking.mockResolvedValue({ status: 200 });

    render(
      <BookingPicker
        listingId={listingId}
        availability={availability}
        pricePerNight={pricePerNight}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: '2025-11-20' },
    });
    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: '2025-11-21' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));

    await waitFor(() => {
      expect(api.makeBooking).toHaveBeenCalledWith(
        listingId,
        ['2025-11-20', '2025-11-21'],
        100
      );
      expect(onConfirm).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('clears dates when Clear Dates clicked', () => {
    render(
      <BookingPicker
        listingId={listingId}
        availability={availability}
        pricePerNight={pricePerNight}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    fireEvent.change(screen.getByLabelText(/Start Date/i), {
      target: { value: '2025-11-20' },
    });
    fireEvent.change(screen.getByLabelText(/End Date/i), {
      target: { value: '2025-11-21' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Clear Dates/i }));

    expect(screen.getByLabelText(/Start Date/i)).toHaveValue('');
    expect(screen.getByLabelText(/End Date/i)).toHaveValue('');
  });
});
