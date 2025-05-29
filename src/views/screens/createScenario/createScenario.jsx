import { useState, useEffect, useMemo } from 'react';
import { Button, Checkbox, Collapse, Empty, Input, Select, Table, Typography } from 'antd';
import { ArrowLeftOutlined, CloseOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';

import { getLatestScenario, postScenario, listRequests } from "src/http";
import { toTitleCase, writeArrayToExcel, readExcelToArray, scenarioScreensToRefArray, checkExcelValidity } from "src/utils";
import { notify } from 'src/notify';

import DefaultLayout from 'src/views/layouts/default';

import './createScenario.scss';

const { Text, Title } = Typography;

const CreateScenario = () => {
  const navigate = useNavigate();
  const currentScenario = useSelector((state) => state.currentScenario);
  const requests = useSelector((state) => state.requests);

  const [screensChecked, setScreensChecked] = useState([]);
  const [screenValues, setScreenValues] = useState({});
  const [requestSelections, setRequestSelections] = useState({});
  const [editEnabled, setEditEnabled] = useState(false);
  const [scenarioName, setScenarioName] = useState('');
  const [scenarioURL, setScenarioURL] = useState('');

  const filteredScreens = useMemo(() => {
    return currentScenario?.screens?.filter((screen, i) => !editEnabled || screensChecked[i]);
  }, [currentScenario, editEnabled, screensChecked]);

  const allScreensSelected = useMemo(() => {
    if (screensChecked.length === 0) return false;

    return screensChecked?.find((checked) => !checked) === undefined;
  }, [screensChecked]);

  useEffect(() => {
    getLatestScenario().then((scenario) => {
      const screensCheckedNew = [];
      scenario.screens.forEach((_, i) => {
        screensCheckedNew[i] = false;
      });
      setScreensChecked(screensCheckedNew);
      setScenarioURL(scenario.url);
    });
    listRequests();
  }, []);

  useEffect(() => {
    const screenValuesNew = {};
    const requestSelectionsNew = {};
    filteredScreens.forEach(({ actions }, i) => {
      actions.forEach((action, j) => {
        if (['fill', 'selectOption'].includes(action.action)) {
          screenValuesNew[`${i},${j}`] = '';
          requestSelectionsNew[`${i},${j}`] = null;
        }
      });
    });

    setScreenValues(screenValuesNew);
    setRequestSelections(requestSelectionsNew);
  }, [filteredScreens]);

  const checkAllScreens = () => {
    const updatedScreensChecked = screensChecked?.map(() => (!allScreensSelected));
    setScreensChecked(updatedScreensChecked);
  };

  const checkScreen = (i) => {
    const updatedScreensChecked = [...screensChecked];

    updatedScreensChecked[i] = !updatedScreensChecked[i];

    setScreensChecked(updatedScreensChecked);
  };

  const handleNext = () => {
    if (!screensChecked?.find((checked) => checked)) {
      notify.error('At least one screen is required.');
      return;
    }

    window.scrollTo(0, 0);
    setEditEnabled(true);
  };

  const handleExcelUpload = (e) => {
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

    readExcelToArray(file, (excelData) => {
      e.target.value = null; // Clear the input value
      const scenarioRefArray = scenarioScreensToRefArray(filteredScreens);
      let canProcess = checkExcelValidity(excelData, scenarioRefArray);

      if (canProcess) {
        const newScreenValues = {};

        excelData.forEach((row, i) => {
          if (i === 0) return; // Skip header row

          newScreenValues[row[0]] = row[3];
        });

        setScreenValues(newScreenValues);
        notify.success('File uploaded and values added successfully!');
      }
    });
  };

  const handleSubmit = () => {
    if (!scenarioName) {
      notify.error('Scenario name is required.');
      return;
    }

    const filteredScreensCopy = [...filteredScreens]

    Object.keys(requestSelections).forEach((key) => {
      const [screenIndex, actionIndex] = key.split(',').map(Number);
      const requestId = requestSelections[key];
      if (requestId) {
        filteredScreensCopy[screenIndex].actions[actionIndex].requestId = requestId;
      }
    });

    postScenario(
      scenarioName,
      scenarioURL,
      JSON.stringify(filteredScreensCopy),
      JSON.stringify(Object.keys(screenValues)?.map((key) => [key, screenValues[key]]))
    )
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
        <Title className='create-scenario-heading m-0'>
          Create New Scenario
        </Title>

        {(currentScenario?.screens?.length === 0) &&
          <Empty
            className='py-5 my-5'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text>No Data available. Please upload a spec file & then continue</Text>
            }
          >
            <Button type='primary' onClick={() => navigate('/upload')}>Upload</Button>
          </Empty>
        }

        {(currentScenario?.screens?.length !== 0) &&
          <>
            <div className='d-flex flex-column gap-3'>
              <div className="d-flex align-items-center">
                {(!editEnabled) && (
                  <label className='d-flex align-items-center gap-1 cursor-pointer'>
                    <Text>Select All</Text>
                    <Checkbox checked={allScreensSelected} onChange={() => checkAllScreens()} />
                  </label>
                )}
                {(editEnabled) && (
                  <div className='d-flex w-100 align-items-center justify-content-between'>
                    <div className='d-flex flex-column gap-1 w-33'>
                      <Title level={5}>Scenario Name <Text type='danger'>*</Text></Title>
                      <Input
                        name='Scenario Name'
                        placeholder='Enter Scenario Name'
                        onChange={e => setScenarioName(e.target.value)}
                        value={scenarioName}
                      />
                    </div>
                    <div className='d-flex flex-column gap-1'>
                      <Title level={5} className='text-align-center'>Excel values</Title>
                      <div className='d-flex gap-3'>
                        <Button
                          type='primary'
                          icon={<DownloadOutlined />}
                          onClick={() => writeArrayToExcel(scenarioScreensToRefArray(filteredScreens), 'Scenario values.xlsx')}
                        >
                          Download
                        </Button>
                        <Button
                          type='primary'
                          icon={<UploadOutlined />}
                          onClick={() => document.getElementById('excelFileUpload').click()}
                        >
                          Upload
                        </Button>
                        <input
                          type='file'
                          id='excelFileUpload'
                          style={{ display: 'none' }}
                          onChange={handleExcelUpload}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Collapse
                activeKey={editEnabled ? filteredScreens?.map((_, i) => i) : undefined}
                expandIconPosition='end'
                items={
                  filteredScreens?.map((screen, i) => ({
                    key: i,
                    showArrow: !editEnabled,
                    label: (
                      <div className='d-flex align-items-center gap-2'>
                        {(!editEnabled) &&
                          <Checkbox
                            checked={editEnabled || screensChecked[i]}
                            onClick={(e) => { e.stopPropagation(); checkScreen(i); }}
                          />
                        }
                        <Text>{toTitleCase(screen.screenName)}</Text>
                      </div>
                    ),
                    children: (
                      <Table
                        pagination={false}
                        bordered
                        size='small'
                        rowKey={(record) => `${screen.screenName}-${record.screenIndex}-${record.actionIndex}`}
                        columns={[
                          {
                            title: 'Field Name',
                            className: 'w-33',
                            dataIndex: 'actionName',
                            key: 'actionName',
                            render: (text) => <Text>{text}</Text>,
                          },
                          {
                            title: 'Value',
                            className: 'w-33',
                            dataIndex: 'value',
                            key: 'value',
                            render: (text, record) => (
                              <Input
                                className='w-100'
                                value={text}
                                disabled={!editEnabled}
                                onChange={(e) => {
                                  const newScreenValues = { ...screenValues };
                                  newScreenValues[`${record.screenIndex},${record.actionIndex}`] = e.target.value;
                                  setScreenValues(newScreenValues);
                                }}
                              />
                            ),
                          },
                          {
                            title: 'Request',
                            className: 'w-33',
                            render: (_, record) => (
                              <Select
                                name='Request'
                                className='w-100'
                                disabled={!editEnabled}
                                value={requestSelections[`${record.screenIndex},${record.actionIndex}`] || null}
                                onChange={val => setRequestSelections({ ...requestSelections, [`${record.screenIndex},${record.actionIndex}`]: val })}
                                options={[
                                  { label: 'None', value: null },
                                  ...(requests ? requests.map((request) => ({
                                    label: request.name,
                                    value: request.id,
                                  })) : []),
                                ]}
                              />
                            ),
                          },
                        ]}
                        dataSource={
                          screen?.actions?.map(({ action, options, selector }, j) => {
                            if (!['fill', 'selectOption'].includes(action)) return null;

                            return ({
                              key: `${screen.screenName}-${j}`,
                              actionName: toTitleCase(options?.name || selector),
                              value: screenValues[`${i},${j}`] || '',
                              screenIndex: i,
                              actionIndex: j,
                            });
                          })?.filter(Boolean) // Filter out null values
                        }
                      />
                    ),
                  }))
                }
              />

              <div className='d-flex justify-content-end gap-3'>
                {(!editEnabled) && (
                  <>
                    <Button
                      icon={<CloseOutlined />}
                      onClick={() => navigate('/dashboard')}
                      danger
                    >
                      Cancel
                    </Button>
                    <Button
                      type='primary'
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </>
                )}

                {(editEnabled) && (
                  <>
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => setEditEnabled(false)}
                      danger
                    >
                      Back
                    </Button>
                    <Button
                      type='primary'
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        }
      </div>
    </DefaultLayout>
  );
};

export default CreateScenario;
