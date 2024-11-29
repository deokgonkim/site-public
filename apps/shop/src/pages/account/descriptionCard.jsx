import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Modal,
  Typography,
} from '@mui/material';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  UndoRedo,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // to support tables in markdown
import rehypeRaw from 'rehype-raw'; // to support raw HTML like <u> in markdown
import '@mdxeditor/editor/style.css';
import shopApi from '../../shopApi';
import { getCurrentShopUid } from '../../session';
import { enqueueSnackbar } from 'notistack';

import './descriptionCard.css';

export const DescriptionCard = (props) => {
  const [markdown, setMarkdown] = useState('');
  const [editMode, setEditMode] = useState(false);

  const ref = useRef(null);

  const edit = () => {
    if (!editMode) {
      // entering edit mode
      console.log('setting markdown');
    } else {
      // exiting edit mode
      const newMarkdown = ref.current?.getMarkdown();
      if (newMarkdown) {
        setMarkdown(newMarkdown);
        shopApi
          .updateShop(getCurrentShopUid(), { description: newMarkdown })
          .then(() => {
            enqueueSnackbar('Shop description updated', { variant: 'success' });
          });
      }
    }
    setEditMode(!editMode);
  };

  const cancel = () => {
    if (editMode) {
      setEditMode(false);
    }
  };

  useEffect(() => {
    const fetchShop = async () => {
      const data = await shopApi.getShop(getCurrentShopUid());
      setMarkdown(data.description || '');
    };
    fetchShop();
  }, []);

  return (
    <Card {...props}>
      <CardContent>
        <Modal open={editMode} onClose={cancel}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              height: '80%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
              }}
            >
              <MDXEditor
                ref={ref}
                markdown={markdown}
                plugins={[
                  headingsPlugin(),
                  imagePlugin(),
                  linkPlugin(),
                  linkDialogPlugin(),
                  listsPlugin(),
                  quotePlugin(),
                  thematicBreakPlugin(),
                  tablePlugin(),
                  toolbarPlugin({
                    toolbarContents: () => (
                      <>
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <BlockTypeSelect />
                        <InsertThematicBreak />
                        <CodeToggle />
                        <CreateLink />
                        <ListsToggle />
                        <InsertImage />
                        <InsertTable />
                      </>
                    ),
                  }),
                ]}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                columnGap: 2,
                marginTop: 2,
              }}
            >
              <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={edit}
              >
                {editMode ? 'Finish' : 'Edit'}
              </Button>
              <Button
                variant="contained"
                size="small"
                color="warning"
                onClick={cancel}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
        <Typography variant="h6">Description</Typography>
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            () =>
              rehypeRaw({
                tagfilter: true,
              }),
          ]}
        >
          {markdown}
        </Markdown>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" color="primary" onClick={edit}>
          {editMode ? 'Finish' : 'Edit'}
        </Button>
      </CardActions>
    </Card>
  );
};
