import { UPLOAD, UPLOADING } from './actionTypes';


export const upload = (uploadFiles) => ({
  type: UPLOAD,
  uploadFiles
});

export const uploading = (isUploading) => ({
  type: UPLOADING,
  isUploading
});
