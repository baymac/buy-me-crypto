import { rest } from 'msw';
import { Provider } from 'next-auth/client';
import { useRouter } from 'next/router';
import React from 'react';
import { server } from 'next-auth-mock';
import { render, screen, waitFor } from 'test-utils';
import HomePage from '../../pages/index';

// Setup api routes for next auth
beforeAll(() => {
  server.listen();
});

afterEach(() => {
  jest.clearAllMocks();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// Mock next/router module
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

function ProviderFlow({ options = {} }) {
  return (
    <Provider options={options}>
      <HomePage />
    </Provider>
  );
}

describe('HomePage', () => {
  // Mock useRouter
  const push = jest.fn();
  useRouter.mockImplementation(() => ({
    push,
    pathname: '/',
    route: '/',
    asPath: '/',
    query: '',
  }));

  it('should render the heading', async () => {
    const mockRouter = {
      push: jest.fn(), // the component uses `router.push` only
    };
    useRouter.mockReturnValue(mockRouter);

    // Dummy mock function to check session route has been called
    const sessionRouteCall = jest.fn();
    // Override /session route to return no session
    server.use(
      rest.get('/api/auth/session', (req, res, ctx) => {
        sessionRouteCall();
        return res(ctx.status(200), ctx.json({}));
      })
    );

    // Create next root container for usePrevenScroll hook
    const nextRoot = document.createElement('div');
    nextRoot.setAttribute('id', '__next');
    document.body.appendChild(nextRoot);

    const textToFind = 'Start earning donations via crypto';
    render(<ProviderFlow />, { container: nextRoot });

    await waitFor(() => {
      expect(sessionRouteCall).toHaveBeenCalledTimes(1); // Ensures session has been returned
      const heading = screen.getByText(textToFind);
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(heading).toBeInTheDocument();
    });
  });
});
