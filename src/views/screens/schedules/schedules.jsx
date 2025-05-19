import React, { useState, useEffect, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { notify } from 'src/notify';

import { toTitleCase } from 'src/utils';
import { getSchedules, deleteSchedule, updateSchedule } from 'src/http';

import DefaultLayout from 'src/views/layouts/default';

import './schedules.scss';

dayjs.extend(utc);
dayjs.extend(timezone);

const Schedules = () => {
  const userScenarios = useSelector((state) => state.userScenarios);
  const schedules = useSelector((state) => state.schedules);

  const [deletionSchedule, setDeletionSchedule] = useState();
  const [editScheduleId, setEditScheduleId] = useState();
  const [editScheduleName, setEditScheduleName] = useState('');
  const [editScheduleDT, setEditScheduleDT] = useState();
  const [editScheduleError, setEditScheduleError] = useState('');

  useEffect(() => {
    getSchedules();
  }, []);

  const scenarioIdMap = useMemo(() => {
    return Object.fromEntries(userScenarios.map(({ id, name }) => [id, name]))
  }, [userScenarios]);

  const handleDeleteSchedule = () => {
    deleteSchedule(deletionSchedule.id)
      .then(() => {
        notify.success('Schedule deleted successfully!');
      }).catch(() => {
        notify.error('Something went wrong while trying to delete the schedule.');
      }).finally(() => {
        setDeletionSchedule(null);
        getSchedules();
      });
  };

  const handleEditSchedule = (schedule) => {
    setEditScheduleId(schedule.id);
    setEditScheduleName(schedule.name);
    setEditScheduleDT(new Date(schedule.scheduleTime));
    setEditScheduleError('');
  };

  const closeEditScheduleModal = () => {
    setEditScheduleId(null);
    setEditScheduleName('');
    setEditScheduleError('');
    setEditScheduleDT(null);
  };

  const handleEditSubmit = () => {
    if (!editScheduleDT) {
      setEditScheduleError('Please select a date and time.');
      return;
    }

    if (editScheduleDT && editScheduleDT < new Date()) {
      setEditScheduleError('Please select a future date and time.');
      return;
    }

    if (!editScheduleName) {
      setEditScheduleError('Please enter a name for the schedule.');
      return;
    }

    closeEditScheduleModal();

    updateSchedule(editScheduleId, editScheduleName, editScheduleDT.toUTCString())
      .then(({ success }) => {
        if (success) {
          notify.success('Scenario update successfully!');
        }
      }).catch(() => {
        notify.error(
          'Something went wrong while trying to update the schedule.'
        );
      });
  };

  return (
    <>
      <DefaultLayout>
        <div className='schedules-container position-relative d-flex flex-column gap-4'>
          <p className='schedules-heading m-0'>User Schedules</p>
          {schedules.length === 0 ? (
            <div className='no-schedules-container flex-grow-1 d-flex align-items-center justify-content-center'>
              <p className='no-schedules-text'>No schedules available</p>
            </div>
          ) : (
            <div className='schedules-table-container d-flex flex-column gap-3'>
              <table className='schedules-table table table-bordered'>
                <thead>
                  <tr>
                    <th className='text-nowrap'>Name</th>
                    <th className='w-100'>Scenarios</th>
                    <th className='text-nowrap'>Pending / Complete</th>
                    <th className='text-nowrap'>Scheduled Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    schedules?.map((schedule, index) => (
                      <tr key={index}>
                        <td className='text-nowrap'>{toTitleCase(schedule.name)}</td>
                        <td className='w-100'>{schedule.scenarioIds.map(id => scenarioIdMap[id]).join(', ')}</td>
                        <td className='text-nowrap'>{schedule.isActive ? 'Pending' : 'Complete'}</td>
                        <td className='text-nowrap'>{new Date(schedule.scheduleTime).toLocaleString()}</td>
                        <td className='text-nowrap'>
                          {schedule.isActive && (
                            <>
                              <Button className='me-2' variant='primary' size='sm' onClick={() => handleEditSchedule(schedule)}>
                                Edit
                              </Button>
                              <Button variant='primary' size='sm' onClick={() => setDeletionSchedule(schedule)}>
                                Delete
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}
        </div >
      </DefaultLayout >

      {/* Delete Schedule Modal */}
      <Modal
        size="md"
        centered
        show={!!deletionSchedule}
        onHide={() => setDeletionSchedule(null)}
      >
        <Modal.Header className="border-0 pb-0" closeButton>
          <Modal.Title>Delete Scenario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {deletionSchedule?.name}?
        </Modal.Body>
        <Modal.Footer className="d-flex gap-2 justify-content-end border-0 pt-0">
          <Button
            className="border-dark-subtle border-1"
            variant="secondary"
            onClick={() => setDeletionSchedule(null)}
          >
            <i className="me-1 bi bi-x-lg" />
            No
          </Button>
          <Button
            className="border-dark-subtle border-1"
            variant="danger"
            onClick={handleDeleteSchedule}
          >
            <i className="me-1 bi bi-check-lg" />
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Schedule Modal */}
      <Modal
        size="md"
        centered
        show={!!editScheduleId}
        onHide={closeEditScheduleModal}
      >
        <Modal.Header className="border-0 pb-0" closeButton>
          <Modal.Title>Schedule Scenario Execution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='d-flex flex-column gap-3'>
            <p className='m-0'>The scenario will be executed at {editScheduleDT?.toLocaleString()}</p>
            <Form.Group className='w-100'>
              <Form.Label>Schedule Name<span className='text-danger'>*</span></Form.Label>
              <Form.Control
                name='Schedule Name'
                type='text'
                placeholder='Schedule Name'
                value={editScheduleName}
                onChange={(e) => setEditScheduleName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className='w-100'>
              <Form.Label>Schedule Time<span className='text-danger'>*</span></Form.Label>
              <div className='d-flex gap-2'>
                <input
                  className="form-control"
                  type='date'
                  value={dayjs(editScheduleDT)?.format('YYYY-MM-DD')}
                  onChange={(e) => setEditScheduleDT(new Date(editScheduleDT.setFullYear(e.target.value.split('-')[0], e.target.value.split('-')[1] - 1, e.target.value.split('-')[2])))}
                />
                <input
                  className="form-control"
                  type='time'
                  value={dayjs(editScheduleDT)?.format('HH:mm:ss')}
                  onChange={(e) => setEditScheduleDT(new Date(editScheduleDT.setHours(e.target.value.split(':')[0], e.target.value.split(':')[1], e.target.value.split(':')[2])))}
                />
              </div>
            </Form.Group>
            {editScheduleError && (
              <p className="text-danger m-0">
                {editScheduleError}
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex gap-2 justify-content-end border-0 pt-0">
          <Button
            className="border-dark-subtle border-1"
            variant="secondary"
            onClick={closeEditScheduleModal}
          >
            <i className="me-1 bi bi-x-lg" />
            Cancel
          </Button>
          <Button
            className="border-dark-subtle border-1"
            variant="success"
            onClick={handleEditSubmit}
          >
            <i className="me-1 bi bi-check-lg" />
            Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Schedules;
