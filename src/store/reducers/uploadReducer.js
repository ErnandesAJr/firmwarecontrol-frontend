import { UPLOAD } from '../actions/actionTypes';
const initialState = {
    uploadFiles:[],
};
export const uploadReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD:
      return {
        ...state,
        uploadFiles:action.uploadFiles,
      };
    default:
      return state;
  }
};