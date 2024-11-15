import {
  Card,
  CardContent,
  FormLabel,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { toHumanReadable } from '../../util/date';

export const MyAccountCard = (props) => {
  return (
    <Card {...props}>
      <CardContent>
        <List>
          <ListItem>
            <FormLabel sx={{ marginRight: 1 }}>Email</FormLabel>
            <Typography>{props.profile?.email}</Typography>
          </ListItem>
          <ListItem>
            <FormLabel sx={{ marginRight: 1 }}>Phone</FormLabel>
            <Typography>{props.profile?.phone}</Typography>
          </ListItem>
          <ListItem>
            <FormLabel sx={{ marginRight: 1 }}>Joined At</FormLabel>
            <Typography>{toHumanReadable(props.profile?.createdAt)}</Typography>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};
