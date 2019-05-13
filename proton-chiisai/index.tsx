import React, { Component } from 'react'; // import from react
import youtube from 'youtube-api';
import path from 'path';
import Notifier from 'node-notifier';
import { render, Window, App, Button, Menu } from 'proton-native'; // import the proton-native components
import SysTray from 'systray';
import { readFileSync } from 'fs-extra-p';

const tray = new SysTray({
  menu: {
    icon: new Buffer(readFileSync('./Rikka.png')).toString('base64'),
    title: 'Chiisai',
    tooltip: 'Heya! ><',
    items: [
      {
        title: 'Show Chiisai',
        enabled: true,
        tooltip: '',
        checked: false
      },
      {
        title: 'Quit Chiisai',
        enabled: true,
        tooltip: '',
        checked: false
      }
    ]
  }
});

tray.onClick((action) => {
  if (action.seq_id === 0) {
    console.log('Hi!');
  } else if (action.seq_id === 1) {
    tray.kill();
  }
});

const stop = () => {
  tray.kill(false);
};

class Chiisai extends Component<any> {
  state = {
    searchList: [],
    query: '',
    currentSource: '',
    currentAuthor: '',
    currentSongTitle: '',
    loading: true,
    selectedSource: 'yt'
  };

  getTrending = () => {};

  searchYT = (query: string) => {};

  play = (source: any) => {
    Notifier.notify({
      title: 'Chiisai',
      message: `Now playing ${'something'}`,
      icon: path.join(__dirname, 'Rikka.png'),
      sound: false,
      wait: false
    });
  };

  render() {
    const state = this;
    // all Components must have a render method
    return (
      <App onShouldQuit={stop}>
        <Window
          borderless={true}
          title="Chiisai"
          size={{ w: 300, h: 500 }}
          menuBar={false}
        >
          <Button onClick={this.play.bind(this, {})} />
        </Window>
      </App>
    );
  }
}

render(<Chiisai />); // and finally render your main component
