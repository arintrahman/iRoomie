import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';

// --- Mock Next.js router so we can assert navigation ---
jest.mock('next/navigation', () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  return {
    useRouter: () => ({ push, replace, back }),
  };
});

import LoginPage from './page';
import { useRouter } from 'next/navigation';

describe('LoginPage with jest-fetch-mock', () => {
  beforeEach(() => {
    // Reset fetch mock state before each test:
    // clears previous calls and responses.
    fetchMock.resetMocks();

    // Clear localStorage so tests are isolated.
    window.localStorage.clear?.();

    // Clear other Jest mocks (like router).
    jest.clearAllMocks();
  });

  it('renders email, password, and submit button', () => {

    render(<LoginPage />);


    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /log in/i })
    ).toBeInTheDocument();
  });

  it('submits credentials, stores token, and redirects on success', async () => {
    const user = userEvent.setup();
    const { push } = useRouter();

  
    fetchMock.mockResponseOnce(
      JSON.stringify({ token: 'abc123', username: 'roomie' }),
      { status: 200 }
    );


    render(<LoginPage />);

    // simulate user typing and clicking
    await user.type(screen.getByLabelText(/email/i), 'me@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secretpw');
    await user.click(
      screen.getByRole('button', { name: /log in/i })
    );


    await waitFor(() => {

      expect(window.localStorage.getItem('token')).toBe('abc123');
      expect(window.localStorage.getItem('username')).toBe('roomie');


      expect(push).toHaveBeenCalledWith('/profile');
    });


    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/users/login/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      })
    );

    // matches  input
    const [, options] = fetchMock.mock.calls[0];
    const sentBody = JSON.parse(options.body);
    expect(sentBody).toEqual({
      email: 'me@example.com',
      password: 'secretpw',
    });
  });

  it('does not navigate or store token on 401 invalid credentials', async () => {
    const user = userEvent.setup();
    const { push } = useRouter();

    // Mock 401
    fetchMock.mockResponseOnce(
      JSON.stringify({ detail: 'invalid credentials' }),
      { status: 401 }
    );


    render(<LoginPage />);

    //  fill in wrong creds
    await user.type(screen.getByLabelText(/email/i), 'nope@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpw');
    await user.click(
      screen.getByRole('button', { name: /log in/i })
    );


    await waitFor(() => {
      expect(window.localStorage.getItem('token')).toBeNull();
      expect(window.localStorage.getItem('username')).toBeNull();
      expect(push).not.toHaveBeenCalled();
    });


  });

  it('handles network error without redirect or storage', async () => {
    const user = userEvent.setup();
    const { push } = useRouter();

    // Simulate a network failure: fetch rejects instead of resolving
    fetchMock.mockRejectOnce(new Error('network down'));

    // ARRANGE
    render(<LoginPage />);

    // ACT: try to log in
    await user.type(screen.getByLabelText(/email/i), 'me@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secretpw');
    await user.click(
      screen.getByRole('button', { name: /log in/i })
    );

    // ASSERT: still no token, no username, no redirect
    await waitFor(() => {
      expect(window.localStorage.getItem('token')).toBeNull();
      expect(window.localStorage.getItem('username')).toBeNull();
      expect(push).not.toHaveBeenCalled();
    });

    // Again, if your component shows a "Something went wrong" UI,
    // you can assert it here once it's implemented.
  });
});
