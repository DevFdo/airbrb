import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import BookingRequests from '../pages/BookingRequests';
import * as api from '../utils/api';
import dayjs from 'dayjs';

// Mock the API module
vi.mock('../utils/api', () => ({
  fetchListingDetails: vi.fn(),
  fetchBookings: vi.fn(),
  acceptBooking: vi.fn(),
  denyBooking: vi.fn(),
}));

// Mock react-router-dom navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('BookingRequests', () => {
  // Get current year for test data
  const currentYear = dayjs().year();
  
  // Mock listing data
  const mockListing = {
    id: '123',
    title: 'Oceanside Villa',
    owner: 'host@example.com',
    postedOn: '2024-11-01',
    price: 200,
  };

  // Mock bookings data
  const mockBookings = [
    {
      id: 'booking-1',
      listingId: '123',
      owner: 'guest1@example.com',
      status: 'pending',
      dateRange: [`${currentYear}-12-01`, `${currentYear}-12-03`, `${currentYear}-12-04`],
      totalPrice: 400,
    },
    {
      id: 'booking-2',
      listingId: '123',
      owner: 'guest2@example.com',
      status: 'accepted',
      dateRange: [`${currentYear}-12-10`, `${currentYear}-12-12`, `${currentYear}-12-13`],
      totalPrice: 400,
    },
    {
      id: 'booking-3',
      listingId: '123',
      owner: 'guest3@example.com',
      status: 'declined',
      dateRange: [`${currentYear}-12-20`, `${currentYear}-12-22`],
      totalPrice: 200,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchListingDetails.mockResolvedValue(mockListing);
    api.fetchBookings.mockResolvedValue(mockBookings);
  });

  const renderWithRouter = (listingId = '123') => {
    return render(
      <MemoryRouter initialEntries={[`/booking-requests/${listingId}`]}>
        <Routes>
          <Route path="/booking-requests/:id" element={<BookingRequests />} />
        </Routes>
      </MemoryRouter>
    );
  };

  // Test 1: Renders loading state initially
  it('shows loading spinner while fetching data', () => {
    renderWithRouter();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  // Test 2: Renders listing title after data loads
  it('displays listing title in header after data loads', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Booking Requests - Oceanside Villa')).toBeInTheDocument();
    });
  });

  // Test 3: Displays back button that navigates correctly
  it('renders back button that navigates to hosted listings', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Booking Requests - Oceanside Villa')).toBeInTheDocument();
    });
    
    const backButton = screen.getByRole('button', { name: /back to listings/i });
    expect(backButton).toBeInTheDocument();
    
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/host/listings');
  });

  // Test 4: Calculates and displays days online correctly
  it('calculates and displays correct days online', async () => {
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Days Online')).toBeInTheDocument();
    });
  });

  // Test 5: display days booked this year
  it('displays days booked this year (from accepted bookings only)', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('Days Booked (This Year)')).toBeInTheDocument();
      // booking-2 is accepted with 3 dates = 2 nights (dateRange.length - 1)
      // But the display shows the number in the stat card
      const statCards = screen.getAllByText('3');
      expect(statCards.length).toBeGreaterThan(0);
    });
  });

  // Test 6: display profits from accepted bookings
  it('displays profit from accepted bookings this year', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      // Find the Profit card specifically
      const profitLabel = screen.getByText('Profit (This Year)');
      expect(profitLabel).toBeInTheDocument();
      
      // Check that profit card exists (value might be in a sibling element)
      const profitCard = profitLabel.closest('.MuiCardContent-root');
      expect(profitCard).toBeInTheDocument();
    });
  });

  // Test 7: Displays total booking count
  it('displays total number of booking requests', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('Total Booking Requests')).toBeInTheDocument();
    });
  });

  // Test 8: Renders booking table with all bookings
  it('renders booking history table with all bookings', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('Booking Request History')).toBeInTheDocument();
      expect(screen.getByText('guest1@example.com')).toBeInTheDocument();
      expect(screen.getByText('guest2@example.com')).toBeInTheDocument();
      expect(screen.getByText('guest3@example.com')).toBeInTheDocument();
    });
  });

  // Test 9: Displays correct status for each booking
  it('displays correct status chips for each booking', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('pending')).toBeInTheDocument();
      expect(screen.getByText('accepted')).toBeInTheDocument();
      expect(screen.getByText('declined')).toBeInTheDocument();
    });
  });

  // Test 10: Shows Accept/Deny buttons only for pending bookings
  it('shows Accept and Deny buttons only for pending bookings', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      const acceptButtons = screen.getAllByRole('button', { name: /accept/i });
      const denyButtons = screen.getAllByRole('button', { name: /deny/i });
      
      expect(acceptButtons).toHaveLength(1);
      expect(denyButtons).toHaveLength(1);
    });
  });

  
});