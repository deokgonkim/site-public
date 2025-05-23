import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { basePath, oauth2Token } from '../api';
import shopApi from '../shopApi';
import { Helmet } from 'react-helmet';
import { setItemToStorage } from '../session';
import { Box, CircularProgress } from '@mui/material';

const ReturnPage = () => {
  const [searchParams] = useSearchParams();
  // const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('code')) {
      const code = searchParams.get('code');
      // console.log('Code: ', code);
      oauth2Token(code).then((response) => {
        // navigate("/home");
        if (response) {
          setItemToStorage('idToken', response.id_token || '');
          setItemToStorage('accessToken', response.access_token || '');
          setItemToStorage('refreshToken', response.refresh_token || '');
        }
        shopApi.getProfile().then(() => {
          window.location.href = `${basePath}/`;
        });
      });
    }
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Return Page</title>
        <meta name="description" content="This is a return page" />
      </Helmet>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    </>
  );
};

export default ReturnPage;
