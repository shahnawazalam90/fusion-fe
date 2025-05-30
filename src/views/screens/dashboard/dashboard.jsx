import { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Popconfirm, Select, Typography } from 'antd';
import { ClearOutlined, ClockCircleOutlined, DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import {
  getUserScenarios,
  deleteScenario,
  updateScenarioExcelData,
  executeScenario,
  scheduleScenario,
  getScenarioJSON,
} from 'src/http';
import { downloadJSON, executionBrowserOptions } from 'src/utils';
import { notify } from 'src/notify';
import store from 'src/store';
import { setCurrentScenario, setEditScenarioInfo } from 'src/store/actions';
import initialState from 'src/store/initialState';

import DefaultLayout from 'src/views/layouts/default';
import ScheduleFormModal from 'src/views/sharedComponents/scheduleFormModal';
import { reportStreamHTML } from './components/reportStream';
import ScenarioCard from './components/scenarioCard';

import './dashboard.scss';

const { Text, Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const userScenarios = useSelector((state) => state.userScenarios);

  const [selectedScenarios, setSelectedScenarios] = useState({});
  const [scenariosValues, setScenariosValues] = useState({});
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedBrowser, setSelectedBrowser] = useState(executionBrowserOptions[0].value);

  useEffect(() => {
    getUserScenarios();
  }, []);

  useEffect(() => {
    const initialScenariosValues = {};
    userScenarios.forEach((scenario) => {
      initialScenariosValues[scenario.id] = 'manual';
    });
    setScenariosValues(initialScenariosValues);
  }, [userScenarios]);

  const disableScenarioActions = useMemo(() => !Object.values(selectedScenarios)?.find((x) => x), [selectedScenarios]);

  const handleScenarioClick = (scenarioId) => {
    setSelectedScenarios({
      ...selectedScenarios,
      [scenarioId]: !selectedScenarios[scenarioId],
    });
  };

  const handleDeleteScenario = (scenarioId) => {
    deleteScenario(scenarioId)
      .then(async () => {
        notify.success('Scenario deleted successfully!');
      })
      .catch(() => {
        notify.error('Something went wrong while trying to delete the scenario.');
      })
      .finally(() => {
        getUserScenarios();
      });
  };

  const handleEditScenario = (id, name) => {
    store.dispatch(setCurrentScenario(initialState.currentScenario));
    store.dispatch(setEditScenarioInfo({ id, name }));
    navigate('/edit');
  };

  const handleExcelUpload = (scenarioId, excelJSON) => {
    updateScenarioExcelData(scenarioId, excelJSON)
      .then((resp) => {
        if (resp.status === 'success') {
          notify.success('Excel data updated successfully!');
          getUserScenarios();
        } else {
          notify.error('Failed to update Excel data. Please try again.');
        }
      })
      .catch(() => {
        notify.error('Something went wrong while trying to update the Excel data.');
      });
  };

  const mapSelectedScenarioValues = () => {
    return Object.keys(selectedScenarios)
      ?.map((scenarioId) => ({ scenarioId, valuesType: scenariosValues[scenarioId] }));
  };

  const handleDownloadExecutionData = () => {
    const scenarios = mapSelectedScenarioValues();
    getScenarioJSON(scenarios)
      .then(({ status, data }) => {
        if (status === 'success') {
          downloadJSON(data, 'execution_data.json', 4);
        } else {
          notify.error('Failed to download execution data. Please try again.');
        }
      })
      .catch(() => {
        notify.error('Something went wrong while trying to download the execution data.');
      });
  };

  const handleScenarioExecute = () => {
    executeScenario(mapSelectedScenarioValues(), selectedBrowser)
      .then(({ status, data }) => {
        if (status === 'success') {
          setSelectedScenarios({});
          openTestStreamWindow(data.id);
          notify.success('Scenario(s) started executing successfully!');
        } else {
          notify.error('Failed to execute scenario(s). Please try again.');
        }
      })
      .catch(() => {
        notify.error('Something went wrong while trying to execute the scenario(s).');
      });
  };

  const handleScheduleScenario = (name, dateTime, browser) => {
    scheduleScenario(
      name,
      new Date(dateTime).toUTCString(),
      mapSelectedScenarioValues(),
      browser
    )
      .then(({ success }) => {
        if (success) {
          notify.success('Scenario(s) scheduled successfully!');
        }
      }).catch(() => {
        notify.error(
          'Something went wrong while trying to schedule the scenario.'
        );
      }).finally(() => {
        setShowScheduleModal(false);
        setSelectedScenarios({});
      });
  };

  const openTestStreamWindow = (reportId) => {
    // Create and open the popup window
    const streamWindow = window.open('', '_blank', 'width=800,height=600');

    // Create the HTML content with embedded JavaScript
    const html = reportStreamHTML(reportId, import.meta.env.VITE_API_URL);

    // Write the HTML to the new window
    streamWindow.document.write(html);
    streamWindow.document.close();
  };

  return (
    <DefaultLayout>
      <>
        <div className='dashboard-container flex-grow-1 position-relative d-flex flex-column gap-4'>
          <Title className='dashboard-heading'>Scenario Management</Title>
          <div className='user-scenario-container flex-grow-1 d-flex flex-column gap-3'>
            <div className='scenario-controls-container d-flex align-items-center justify-content-end'>
              <Button
                type='primary'
                icon={<PlusCircleOutlined />}
                onClick={() => {
                  store.dispatch(setEditScenarioInfo(initialState.editScenarioInfo));
                  navigate('/create');
                }}
              >
                Create New Scenario
              </Button>
            </div>
            <div className='scenario-grid-container flex-grow-1'>
              <div className='scenario-grid-wrapper align-items-start d-flex flex-wrap'>
                {userScenarios?.map((scenario) => (
                  <ScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    scenariosValues={scenariosValues}
                    selected={selectedScenarios[scenario.id]}
                    handleValueChange={(value) => setScenariosValues({ ...scenariosValues, [scenario.id]: value })}
                    handleClick={() => handleScenarioClick(scenario.id)}
                    handleDelete={() => handleDeleteScenario(scenario.id)}
                    handleExcelUpload={(excelJSON) => handleExcelUpload(scenario.id, excelJSON)}
                    handleEdit={() => handleEditScenario(scenario.id, scenario.name)}
                  />
                ))}
              </div>
            </div>
            <div className='dashboard-actions-container d-flex align-items-center justify-content-end gap-1'>
              <Button
                icon={<ClearOutlined />}
                onClick={() => setSelectedScenarios({})}
                disabled={disableScenarioActions}
                danger
              >
                Clear Selection
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownloadExecutionData}
                disabled={disableScenarioActions}
              >
                Downlaod Execution Data
              </Button>
              <Divider type='vertical' className='py-2' />
              <div className='d-flex gap-1'>
                <Popconfirm
                  title="Select Execution Browser"
                  description={<Select className='w-100 my-2' options={executionBrowserOptions} value={selectedBrowser} onChange={setSelectedBrowser} />}
                  onConfirm={handleScenarioExecute}
                  okText="Submit"
                  cancelText="Cancel"
                >
                  <Button
                    type='primary'
                    disabled={disableScenarioActions}
                  >
                    Execute
                  </Button>
                </Popconfirm>
                <Button
                  type='primary'
                  icon={<ClockCircleOutlined />}
                  onClick={() => setShowScheduleModal(true)}
                  disabled={disableScenarioActions}
                />
              </div>
            </div>
          </div>
        </div>

        <ScheduleFormModal
          showModal={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          onSubmit={handleScheduleScenario}
        />
      </>
    </DefaultLayout >
  );
};

export default Dashboard;
