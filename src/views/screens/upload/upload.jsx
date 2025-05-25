import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Typography } from 'antd';
import { CloseOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

import { uploadTS } from 'src/http';
import { notify } from 'src/notify';
import { downloadJSON } from 'src/utils';

import DefaultLayout from 'src/views/layouts/default';

import './upload.scss';

const { Text, Title } = Typography;

const Upload = () => {
  const navigate = useNavigate();

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.ts')) {
      setUploadedFile(file);
    } else {
      notify.error('Only .ts files are allowed.');
      setUploadedFile(null);
      e.target.value = null; // Clear the input value
    }
  };

  const handleFileParse = () => {
    uploadTS(uploadedFile)
      .then((response) => {
        if (response.status === 'success') {
          notify.success((t) => (
            <div className='d-flex align-items-center gap-2'>
              <span className='text-nowrap'>Uploaded successfully!</span>
              <Button className='text-nowrap' onClick={async () => {
                try {
                  await downloadJSON(response.data.specFile, `${response.data.specFile.originalName}.json`, 4);
                  notify.success('Downloaded successfully!');
                } catch (err) {
                  notify.error('Could not download the file due to some error.');
                  console.error('Unable to download file. Error: ', err);
                } finally {
                  notify.dismiss(t.id)
                }
              }}>
                Download Parsed JSON
              </Button>
            </div>
          ), {
            duration: 5000, style: {
              maxWidth: '500px',
            }
          });
          setUploadedFile(null);
          navigate('/dashboard');
        } else {
          notify.error('File upload failed. Please try again.');
          setUploadedFile(null);
        }
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        notify.error('Error uploading file. Please try again.');
        setUploadedFile(null);
      });
  }

  return (
    <DefaultLayout>
      <div className='upload-container position-relative d-flex flex-column gap-4'>
        <Title className='upload-heading'>Upload TS File</Title>
        {(!uploadedFile) && (
          <div className='upload-file-container d-flex flex-column gap-2'>
            <div
              className='upload-file-wrapper d-flex flex-column gap-3 align-items-center justify-content-center rounded-4'
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.name.endsWith('.ts')) {
                  setUploadedFile(file);
                } else {
                  notify.error('Only .ts files are allowed.');
                  setUploadedFile(null);
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Title className='upload-file-text' level={3}>Drag and drop TS file here</Title>
              <Title className='upload-file-text' level={5}>OR</Title>
              <Button
                type='primary'
                size='large'
                icon={<UploadOutlined />}
                onClick={() => document.getElementById('tsFileUpload').click()}
              >Browse files</Button>
              <input
                type='file'
                id='tsFileUpload'
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>

            <div className='d-flex justify-content-between'>
              <Text className='upload-file-text'>Supported Formats: TS</Text>
              <Text className='upload-file-text'>Maximum file size: 80MB</Text>
            </div>
          </div>
        )}
        
        {(uploadedFile) && (
          <>
            <div className='uploaded-file-wrapper d-flex justify-content-between align-items-center rounded-3 p-3'>
              <div className='d-flex align-items-center d-flex gap-3 align-items-center'>
                <img
                  src='src/views/assets/TS.svg'
                  alt='ts-format'
                />
                <div className='uploaded-file-info d-flex flex-column'>
                  <Text className='mb-0 file-name-text'>{uploadedFile?.name}</Text>
                  <Text className='mb-0 file-size-text'>
                    {(uploadedFile?.size / 1024).toFixed(2)} KB
                  </Text>
                </div>
              </div>

              <Button
                className='delete-file-icon'
                icon={<DeleteOutlined />}
                size='large'
                danger
                onClick={() => setUploadedFile(null)}
              />
            </div>
            <div className='upload-file-actions d-flex gap-3 justify-content-end'>
              <Button
                className='border-dark-subtle border-1'
                icon={<CloseOutlined />}
                onClick={() => setUploadedFile(null)}
                danger
              >
                Cancel
              </Button>
              <Button type='primary' disabled={!uploadedFile} onClick={handleFileParse}>
                Upload
              </Button>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Upload;
