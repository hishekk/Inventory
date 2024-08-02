import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const EditUserDialog = ({ open, handleClose, fetchUsers, user }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
  }, [user]);

  const handleEditUser = async () => {
    if (password !== rePassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:9000/users/${user.id}`, {
        id: user.id,
        username,
        email,
        password,
        re_password: rePassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Token': `${token}`
        }
      });
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Error editing user:', error.response ? error.response.data : error.message);
      setError('Error editing user: ' + (error.response?.data?.status_message || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Username"
          type="text"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Re-enter Password"
          type="password"
          fullWidth
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        />
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleEditUser} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
