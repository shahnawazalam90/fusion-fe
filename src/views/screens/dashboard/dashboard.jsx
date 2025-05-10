import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';

import { getUserScenarios, deleteScenario, executeScenario, getScenariosJSON } from 'src/http';
import { notify } from 'src/notify';
import { downloadFile } from 'src/utils';
import store from 'src/store';
import { setCurrentScenario, setEditScenarioInfo } from 'src/store/actions';
import initialState from 'src/store/initialState';

import DefaultLayout from 'src/views/layouts/default';

import './dashboard.scss';

const Dashboard = () => {
  const navigate = useNavigate();
  const userScenarios = useSelector((state) => state.userScenarios);

  const [selectedScenarios, setSelectedScenarios] = useState({});
  const [deletionScenario, setDeletionScenario] = useState();

  useEffect(() => {
    getUserScenarios();
  }, []);

  const scenarioIdMap = useMemo(() => {
    return Object.fromEntries(userScenarios.map(({ id, name }) => [id, name]))
  }, [userScenarios]);

  const handleScenarioClick = (scenarioId) => {
    setSelectedScenarios(({ ...selectedScenarios, [scenarioId]: !selectedScenarios[scenarioId] }));
  };

  const handleDeleteScenario = () => {
    deleteScenario(deletionScenario.id)
      .then(async () => {
        notify.success('Scenario deleted successfully!');
      }).catch(() => {
        notify.error('Something went wrong while trying to delete the scenario.');
      }).finally(() => {
        setDeletionScenario(null);
        getUserScenarios();
      });
  };

  const handleEditScenario = (id, name) => {
    store.dispatch(setCurrentScenario(initialState.currentScenario));
    store.dispatch(setEditScenarioInfo({ id, name }));
    navigate('/edit');
  };

  const handleScenarioDownload = () => {
    getScenariosJSON(Object.keys(selectedScenarios))
      .then(async ({ status, data }) => {
        if (status === 'success') {
          await downloadFile(data, `${Object.keys(selectedScenarios).map(id => scenarioIdMap[id]).join(', ')}.json`, 4);
          notify.success('Downloaded successfully!');
        }
      });
  };

  const handleScenarioExecute = () => {
    executeScenario(Object.keys(selectedScenarios))
      .then(({ status, data }) => {
        if (status === 'success') {
          setSelectedScenarios({});
          notify.success((t) => (
            <div className='d-flex align-items-center gap-2'>
              <span className='text-nowrap'>Scenarios started executing successfully!</span>
              <Button className='text-nowrap' variant='primary' size='sm' onClick={async () => {
                try {
                  await navigator.clipboard.writeText(data.scenarioFile.replace(/^.*[\\/]/, ''));
                  notify.success('Copied successfully!');
                } catch (err) {
                  notify.error('Scenario ID could not be copied to clipboard. It has been console logged');
                  console.log('Clipboard copy error: ', err);
                  console.log('Scenario ID: ', data.scenarioFile.replace(/^.*[\\/]/, ''));
                } finally {
                  notify.dismiss(t.id);
                }
              }}>
                Copy Scenario ID
              </Button>
            </div>
          ), {
            duration: 5000, style: {
              maxWidth: '500px',
            }
          });
        }
      });
  };

  const disableScenarioActions = useMemo(() => !Object.values(selectedScenarios).find(x => x), [selectedScenarios]);

  return (
    <DefaultLayout>
      <>
        <div className='dashboard-container flex-grow-1 position-relative d-flex flex-column gap-4'>
          <p className='dashboard-heading m-0'>Scenario Management</p>
          <div className='user-scenario-container flex-grow-1 d-flex flex-column gap-3'>
            <div className='scenario-controls-container d-flex align-items-center justify-content-end'>
              <Button variant='primary' onClick={() => {
                store.dispatch(setEditScenarioInfo(initialState.editScenarioInfo));
                navigate('/create');
              }}>
                <i className='create-new-icon bi bi-plus-circle me-2' />
                Create New Scenario
              </Button>

              {/* Filter UI - To Be Implemented */}
              {/* <div className='d-flex align-items-center gap-3'>
                <Form className='search-form' onSubmit={(e) => e.preventDefault()}>
                  <Form.Group>
                    <InputGroup>
                      <Form.Control
                        className='border-end-0'
                        name='Search'
                        type='text'
                        placeholder='Search'
                      />
                      <InputGroup.Text className='search-icon-container bg-transparent'>
                        <i className='search-icon bi bi-search text-secondary' />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Form>
                <Button variant='primary' onClick={() => setIsFilterVisible(!isFilterVisible)}>Filter</Button>
              </div> */}
            </div>
            <div className='scenario-grid-container flex-grow-1'>
              <div className='scenario-grid-wrapper align-items-start d-flex flex-wrap'>
                {userScenarios.map((scenario) => (
                  <Card className='scenario-card' key={scenario.id}>
                    <Card.Body onClick={() => handleScenarioClick(scenario.id)}>
                      <Card.Title className='scenario-card-title d-flex align-items-center justify-content-between gap-2'>
                        <span>{scenario.name}</span>
                        <i className={classNames('bi', { 'bi-square': !selectedScenarios[scenario.id], 'bi-check-square-fill text-primary': selectedScenarios[scenario.id] })} />
                      </Card.Title>
                      <Card.Text className='scenario-card-details'>
                        <span className='scenario-text d-block mb-0'>{JSON.parse(scenario.jsonMetaData)?.length} screen(s)</span>
                        <span className='scenario-text mb-0'>{new Date(scenario.createdAt).toLocaleString()}</span>
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className='d-flex gap-2 justify-content-end'>
                      <Button
                        className='border-dark-subtle border-1'
                        variant='danger'
                        onClick={() => setDeletionScenario(scenario)}
                      >
                        <i className="me-1 bi bi-trash3" />
                        Delete
                      </Button>
                      <Button
                        variant='primary'
                        onClick={() => handleEditScenario(scenario.id, scenario.name)}
                      >
                        <i className="me-1 bi bi-pencil-square" />
                        Edit
                      </Button>
                    </Card.Footer>
                  </Card>
                ))}

              </div>
            </div>
            <div className='dashboard-actions-container d-flex justify-content-end gap-3'>
              <Button className='border-dark-subtle border-1' variant='secondary' onClick={() => setSelectedScenarios({})} disabled={disableScenarioActions}>
                Clear Selection
              </Button>
              <Button className='border-dark-subtle border-1' variant='secondary' onClick={handleScenarioDownload} disabled={disableScenarioActions}>
                Download
              </Button>
              <Button variant='primary' onClick={handleScenarioExecute} disabled={disableScenarioActions}>
                Execute
              </Button>
            </div>
          </div>
        </div>

        {/* Filter UI - To Be Implemented */}
        {/* <div className='scenario-filter-container position-fixed d-flex flex-column'></div> */}

        <Modal size='md' centered show={!!deletionScenario} onHide={() => setDeletionScenario(null)}>
          <Modal.Header className='border-0 pb-0' closeButton>
            <Modal.Title>Delete Scenario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete {deletionScenario?.name}?
          </Modal.Body>
          <Modal.Footer className='d-flex gap-2 justify-content-end border-0 pt-0'>
            <Button
              className='border-dark-subtle border-1'
              variant='secondary'
              onClick={() => setDeletionScenario(null)}
            >
              <i className="me-1 bi bi-x-lg" />
              No
            </Button>
            <Button
              className='border-dark-subtle border-1'
              variant='danger'
              onClick={() => handleDeleteScenario()}
            >
              <i className="me-1 bi bi-check-lg" />
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </DefaultLayout>
  );
};

export default Dashboard;
