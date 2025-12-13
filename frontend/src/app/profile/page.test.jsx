import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';

// mock router
jest.mock('next/navigation', () => {
  const push = jest.fn();
  return {
    useRouter: () => ({ push, replace: jest.fn(), back: jest.fn() }),
  };
});

import ProfilePage from './page';
import { useRouter } from 'next/navigation';

describe('ProfilePage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    window.localStorage.clear?.();
    jest.clearAllMocks();
  });

  it('redirects to /login when no token in localStorage', async () => {
    const { push } = useRouter();

    render(<ProfilePage />);


    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();


    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });


    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('loads and displays profile when token exists', async () => {
    const { push } = useRouter();

    window.localStorage.setItem('token', 'abc123');

    const profileData = {
      age: '21',
      gender: 'Non-binary',
      budget: '800',
      preferred_location: 'Campustown',
      bio: 'Love quiet roommates',
    };

    // fetch: GET profile
    fetchMock.mockResponseOnce(JSON.stringify(profileData), { status: 200 });

    render(<ProfilePage />);


    expect(screen.getByText(/loading profile/i)).toBeInTheDocument();


    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /your profile/i })).toBeInTheDocument();
    });

    // Inputs should be pre-filled with the profile data
    expect(screen.getByPlaceholderText(/age/i)).toHaveValue('21');
    expect(screen.getByPlaceholderText(/gender/i)).toHaveValue('Non-binary');
    expect(screen.getByPlaceholderText(/budget/i)).toHaveValue('800');
    expect(screen.getByPlaceholderText(/preferred location/i)).toHaveValue('Campustown');
    expect(screen.getByPlaceholderText(/bio/i)).toHaveValue('Love quiet roommates');


    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe('http://127.0.0.1:8000/api/users/profile/');
    expect(options.headers.Authorization).toBe('Token abc123');

    // Should not have redirected
    expect(push).not.toHaveBeenCalled();
  });

  it('updates profile and shows success message on save', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('token', 'abc123');

    const initialProfile = {
      age: '21',
      gender: 'Non-binary',
      budget: '800',
      preferred_location: 'Campustown',
      bio: 'Love quiet roommates',
    };

    // First response: GET profile
    // Second response: PUT profile update
    fetchMock.mockResponses(
      [JSON.stringify(initialProfile), { status: 200 }],
      [JSON.stringify({ ...initialProfile, age: '22' }), { status: 200 }],
    );

    render(<ProfilePage />);


    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /your profile/i })).toBeInTheDocument();
    });

    const ageInput = screen.getByPlaceholderText(/age/i);

    // Change age from 21 -> 22
    await user.clear(ageInput);
    await user.type(ageInput, '22');

    // Click "Save Changes"
    await user.click(screen.getByRole('button', { name: /save changes/i }));


    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });


    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [putUrl, putOptions] = fetchMock.mock.calls[1];
    expect(putUrl).toBe('http://127.0.0.1:8000/api/users/profile/');
    expect(putOptions.method).toBe('PUT');
    expect(putOptions.headers['Content-Type']).toBe('application/json');
    expect(putOptions.headers.Authorization).toBe('Token abc123');

    const body = JSON.parse(putOptions.body);
    expect(body.age).toBe('22'); // updated value
  });

  it('logs out: clears token and redirects to /login', async () => {
    const user = userEvent.setup();
    const { push } = useRouter();
    window.localStorage.setItem('token', 'abc123');

    const profileData = {
      age: '21',
      gender: 'Non-binary',
      budget: '800',
      preferred_location: 'Campustown',
      bio: 'Love quiet roommates',
    };

    fetchMock.mockResponseOnce(JSON.stringify(profileData), { status: 200 });

    render(<ProfilePage />);

    // Wait until profile is loaded
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /your profile/i })).toBeInTheDocument();
    });

    // Click Logout
    await user.click(screen.getByRole('button', { name: /logout/i }));

    // Token should be removed
    expect(window.localStorage.getItem('token')).toBeNull();

    // Should navigate to /login
    expect(push).toHaveBeenCalledWith('/login');
  });
});
