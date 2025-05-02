import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';

import {
  getUserScenarios,
  getReports,
} from 'src/http';
import { notify } from 'src/notify';

import DefaultLayout from 'src/views/layouts/default';

import './dashboard.scss';

const Dashboard = () => {
  const navigate = useNavigate();
  const userScenarios = useSelector((state) => state.userScenarios);
  const currentScenario = useSelector((state) => state.currentScenario);

  const [selectedScenarios, setSelectedScenarios] = useState({});

  useEffect(() => {
    getUserScenarios();
    getReports();
  }, []);

  const handleScenarioClick = (scenarioId) => {
    setSelectedScenarios(({ ...selectedScenarios, [scenarioId]: !selectedScenarios[scenarioId] }));
  };

  const handleScenarioExecute = () => {
    try {
      const scenariosList = userScenarios.filter(scenario => selectedScenarios[scenario.id]);
      const blob = new Blob([JSON.stringify(scenariosList.map(({ jsonMetaData }) => jsonMetaData), null, 4)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${scenariosList.map(({ name }) => name).join()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSelectedScenarios({});
      notify.success('Scenarios downloaded successfully!');
    } catch (error) {
      console.error('Error downloading scenarios:', error);
      notify.error('Error downloading scenarios. Please try again.');
    }
  };

  return (
    <DefaultLayout>
      <>
        <div className='dashboard-container position-relative d-flex flex-column gap-4'>
          <p className='dashboard-heading m-0'>Scenario Management</p>
          <div className='user-scenario-container d-flex flex-column gap-3'>
            <div className='scenario-controls-container d-flex align-items-center justify-content-end'>
              <Button variant='primary' disabled={!currentScenario.length} onClick={() => navigate('/create')}>
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
            <div className='scenario-grid-container d-flex flex-wrap'>
              {userScenarios.map((scenario) => (
                <Card className='scenario-card' key={scenario.id} onClick={() => handleScenarioClick(scenario.id)}>
                  <Card.Body>
                    <Card.Title className='scenario-card-title d-flex align-items-center gap-2'>
                      <i className={classNames('bi', { 'bi-circle': !selectedScenarios[scenario.id], 'bi-record-circle-fill text-primary': selectedScenarios[scenario.id] })} />
                      <span>{scenario.name}</span>
                    </Card.Title>
                    <Card.Text className='scenario-card-details'>
                      <span className='scenario-text d-block mb-0'>{scenario.jsonMetaData?.length} screen(s)</span>
                      <span className='scenario-text mb-0'>{new Date(scenario.createdAt).toLocaleString()}</span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className='dashboard-actions-container d-flex justify-content-end gap-3'>
              <Button variant='secondary' onClick={() => setSelectedScenarios([])} disabled={!Object.keys(selectedScenarios).length}>
                Clear Selection
              </Button>
              <Button variant='primary' onClick={handleScenarioExecute} disabled={!Object.keys(selectedScenarios).length}>
                Execute
              </Button>
            </div>
          </div>
        </div>

        {/* Filter UI - To Be Implemented */}
        {/* <div className='scenario-filter-container position-fixed d-flex flex-column'></div> */}
      </>
    </DefaultLayout>
  );
};

export default Dashboard;
