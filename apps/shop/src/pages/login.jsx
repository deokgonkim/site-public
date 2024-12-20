import { Box, Button, Container, Typography } from '@mui/material';
import { basePath, config } from '../api';

const LoginPage = () => {
  const goHostedUI = async () => {
    const url = config.hostedUiUrl + '/login';
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: config.clientId,
      redirect_uri: document.location.origin + basePath + '/return',
      scope: 'openid email phone',
    });
    document.location.href = url + '?' + params.toString();
  };

  return (
    <Container
      style={{
        padding: '1em',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h5">Welcome</Typography>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          margin: '0 auto',
          alignContent: 'center',
          gap: '1em',
        }}
      >
        <Button variant="outlined" type="submit" onClick={() => goHostedUI()}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
