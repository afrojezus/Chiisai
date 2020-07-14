import React from 'react';
import ReactPlayer from 'react-player';
import {
  AppBar,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Slider,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  FastForward as ForwardIcon,
  FastRewind as RewindIcon,
  VolumeUp,
  VolumeDown,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { playerIsPlaying, playing as _play } from './playerSlice';
import DataInterface from '../../interfaces/DataInterface';
import Duration from './Duration';

interface PlayerProps {
  playing: boolean;
  data: DataInterface;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      top: 'auto',
      bottom: 0,
      backdropFilter: 'blur(20px)',
      backgroundColor:
        theme.palette.type === 'dark'
          ? 'rgba(0,0,0,0.8)'
          : 'rgba(255,255,255,0.8)',
    },
    controlbar: {
      placeContent: 'center',
      minHeight: 'inherit',
    },
    seekbar: {
      margin: 0,
      padding: 0,
      minHeight: 'inherit',
    },
    infobar: {
      placeContent: 'center',
      flexDirection: 'column',
    },
    volume: {
      width: 350,
    },
    durationbar: {
      minHeight: 24,
    },
    volumebar: {
      placeContent: 'center',
      minHeight: 'inherit',
    },
  })
);

const Player = ({ data, playing }: PlayerProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isPlaying = useSelector(playerIsPlaying);

  const playerRef = React.useRef(null);

  const [volume, setVolume] = React.useState(0.5);
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState({
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
  });
  // TODO: seek functionality.
  const [played, setPlayed] = React.useState(0);

  const togglePlaying = () => dispatch(_play(!isPlaying));

  const changeVolume = (
    _event: React.ChangeEvent<unknown>,
    value: number | number[]
  ) => setVolume(value as number);

  const onDuration = (d: number) => {
    setDuration(d);
  };

  const onProgress = (state: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    setProgress(state);
  };

  const handleSeekChange = () => {};

  (window as any).chiisaiData = {
    title: data.title,
    playing,
  };

  return (
    <>
      <ReactPlayer
        style={{ display: 'none' }}
        onProgress={onProgress}
        onDuration={onDuration}
        volume={volume}
        url={data.src}
        playing={playing}
        ref={playerRef}
      />
      <AppBar color="transparent" position="fixed" className={classes.root}>
        <Toolbar disableGutters className={classes.seekbar}>
          <Slider
            min={0}
            max={duration}
            className={classes.seekbar}
            value={progress.playedSeconds}
          />
        </Toolbar>
        <Toolbar className={classes.durationbar}>
          <Typography style={{ fontSize: 9 }}>
            <Duration
              seconds={duration * progress.played}
              className={undefined}
            />
          </Typography>
          <div style={{ flex: 1 }} />
          <Typography style={{ fontSize: 9 }}>
            <Duration seconds={duration} className={undefined} />
          </Typography>
        </Toolbar>
        <Toolbar className={classes.infobar}>
          <Typography variant="h6" style={{ fontSize: 12 }}>
            {data.title}
          </Typography>
          <Typography variant="subtitle1" style={{ fontSize: 10 }}>
            {data.author}
          </Typography>
        </Toolbar>
        <Toolbar className={classes.controlbar}>
          <IconButton>
            <RewindIcon />
          </IconButton>
          <IconButton onClick={togglePlaying}>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
          <IconButton>
            <ForwardIcon />
          </IconButton>
        </Toolbar>
        <Toolbar className={classes.volumebar}>
          <Grid container spacing={2} className={classes.volume}>
            <Grid item>
              <VolumeDown />
            </Grid>
            <Grid item xs>
              <Slider
                value={volume}
                min={0}
                step={0.1}
                max={1}
                onChange={changeVolume}
                aria-labelledby="continuous-slider"
              />
            </Grid>
            <Grid item>
              <VolumeUp />
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Player;
