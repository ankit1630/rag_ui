import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  model: "",
  collections: [],
  selectedCollection: ""
};

export const ragSlice = createSlice({
  name: 'rag',
  initialState,
  reducers: {
    changeModel: (state, action) => {
        state.model = action.payload.model;
        state.collections = action.payload.collections;
    },
    onSelectCollection: (state, action) => {
        state.selectedCollection = action.payload;
    },
    onCreateCollection: (state, action) => {
        state.collections = [action.payload, ...state.collections];
        state.selectedCollection = action.payload;
    }
  },
});

export const { changeModel, onSelectCollection, onCreateCollection } = ragSlice.actions;

export const selectModel = (state) => state.rag.model;
export const selectCollectionOptions = (state) => state.rag.collections;
export const selectSelectedCollection = (state) => state.rag.selectedCollection;

export default ragSlice.reducer;
