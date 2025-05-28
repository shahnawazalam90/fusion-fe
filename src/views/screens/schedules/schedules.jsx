import { useState, useEffect, useMemo } from 'react';
import { Button, Popconfirm, Table, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { notify } from 'src/notify';
import { toTitleCase } from 'src/utils';
import { getSchedules, deleteSchedule, updateSchedule } from 'src/http';

import DefaultLayout from 'src/views/layouts/default';
import ScheduleFormModal from 'src/views/sharedComponents/scheduleFormModal';

import './schedules.scss';

const { Title } = Typography;

const Schedules = () => {
  const userScenarios = useSelector((state) => state.userScenarios);
  const schedules = useSelector((state) => state.schedules);

  const [editSchedule, setEditSchedule] = useState();
  const [disableRefresh, setDisableRefresh] = useState(false);

  useEffect(() => {
    getSchedules();
  }, []);

  const scenarioIdMap = useMemo(() => {
    return Object.fromEntries(userScenarios?.map(({ id, name }) => [id, name]))
  }, [userScenarios]);

  const refreshSchedules = () => {
    setDisableRefresh(true);
    notify.success('Schedules have been refreshed');
    getSchedules();
    setTimeout(() => setDisableRefresh(false), 10000);
  };

  const handleDeleteSchedule = (schedule) => {
    deleteSchedule(schedule.id)
      .then(() => {
        notify.success('Schedule deleted successfully!');
      }).catch(() => {
        notify.error('Something went wrong while trying to delete the schedule.');
      }).finally(() => {
        getSchedules();
      });
  };

  const handleEditSubmit = (name, dateTime) => {
    updateSchedule(editSchedule.id, name, new Date(dateTime).toUTCString())
      .then(({ success }) => {
        if (success) {
          notify.success('Scenario update successfully!');
        }
      }).catch(() => {
        notify.error(
          'Something went wrong while trying to update the schedule.'
        );
      }).finally(() => {
        setEditSchedule(null);
        getSchedules();
      });
  };

  return (
    <>
      <DefaultLayout>
        <div className='schedules-container position-relative d-flex flex-column gap-4'>
          <Title className='schedules-heading'>User Schedules</Title>
          <div className='schedules-table-container d-flex flex-column gap-3'>
            <div className='reports-actions-container d-flex justify-content-end'>
              <Button type='primary' disabled={disableRefresh} icon={<SyncOutlined />} onClick={refreshSchedules}>
                Refresh
              </Button>
            </div>
            <Table
              className='schedules-table'
              bordered
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                  className: 'text-nowrap',
                  render: (text, record) => toTitleCase(record.name),
                },
                {
                  title: 'Scenarios',
                  dataIndex: 'scenarios',
                  key: 'scenarios',
                  width: '100%',
                  render: (text, record) => record?.scenarios?.map(({ scenarioId }) => scenarioIdMap[scenarioId]).join(', ')
                },
                {
                  title: 'Pending / Executed',
                  dataIndex: 'status',
                  key: 'status',
                  className: 'text-nowrap',
                  render: (text, record) => record.isActive ? 'Pending' : 'Complete',
                },
                {
                  title: 'Scheduled Time',
                  dataIndex: 'executedAt',
                  key: 'executedAt',
                  className: 'text-nowrap',
                  render: (text, record) => new Date(record.scheduleTime).toLocaleString(),
                },
                {
                  title: 'Action',
                  dataIndex: 'action',
                  key: 'action',
                  className: 'text-nowrap',
                  render: (text, record) => {
                    if (!record.isActive) return;

                    return (
                      <div className='d-flex gap-2'>
                        <Button icon={<EditOutlined />} onClick={() => setEditSchedule(record)}>
                          Edit
                        </Button>
                        <Popconfirm
                          title='Delete schedule'
                          description={`Are you sure to delete ${toTitleCase(record.name)}?`}
                          onConfirm={() => handleDeleteSchedule(record)}
                          okText='Yes'
                          cancelText='No'
                        >
                          <Button icon={<DeleteOutlined />} danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      </div>
                    )
                  },
                }
              ]}
              dataSource={schedules}
              rowKey={(record) => record.id}
            />
          </div>
        </div>
      </DefaultLayout >

      <ScheduleFormModal editSchedule={editSchedule} onClose={() => setEditSchedule(null)} onSubmit={handleEditSubmit} />
    </>
  );
};

export default Schedules;
