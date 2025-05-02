import React, { useState } from 'react';
import { useNavigate } from "react-router";

import Button from 'react-bootstrap/Button';

import store from 'src/store';
import { setCurrentScenario } from 'src/store/actions';
import { uploadTS } from "src/http";
import { toTitleCase, getFieldName } from 'src/utils';

import DefaultLayout from 'src/views/layouts/default';

import './upload.scss';

const Upload = () => {
  const navigate = useNavigate();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedScenario, setParsedScenario] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith(".ts")) {
      setUploadedFile(file);
    } else {
      alert("Only .ts files are allowed.");
    }
  };

  const handleFileParse = () => {
    uploadTS(uploadedFile)
      .then((response) => {
        if (response.status === 'success') {
          setParsedScenario(response.data);
        } else {
          alert("File upload failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
      });
  }

  const handleSave = () => {
    store.dispatch(setCurrentScenario(parsedScenario)); // Replace with http save call
    setUploadedFile(null);
    navigate('/dashboard');
  };

  return (
    <DefaultLayout>
      <div className='upload-container position-relative d-flex flex-column gap-4'>
        <p className='upload-heading m-0'>Upload TS File</p>
        {(!uploadedFile && !parsedScenario) && (
          <div className='upload-file-container d-flex flex-column gap-2'>
            <div
              className='upload-file-wrapper p-5 d-flex flex-column gap-3 align-items-center justify-content-center rounded-4'
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file && file.name.endsWith(".ts")) {
                  setUploadedFile(file);
                } else {
                  alert("Only .ts files are allowed.");
                }
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <i class="upload-file-icon bi bi-file-earmark-arrow-up text-secondary"></i>
              <h3 className="upload-file-text m-0">Drag and drop TS file here</h3>
              <p className="upload-file-text m-0">OR</p>
              <label htmlFor="tsFileUpload" className="btn btn-primary">
                Browse files
              </label>
              <input
                type="file"
                id="tsFileUpload"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </div>

            <div className="d-flex justify-content-between">
              <p className="upload-file-text text-secondary m-0">Supported Formats: TS</p>
              <p className="upload-file-text text-secondary m-0">Maximum file size: 80MB</p>
            </div>
          </div>
        )}
        {(uploadedFile && !parsedScenario) && (
          <>
            <div className="uploaded-file-wrapper d-flex justify-content-between align-items-center rounded-3 p-3">
              <div className="d-flex align-items-center d-flex gap-3 align-items-center">
                <img
                  src="src/views/assets/TS.svg"
                  alt="ts-format"
                />
                <div className="uploaded-file-info d-flex flex-column">
                  <p className="mb-0 file-name-text">{uploadedFile?.name}</p>
                  <p className="mb-0 file-size-text">
                    {(uploadedFile?.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>

              <i
                className="delete-file-icon bi bi-trash3"
                onClick={() => setUploadedFile(null)}
              />
            </div>
            <div className='upload-file-actions d-flex gap-3 justify-content-end'>
              <Button variant='secondary' onClick={() => setUploadedFile(null)}>
                Cancel
              </Button>
              <Button variant='primary' disabled={!uploadedFile} onClick={handleFileParse}>
                Parse File
              </Button>
            </div>
          </>
        )}
        {(uploadedFile && parsedScenario) && (
          <>
            <div className="parsed-file-wrapper d-flex justify-content-between align-items-center rounded-3 p-3">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Screen Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedScenario.map(({ screenName, actions }, i) => (
                    actions.map((action, j) => (
                      <tr key={screenName + i + j}>
                        {j === 0 && (
                          <td className="parsed-file-screen-name" rowSpan={actions.length}>
                            {toTitleCase(screenName)}
                          </td>
                        )}
                        <td>{getFieldName(action.locator)}</td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>
            </div>

            <div className='parsed-file-actions d-flex gap-3 justify-content-end'>
              <Button variant='secondary' onClick={() => setParsedScenario(null)}>
                Cancel
              </Button>
              <Button variant='primary' disabled={!parsedScenario} onClick={handleSave}>
                Save
              </Button>
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Upload;
