import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

class SocketClient {
  url;
  socket;
  setState;

  constructor() {
    this.setState = null;
    this.socket = null;
  }

  init(url, setState) {
    if (url) {
      this.url = url;
    }
    if (setState) {
      this.setState = setState;
    }
    this.setState && this.setState('(connecting)');
    this.socket = new WebSocket(this.url);
  }

  onMessage(callback) {
    this.socket.onmessage = callback;
  }

  onOpen(callback) {
    this.socket.onopen = callback;
  }

  onClose(callback) {
    this.socket.onclose = callback;
  }

  onError(callback) {
    this.socket.onerror = callback;
  }

  send(message) {
    this.socket.send(message);
  }
}

const webSocket = new SocketClient();

export const ChatDialog = ({ open, handleClose }) => {
  const [userInput, setUserInput] = useState('');
  const [state, setState] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_CHAT_SOCKET_URL;

    console.log('WebSocket', socketUrl);
    webSocket.init(socketUrl, setState);

    webSocket.onMessage((message) => {
      const payload = JSON.parse(message.data);
      setResponse((prev) => {
        return prev + payload.data;
      });
    });

    webSocket.onOpen(() => {
      console.log('connected');
      setState('(connected)');
    });

    webSocket.onClose(() => {
      console.log('disconnected');
      setState('(disconnected)');
    });

    webSocket.onError((error) => {
      console.log('error', error);
      setState('(error)');
    });
  }, []);

  useEffect(() => {
    if (state === '(disconnected)' || state === '(error)') {
      if (window.confirm('Connection lost. Do you want to reconnect?')) {
        webSocket.init();
      }
    }
  }, [state]);

  const handleSend = () => {
    webSocket.send(
      JSON.stringify({
        type: 'chat',
        data: userInput,
      })
    );
    // setUserInput('');
    setResponse('');
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Ask {state}</DialogTitle>
      <DialogContent>
        {/* <DialogContentText>{response}</DialogContentText> */}
        <Markdown>{response}</Markdown>
        <TextField
          autoFocus
          required
          //   margin="dense"
          variant="standard"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit" onClick={handleSend}>
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};
