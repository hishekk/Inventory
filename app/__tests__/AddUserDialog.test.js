import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddUserDialog from '../components/users/AddUserDialog';
import axios from 'axios';

jest.mock('axios');

describe('AddUserDialog', () => {
  const handleClose = jest.fn();
  const fetchUsers = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const open = true;

  test('renders the form fields correctly', () => {
    render(<AddUserDialog open={open} handleClose={handleClose} fetchUsers={fetchUsers} />);

    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    const passwordFields = screen.getAllByLabelText(/Password/i);
    expect(passwordFields[0]).toBeInTheDocument();
    expect(passwordFields[1]).toBeInTheDocument();
    expect(screen.getByLabelText(/Branch/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add User/i })).toBeInTheDocument();
  });

  test('updates form fields on user input', () => {
    render(<AddUserDialog open={open} handleClose={handleClose} fetchUsers={fetchUsers} />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    const passwordFields = screen.getAllByLabelText(/Password/i);
    fireEvent.change(passwordFields[0], { target: { value: 'password' } });
    fireEvent.change(passwordFields[1], { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Branch/i), { target: { value: '1' } });

    expect(screen.getByLabelText(/Username/i).value).toBe('testuser');
    expect(screen.getByLabelText(/Email/i).value).toBe('test@example.com');
    expect(passwordFields[0].value).toBe('password');
    expect(passwordFields[1].value).toBe('password');
    expect(screen.getByLabelText(/Branch/i).value).toBe('1');
  });

  test('displays error message on password mismatch', async () => {
    render(<AddUserDialog open={open} handleClose={handleClose} fetchUsers={fetchUsers} />);

    const passwordFields = screen.getAllByLabelText(/Password/i);
    fireEvent.change(passwordFields[0], { target: { value: 'password1' } });
    fireEvent.change(passwordFields[1], { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: /Add User/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  test('makes API call on form submission', async () => {
    axios.post.mockResolvedValueOnce({ data: { status_code: 'REBEL-200' } });

    render(<AddUserDialog open={open} handleClose={handleClose} fetchUsers={fetchUsers} />);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    const passwordFields = screen.getAllByLabelText(/Password/i);
    fireEvent.change(passwordFields[0], { target: { value: 'password' } });
    fireEvent.change(passwordFields[1], { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText(/Branch/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Add User/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:9000/Users', expect.any(Object), expect.any(Object));
      expect(fetchUsers).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
