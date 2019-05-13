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

export default class Chiisai {
  state = {};
  constructor(state: ChiisaiState) {
    this.state = state;
    console.log('Hello world!');
  }
}
