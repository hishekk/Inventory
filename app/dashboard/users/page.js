'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button, IconButton } from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUserDialog from '@/app/components/users/AddUserDialog';
import EditUserDialog from '@/app/components/users/EditUserDialog';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9000/users', {
        headers: {
          'Content-Type': 'application/json',
          'Token': `${token}`
        }
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (user) => {
    setCurrentUser(user);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:9000/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Token': `${token}`
        }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Users
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={handleOpenAddDialog}>
        Add User
      </Button>
      <Grid container spacing={3}>
        {users.map((user) => (
          <Grid item key={user.id} xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {user.username}
              </Typography>
              <Box sx={{ mt: 'auto' }}>
                <IconButton color="primary" aria-label="edit user" onClick={() => handleOpenEditDialog(user)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" aria-label="delete user" onClick={() => handleDeleteUser(user.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <AddUserDialog open={openAddDialog} handleClose={handleCloseAddDialog} fetchUsers={fetchUsers} />
      {currentUser && (
        <EditUserDialog open={openEditDialog} handleClose={handleCloseEditDialog} fetchUsers={fetchUsers} user={currentUser} />
      )}
    </Box>
  );
};

export default UsersPage;
