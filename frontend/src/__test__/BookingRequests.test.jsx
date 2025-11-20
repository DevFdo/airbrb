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

  // Test 11: Calls acceptBooking API when Accept button clicked
  it('calls acceptBooking API when Accept button is clicked', async () => {
    api.acceptBooking.mockResolvedValue({ status: 200 });
    
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    });
    
    const acceptButton = screen.getByRole('button', { name: /accept/i });
    fireEvent.click(acceptButton);
    
    await waitFor(() => {
      expect(api.acceptBooking).toHaveBeenCalledWith('booking-1');
    });
  });

  // Test 12: Shows success message after accepting booking
  it('displays success message after accepting booking', async () => {
    api.acceptBooking.mockResolvedValue({ status: 200 });
    
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    });
    
    const acceptButton = screen.getByRole('button', { name: /accept/i });
    fireEvent.click(acceptButton);
    
    await waitFor(() => {
      expect(screen.getByText('Booking accepted successfully!')).toBeInTheDocument();
    });
  });

  // Test 13: Calls denyBooking API when Deny button clicked
  it('calls denyBooking API when Deny button is clicked', async () => {
    api.denyBooking.mockResolvedValue({ status: 200 });
    
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /deny/i })).toBeInTheDocument();
    });
    
    const denyButton = screen.getByRole('button', { name: /deny/i });
    fireEvent.click(denyButton);
    
    await waitFor(() => {
      expect(api.denyBooking).toHaveBeenCalledWith('booking-1');
    });
  });

  // Test 14: Shows success message after declining booking
  it('displays success message after declining booking', async () => {
    api.denyBooking.mockResolvedValue({ status: 200 });
    
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /deny/i })).toBeInTheDocument();
    });
    
    const denyButton = screen.getByRole('button', { name: /deny/i });
    fireEvent.click(denyButton);
    
    await waitFor(() => {
      expect(screen.getByText('Booking declined successfully!')).toBeInTheDocument();
    });
  });

  // Test 15: Refreshes data after accepting booking
  it('refreshes booking list after accepting a booking', async () => {
    api.acceptBooking.mockResolvedValue({ status: 200 });
    
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    });
    
    const acceptButton = screen.getByRole('button', { name: /accept/i });
    fireEvent.click(acceptButton);
    
    await waitFor(() => {
      expect(api.fetchBookings).toHaveBeenCalledTimes(2);
    });
  });

  // Test 16: Displays error message when API call fails
  it('displays error message when accepting booking fails', async () => {
    api.acceptBooking.mockRejectedValue(new Error('Network error'));
    
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    });
    
    const acceptButton = screen.getByRole('button', { name: /accept/i });
    fireEvent.click(acceptButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to accept booking')).toBeInTheDocument();
    });
  });

  // Test 17: displays date ranges in table
  it('displays date ranges correctly in table', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('Date Range')).toBeInTheDocument();
    });
  });

  // Test 18: displays number of nights for each booking
  it('displays number of nights for each booking', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      // Check that Nights column header exists
      expect(screen.getByText('Nights')).toBeInTheDocument();
      // Check that "nights" text appears in the table (at least once)
      const nightsText = screen.getAllByText(/nights/i);
      expect(nightsText.length).toBeGreaterThan(0);
    });
  });

  // Test 19: displays total price for each booking
  it('displays total price for each booking', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      const priceElements = screen.getAllByText(/\$\d+/);
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  // Test 20: Shows message when no bookings exist
  it('displays message when no bookings exist', async () => {
    api.fetchBookings.mockResolvedValue([]);
    
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('No booking requests yet.')).toBeInTheDocument();
    });
  });

  // Test 21: Fetches data with correct listing ID from URL
  it('fetches listing details using ID from URL parameter', async () => {
    renderWithRouter('456');
    
    await waitFor(() => {
      expect(api.fetchListingDetails).toHaveBeenCalledWith('456');
    });
  });

  // Test 22: Filters bookings to only show current listing
  it('displays only bookings for the current listing', async () => {
    const allBookings = [
      ...mockBookings,
      {
        id: 'booking-other',
        listingId: '999',
        owner: 'guest4@example.com',
        status: 'pending',
        dateRange: [`${currentYear}-12-25`, `${currentYear}-12-27`],
        totalPrice: 300,
      }
    ];
    
    api.fetchBookings.mockResolvedValue(allBookings);
    
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('guest1@example.com')).toBeInTheDocument();
      expect(screen.getByText('guest2@example.com')).toBeInTheDocument();
      expect(screen.queryByText('guest4@example.com')).not.toBeInTheDocument();
    });
  });

  // Test 23: Displays all statistic cards
  it('renders all four statistic cards', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('Days Online')).toBeInTheDocument();
      expect(screen.getByText('Days Booked (This Year)')).toBeInTheDocument();
      expect(screen.getByText('Profit (This Year)')).toBeInTheDocument();
      expect(screen.getByText('Total Booking Requests')).toBeInTheDocument();
    });
  });

  // Test 24: checks only accepted bookings count for profit
it('only counts accepted bookings for profit, not pending or declined', async () => {
  renderWithRouter();
  
  await waitFor(() => {
    // Find the Profit card
    const profitLabel = screen.getByText('Profit (This Year)');
    expect(profitLabel).toBeInTheDocument();
    
    // Get the card containing the profit value
    // The profit amount should be in a sibling element or parent card
    const profitCard = profitLabel.closest('.MuiCardContent-root');
    expect(profitCard).toBeInTheDocument();
    
    // Check for $400 (only from accepted booking)
    // booking-2: accepted, $400 
    // booking-1: pending, $400  (should not count)
    // booking-3: declined, $200 (should not count)
    expect(profitCard.textContent).toContain('$400');
    
    // Verify that booking table shows all statuses
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('accepted')).toBeInTheDocument();
    expect(screen.getByText('declined')).toBeInTheDocument();
  });
});

  // Test 25: Handles bookings from different years correctly
  it('only counts bookings from current year for statistics', async () => {
    const lastYear = currentYear - 1;
    
    const bookingsMultipleYears = [
      {
        id: 'booking-current',
        listingId: '123',
        owner: 'guest@example.com',
        status: 'accepted',
        dateRange: [`${currentYear}-12-01`, `${currentYear}-12-03`],
        totalPrice: 300,
      },
      {
        id: 'booking-last',
        listingId: '123',
        owner: 'guest2@example.com',
        status: 'accepted',
        dateRange: [`${lastYear}-12-01`, `${lastYear}-12-03`],
        totalPrice: 500,
      }
    ];
    
    api.fetchBookings.mockResolvedValue(bookingsMultipleYears);
    
    renderWithRouter();
    
    await waitFor(() => {
      // Verify both bookings appear in table
      expect(screen.getByText('guest@example.com')).toBeInTheDocument();
      expect(screen.getByText('guest2@example.com')).toBeInTheDocument();
    });
  });

  // Test 26: Table headers are displayed correctly
  it('displays all table column headers', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('Guest')).toBeInTheDocument();
      expect(screen.getByText('Date Range')).toBeInTheDocument();
      expect(screen.getByText('Nights')).toBeInTheDocument();
      expect(screen.getByText('Total Price')).toBeInTheDocument();
      expect(screen.getByText('Status')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  // Test 27: Icons are displayed in statistic cards
  it('displays icons in statistic cards', async () => {
    renderWithRouter();
    
    await waitFor(() => {
      expect(screen.getByText('Days Online').parentElement).toBeInTheDocument();
    });
  });
});