import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  TextField,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/core/styles';
import { apiEndpoint } from './config';
import axios from 'axios';
import { shortUrlModel } from './shortUrl.model';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  appbar: {
    borderRadius: '5px',
    width: '60%',
    margin: '0 auto',
    marginTop: '2%'
  },
  title: {
    flexGrow: 1,
    textAlign: 'center'
  },
  card: {
    width: '50vw',
    height: 'auto',
    margin: '0 auto',
    marginTop: '2%'
  },
  cardHeader: {
    textAlign: 'center'
  },
  btn: {
    marginLeft: '10px'
  },
  link: {
    paddingBottom: '10px'
  },
  message: {
    backgound: 'lightgreen',
    textAlign: 'center',
    padding: '5px'
  }
}));

function ItemlastFive({
  lf,
  delClickHandler
}: {
  lf: Array<shortUrlModel>;
  delClickHandler: (shortUrl: string) => void;
}) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Actual Url</TableCell>
            <TableCell>Short Url</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lf.map((row) => (
            <TableRow key={row.shortUrl}>
              <TableCell component='th' scope='row'>
                {row.actualUrl}
              </TableCell>
              <TableCell>{row.shortUrl}</TableCell>
              <TableCell>
                {moment(row.createdAt).format('DD MMM YYYY hh:mm:ss')}
              </TableCell>
              <TableCell>
                <IconButton
                  aria-label='Delete'
                  size='small'
                  onClick={() => delClickHandler(row.shortUrl)}
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function App() {
  const classes = useStyles();
  const [link, setLink] = useState('');
  const [lf, setlf] = useState(new Array<shortUrlModel>());
  const [fetch, setFetch] = useState('None');
  const [shortUrl, setShortUrl] = useState('');

  useEffect(() => {
    (async () => {
      const resp2 = await axios.get(apiEndpoint + '/api/v1/user/');
      if (resp2.status === 200) {
        setlf(resp2.data.Items);
      }
    })();
  }, []);

  // delete click handler
  async function delClickHandler(shortUrl: string) {
    await axios.delete(
      apiEndpoint + '/api/v1/shortUrl/' + encodeURIComponent(shortUrl)
    );
    (async () => {
      const resp = await axios.get(apiEndpoint + '/api/v1/user/');
      if (resp.status === 200) {
        setlf(resp.data.Items);
      }
    })();
  }

  // handling the send button click
  async function handleClick() {
    console.log(`${link}`);
    const resp1 = await axios.get(
      apiEndpoint + '/api/v1/shortUrl/' + encodeURIComponent(link)
    );
    if (resp1.status === 200) {
      setFetch('Success');
      setShortUrl(resp1.data.shortUrl);
    } else {
      setFetch('Failed');
    }
    const resp2 = await axios.get(apiEndpoint + '/api/v1/user/');
    if (resp2.status === 200) {
      setlf(resp2.data.Items);
    }
  }

  return (
    <div className='App'>
      <header>
        <AppBar position='static' className={classes.appbar}>
          <Toolbar>
            <Typography variant='h4' className={classes.title}>
              ShortUrl
            </Typography>
          </Toolbar>
        </AppBar>
      </header>
      <br />
      <Card className={classes.card}>
        <CardHeader
          title='Get a new Short Url'
          className={classes.cardHeader}
        />
        <CardContent>
          <Typography component='p'>
            Provide a link and get a new unique Short url to your link here!!
          </Typography>
          <br />
          <FormControl fullWidth={true}>
            <span className={classes.link}>
              <TextField
                id='outlined-basic'
                label='link'
                variant='outlined'
                onChange={(e) => setLink(e.target.value)}
                size='small'
                style={{ width: '85%' }}
              />
              <Button
                variant='contained'
                size='medium'
                color='primary'
                endIcon={<SendIcon />}
                className={classes.btn}
                onClick={handleClick}
              >
                Send
              </Button>
            </span>
          </FormControl>
          {fetch === 'Success' ? (
            <p className={classes.message}>
              Successful!! Your new Short url {shortUrl}
            </p>
          ) : fetch === 'Failed' ? (
            <p className={classes.message}>Failed to create, Retry!</p>
          ) : null}
          <Typography variant='h6' className={classes.title}>
            Recent Five short Urls
          </Typography>
          <ItemlastFive lf={lf} delClickHandler={delClickHandler} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
