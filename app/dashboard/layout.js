'use client';

import { Box, CssBaseline, Drawer, Toolbar, AppBar, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';

const drawerWidth = 300;

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(to top right, rgb(245,244,2253,.7), rgb(245,241,252,.7))' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', background: '#f5f5f5' },
        }}
      >
       
        <Sidebar />
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, overflowX: 'hidden' }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
