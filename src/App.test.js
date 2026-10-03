import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

const initialCounter = { count: 0, min: 0, max: 10 };

beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => initialCounter,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders in Brazilian Portuguese and switches to American English', async () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Meu Contador' })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('pt-BR');

  fireEvent.click(screen.getByRole('button', { name: 'Mudar idioma para English (US)' }));

  expect(screen.getByRole('heading', { name: 'My Counter' })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'Counter limits' })).toBeInTheDocument();
  expect(await screen.findByRole('button', { name: 'Decrease by one' })).toBeInTheDocument();
  expect(document.documentElement.lang).toBe('en-US');
});

test('sends counter actions to the backend API', async () => {
  global.fetch.mockImplementation((url) =>
    Promise.resolve({
      ok: true,
      json: async () =>
        url.endsWith('/increment')
          ? { count: 1, min: 0, max: 10 }
          : initialCounter,
    })
  );
  render(<App />);

  fireEvent.click(await screen.findByRole('button', { name: 'Aumentar em um' }));

  await waitFor(() => {
    expect(global.fetch).toHaveBeenLastCalledWith(
      'http://127.0.0.1:8000/api/counter/increment',
      expect.objectContaining({ method: 'POST' })
    );
  });
  await waitFor(() => {
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
  });
});
