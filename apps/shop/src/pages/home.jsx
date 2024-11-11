import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import { currentUser, getProfile } from '../session';
import { logout } from '../api';
import './home.css';
import { Helmet } from 'react-helmet';

const HomePage = () => {
  const navigate = useNavigate();
  // const user = currentUser();

  const userProfile = getProfile();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="This is a home page" />
      </Helmet>
      <Container
        maxWidth="sm"
        style={{ textAlign: 'center', marginTop: '20px' }}
      >
        <Typography variant="h1">Hello World</Typography>
        <Typography variant="h2">Welcome {userProfile?.username}</Typography>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Container>
    </>
  );
};

export default HomePage;
