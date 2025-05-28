import { useEffect, useReducer } from 'react';
import { Button, Input, InputNumber, Modal, Select, Space, Typography } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { toTitleCase } from 'src/utils';

import { requestModalMode, requestMethodOptions, requestTypeOptions, requestModalInitialValues } from '../../util';

import './requestFormModal.scss';

const { Title, Text } = Typography;

const RequestFormModal = ({ modalState, requestInfo, onClose, onSubmit }) => {
  const [request, setRequest] = useReducer((state, action) => ({ ...state, ...action }), requestModalInitialValues);

  useEffect(() => {
    if (modalState === requestModalMode.update || modalState === requestModalMode.view) {
      setRequest({
        name: requestInfo.name || requestModalInitialValues.name,
        method: requestInfo.method || requestModalInitialValues.method,
        url: requestInfo.url || requestModalInitialValues.url,
        headers: JSON.parse(requestInfo.headers) || requestModalInitialValues.headers,
        type: requestInfo.type || requestModalInitialValues.type,
        pollingInterval: Number(JSON.parse(requestInfo.pollingOptions)?.pollingInterval) || requestModalInitialValues.pollingInterval,
        pollingTimeout: Number(JSON.parse(requestInfo.pollingOptions)?.pollingTimeout) || requestModalInitialValues.pollingTimeout,
        expectedResponse: JSON.parse(requestInfo.expectedResponse) || requestModalInitialValues.expectedResponse,
        payload: JSON.parse(requestInfo.payload) || requestModalInitialValues.payload,
        error: '',
      });
    } else {
      setRequest(requestModalInitialValues);
    }
  }, [modalState, requestInfo]);

  const handleSubmit = () => {
    if (!request.name) {
      setRequest({ error: 'Enter a valid request name.' });
      return;
    }

    if (!request.url) {
      setRequest({ error: 'Enter a valid URL.' });
      return;
    }

    if (request.type === 'polling' && (request.pollingInterval <= 0 || request.pollingTimeout <= 0)) {
      setRequest({ error: 'Polling interval and timeout must be greater than 0.' });
      return;
    }

    onSubmit(request);
  }

  return (
    <Modal
      className="request-form-modal"
      title={toTitleCase(`${modalState} Request`)}
      open={!!modalState}
      footer={null}
      width='100%'
      centered
      onCancel={onClose}
    >
      <div className="request-form-modal-body d-flex flex-column gap-2 pt-3">
        <div className='d-flex gap-2'>
          <div className='d-flex flex-column gap-1 w-25'>
            <Title level={5}>Name <Text type='danger'>*</Text></Title>
            <Input
              name='Name'
              placeholder='Enter Name'
              value={request.name}
              onChange={e => setRequest({ name: e.target.value, error: '' })}
              readOnly={modalState === requestModalMode.view}
            />
          </div>
          <div className='d-flex flex-column gap-1 flex-grow-1'>
            <Title level={5}>URL <Text type='danger'>*</Text></Title>
            <Space.Compact>
              <Select
                style={{ width: '100px' }}
                options={requestMethodOptions}
                value={request?.method}
                onChange={method => modalState !== requestModalMode.view && setRequest({ method, error: '' })}
                readOnly={modalState === requestModalMode.view}
              />
              <Input
                name='URL'
                value={request.url}
                onChange={e => setRequest({ url: e.target.value, error: '' })}
                placeholder='Enter URL'
                readOnly={modalState === requestModalMode.view}
              />
            </Space.Compact>
          </div>
        </div>
        <div className='d-flex flex-column gap-1 flex-grow-1'>
          <Title level={5}>Headers</Title>
          <Input.TextArea
            name='Headers'
            placeholder='Enter Headers (JSON format)'
            autoSize={{ minRows: 5, maxRows: 5 }}
            allowClear
            value={request.headers}
            onChange={e => setRequest({ headers: e.target.value, error: '' })}
            readOnly={modalState === requestModalMode.view}
          />
        </div>
        <div className='d-flex gap-2'>
          <div className='d-flex flex-column gap-1 w-33'>
            <Title level={5}>Type <Text type='danger'>*</Text></Title>
            <Select
              name='Type'
              options={requestTypeOptions}
              value={request.type}
              onChange={type => setRequest({ type, error: '' })}
              readOnly={modalState === requestModalMode.view}
            />
          </div>
          {request.type === 'polling' && (
            <>
              <div className='d-flex flex-column gap-1 w-33'>
                <Title level={5}>Polling Interval (mins)</Title>
                <InputNumber
                  className='w-100'
                  name='Polling Interval'
                  placeholder='Enter Polling Interval'
                  type='number'
                  min={0}
                  value={request.pollingInterval}
                  onChange={val => setRequest({ pollingInterval: val, error: '' })}
                  readOnly={modalState === requestModalMode.view}
                />
              </div>
              <div className='d-flex flex-column gap-1 w-33'>
                <Title level={5}>Polling Timeout (mins)</Title>
                <InputNumber
                  className='w-100'
                  name='Polling Timeout'
                  placeholder='Enter Polling Timeout'
                  type='number'
                  min={0}
                  value={request.pollingTimeout}
                  onChange={val => setRequest({ pollingTimeout: val, error: '' })}
                  readOnly={modalState === requestModalMode.view}
                />
              </div>
            </>
          )}
        </div>
        <div className='d-flex gap-2'>
          <div className='d-flex flex-column gap-1 w-50'>
            <Title level={5}>Expected Response</Title>
            <Input.TextArea
              name='Expected Response'
              placeholder='Enter Expected Response (JSON format)'
              autoSize={{ minRows: 5, maxRows: 5 }}
              allowClear
              value={request.expectedResponse}
              onChange={e => setRequest({ expectedResponse: e.target.value, error: '' })}
              readOnly={modalState === requestModalMode.view}
            />
          </div>
          <div className='d-flex flex-column gap-1 w-50'>
            <Title level={5}>Payload</Title>
            <Input.TextArea
              name='Payload'
              placeholder='Enter Payload (JSON format)'
              autoSize={{ minRows: 5, maxRows: 5 }}
              allowClear
              value={request.payload}
              onChange={e => setRequest({ payload: e.target.value, error: '' })}
              readOnly={modalState === requestModalMode.view}
            />
          </div>
        </div>
        {request.error && <Text className='text-align-right' type='danger'>{request.error}</Text>}
        {modalState !== requestModalMode.view && (
          <div className='d-flex justify-content-end gap-2'>
            <Button icon={<CloseOutlined />} onClick={onClose}>Cancel</Button>
            <Button type='primary' onClick={handleSubmit}>Submit</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RequestFormModal;
