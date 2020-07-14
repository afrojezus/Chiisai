import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

const playerSlice = createSlice({
  name: 'player',
  initialState: { data: { src: '', title: '', author: '', id: '' }, playing: false },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
    playing: (state, action) => {
      state.playing = action.payload;
    },
  },
});

export const { setData, playing } = playerSlice.actions;

export default playerSlice.reducer;

export const playerData = (state: RootState) => state.player.data;
export const playerIsPlaying = (state: RootState) => state.player.playing;
