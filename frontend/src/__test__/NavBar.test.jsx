import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NavBar from '../components/NavBar';
import * as api from '../utils/api';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const navigateMock = vi.fn();
  return {
    ...actual,
    useNavigate: () => navigateMock,
    navigateMock,
  };
});

vi.mock('../utils/api', () => ({
  logout: vi.fn(),
}));

import { MemoryRouter, navigateMock } from 'react-router-dom';

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('NavBar', () => {
  
  it('shows Get Started when not authenticated', () => {
    render(<MemoryRouter><NavBar /></MemoryRouter>);
    expect(screen.getByText(/Get Started/i)).toBeInTheDocument();
  });

  it('Get Started button navigate to log in page when clicked',()=>{
    render(<MemoryRouter><NavBar /></MemoryRouter>);
    const button = screen.getByText(/Get Started/i)
    expect(button.closest('a')).toHaveAttribute('href', '/login');
  })

  it('shows user avatar when authenticated, stating that user has logged in.',()=>{
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('email', 'johnsmith@123com');

    render(<MemoryRouter><NavBar /></MemoryRouter>);
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.queryByText(/Get Started/i)).not.toBeInTheDocument();
  })

  it('able to navigate to homepage when home icon clicked', async () =>{
    render(<MemoryRouter><NavBar /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    expect(navigateMock).toHaveBeenCalledWith('/');
  })
  it('opens menu when avatar clicked, with my hosted listings and log out displayed', async () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('email', 'johnsmith@123com');

    render(<MemoryRouter><NavBar /></MemoryRouter>);
    await fireEvent.click(screen.getByRole('button', { name: /Open settings/i }));

    expect(screen.getByText(/My Hosted Listings/i)).toBeVisible();
    expect(screen.getByText(/Log out/i)).toBeVisible();
  });

});
