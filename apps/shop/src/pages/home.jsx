import { Helmet } from 'react-helmet';
import { Container, Typography } from '@mui/material';
import { getProfile } from '../session';
import './home.css';

const HomePage = () => {
  // const user = currentUser();

  const userProfile = getProfile();

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
      </Container>
    </>
  );
};

export default HomePage;
