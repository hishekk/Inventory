'use client';

import { useState } from 'react';
import { TextField, Button, Box, Container, CssBaseline, Avatar, Typography, Grid, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/navigation';
import { grey, purple } from '@mui/material/colors';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/login', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.data) {
        console.log(response.data);
        localStorage.setItem('token', response.data.data.token);
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(to top right, rgb(245,244,253), rgb(245,241,252))',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CssBaseline />
      <Container component="main" maxWidth="lg" sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={4} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5,delay:0.3 }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Typography component="h1" variant="h2" gutterBottom sx={{ color: purple[500], fontWeight: 'bold' }}>
                  Bhumio Inventory
                </Typography>
                <Typography component="p" variant="h6" sx={{ color: grey[700], opacity: 0.7, mb: 4 }}>
                  Manage your inventory efficiently and effectively with our system. Keep track of users, products, customers, and orders in one place.
                </Typography>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper elevation={6} sx={{ padding: 4, width: '100%' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                  <Typography component="h1" variant="h5">
                    Sign In
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                      <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {error}
                      </Typography>
                    )}
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
