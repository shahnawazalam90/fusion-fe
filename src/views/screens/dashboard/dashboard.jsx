import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import dayjs from 'dayjs'

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';

import {
  getUserScenarios,
  deleteScenario,
  executeScenario,
  getScenariosJSON,
  scheduleScenario
} from 'src/http';
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
  const [scheduleDT, setScheduleDT] = useState();
  const [scheduleError, setScheduleError] = useState('');

  useEffect(() => {
    getUserScenarios();
  }, []);

  const scenarioIdMap = useMemo(() => {
    return Object.fromEntries(userScenarios.map(({ id, name }) => [id, name]));
  }, [userScenarios]);

  const handleScenarioClick = (scenarioId) => {
    setSelectedScenarios({
      ...selectedScenarios,
      [scenarioId]: !selectedScenarios[scenarioId],
    });
  };

  const handleDeleteScenario = () => {
    deleteScenario(deletionScenario.id)
      .then(async () => {
        notify.success('Scenario deleted successfully!');
      })
      .catch(() => {
        notify.error(
          'Something went wrong while trying to delete the scenario.'
        );
      })
      .finally(() => {
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
    getScenariosJSON(Object.keys(selectedScenarios)).then(
      async ({ status, data }) => {
        if (status === 'success') {
          await downloadFile(
            data,
            `${Object.keys(selectedScenarios)
              .map((id) => scenarioIdMap[id])
              .join(', ')}.json`,
            4
          );
          notify.success('Downloaded successfully!');
        }
      }
    );
  };

  const handleScenarioExecute = () => {
    executeScenario(Object.keys(selectedScenarios)).then(({ status, data }) => {
      if (status === 'success') {
        setSelectedScenarios({});
        openTestStreamWindow(data.id);
        notify.success(
          (t) => (
            <div className="d-flex align-items-center gap-2">
              <span className="text-nowrap">
                Scenarios started executing successfully!
              </span>
              <Button
                className="text-nowrap"
                variant="primary"
                size="sm"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      data.scenarioFile.replace(/^.*[\\/]/, '')
                    );
                    notify.success('Copied successfully!');
                  } catch (err) {
                    notify.error(
                      'Scenario ID could not be copied to clipboard. It has been console logged'
                    );
                    console.log('Clipboard copy error: ', err);
                    console.log(
                      'Scenario ID: ',
                      data.scenarioFile.replace(/^.*[\\/]/, '')
                    );
                  } finally {
                    notify.dismiss(t.id);
                  }
                }}
              >
                Copy Scenario ID
              </Button>
            </div>
          ),
          {
            duration: 5000,
            style: {
              maxWidth: '500px',
            },
          }
        );
      }
    });
  };

  const handleScheduleScenario = () => {
    if (scheduleDT && scheduleDT < new Date()) {
      setScheduleError('Please select a future date and time.');
      return;
    }

    setScheduleError('');
    setScheduleDT(null);
    setSelectedScenarios({});

    scheduleScenario(scheduleDT.toUTCString(), Object.keys(selectedScenarios))
      .then(({ success }) => {
        if (success) {
          notify.success('Scenario scheduled successfully!');
        }
      }).catch(() => {
        notify.error(
          'Something went wrong while trying to schedule the scenario.'
        );
      });
  };

  const disableScenarioActions = useMemo(
    () => !Object.values(selectedScenarios).find((x) => x),
    [selectedScenarios]
  );

  const openTestStreamWindow = (reportId) => {
    // Create and open the popup window
    const streamWindow = window.open('', '_blank', 'width=800,height=600');

    // Create the HTML content with embedded JavaScript
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Stream - Report ${reportId}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              background: #f8f9fa;
            }
            .test-stream { 
              max-width: 800px; 
              margin: 0 auto;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .status { 
              margin-bottom: 10px;
              padding: 10px;
              background: #e9ecef;
              border-radius: 4px;
            }
            .error { 
              color: #dc3545;
              margin: 10px 0;
              padding: 10px;
              background: #f8d7da;
              border-radius: 4px;
            }
            .output { 
              background: #f8f9fa;
              padding: 15px;
              border-radius: 4px;
              max-height: 500px;
              overflow-y: auto;
              border: 1px solid #dee2e6;
            }
            .output-line { 
              margin: 5px 0;
              padding: 5px;
              border-bottom: 1px solid #dee2e6;
            }
            .output-line:last-child {
              border-bottom: none;
            }
          </style>
        </head>
        <body>
          <div class="test-stream">
            <div class="status">Status: connecting...</div>
            <div class="error" style="display: none;"></div>
            <div class="output"></div>
          </div>
  
          <script>
            (function() {
              const reportId = "${reportId}";
              let retryCount = 0;
              const maxRetries = 3;
              const retryDelay = 2000;
              let eventSource = null;
  
              function updateStatus(status) {
                document.querySelector('.status').textContent = 'Status: ' + status;
              }
  
              function showError(message) {
                const errorDiv = document.querySelector('.error');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
              }
  
              function appendOutput(message) {
                const outputDiv = document.querySelector('.output');
                const line = document.createElement('div');
                line.className = 'output-line';
                line.textContent = message;
                outputDiv.appendChild(line);
                outputDiv.scrollTop = outputDiv.scrollHeight;
              }
  
              function connectSSE() {
                if (eventSource) {
                  eventSource.close();
                }
  
                eventSource = new EventSource(import.meta.env.VITE_API_URL + '/api/v1/reports/' + reportId + '/stream');
  
                eventSource.onopen = () => {
                  updateStatus('connecting');
                  retryCount = 0;
                };
  
                eventSource.addEventListener('connected', (event) => {
                  updateStatus('connected');
                  const data = JSON.parse(event.data);
                  appendOutput(data.message);
                });
  
                eventSource.addEventListener('status', (event) => {
                  const data = JSON.parse(event.data);
                  updateStatus(data.status);
                  if (data.status === 'failed') {
                    showError('Test execution failed');
                  }
                });
  
                eventSource.addEventListener('output', (event) => {
                  const data = JSON.parse(event.data);
                  appendOutput(data.output);
                });
  
                eventSource.addEventListener('error', (event) => {
                  const data = JSON.parse(event.data);
                  showError(data.error);
                });
  
                eventSource.onerror = (error) => {
                  console.error('SSE connection error:', error);
                  updateStatus('disconnected');
                  showError('Connection lost. Reconnecting...');
                  
                  if (retryCount < maxRetries) {
                    setTimeout(() => {
                      retryCount++;
                      connectSSE();
                    }, retryDelay * Math.pow(2, retryCount));
                  } else {
                    showError('Failed to connect after multiple attempts');
                  }
                };
              }
  
              // Start the connection
              connectSSE();
  
              // Cleanup when window is closed
              window.onbeforeunload = () => {
                if (eventSource) {
                  eventSource.close();
                }
              };
            })();
          </script>
        </body>
      </html>
    `;

    // Write the HTML to the new window
    streamWindow.document.write(html);
    streamWindow.document.close();
  };
  return (
    <DefaultLayout>
      <>
        <div className="dashboard-container flex-grow-1 position-relative d-flex flex-column gap-4">
          <p className="dashboard-heading m-0">Scenario Management</p>
          <div className="user-scenario-container flex-grow-1 d-flex flex-column gap-3">
            <div className="scenario-controls-container d-flex align-items-center justify-content-end">
              <Button
                variant="primary"
                onClick={() => {
                  store.dispatch(
                    setEditScenarioInfo(initialState.editScenarioInfo)
                  );
                  navigate('/create');
                }}
              >
                <i className="create-new-icon bi bi-plus-circle me-2" />
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
            <div className="scenario-grid-container flex-grow-1">
              <div className="scenario-grid-wrapper align-items-start d-flex flex-wrap">
                {userScenarios.map((scenario) => (
                  <Card className="scenario-card" key={scenario.id}>
                    <Card.Body onClick={() => handleScenarioClick(scenario.id)}>
                      <Card.Title className="scenario-card-title d-flex align-items-center justify-content-between gap-2">
                        <span>{scenario.name}</span>
                        <i
                          className={classNames('bi', {
                            'bi-square': !selectedScenarios[scenario.id],
                            'bi-check-square-fill text-primary':
                              selectedScenarios[scenario.id],
                          })}
                        />
                      </Card.Title>
                      <Card.Text className="scenario-card-details">
                        <span className="scenario-text d-block mb-0">
                          {JSON.parse(scenario.jsonMetaData)?.length} screen(s)
                        </span>
                        <span className="scenario-text mb-0">
                          {new Date(scenario.createdAt).toLocaleString()}
                        </span>
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="d-flex gap-2 justify-content-end">
                      <Button
                        className="border-dark-subtle border-1"
                        variant="danger"
                        onClick={() => setDeletionScenario(scenario)}
                      >
                        <i className="me-1 bi bi-trash3" />
                        Delete
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() =>
                          handleEditScenario(scenario.id, scenario.name)
                        }
                      >
                        <i className="me-1 bi bi-pencil-square" />
                        Edit
                      </Button>
                    </Card.Footer>
                  </Card>
                ))}
              </div>
            </div>
            <div className="dashboard-actions-container d-flex align-items-center justify-content-end gap-3">
              <Button
                className="border-dark-subtle border-1"
                variant="secondary"
                onClick={() => setSelectedScenarios({})}
                disabled={disableScenarioActions}
              >
                Clear Selection
              </Button>
              <Button
                className="border-dark-subtle border-1"
                variant="secondary"
                onClick={handleScenarioDownload}
                disabled={disableScenarioActions}
              >
                Download
              </Button>
              <div className='d-flex gap-1 p-1 border border-1 border-black rounded-3'>
                <Button
                  variant="primary"
                  onClick={handleScenarioExecute}
                  disabled={disableScenarioActions}
                >
                  Execute
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setScheduleDT(new Date())}
                  disabled={disableScenarioActions}
                >
                  <i className="bi bi-alarm" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter UI - To Be Implemented */}
        {/* <div className='scenario-filter-container position-fixed d-flex flex-column'></div> */}

        {/* Delete Scenario Modal */}
        <Modal
          size="md"
          centered
          show={!!deletionScenario}
          onHide={() => setDeletionScenario(null)}
        >
          <Modal.Header className="border-0 pb-0" closeButton>
            <Modal.Title>Delete Scenario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete {deletionScenario?.name}?
          </Modal.Body>
          <Modal.Footer className="d-flex gap-2 justify-content-end border-0 pt-0">
            <Button
              className="border-dark-subtle border-1"
              variant="secondary"
              onClick={() => setDeletionScenario(null)}
            >
              <i className="me-1 bi bi-x-lg" />
              No
            </Button>
            <Button
              className="border-dark-subtle border-1"
              variant="danger"
              onClick={() => handleDeleteScenario()}
            >
              <i className="me-1 bi bi-check-lg" />
              Yes
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Schedule Scenario Modal */}
        <Modal
          size="md"
          centered
          show={!!scheduleDT}
          onHide={() => { setScheduleDT(null); setScheduleError(''); }}
        >
          <Modal.Header className="border-0 pb-0" closeButton>
            <Modal.Title>Schedule Scenario Execution</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='d-flex flex-column gap-3'>
              <p className='m-0'>The scenario will be executed at {scheduleDT?.toLocaleString()}</p>
              <div className='d-flex gap-2'>
                <input
                  className="form-control"
                  type='date'
                  value={dayjs(scheduleDT)?.format('YYYY-MM-DD')}
                  onChange={(e) => setScheduleDT(new Date(scheduleDT.setFullYear(e.target.value.split('-')[0], e.target.value.split('-')[1] - 1, e.target.value.split('-')[2])))}
                />
                <input
                  className="form-control"
                  type='time'
                  value={dayjs(scheduleDT)?.format('HH:mm:ss')}
                  onChange={(e) => setScheduleDT(new Date(scheduleDT.setHours(e.target.value.split(':')[0], e.target.value.split(':')[1], e.target.value.split(':')[2])))}
                />
              </div>
              {scheduleError && (
                <p className="text-danger m-0">
                  {scheduleError}
                </p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer className="d-flex gap-2 justify-content-end border-0 pt-0">
            <Button
              className="border-dark-subtle border-1"
              variant="secondary"
              onClick={() => { setScheduleDT(null); setScheduleError(''); }}
            >
              <i className="me-1 bi bi-x-lg" />
              Cancel
            </Button>
            <Button
              className="border-dark-subtle border-1"
              variant="success"
              onClick={handleScheduleScenario}
            >
              <i className="me-1 bi bi-check-lg" />
              Schedule
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </DefaultLayout>
  );
};

export default Dashboard;
