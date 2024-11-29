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
        ) : (
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
        )}
      </CardContent>
      <CardActions>
        <Button variant="contained" size="small" color="primary" onClick={edit}>
          {editMode ? 'Finish' : 'Edit'}
        </Button>
        {editMode && (
          <Button
            variant="contained"
            size="small"
            color="warning"
            onClick={cancel}
          >
            Cancel
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
