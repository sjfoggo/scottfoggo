import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

vi.mock('motion/react', async (importOriginal) => {
  const motion = await importOriginal();

  return {
    ...motion,
    useReducedMotion: () => true,
  };
});

import App from '../components/App';

test('renders the ocean experience as the main site', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /scott foggo/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /turns data into decisions/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /let’s build something useful/i })).toBeInTheDocument();
  expect(screen.queryByRole('navigation', { name: /horizon preview/i })).not.toBeInTheDocument();
});
