/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import routes from './constants/routes.json';
import App from './containers/App';
import HomePage from './containers/HomePage';
import Player from './components/player';
import { playerData, playerIsPlaying } from './components/player/playerSlice';

export default function Routes() {
  const data = useSelector(playerData);
  const isPlaying = useSelector(playerIsPlaying);
  return (
    <App>
      <Switch>
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
      <Player playing={isPlaying} data={data} />
    </App>
  );
}
