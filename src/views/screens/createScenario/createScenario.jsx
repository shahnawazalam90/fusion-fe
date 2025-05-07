import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import store from 'src/store';
import { notify } from 'src/notify';
import { setCurrentScenarioValue } from 'src/store/actions';

import { postScenario, getLatestScenario } from "src/http";

import DefaultLayout from 'src/views/layouts/default';
import ScreenAccordion from './screenAccordion';

import './createScenario.scss';

const CreateScenario = () => {
  const navigate = useNavigate();
  const currentScenario = useSelector((state) => state.currentScenario);

  const [screensChecked, setScreensChecked] = useState([]);
  const [editEnabled, setEditEnabled] = useState(false);
  const [scenarioName, setScenarioName] = useState('');

  useEffect(() => {
    getLatestScenario().then(({ screens }) => {
      const updatedChecked = screens.map(() => false);
      setScreensChecked(updatedChecked);
    });
  }, []);

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

    postScenario(scenarioName, currentScenario?.url, JSON.stringify(currentScenario?.screens.filter((_, i) => screensChecked[i])))
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

  return (
    <DefaultLayout>
      <div className='create-scenario-container position-relative d-flex flex-column gap-4'>
        <p className='create-scenario-heading m-0'>Create New Scenario</p>

        {currentScenario?.screens?.length === 0 ? (
          <div className='no-scenario-container flex-grow-1 d-flex align-items-center justify-content-center'>
            <p className='no-scenario-text'>No Scenario available. Please upload a spec file & then continue</p>
          </div>
        ) : (
          <>
            <div className='scenario-list-container d-flex flex-column gap-1'>
              <div className="d-flex align-items-center mb-3">
                {!editEnabled ? (
                  <>
                    <label className="form-label-checkbox mb-0 me-2" htmlFor='select-all-checkbox'>Select All</label>
                    <input id='select-all-checkbox' type="checkbox" className="form-check-input mt-0 border-dark-subtle rounded-1" checked={allActionsSelected} onChange={() => checkAllActions()} />
                  </>
                ) : (
                  <Form.Group className='mb-3'>
                    <Form.Label>Scenario Name <span className='text-danger'>*</span></Form.Label>
                    <Form.Control
                      name='ScenarioName'
                      type='text'
                      placeholder='Scenario Name'
                      value={scenarioName}
                      onChange={(e) => setScenarioName(e.target.value)}
                    />
                  </Form.Group>
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
                    editEnabled={editEnabled}
                    onChange={(j, value) => handleChange(i, j, value)}
                  />
                )
              })}
            </div>

            <div className='scenario-actions-container d-flex gap-3 justify-content-end'>
              {!editEnabled ? (
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
                  <Button className='border-dark-subtle border-1' variant='secondary' onClick={() => setEditEnabled(false)}>
                    Back
                  </Button>
                  <Button variant='primary' onClick={handleSave}>
                    Save
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CreateScenario;
