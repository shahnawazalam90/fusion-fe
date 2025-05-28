import { useState, useEffect } from 'react';
import { Button, Popconfirm, Table, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, SyncOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

import { notify } from 'src/notify';

import { toTitleCase } from 'src/utils';
import { createRequest, deleteRequest, listRequests, updateRequest } from 'src/http';

import DefaultLayout from 'src/views/layouts/default';

import RequestFormModal from './components/requestFormModal';
import { requestModalMode } from './util';

import './requests.scss';

const { Title } = Typography;

const Requests = () => {
  const requests = useSelector((state) => state.requests);

  const [selectedRequest, setSelectedRequest] = useState();
  const [disableRefresh, setDisableRefresh] = useState(false);

  const [requestModalState, setRequestModalState] = useState();

  useEffect(() => {
    listRequests();
  }, []);

  const refreshRequests = () => {
    setDisableRefresh(true);
    notify.success('Requests have been refreshed');
    listRequests();
    setTimeout(() => setDisableRefresh(false), 10000);
  };

  const handleCreateRequest = (requestInfo) => {
    createRequest(requestInfo)
      .then((res) => {
        if (res.status === 'success') {
          notify.success('Request created successfully');
        }
      })
      .catch((error) => {
        notify.error(`Failed to create request: ${error.message}`);
      })
      .finally(() => {
        setRequestModalState();
        listRequests();
      });
  };

  const handleUpdateRequest = (requestInfo) => {
    updateRequest(selectedRequest.id, requestInfo)
      .then((res) => {
        if (res.status === 'success') {
          notify.success('Request updated successfully');
        }
      })
      .catch((error) => {
        notify.error(`Failed to update request: ${error.message}`);
      })
      .finally(() => {
        setRequestModalState();
        listRequests();
      });

  }

  const handleDelete = (requestId) => {
    deleteRequest(requestId)
      .then(() => {
        notify.success('Request deleted successfully');
        listRequests();
      })
      .catch((error) => {
        notify.error(`Failed to delete request: ${error.message}`);
      });
  };

  return (
    <>
      <DefaultLayout>
        <div className='requests-container position-relative d-flex flex-column gap-4'>
          <Title className='requests-heading'>Requests</Title>
          <div className='requests-table-container d-flex flex-column gap-3'>
            <div className='requests-actions-container d-flex gap-2 justify-content-end'>
              <Button type='primary' disabled={disableRefresh} icon={<SyncOutlined />} onClick={refreshRequests}>
                Refresh
              </Button>
              <Button
                type='primary'
                disabled={disableRefresh}
                icon={<PlusCircleOutlined />}
                onClick={() => setRequestModalState(requestModalMode.create)}
              >
                Create New Request
              </Button>
            </div>
            <Table
              className='requests-table'
              bordered
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'index',
                  key: 'index',
                  className: 'text-nowrap',
                  render: (text, record) => record.name,
                },
                {
                  title: 'Method',
                  dataIndex: 'method',
                  key: 'method',
                  className: 'text-nowrap',
                  render: (text, record) => toTitleCase(record.method),
                },
                {
                  title: 'URL',
                  dataIndex: 'url',
                  key: 'url',
                  width: '100%',
                  render: (text, record) => record.url,
                },
                {
                  title: 'Type',
                  dataIndex: 'type',
                  key: 'type',
                  className: 'text-nowrap',
                  render: (text, record) => toTitleCase(record.type),
                },
                {
                  title: 'Action',
                  dataIndex: 'action',
                  key: 'action',
                  render: (text, record) => (
                    <div className='d-flex gap-1'>
                      <Button icon={<EyeOutlined />} onClick={() => { setRequestModalState(requestModalMode.view); setSelectedRequest(record) }}>
                        View
                      </Button>
                      <Button icon={<EditOutlined />} onClick={() => { setSelectedRequest(record); setRequestModalState(requestModalMode.update); }}>
                        Edit
                      </Button>
                      <Popconfirm
                        title='Delete Request'
                        description={`Are you sure to delete ${record.name}?`}
                        onConfirm={() => handleDelete(record.id)}
                        okText='Yes'
                        cancelText='No'
                      >
                        <Button
                          icon={<DeleteOutlined />}
                          danger
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </div>
                  ),
                }
              ]}
              dataSource={requests}
              rowKey={(record) => record.id}
            />
          </div>
        </div >
      </DefaultLayout>

      <RequestFormModal
        modalState={requestModalState}
        requestInfo={selectedRequest}
        onClose={() => setRequestModalState()}
        onSubmit={requestModalState === requestModalMode.create ? handleCreateRequest : handleUpdateRequest}
      />
    </>
  );
};

export default Requests;
