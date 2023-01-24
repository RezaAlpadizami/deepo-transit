import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import WarehouseSelection from '../screens/transit-screens/warehouse-selection-screens/index';

test('search input should be rendered', () => {
  render(<WarehouseSelection />);
  const userSearchInputEl = screen.getByPlaceholderText(/search/i);
  expect(userSearchInputEl).toBeInTheDocument();
});

test('search input should be empty', () => {
  render(<WarehouseSelection />);
  const userSearchInputEl = screen.getByPlaceholderText(/search/i);
  expect(userSearchInputEl.value).toBe('');
});

test('button should be disabled', () => {
  render(<WarehouseSelection />);
  const errorEl = screen.getByRole('button');
  expect(errorEl).toBeDisabled();
});

test('searc input should change', () => {
  render(<WarehouseSelection />);
  const searchInputEl = screen.getByPlaceholderText(/search/i);
  const testValue = 'test';

  fireEvent.change(searchInputEl, { target: { value: testValue } });
  expect(searchInputEl.value).toBe(testValue);
});
