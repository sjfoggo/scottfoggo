import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import App from '../components/App';

test('renders the site navigation', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /scott foggo/i })).toBeInTheDocument();
  const menuButton = screen.getByRole('button', { name: /open site index/i });
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
  fireEvent.click(menuButton);
  expect(screen.getByRole('button', { name: /close site index/i })).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '#about');
  expect(screen.getByRole('link', { name: /experience/i })).toHaveAttribute('href', '#career');
  expect(screen.queryByRole('link', { name: /technology/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact');
});
