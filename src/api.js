const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `API request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body.detail) {
        message = body.detail;
      }
    } catch {
      // Keep the HTTP status message when the server response is not JSON.
    }
    throw new Error(message);
  }

  return response.json();
}

export const getCounter = () => request('/api/counter');

export const changeCounter = (operation) =>
  request(`/api/counter/${operation}`, { method: 'POST' });

export const updateCounterLimits = (min, max) =>
  request('/api/counter/limits', {
    method: 'PUT',
    body: JSON.stringify({ min, max }),
  });
