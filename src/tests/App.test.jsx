import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from '../components/App';

test('renders the site navigation', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /scott foggo/i })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /index/i }));
  expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '#about');
  expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '#career');
  expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact');
});
