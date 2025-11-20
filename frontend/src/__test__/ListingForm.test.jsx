import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ListingForm from '../components/ListingForm';

describe('ListingForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Verifies all required form fields are rendered
  it('renders all required form input fields', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    expect(screen.getByLabelText(/Listing Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Postcode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Price per night/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bedrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bathrooms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Total beds/i)).toBeInTheDocument();
  });

  // Test 2: Verifies submit button displays custom label
  it('displays custom submit button label', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Save Changes" />);
    
    const submitButton = screen.getByRole('button', { name: /Save Changes/i });
    expect(submitButton).toBeInTheDocument();
  });

  // Test 3: Verifies form pre-fills with initial data
  it('pre-fills form fields when initialData is provided', () => {
    const initialData = {
      title: 'Luxury Villa',
      price: 350,
      address: {
        street: '456 Beach Rd',
        city: 'Sydney',
        state: 'NSW',
        postcode: '2000',
        country: 'Australia'
      },
      metadata: {
        bedroom: 4,
        bathroom: 3,
        beds: 5,
        type: 'Cabin',
        amenities: ['WiFi', 'Pool']
      }
    };
    
    render(<ListingForm onSubmit={mockOnSubmit} initialData={initialData} submitLabel="Update" />);
    
    expect(screen.getByLabelText(/Listing Title/i)).toHaveValue('Luxury Villa');
    expect(screen.getByLabelText(/Price per night/i)).toHaveValue(350);
    expect(screen.getByLabelText(/Street/i)).toHaveValue('456 Beach Rd');
    expect(screen.getByLabelText(/City/i)).toHaveValue('Sydney');
    expect(screen.getByLabelText(/Bedrooms/i)).toHaveValue(4);
    expect(screen.getByLabelText(/Bathrooms/i)).toHaveValue(3);
  });

  // Test 4: Verifies user can input text in title field
  it('allows user to type in the listing title field', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    const titleInput = screen.getByLabelText(/Listing Title/i);
    fireEvent.change(titleInput, { target: { value: 'Seaside Retreat' } });
    
    expect(titleInput).toHaveValue('Seaside Retreat');
  });

  // Test 5: Verifies user can input numbers in price field
  it('accepts numeric input for price field', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    const priceInput = screen.getByLabelText(/Price per night/i);
    fireEvent.change(priceInput, { target: { value: '450' } });
    
    expect(priceInput).toHaveValue(450);
  });

  // Test 6: Verifies property type dropdown exists
  it('renders property type dropdown with options', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    const propertyTypeLabel = screen.getByLabelText(/Property type/i);
    expect(propertyTypeLabel).toBeInTheDocument();
  });

  // Test 7: Add button only appears when amenity input has text
  it('shows Add button only when amenity input has text', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    // Initially, Add button should not be visible
    expect(screen.queryByRole('button', { name: /Add/i })).not.toBeInTheDocument();
    
    const amenityInput = screen.getByLabelText(/Amenities/i);
    
    // Type in amenity and Add button should appear
    fireEvent.change(amenityInput, { target: { value: 'WiFi' } });
    // Now the Add button should be visible
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  // Test 8: Test adding multiple amenities
  it('allows adding multiple amenities', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    const amenityInput = screen.getByLabelText(/Amenities/i);
    
    // Add first amenity
    fireEvent.change(amenityInput, { target: { value: 'WiFi' } });
    const addButton = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(addButton);
    
    // Check first amenity was added
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    
    // Add second amenity
    fireEvent.change(amenityInput, { target: { value: 'Parking' } });
    const addButton2 = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(addButton2);
    
    // Both should be visible
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Parking')).toBeInTheDocument();
  });

  // Test 9: Test removing amenities
  it('allows user to remove amenities', () => {
    const initialData = {
      metadata: {
        amenities: ['WiFi', 'Pool', 'Gym']
      }
    };
    
    render(<ListingForm onSubmit={mockOnSubmit} initialData={initialData} submitLabel="Update" />);
    
    // All amenities should be visible
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByText('Gym')).toBeInTheDocument();
    
    // Find delete buttons (CancelIcon in Chip)
    const deleteButtons = screen.getAllByTestId('CancelIcon');
    
    // Remove first amenity (WiFi)
    fireEvent.click(deleteButtons[0]);
    
    // WiFi should be removed, others remain
    expect(screen.queryByText('WiFi')).not.toBeInTheDocument();
    expect(screen.getByText('Pool')).toBeInTheDocument();
    expect(screen.getByText('Gym')).toBeInTheDocument();
  });

  // Test 10: Verifies YouTube URL field exists
  it('renders YouTube URL optional field', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    const youtubeField = screen.getByLabelText(/YouTube URL/i);
    expect(youtubeField).toBeInTheDocument();
    expect(screen.getByText(/Paste an embeded link/i)).toBeInTheDocument();
  });

  // Test 11: Verifies user can input YouTube URL
  it('allows user to input YouTube URL', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    const youtubeField = screen.getByLabelText(/YouTube URL/i);
    fireEvent.change(youtubeField, { 
      target: { value: 'https://www.youtube.com/embed/dQw4w9WgXcQ' } 
    });
    
    expect(youtubeField).toHaveValue('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  // Test 12: Verifies thumbnail upload button exists
  it('renders thumbnail upload button', () => {
    render(<ListingForm onSubmit={mockOnSubmit} submitLabel="Create" />);
    
    const uploadButton = screen.getByRole('button', { name: /Upload thumbnail/i });
    expect(uploadButton).toBeInTheDocument();
  });


});