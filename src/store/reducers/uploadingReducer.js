import { UPLOADING } from '../actions/actionTypes';
const initialState = {
    isUploading:false,
};
export const uploadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPLOADING:
      return {
        ...state,
        isUploading:action.isUploading,
      };
    default:
      return state;
  }
};