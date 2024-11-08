import { Container, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

export const BlankLayout = () => {
  return (
    <Container
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid black',
        padding: 0,
      }}
    >
      <Outlet />
    </Container>
  );
};
