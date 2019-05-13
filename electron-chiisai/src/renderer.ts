import { ipcRenderer, shell } from 'electron';
import Chiisai from './chiisai';

const main = () => {
  let tempstate = {
    currentSource: '',
    isPlaying: false,
    isLoading: true,
    currentAuthor: '',
    currentSongTitle: '',
    prefferedSource: 'yt',
    searchList: <any>[],
    query: ''
  };

  return new Chiisai(tempstate);
};
