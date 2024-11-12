import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Container, Typography, Button, Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import { currentUser, getProfile } from '../session';
import { logout } from '../api';
import { getFcmToken, registerServiceWorker } from '../external/firebase';
// import fcmApi from '../api/fcm';
import shopApi from '../shopApi';
import './home.css';

const HomePage = () => {
  const navigate = useNavigate();
  // const user = currentUser();
  const { enqueueSnackbar } = useSnackbar();

  const userProfile = getProfile();

  const handlePushNotification = () => {
    registerServiceWorker().then((registration) => {
      enqueueSnackbar('Push notification registered', { variant: 'success' });
    });
  };

  const handleGetFCMToken = () => {
    getFcmToken().then((token) => {
      console.log(token);
      if (token && token.length > 0) {
        // fcmApi.registerFcmToken(token).then((response) => {
        //   console.log(response);
        //   enqueueSnackbar('FCM Token registered', { variant: 'success' });
        // });
        shopApi.registerFcmToken(token).then((response) => {
          console.log(response);
          enqueueSnackbar('FCM Token registered', { variant: 'success' });
        });
      }
      // enqueueSnackbar('FCM Token: ' + token, { variant: 'success' });
    });
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
        <Button onClick={handlePushNotification}>
          Enable Push Notification
        </Button>
        <Divider />
        <Button onClick={handleGetFCMToken}>Get FCM Token</Button>
      </Container>
    </>
  );
};

export default HomePage;
