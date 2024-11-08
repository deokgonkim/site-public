import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { currentUser } from '../session';
import { logout } from '../api';
import './home.css';

const HomePage = () => {
  const navigate = useNavigate();
  const user = currentUser();
  const handleLogout = () => {
    logout();
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', marginTop: '20px' }}>
      <Typography variant="h1">Hello World</Typography>
      <Typography variant="h2">Welcome {user?.['cognito:username']}</Typography>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </Container>
  );
};

export default HomePage;
