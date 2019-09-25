import { uploadReducer } from '../reducers/uploadReducer';
import { uploadingReducer } from '../reducers/uploadingReducer';


import { combineReducers } from 'redux';

export const Reducers = combineReducers({
  
  uploadState: uploadReducer,
  uploadingState: uploadingReducer
  
});