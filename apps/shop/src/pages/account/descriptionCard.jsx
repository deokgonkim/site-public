import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertImage,
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
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import Markdown from 'react-markdown';
import '@mdxeditor/editor/style.css';
import shopApi from '../../shopApi';
import { getCurrentShopUid } from '../../session';
import { enqueueSnackbar } from 'notistack';

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
        <Typography variant="h6">Description</Typography>
        {editMode ? (
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
                  </>
                ),
              }),
            ]}
          />
        ) : (
          <Markdown>{markdown}</Markdown>
        )}
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" color="primary" onClick={edit}>
          {editMode ? 'Finish' : 'Edit'}
        </Button>
      </CardActions>
    </Card>
  );
};
