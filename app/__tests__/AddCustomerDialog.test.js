import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import AddCustomerDialog from '../components/customers/AddCustomerDialog';

jest.mock('axios');

describe('AddCustomerDialog', () => {
  const handleClose = jest.fn();
  const fetchCustomers = jest.fn();
  const open = true;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form fields correctly', () => {
    render(<AddCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add/i })).toBeInTheDocument();
  });

  test('updates form fields on user input', () => {
    render(<AddCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });

    expect(screen.getByLabelText(/Name/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/Address/i)).toHaveValue('123 Main St');
    expect(screen.getByLabelText(/Phone/i)).toHaveValue('1234567890');
  });

  test('displays error message on API failure', async () => {
    axios.post.mockRejectedValueOnce(new Error('Error adding customer'));
    render(<AddCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    await waitFor(() => {
      expect(screen.getByText('Error adding customer: Error adding customer')).toBeInTheDocument();
    });
  });

  test('makes API call on form submission', async () => {
    axios.post.mockResolvedValueOnce({ data: { status_code: 'REBEL-200' } });
    render(<AddCustomerDialog open={open} handleClose={handleClose} fetchCustomers={fetchCustomers} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.click(screen.getByRole('button', { name: /Add/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:9000/customers', {
        name: 'Test User',
        email: 'test@example.com',
        address: '123 Main St',
        hp: '1234567890'
      }, {
        headers: { 'Token': 'null' } 
      });
      expect(fetchCustomers).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
