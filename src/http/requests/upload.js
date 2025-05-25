import { post } from 'src/http/utils';

export const uploadTS = async (file) => {
  const url = '/api/v1/specs/upload';
  const formData = new FormData();
  formData.append('specFile', file);

  try {
    const response = await post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};
