import { useState, useEffect } from 'react';
import { DatePicker, Input, Modal, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { executionBrowserOptions } from 'src/utils';

import './scheduleFormModal.scss';

const { Text, Title } = Typography;
dayjs.extend(utc);
dayjs.extend(timezone);

const ScheduleFormModal = ({ editSchedule, showModal, onClose, onSubmit }) => {
  const [scheduleName, setScheduleName] = useState('');
  const [scheduleDT, setScheduleDT] = useState();
  const [selectedBrowser, setSelectedBrowser] = useState(executionBrowserOptions[0].value);
  const [scheduleError, setScheduleError] = useState('');

  useEffect(() => {
    if (showModal) {
      setScheduleName('');
      setScheduleDT(new Date());
      setSelectedBrowser(executionBrowserOptions[0].value);
      setScheduleError('');
    }
    if (editSchedule) {
      setScheduleName(editSchedule.name);
      setScheduleDT(new Date(editSchedule.scheduleTime));
      setSelectedBrowser(editSchedule.browser || executionBrowserOptions[0].value);
      setScheduleError('');
    }
  }, [showModal, editSchedule]);

  const handleEditSubmit = () => {
    if (!scheduleName) {
      setScheduleError('Please enter a schedule name.');
      return;
    }
    if (!scheduleDT) {
      setScheduleError('Please select a schedule date and time.');
      return;
    }
    if (scheduleDT && scheduleDT < new Date()) {
      setScheduleError('Please select a future date and time.');
      return;
    }

    onSubmit(scheduleName, scheduleDT, selectedBrowser);
  };

  return (
    <Modal
      centered
      open={!!editSchedule || showModal}
      onOk={handleEditSubmit}
      onCancel={onClose}
      title={scheduleName ? 'Edit Schedule' : 'Schedule a new scenario'}
      cancelText='Cancel'
      okText='Schedule'
    >
      <div className='d-flex flex-column gap-2 py-4'>
        <div className='d-flex flex-column gap-1'>
          <Title level={5}>Schedule Name <Text type='danger'>*</Text></Title>
          <Input
            name='Schedule Name'
            placeholder='Enter Schedule Name'
            onChange={e => { setScheduleName(e.target.value); setScheduleError(''); }}
            value={scheduleName}
            onPressEnter={handleEditSubmit}
          />
        </div>
        <div className='d-flex flex-column gap-1'>
          <Title level={5}>Schedule Date & Time <Text type='danger'>*</Text></Title>
          <DatePicker
            showTime
            name='Schedule Date'
            placeholder='Select Schedule Date'
            onChange={date => { setScheduleDT(date); setScheduleError(''); }}
            value={scheduleDT ? dayjs(scheduleDT) : null}
            format='YYYY-MM-DD hh:mm:ss A'
            onPressEnter={handleEditSubmit}
            needConfirm={false}
          />
        </div>
        <div className='d-flex flex-column gap-1'>
          <Title level={5}>Execution Browser <Text type='danger'>*</Text></Title>
          <Select options={executionBrowserOptions} value={selectedBrowser} onChange={setSelectedBrowser} />
        </div>
        {scheduleError && <Text type='danger'>{scheduleError}</Text>}
      </div>
    </Modal>
  );
};

export default ScheduleFormModal;
