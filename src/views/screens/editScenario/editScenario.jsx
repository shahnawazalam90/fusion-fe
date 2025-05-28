import { useState, useEffect } from 'react';
import { Button, Checkbox, Collapse, Empty, Input, Select, Table, Typography } from 'antd';
import { ArrowLeftOutlined, CloseOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router";
import { useSelector } from 'react-redux';

import { getScenarioById, updateScenario, listRequests } from "src/http";
import { toTitleCase, writeArrayToExcel, readExcelToArray, scenarioScreensToRefArray, checkExcelValidity } from "src/utils";
import { notify } from 'src/notify';

import DefaultLayout from 'src/views/layouts/default';

import './editScenario.scss';

const { Text, Title } = Typography;

const EditScenario = () => {
  const navigate = useNavigate();
  const currentScenario = useSelector((state) => state.currentScenario);
  const editScenarioInfo = useSelector((state) => state.editScenarioInfo);
  const requests = useSelector((state) => state.requests);

  const [screenValues, setScreenValues] = useState({});
  const [scenarioName, setScenarioName] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [scenarioURL, setScenarioURL] = useState('');

  useEffect(() => {
    getScenarioById(editScenarioInfo?.id).then((scenario) => {
      setScenarioName(editScenarioInfo.name || '');
      setRequestId(scenario.requestId || null);
      setScenarioURL(scenario.url || '');
      setScreenValues(Object.fromEntries(scenario.dataManual));
    });
    listRequests();
  }, [editScenarioInfo]);

  const handleExcelDownload = () => {
    let scenarioRefArray = scenarioScreensToRefArray(currentScenario.screens);

    if (currentScenario.dataManual) {
      const excelData = currentScenario.dataManual;

      scenarioRefArray = scenarioRefArray?.map((row, i) => {
        if (i === 0) return row; // Skip header row

        const [id, screen, fieldName] = row;
        const [_, ...values] = excelData[i - 1];

        return [id, screen, fieldName, ...values];
      });
    }

    writeArrayToExcel(scenarioRefArray, `${toTitleCase(scenarioName)} Scenario values.xlsx`);
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
      const scenarioRefArray = scenarioScreensToRefArray(currentScenario.screens);
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

    if (!scenarioURL) {
      notify.error('Scenario URL is required.');
      return;
    }

    updateScenario(
      editScenarioInfo?.id,
      scenarioName,
      scenarioURL,
      JSON.stringify(Object.keys(screenValues)?.map((key) => [key, screenValues[key]])),
      requestId
    ).then((res) => {
      if (res.status === 'success') {
        notify.success('Scenario updated successfully!');
        navigate('/dashboard');
      } else {
        notify.error('Failed to update scenario. Please try again.');
      }
    }).catch((error) => {
      console.error('Error updating scenario:', error);
      notify.error('Failed to update scenario. Please try again.');
    });
  };

  return (
    <DefaultLayout>
      <div className='edit-scenario-container position-relative d-flex flex-column gap-4'>
        <Title className='edit-scenario-heading m-0'>
          Edit Scenario
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
              <div className="d-flex flex-column gap-1">
                <div className='d-flex gap-3 w-100'>
                  <div className='d-flex flex-column gap-1 flex-grow-1'>
                    <Title level={5}>Scenario Name <Text type='danger'>*</Text></Title>
                    <Input
                      name='Scenario Name'
                      placeholder='Enter Scenario Name'
                      onChange={e => setScenarioName(e.target.value)}
                      value={scenarioName}
                    />
                  </div>
                  <div className='d-flex flex-column gap-1 w-33'>
                    <Title level={5}>Request</Title>
                    <Select
                      name='Request'
                      value={requestId}
                      onChange={setRequestId}
                      options={[
                        { label: 'None', value: null },
                        ...(requests ? requests.map((request) => ({
                          label: request.name,
                          value: request.id,
                        })) : []),
                      ]}
                    />
                  </div>
                  <div className='d-flex flex-column gap-1'>
                    <Title level={5} className='text-align-center'>Excel values</Title>
                    <div className='d-flex gap-3'>
                      <Button
                        type='primary'
                        icon={<DownloadOutlined />}
                        onClick={handleExcelDownload}
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
                <div className='d-flex flex-column gap-1 flex-grow-1'>
                  <Title level={5}>Scenario URL <Text type='danger'>*</Text></Title>
                  <Input
                    name='Scenario URL'
                    placeholder='Enter Scenario URL'
                    onChange={e => setScenarioURL(e.target.value)}
                    value={scenarioURL}
                  />
                </div>
              </div>

              <Collapse
                activeKey={currentScenario?.screens?.map((_, i) => i)}
                expandIconPosition='end'
                items={
                  currentScenario?.screens?.map((screen, i) => ({
                    key: i,
                    showArrow: false,
                    label: (
                      <div className='d-flex align-items-center gap-2'>
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
                            className: 'w-50',
                            dataIndex: 'actionName',
                            key: 'actionName',
                            render: (text) => <Text>{text}</Text>,
                          },
                          {
                            title: 'Value',
                            className: 'w-50',
                            dataIndex: 'value',
                            key: 'value',
                            render: (text, record) => (
                              <Input
                                className='w-100'
                                value={text}
                                onChange={(e) => {
                                  const newScreenValues = { ...screenValues };
                                  newScreenValues[`${record.screenIndex},${record.actionIndex}`] = e.target.value;
                                  setScreenValues(newScreenValues);
                                }}
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
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => navigate('/dashboard')}
                  danger
                >
                  Cancel
                </Button>
                <Button
                  type='primary'
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </div>
          </>
        }
      </div>
    </DefaultLayout >
  );
};

export default EditScenario;
