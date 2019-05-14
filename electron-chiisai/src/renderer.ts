import { ipcRenderer, shell } from 'electron';
import YouTube from 'simple-youtube-api';
import Notifyer from 'node-notifier';
import Path from 'path';
import { YT_API_KEY, DISCORD_API } from './supersecretkeys';

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

export interface ChiisaiYTDataListType {
  title: string;
  url: string;
  id: string;
  explicit: boolean;
  author: string;
}

export interface ChiisaiState {
  currentSource: string;
  isPlaying: boolean;
  isLoading: boolean;
  currentAuthor: string;
  currentSongTitle: string;
  prefferedSource: string;
  searchList: Array<ChiisaiYTDataListType>;
  query: string;
}

class Chiisai {
  youtube = new YouTube(YT_API_KEY);

  state = {
    currentSource: '',
    isPlaying: false,
    isLoading: true,
    currentAuthor: '',
    currentSongTitle: '',
    prefferedSource: 'yt',
    searchList: <any>[],
    query: ''
  };

  currentlyPlayingTitle = <HTMLElement>(
    document.getElementById('currentlyPlayingTitle')
  );
  currentlyPlayingAuthor = <HTMLElement>(
    document.getElementById('currentlyPlayingAuthor')
  );

  activityIndicatorLabel = <HTMLElement>(
    document.getElementById('activityIndicatorLabel')
  );

  tableView = <HTMLElement>document.getElementById('tableView');
  searchField = <HTMLInputElement>document.getElementById('searchField');
  player = <HTMLAudioElement>document.getElementById('player');

  // This is basically viewDidLoad()
  constructor(state: ChiisaiState) {
    this.state = state;
    console.log('uwu');
    this.searchField.addEventListener('submit', this._searchOnSubmit);

    this.tableView.addEventListener('click', (e: any) => {
      let selected = this.tableView.getElementsByClassName('.selected');
      if (selected[0]) selected[0].className = '';
      e.target.parentNode.className = 'selected';

      let vid = e.target.parentNode.getAttribute('video-id');
      let info = e.target.parentNode.getAttribute('video-info');
      console.log(vid, JSON.parse(info));
      return this._streamYTAudio(vid, JSON.parse(info));
    });

    // Player listeners
    let p = this.player;
    p.addEventListener('playing', this._isPlaying);
    p.addEventListener('error', this._handlePlayerError);

    p.volume = 0.5;
  }

  _handlePlayerError = (e: any) => {
    console.error(e);
  };
  _isPlaying = (e: any) => {
    if (e) this.state.isPlaying = true;
    else this.state.isPlaying = false;
  };

  // TypeScript is such a fucking wonderful language innit?
  _searchOnSubmit = (e: any) => {
    e.preventDefault();
    this.state.query = e.target.searchFieldInput.value;

    let query = this.state.query;

    if (query.startsWith('https://www.youtube.com/watch?v=')) {
      this._directYTURL(query);
    } else if (query !== '') {
      this._searchYT(query);
    } else {
      // DO ABSOLUTELY FUCKING NOTHING
    }
  };

  _searchYT = async (query: string) => {
    try {
      this._loadingLabel('LOADING');
      const results = await this.youtube.searchVideos(query, 10, {});
      console.log(results);
      results.map((r: any) => {
        let node = document.createElement('tr');
        let imageCell = document.createElement('td');
        let seperator = document.createElement('br');
        let cell = document.createElement('td');
        node.setAttribute('video-id', r.id);
        node.setAttribute('video-info', JSON.stringify(r));
        let titleNode = document.createTextNode(r.title);
        let authorNode = document.createTextNode(r.channel.title);
        let imageNode = document.createElement('img');
        imageNode.src = r.thumbnails.default.url;
        imageNode.className = 'tableViewCellThumbnail';

        cell.appendChild(titleNode);
        cell.appendChild(seperator);
        //TODO: Fix this dogshit later.
        //cell.appendChild(authorNode);
        imageCell.appendChild(imageNode);

        node.appendChild(imageCell);
        node.appendChild(cell);

        this.tableView.appendChild(node);

        /*this.tableView.addEventListener('click', (e: any) => {
          let vid = e.target.getAttribute('video-id');
          let info = e.target.getAttribute('video-info');
          console.log(e, vid, info);
          return this._streamYTAudio(vid, JSON.parse(info));
        });*/
      });
      // I ain't gonna bother if this somehow didn't work.
      /*for (let i = 0; results.length > 0, i++; ) {
        let node = document.createElement('li');
        node.setAttribute('video-id', results[i].id);
        let titleNode = document.createTextNode(results[i].title);
        let authorNode = document.createTextNode(results[i].channel.title);
        let imageNode = document.createElement('img');
        imageNode.src = results[i].thumbnails.default.url;
        imageNode.className = 'tableViewCellThumbnail';

        node.appendChild(titleNode);
        node.appendChild(authorNode);
        node.appendChild(imageNode);

        this.tableView.appendChild(node);
      }*/
      this._loadingLabel('');
    } catch (error) {
      this._loadingLabel('');
      console.error(error);
      this._handleError(error);
    }
  };

  _directYTURL = async (url: string) => {
    try {
      this._loadingLabel('LOADING');
      const video = await this.youtube.getVideo(url, {});
      console.log(video);

      this.currentlyPlayingTitle.innerText = video.title;
      this.currentlyPlayingAuthor.innerText = video.channel.title;

      return this._streamYTAudio(video.id, video);
    } catch (error) {
      this._loadingLabel('');
      console.error(error);
      this._handleError(error);
    }
  };

  parse_str = (str: string) => {
    return str.split('&').reduce((params: any, param: any) => {
      var paramSplit = param.split('=').map((value: string) => {
        return decodeURIComponent(value.replace('+', ' '));
      });
      params[paramSplit[0]] = paramSplit[1];
      return params;
    }, {});
  };

  _streamYTAudio = async (id: string, info: any) => {
    try {
      let audio_streams: any[string] = [];
      const response = await fetch(
        'https://' +
          id +
          '-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https%3A%2F%2Fwww.youtube.com%2Fget_video_info%3Fvideo_id%3D' +
          id
      );
      const d = await response.text();
      let data = this.parse_str(d),
        streams = (
          data.url_encoded_fmt_stream_map +
          ',' +
          data.adaptive_fmts
        ).split(',');

      streams.forEach((s, n) => {
        let stream = this.parse_str(s),
          itag = stream.itag * 1,
          quality = '';
        console.log(stream);
        switch (itag) {
          case 139:
            quality = '48kbps';
            break;
          case 140:
            quality = '128kbps';
            break;
          case 141:
            quality = '256kbps';
            break;
        }
        if (quality) audio_streams[quality] = stream.url;
      });

      this.player.src = audio_streams['128kbps'];
      try {
        await this.player.play();
        this._notify(info);
        this._handleRPC(info);
        this.currentlyPlayingTitle.innerText = info.title;
        this.currentlyPlayingAuthor.innerText = info.channel.title;
        this._loadingLabel('');
      } catch (error) {
        throw Error(error);
      }
    } catch (error) {
      this._loadingLabel('');
      this._handleError(error);
      return Error(error);
    }
  };

  stopPlayer = () => {
    this.player.src = null;
  };

  _notify = (info: any) => {
    Notifyer.notify({
      title: 'Chiisai',
      message: `Now playing ${info.title}`,
      icon: Path.join(__dirname, '../assets/Rikka.png'),
      sound: false,
      wait: false
    });
  };

  _handleRPC = (info: any) => {
    // DISCORD RPC CAN GO FUCK ITSELF
    /*rpc(DISCORD_API).UpdatePresence({
      details: `Listening to ${info.title}`,
      state: 'electron-chiisai',
      startTimestamp: Number(new Date()),
      largeImageKey: 'rikka3x',
      largeImageText: 'uwu',
      instance: false
    });*/
  };

  _loadingLabel = (label: string) =>
    (this.activityIndicatorLabel.innerText = label);

  _handleError = (err: string) => {
    this.currentlyPlayingTitle.innerText = "I couldn't play it! >_<";
    this.currentlyPlayingAuthor.innerText = `${err}`;
  };
}

new Chiisai(tempstate);
