// src/app/register/page.test.jsx
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

import RegisterPage from './page';
import { useRouter } from 'next/navigation';

describe('RegisterPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    jest.clearAllMocks();
  });

  it('disables submit until form is valid', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    const button = screen.getByRole('button', { name: /create account/i });

    // initially disabled
    expect(button).toBeDisabled();

    // fill email + username + pw but mismatched confirm
    await user.type(screen.getByLabelText(/email/i), 'me@example.com');
    await user.type(screen.getByLabelText(/username/i), 'roomie');
    await user.type(screen.getByLabelText(/^password$/i), 'abc12345');
    await user.type(screen.getByLabelText(/confirm password/i), 'different');

    // still disabled (because pw !== pw2)
    expect(button).toBeDisabled();

    // fix confirm password
    await user.clear(screen.getByLabelText(/confirm password/i));
    await user.type(screen.getByLabelText(/confirm password/i), 'abc12345');

    // now enabled
    expect(button).toBeEnabled();
  });

  it('submits registration and navigates on success', async () => {
    const user = userEvent.setup();
    const { push } = useRouter();

    // backend returns success
    fetchMock.mockResponseOnce(JSON.stringify({ id: 1 }), { status: 201 });

    render(<RegisterPage />);

    // fill valid form
    await user.type(screen.getByLabelText(/email/i), 'me@example.com');
    await user.type(screen.getByLabelText(/username/i), 'roomie');
    await user.type(screen.getByLabelText(/^password$/i), 'abc12345');
    await user.type(screen.getByLabelText(/confirm password/i), 'abc12345');

    const button = screen.getByRole('button', { name: /create account/i });
    expect(button).toBeEnabled();

    // submit
    await user.click(button);

    // wait for redirect
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });

    // check fetch call
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/users/register/',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.any(String),
      })
    );

    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body).toEqual({
      email: 'me@example.com',
      username: 'roomie',
      password: 'abc12345',
    });
  });
});
