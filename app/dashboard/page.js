'use client';

import { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token'); 

        const [usersRes, productsRes, customersRes] = await Promise.all([
          axios.get('http://localhost:9000/users', {
            headers: {
              'Token': `${token}`,
            },
          }),
          axios.get('http://localhost:9000/products', {
            headers: {
              'Token': `${token}`,
            },
          }),
          axios.get('http://localhost:9000/customers', {
            headers: {
              'Token': `${token}`,
            },
          }),
        
        ]);

        setStats({
          totalUsers: usersRes.data.data?.length || 0,
          totalProducts: productsRes.data.data?.length || 0,
          totalCustomers: customersRes.data.data?.length || 0,
        
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Typography variant="h4" sx={{ mb: 4 }}>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
            <Typography variant="h6" sx={{ color: '#6c757d' }}>Total Users</Typography>
            <Typography variant="h4" sx={{ mt: 2, color: '#6c757d' }}>{stats.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
            <Typography variant="h6" sx={{ color: '#6c757d' }}>Total Products</Typography>
            <Typography variant="h4" sx={{ mt: 2, color: '#6c757d' }}>{stats.totalProducts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, boxShadow: 3, backgroundColor: '#fff' }}>
            <Typography variant="h6" sx={{ color: '#6c757d' }}>Total Customers</Typography>
            <Typography variant="h4" sx={{ mt: 2, color: '#6c757d' }}>{stats.totalCustomers}</Typography>
          </Paper>
        </Grid>

      </Grid>
    </>
  );
}
