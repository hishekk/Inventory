import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditUserDialog from '../components/users/EditUserDialog';
import axios from 'axios';

jest.mock('axios');

describe('EditUserDialog', () => {
  const handleClose = jest.fn();
  const fetchUsers = jest.fn();
  const user = { id: 1, username: 'testuser', email: 'test@example.com', branch: '1' };
  const open = true;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form fields correctly', () => {
    render(<EditUserDialog open={open} handleClose={handleClose} fetchUsers={fetchUsers} user={user} />);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Password/i)).toHaveLength(2);
    expect(screen.getByLabelText(/Re-enter Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save/i })).toBeInTheDocument();
  });

  test('updates form fields on user input', () => {
    render(<EditUserDialog open={open} handleClose={handleClose} fetchUsers={fetchUsers} user={user} />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'updateduser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'updated@example.com' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'newpassword' } });
    fireEvent.change(screen.getByLabelText(/Re-enter Password/i), { target: { value: 'newpassword' } });

    expect(screen.getByLabelText(/Username/i)).toHaveValue('updateduser');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('updated@example.com');
    expect(screen.getAllByLabelText(/Password/i)[0]).toHaveValue('newpassword');
    expect(screen.getByLabelText(/Re-enter Password/i)).toHaveValue('newpassword');
  });

  test('displays error message on password mismatch', async () => {
    render(<EditUserDialog open={open} handleClose={handleClose} fetchUsers={fetchUsers} user={user} />);
    
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText(/Re-enter Password/i), { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('makes API call on form submission', async () => {
    axios.put.mockResolvedValueOnce({ data: { status_code: 'REBEL-200' } });
    render(<EditUserDialog open={open} handleClose={handleClose} fetchUsers={fetchUsers} user={user} />);
    
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'updateduser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'updated@example.com' } });
    fireEvent.change(screen.getAllByLabelText(/Password/i)[0], { target: { value: 'newpassword' } });
    fireEvent.change(screen.getByLabelText(/Re-enter Password/i), { target: { value: 'newpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('http://localhost:9000/users/1', expect.any(Object), expect.any(Object));
      expect(fetchUsers).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
