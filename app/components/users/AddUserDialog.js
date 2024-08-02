import { useState } from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Box } from '@mui/material';
import axios from 'axios';

export default function AddUserDialog({ open, handleClose, fetchUsers }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [branch, setBranch] = useState('');
  const [roles, setRoles] = useState([{ id: 1 }]);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    console.log('Button clicked, submitting data:', { username, email, password, rePassword, isActive, branch, roles });

    if (password !== rePassword) {
      setError('Passwords do not match');
      console.log('Error: Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('Token retrieved:', token);

      const response = await axios.post('http://localhost:9000/Users', {
        username: username,
        email: email,
        password: password,
        re_password: rePassword,
        is_active: isActive,
        branch: parseInt(branch), 
        roles: roles
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Token': `${token}`
        }
      });

      console.log('API response:', response);
      if (response.data) {
        fetchUsers(); 
        handleClose();
      }
    } catch (err) {
      console.error('API call error:', err);
      setError('Error adding user: ' + (err.response?.data?.status_message || err.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add User</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="rePassword"
            label="Re-enter Password"
            type="password"
            id="rePassword"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="branch"
            label="Branch"
            name="branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          />
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
}
