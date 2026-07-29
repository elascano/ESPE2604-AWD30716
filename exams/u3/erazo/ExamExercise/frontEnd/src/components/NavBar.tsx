import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { ShoppingCart, Percent, CalendarMonth } from '@mui/icons-material';

const LINKS = [
  { label: 'Total calculation', path: '/total-calculation', icon: <ShoppingCart /> },
  { label: 'IVA calculation', path: '/iva-calculation', icon: <Percent /> },
  { label: 'Expiration time', path: '/expiration-calculation', icon: <CalendarMonth /> },
];

function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" sx={{ mr: 4 }}>
          Computation App
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {LINKS.map((link) => (
            <Button
              key={link.path}
              color="inherit"
              startIcon={link.icon}
              onClick={() => navigate(link.path)}
              sx={{
                fontWeight: location.pathname === link.path ? 700 : 400,
                borderBottom: location.pathname === link.path ? '2px solid white' : '2px solid transparent',
                borderRadius: 0,
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
