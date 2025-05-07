import React, { useState, useEffect, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';

import { notify } from 'src/notify';
import { toTitleCase } from 'src/utils';
import { getReports } from 'src/http/requests';

import DefaultLayout from 'src/views/layouts/default';

import './reports.scss';

const Report = () => {
  const userScenarios = useSelector((state) => state.userScenarios);
  const userReports = useSelector((state) => state.userReports);

  const [reportURL, setReportURL] = useState(null);
  const [disableRefresh, setDisableRefresh] = useState(false);

  useEffect(() => {
    getReports();
  }, []);

  useEffect(() => {
    if (reportURL) {
      var iframe = document.getElementById('reportiframe');
      iframe.src = 'http://localhost:3000' + reportURL;
    }
  }, [reportURL]);

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
          <p className='reports-heading m-0'>User Reports</p>
          {userReports.length === 0 ? (
            <div className='no-reports-container flex-grow-1 d-flex align-items-center justify-content-center'>
              <p className='no-reports-text'>No reports available</p>
            </div>
          ) : (
            <div className='reports-table-container d-flex flex-column gap-3'>
              <div className='reports-actions-container d-flex justify-content-end'>
                <Button variant='primary' disabled={disableRefresh} onClick={refreshReports}>
                  <i className="bi bi-arrow-clockwise me-1" />
                  Refresh
                </Button>
              </div>
              <table className='reports-table table table-bordered'>
                <thead>
                  <tr>
                    <th className='text-nowrap'>S. No</th>
                    <th className='w-100'>Scenarios</th>
                    <th className='text-nowrap'>Status</th>
                    <th className='text-nowrap'>Executed At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    userReports.map((report, index) => (
                      <tr key={index}>
                        <td className='text-nowrap'>{index + 1}</td>
                        <td className='w-100'>{report.scenarioIds.map(id => scenarioIdMap[id]).join(', ')}
                        </td>
                        <td className='text-nowrap'>{toTitleCase(report.status)}</td>
                        <td className='text-nowrap'>{new Date(report.executedAt).toLocaleString()}</td>
                        <td className='text-nowrap'>
                          {report.filePath !== null && (
                            <Button variant='primary' size='sm' onClick={() => setReportURL(report.filePath)}>
                              View Report
                            </Button>
                          )}
                        </td>
                      </tr>
                    )).reverse()
                  }
                </tbody>
              </table>
            </div>
          )}
        </div >
      </DefaultLayout >
      <Modal fullscreen centered show={!!reportURL} onHide={() => setReportURL(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Report for Scenario 1, Scenario 2</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <iframe
            id='reportiframe'
            src={reportURL}
            title="Report"
            className="report-iframe"
            width={"100%"}
            height={"100%"}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Report;
