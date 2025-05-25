import { useState, useEffect, useMemo } from 'react';
import { Button, Modal, Table, Typography } from 'antd';
import { EyeOutlined, SyncOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { notify } from 'src/notify';

import { toTitleCase } from 'src/utils';
import { getReports, getUserScenarios } from 'src/http';

import DefaultLayout from 'src/views/layouts/default';

import './reports.scss';

const { Title } = Typography;

const Report = () => {
  const userScenarios = useSelector((state) => state.userScenarios);
  const userReports = useSelector((state) => state.userReports);

  const [selectedReport, setSelectedReport] = useState();
  const [disableRefresh, setDisableRefresh] = useState(false);

  useEffect(() => {
    getReports();
    getUserScenarios();
  }, []);

  useEffect(() => {
    if (selectedReport?.filePath) {
      var iframe = document.getElementById('reportiframe');
      iframe.src = `${import.meta.env.VITE_API_URL || ''}${selectedReport?.filePath}`;
    }
  }, [selectedReport?.filePath]);

  const scenarioIdMap = useMemo(() => {
    return Object.fromEntries(userScenarios.map(({ id, name }) => [id, name]))
  }, [userScenarios]);

  const refreshReports = () => {
    setDisableRefresh(true);
    notify.success('Reports have been refreshed');
    getReports();
    setTimeout(() => setDisableRefresh(false), 10000);
  };

  return (
    <>
      <DefaultLayout>
        <div className='reports-container position-relative d-flex flex-column gap-4'>
          <Title className='reports-heading'>User Reports</Title>
          <div className='reports-table-container d-flex flex-column gap-3'>
            <div className='reports-actions-container d-flex justify-content-end'>
              <Button type='primary' disabled={disableRefresh} icon={<SyncOutlined />} onClick={refreshReports}>
                Refresh
              </Button>
            </div>
            <Table
              className='reports-table'
              bordered
              columns={[
                {
                  title: 'S. No',
                  dataIndex: 'index',
                  key: 'index',
                  className: 'text-nowrap',
                  render: (text, record, index) => index + 1,
                },
                {
                  title: 'Scenarios',
                  dataIndex: 'scenarios',
                  key: 'scenarios',
                  width: '100%',
                  render: (text, record) => record.scenarios.map(({ scenarioId }) => scenarioIdMap[scenarioId]).join(', ')
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (text, record) => toTitleCase(record.status),
                },
                {
                  title: 'Executed At',
                  dataIndex: 'executedAt',
                  key: 'executedAt',
                  className: 'text-nowrap',
                  render: (text, record) => new Date(record.executedAt).toLocaleString(),
                },
                {
                  title: 'Action',
                  dataIndex: 'action',
                  key: 'action',
                  render: (text, record) => (
                    ['completed', 'failed'].includes(record.status) && (
                      <Button icon={<EyeOutlined />} onClick={() => setSelectedReport(record)}>
                        View Report
                      </Button>
                    )
                  ),
                }
              ]}
              dataSource={userReports}
              rowKey={(record) => record.id}
            />
          </div>
        </div >
      </DefaultLayout>

      {/* View Report Modal */}
      <Modal
        centered
        open={!!selectedReport}
        onCancel={() => setSelectedReport(null)}
        footer={null}
        title={selectedReport?.scenarios.map(({ scenarioId }) => scenarioIdMap[scenarioId]).join(', ')}
        width='100%'
      >
        <iframe
          id='reportiframe'
          title='Report'
          className='report-iframe'
          width='100%'
          height={600}
        />
      </Modal>
    </>
  );
};

export default Report;
