import { List, ListItem, ListItemText, ListItemIcon, Divider, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, path: '/dashboard/users' },
    { text: 'Products', icon: <InventoryIcon />, path: '/dashboard/products' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/dashboard/customers' },
    { text: 'Orders', icon: <ShoppingCartIcon />, path: '/dashboard/orders' },
  ];

  return (
    <Box sx={{ width: 300 }}>
      <Box sx={{ p: 2, textAlign: 'center', background: '#403c69', color: 'white' }}>
        <Typography variant="h6">Inventory Management</Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <Link href={item.path} passHref key={item.text} style={{ textDecoration: 'none' }}>
            <ListItem
              button
              selected={pathname === item.path}
              sx={{
                '&.Mui-selected': { backgroundColor: '#e0e0e0' },
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <ListItemIcon sx={{ color: pathname === item.path ? '#403c69' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: pathname === item.path ? '#403c69' : 'black' }} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
