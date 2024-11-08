import {
  Button,
  Container,
  Divider,
  FormLabel,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { getProfile } from '../shopApi';
import { logout } from '../api';
import { toHumanReadable } from '../util/date';

export const AccountPage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  return (
    <Container
      sx={{
        padding: 2,
      }}
    >
      <Typography variant="h5">Account</Typography>
      <Typography variant="h6">Welcome! {profile?.username}</Typography>
      <Divider />
      <List>
        <ListItem>
          <FormLabel sx={{ marginRight: 1 }}>Email</FormLabel>
          <Typography>{profile?.email}</Typography>
        </ListItem>
        <ListItem>
          <FormLabel sx={{ marginRight: 1 }}>Phone</FormLabel>
          <Typography>{profile?.phone}</Typography>
        </ListItem>
        <ListItem>
          <FormLabel sx={{ marginRight: 1 }}>Joined At</FormLabel>
          <Typography>{toHumanReadable(profile?.createdAt)}</Typography>
        </ListItem>
      </List>
      <Divider />
      <Button
        sx={{
          marginTop: 2,
        }}
        variant="contained"
        onClick={logout}
      >
        Logout
      </Button>
    </Container>
  );
};
