import React from 'react';
import {
  AppBar,
  Container,
  createStyles,
  Toolbar,
  makeStyles,
  Theme,
  Paper,
  InputBase,
  Card,
  CardMedia,
  Typography,
  CardContent,
} from '@material-ui/core';
import YT from 'simple-youtube-api';
import { useSelector, useDispatch } from 'react-redux';
import { grey, lightBlue } from '@material-ui/core/colors';
import transitions from '@material-ui/core/styles/transitions';
import { setData, playing, playerData } from './player/playerSlice';
import YTDataInterface from '../interfaces/YTDataInterface';

const youtube = new YT(process.env.YT_API_KEY);

const useSearchStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      margin: '0px 8px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
    input: {
      flex: 1,
    },
    baseInput: {
      textAlign: 'center',
      transition: transitions.create(['all']),
      fontWeight: 600,
      '&:focus': {
        textAlign: 'inherit',
        marginLeft: theme.spacing(1),
      },
    },
  })
);

function SearchBar({ onSubmit }: { onSubmit: (str: string) => void }) {
  const classes = useSearchStyles();
  const [value, setValue] = React.useState('');
  const change = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => setValue(event.target.value);
  const submit = (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    onSubmit(value);
  };
  return (
    <Paper component="form" className={classes.root} onSubmit={submit}>
      <InputBase
        value={value}
        onChange={change}
        className={classes.input}
        placeholder="Chiisai"
        inputProps={{
          'aria-label': 'search music',
          className: classes.baseInput,
        }}
      />
    </Paper>
  );
}

const useHomeStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      margin: '4px 0px',
      cursor: 'pointer',
      transition: transitions.create(['all']),
      '&:hover': {
        background: grey['700'],
      },
      '&:active': {
        background: lightBlue.A400,
      },
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    cover: {
      width: 100,
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    playIcon: {
      height: 38,
      width: 38,
    },
    container: {
      padding: '0px 8px',
      paddingTop: theme.spacing(8),
      paddingBottom: 170 + 8,
      boxSizing: 'border-box',
    },
    title: {
      fontSize: 12,
    },
    subtitle: {
      fontSize: 10,
    },
    appbar: {
      backgroundColor:
        theme.palette.type === 'dark'
          ? 'rgba(0,0,0,0.8)'
          : 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)',
    },
  })
);

export default function Home(): JSX.Element {
  const classes = useHomeStyles();
  const [list, setList] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const dispatch = useDispatch();
  const currentlyPlayingData = useSelector(playerData);

  const triggerSearch = (val: string) => setQuery(val);

  React.useEffect(() => {
    async function fetchVideos() {
      if (query === '') return;
      const results = await youtube.searchVideos(query, 10, {});
      setList(results);
    }

    fetchVideos();
  }, [query]);

  const select = (elem: YTDataInterface) => {
    const data = {
      src: elem.url,
      title: elem.title,
      author: elem.channel.title,
      id: elem.id,
    };
    dispatch(setData(data));
    dispatch(playing(true));
  };

  return (
    <>
      <AppBar color="default" className={classes.appbar}>
        <Toolbar disableGutters>
          <SearchBar onSubmit={triggerSearch} />
        </Toolbar>
      </AppBar>
      <Container disableGutters className={classes.container}>
        {list.map((elem: YTDataInterface) => (
          <Card
            className={classes.root}
            style={{
              border:
                currentlyPlayingData.id === elem.id
                  ? `1px solid ${lightBlue.A200}`
                  : undefined,
            }}
            key={elem.id}
            onClick={() => select(elem)}
          >
            <CardMedia
              className={classes.cover}
              image={elem.thumbnails.default.url}
            />
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography
                  className={classes.title}
                  component="h6"
                  variant="h6"
                >
                  {elem.title}
                </Typography>
                <Typography
                  className={classes.subtitle}
                  variant="subtitle1"
                  color="textSecondary"
                >
                  {elem.channel.title}
                </Typography>
              </CardContent>
            </div>
          </Card>
        ))}
      </Container>
    </>
  );
}
