import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import DeleteCustomerDialog from '../components/customers/DeleteCustomerDialog';

jest.mock('axios');

describe('DeleteCustomerDialog', () => {
  const handleClose = jest.fn();
  const fetchCustomers = jest.fn();
  const customer = { id: 1, name: 'John Doe' };
  const open = true;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the dialog correctly', () => {
    render(<DeleteCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} customer={customer} />);
    expect(screen.getByText('Delete Customer')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this customer?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
  });

  test('displays error message on API failure', async () => {
    axios.delete.mockRejectedValueOnce(new Error('Error deleting customer'));
    render(<DeleteCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} customer={customer} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(screen.getByText('Error deleting customer: Error deleting customer')).toBeInTheDocument();
    });
  });

  test('makes API call on delete confirmation', async () => {
    axios.delete.mockResolvedValueOnce({ data: { status_code: 'REBEL-200' } });
    render(<DeleteCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} customer={customer} />);
    
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(`http://localhost:9000/customers/1`, {
        headers: { 'Token': 'null' } 
      });
      expect(fetchCustomers).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
