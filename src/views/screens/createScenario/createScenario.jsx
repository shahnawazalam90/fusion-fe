import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import store from 'src/store';
import { setCurrentScenarioValue } from 'src/store/actions';
import { notify } from 'src/notify';

import { postScenario, getScenarioById, getLatestScenario, updateScenario } from "src/http";

import DefaultLayout from 'src/views/layouts/default';
import ScreenAccordion from './screenAccordion';

import './createScenario.scss';
import * as XLSX from 'xlsx';

const CreateScenario = () => {
  const navigate = useNavigate();

  const currentScenario = useSelector((state) => state.currentScenario);
  const editScenarioInfo = useSelector((state) => state.editScenarioInfo);

  const [screensChecked, setScreensChecked] = useState([]);
  const [editEnabled, setEditEnabled] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioURL, setScenarioURL] = useState('');
  const [fillErrors, setFillErrors] = useState([]);

  useEffect(() => {
    (editScenarioInfo?.id ? getScenarioById(editScenarioInfo?.id) : getLatestScenario()).then((scenario) => {
      const updatedChecked = scenario.screens.map(() => !!editScenarioInfo?.id);
      setScreensChecked(updatedChecked);
      setScenarioName(editScenarioInfo?.name || '');
      setScenarioURL(scenario.url);
    });
  }, [editScenarioInfo]);

  const allActionsSelected = useMemo(() => {
    return screensChecked.find((screenChecked) => !screenChecked) === undefined;
  }, [screensChecked]);

  const checkAllActions = () => {
    const updatedChecked = screensChecked.map(() => !allActionsSelected);
    setScreensChecked(updatedChecked);
  };

  const checkScreen = (i) => {
    const updatedChecked = [...screensChecked];

    updatedChecked[i] = !updatedChecked[i];

    setScreensChecked(updatedChecked);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      notify.error('No file selected.');
      return;
    }

    const allowedExtensions = ['xls', 'xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      notify.error('Invalid file type. Please upload an Excel file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const missingRows = [];

        jsonData.forEach(row => {
          const sName = row['Screen Name'].replaceAll(" ", "").toLowerCase();
          const fName = row['Field Name'].replaceAll(" ", "").toLowerCase();

          const screenMatchIndex = currentScenario?.screens?.findIndex(({ screenName }) => screenName.replaceAll(" ", "").toLowerCase() === sName);

          if (screenMatchIndex !== -1) {
            const fieldMatchIndex = currentScenario?.screens?.[screenMatchIndex].actions.findIndex(({ options, selector, action }) => ['fill', 'selectOption'].includes(action) && ((options?.name || selector).replaceAll(" ", "").toLowerCase() === fName));

            if (fieldMatchIndex !== -1) {
              store.dispatch(setCurrentScenarioValue(screenMatchIndex, fieldMatchIndex, row['Value']));

              return;
            }
          }

          missingRows.push(row);
        });

        if (missingRows.length) {
          setFillErrors(missingRows);
        } else {
          notify.success('All values were filled from the uploaded file. Please verify before proceeding!');
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
        notify.error('Failed to read the Excel file. Please try again.');
      } finally {
        document.getElementById('xlsFileUpload').value = "";
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleChange = (parentIndex, childIndex, value) => {
    store.dispatch(setCurrentScenarioValue(parentIndex, childIndex, value));
  };

  const handleNext = () => {
    if (!screensChecked.find((screenChecked) => screenChecked)) {
      notify.error('At least one screen is required.');
      return;
    }
    window.scrollTo(0, 0);
    setEditEnabled(true);
  };

  const handleSave = () => {
    if (!scenarioName) {
      notify.error('Scenario name is required.');
      return;
    }
    if (!scenarioURL && editScenarioInfo?.id) {
      notify.error('Scenario URL is required.');
      return;
    }

    postScenario(scenarioName, scenarioURL, JSON.stringify(currentScenario?.screens.filter((_, i) => screensChecked[i])))
      .then((res) => {
        if (res.status === 'success') {
          notify.success('Scenario created successfully!');
          navigate('/dashboard');
        } else {
          notify.error('Failed to create scenario. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error creating scenario:', error);
        notify.error('Failed to create scenario. Please try again.');
      });
  };

  const handleEdit = () => {
    updateScenario(editScenarioInfo?.id, JSON.stringify(currentScenario?.screens))
      .then((res) => {
        if (res.status === 'success') {
          notify.success('Scenario Update successfully!');
          navigate('/dashboard');
        } else {
          notify.error('Failed to update scenario. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error updating scenario:', error);
        notify.error('Failed to update scenario. Please try again.');
      });
  };

  return (
    <DefaultLayout>
      <>
        <div className='create-scenario-container position-relative d-flex flex-column gap-4'>
          <p className='create-scenario-heading m-0'>
            {!editScenarioInfo?.id ? 'Create New Scenario' : 'Edit Scenario'}
          </p>

          {currentScenario?.screens?.length === 0 ? (
            <div className='no-scenario-container flex-grow-1 d-flex align-items-center justify-content-center'>
              <p className='no-scenario-text'>No Scenario available. Please upload a spec file & then continue</p>
            </div>
          ) : (
            <>
              <div className='scenario-list-container d-flex flex-column gap-1'>
                <div className="d-flex align-items-center mb-3">
                  {(!editScenarioInfo?.id && !editEnabled) ? (
                    <>
                      <label className="form-label-checkbox mb-0 me-2" htmlFor='select-all-checkbox'>Select All</label>
                      <input id='select-all-checkbox' type="checkbox" className="form-check-input mt-0 border-dark-subtle rounded-1" checked={allActionsSelected} onChange={() => checkAllActions()} />
                    </>
                  ) : (
                    <div className='d-flex gap-3 w-100'>
                      <Form.Group className='w-50'>
                        <Form.Label>Scenario Name <span className='text-danger'>*</span></Form.Label>
                        <Form.Control
                          name='ScenarioName'
                          type='text'
                          placeholder='Scenario Name'
                          value={scenarioName}
                          onChange={(e) => setScenarioName(e.target.value)}
                        />
                      </Form.Group>
                      {editScenarioInfo?.id &&
                        <Form.Group className='w-50'>
                          <Form.Label>Scenario URL <span className='text-danger'>*</span></Form.Label>
                          <Form.Control
                            name='ScenarioURL'
                            type='text'
                            placeholder='Scenario URL'
                            value={scenarioURL}
                            onChange={(e) => setScenarioURL(e.target.value)}
                          />
                        </Form.Group>
                      }
                      <div className='d-flex align-items-end'>
                        <label htmlFor="xlsFileUpload" className="btn btn-primary text-nowrap">
                          <h5 className="d-inline bi bi-filetype-xls me-1" />
                          Fill values with excel
                        </label>
                        <input
                          type="file"
                          id="xlsFileUpload"
                          style={{ display: 'none' }}
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {currentScenario?.screens?.map((screen, i) => {
                  const screenNameID = screen.screenName.replace(/\s+/g, '') + i;
                  if (editEnabled && !screensChecked[i]) return null;

                  return (
                    <ScreenAccordion
                      key={screen.screenName + screen.actions.length + i}
                      screen={screen}
                      screenNameID={screenNameID}
                      screenSelected={screensChecked[i] || false}
                      toggleScreenSelection={() => checkScreen(i)}
                      editEnabled={editEnabled || editScenarioInfo?.id}
                      onChange={(j, value) => handleChange(i, j, value)}
                    />
                  )
                })}
              </div>

              <div className='scenario-actions-container d-flex gap-3 justify-content-end'>
                {(!editScenarioInfo?.id && !editEnabled) ? (
                  <>
                    <Button className='border-dark-subtle border-1' variant='secondary' onClick={() => navigate('/dashboard')}>
                      Cancel
                    </Button>
                    <Button variant='primary' onClick={handleNext}>
                      Next
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className='border-dark-subtle border-1' variant='secondary' onClick={() => editScenarioInfo?.id ? navigate('/dashboard') : setEditEnabled(false)}>
                      Back
                    </Button>
                    <Button variant='primary' onClick={!editScenarioInfo?.id ? handleSave : handleEdit}>
                      Save
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <Modal size='xl' centered show={fillErrors.length} onHide={() => setFillErrors([])}>
          <Modal.Header closeButton>
            <Modal.Title>Failed to fill</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className='mb-3'>We could not fill the values shown below. Please add them manually & verify the filled values too</p>
            <table className="table table-bordered m-0">
              <thead>
                <tr>
                  <th className="table-heading">Screen Name</th>
                  <th className="table-heading">Field Name</th>
                  <th className="table-heading">Value</th>
                </tr>
              </thead>
              <tbody>
                {fillErrors.map(row => (
                  <tr>
                    <td>{row['Screen Name']}</td>
                    <td>{row['Field Name']}</td>
                    <td>{row['Value']}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
      </>
    </DefaultLayout>
  );
};

export default CreateScenario;
