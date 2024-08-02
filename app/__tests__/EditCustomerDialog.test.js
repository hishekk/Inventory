import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import EditCustomerDialog from '../components/customers/EditCustomerDialog';

jest.mock('axios');

describe('EditCustomerDialog', () => {
  const handleClose = jest.fn();
  const fetchCustomers = jest.fn();
  const customer = { id: 1, name: 'John Doe', email: 'john@example.com', address: '123 Main St', hp: '1234567890' };
  const open = true;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form fields correctly', () => {
    render(<EditCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} customer={customer} />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  test('updates form fields on user input', () => {
    render(<EditCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} customer={customer} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '456 Elm St' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '0987654321' } });

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Jane Doe');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('jane@example.com');
    expect(screen.getByLabelText(/Address/i)).toHaveValue('456 Elm St');
    expect(screen.getByLabelText(/Phone/i)).toHaveValue('0987654321');
  });

  test('displays error message on API failure', async () => {
    axios.put.mockRejectedValueOnce(new Error('Error editing customer'));
    render(<EditCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} customer={customer} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '456 Elm St' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '0987654321' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText('Error editing customer: Error editing customer')).toBeInTheDocument();
    });
  });

  test('makes API call on form submission', async () => {
    axios.put.mockResolvedValueOnce({ data: { status_code: 'REBEL-200' } });
    render(<EditCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} customer={customer} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '456 Elm St' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '0987654321' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:9000/customers/1', {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
        address: '456 Elm St',
        hp: '0987654321'
      }, {
        headers: { 'Token': 'null' } 
      });
      expect(fetchCustomers).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
